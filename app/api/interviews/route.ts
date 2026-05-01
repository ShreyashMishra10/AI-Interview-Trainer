import * as Sentry from "@sentry/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Groq from "groq-sdk";
import { rateLimit } from "@/lib/ratelimit";
import { sendSessionCompleteEmail } from "@/lib/email";

const ALLOWED_ROLES = new Set([
  "Frontend Developer (React)", "Frontend Developer (Vue / Angular)", "UI/UX Engineer",
  "Backend Developer (Node.js)", "Backend Developer (Python / Django)",
  "Backend Developer (Java / Spring)", "Backend Developer (Go)",
  "Full Stack Developer", "MERN Stack Developer",
  "Machine Learning Engineer", "Data Scientist", "Data Engineer", "AI / NLP Engineer",
  "DevOps Engineer", "Cloud Engineer (AWS / GCP / Azure)", "Site Reliability Engineer",
  "Software Engineer (DSA focus)", "Systems Programmer (C / C++)",
  "Database Engineer", "Cybersecurity Engineer",
  "Android Developer (Kotlin)", "iOS Developer (Swift)", "React Native Developer",
]);
const ALLOWED_LEVELS = new Set(["fresher", "junior", "mid", "senior", "lead"]);
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface InterviewRequest {
  messages:      Message[];
  role:          string;
  candidateName: string;
  experience:    string;
  questionCount: number;
  sessionId?:    string;
  cvContext?:    string;
}

// GET /api/interviews — list all sessions for the current user
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("interview_sessions")
    .select("*")
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/interviews — get next AI response + save to Supabase
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { success } = await rateLimit(`interviews:${userId}`, 30, 60_000);
    if (!success)
      return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 500 });

    const body: InterviewRequest = await req.json();
    const { sessionId } = body;

    // --- Input validation (CRIT-3: prevent prompt injection) ---
    const role = typeof body.role === "string" ? body.role.trim() : "";
    if (!ALLOWED_ROLES.has(role))
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });

    const experience = typeof body.experience === "string" ? body.experience.trim().toLowerCase() : "";
    if (!ALLOWED_LEVELS.has(experience))
      return NextResponse.json({ error: "Invalid experience" }, { status: 400 });

    const safeName = typeof body.candidateName === "string"
      ? body.candidateName.replace(/[`"\\<>]/g, "").trim().slice(0, 100)
      : "";
    if (!safeName)
      return NextResponse.json({ error: "Invalid candidateName" }, { status: 400 });

    // Clamp server-side so client can't skip to completion on first message
    const questionCount = Number.isInteger(body.questionCount)
      ? Math.min(Math.max(0, body.questionCount), 10)
      : 0;

    if (sessionId && !UUID_RE.test(sessionId))
      return NextResponse.json({ error: "Invalid sessionId" }, { status: 400 });

    // Cap messages to last 24 and trim each to 2000 chars to stay within token limits
    const messages  = (Array.isArray(body.messages) ? body.messages.slice(-24) : [])
      .map((m) => ({ ...m, content: String(m.content).slice(0, 2000) }));
    const cvContext = typeof body.cvContext === "string" ? body.cvContext.slice(0, 3000) : "";

    const systemPrompt = `You are a senior technical interviewer at a top tech company conducting a real job interview for the role of "${role}".
Candidate name: ${safeName}
Experience level: ${experience}
${cvContext ? `\n--- CANDIDATE CV START ---\n${cvContext}\n--- CANDIDATE CV END ---\n` : ""}

INTERVIEW STRUCTURE (follow this strictly):
1. INTRODUCTION (question 0): Warmly introduce yourself as "Sarah", welcome ${safeName}, briefly mention the format (10 questions, feedback after each), then ask them to introduce themselves and walk you through their background. Do NOT ask a technical question yet.
2. TECHNICAL QUESTIONS (questions 1–9): After their introduction, ask one technical question per turn. Give 1-sentence feedback on their answer, then ask the next question. Progress from fundamentals to advanced topics.${cvContext ? " Personalise questions based on their CV — reference specific projects and technologies they mentioned." : ""}
3. WRAP UP (question 10): Give an overall assessment with 2–3 strengths and 1–2 improvement areas, thank them warmly, then end with exactly: SCORE: XX/100

RULES:
- One message at a time. Never ask multiple questions.
- You are currently on turn ${questionCount} of 10.
- Be professional, encouraging, and conversational. No markdown, no bullet points.
- If the candidate says something off-topic like "ask another question", gently redirect: remind them this is an interview and ask them to answer the current question.
- SCORE line only appears in your final wrap-up message.`;

    const groq = new Groq({ apiKey });

    const groqMessages = [
      { role: "system" as const, content: systemPrompt },
      ...messages.map((m) => ({
        role:    m.role === "assistant" ? "assistant" as const : "user" as const,
        content: m.content,
      })),
    ];

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("AI response timed out. Please try again.")), 30_000)
    );
    const result  = await Promise.race([
      groq.chat.completions.create({
        model:       "llama-3.3-70b-versatile",
        messages:    groqMessages,
        temperature: 0.7,
        max_tokens:  1024,
      }),
      timeout,
    ]);
    const rawText = result.choices[0]?.message?.content ?? "";

    // Extract score from final message (e.g. "SCORE: 78/100")
    const scoreMatch = rawText.match(/SCORE:\s*(\d{1,3})\/100/i);
    const score      = scoreMatch ? Math.min(100, Math.max(0, parseInt(scoreMatch[1]))) : null;

    // Strip the score line from the user-facing reply
    const text = rawText.replace(/\n?SCORE:\s*\d{1,3}\/100/i, "").trim();

    const isComplete =
      questionCount >= 10 ||
      text.toLowerCase().includes("goodbye") ||
      text.toLowerCase().includes("good luck") ||
      text.toLowerCase().includes("that concludes");

    // Save messages to Supabase if session exists
    if (sessionId) {
      // CRIT-1: verify this session belongs to the authenticated user
      const { data: ownedSession } = await supabaseAdmin
        .from("interview_sessions")
        .select("id")
        .eq("id", sessionId)
        .eq("clerk_user_id", userId)
        .single();
      if (!ownedSession)
        return NextResponse.json({ error: "Session not found" }, { status: 403 });

      const lastUserMessage = [...messages].reverse().find((m) => m.role === "user");

      if (lastUserMessage) {
        await supabaseAdmin.from("session_messages").insert([
          {
            session_id:      sessionId,
            role:            "user",
            content:         lastUserMessage.content,
            question_number: questionCount,
          },
          {
            session_id:      sessionId,
            role:            "assistant",
            content:         text,
            question_number: questionCount,
          },
        ]);
      }

      if (isComplete) {
        await supabaseAdmin
          .from("interview_sessions")
          .update({
            status:       "completed",
            completed_at: new Date().toISOString(),
            ...(score !== null && { score }),
          })
          .eq("id", sessionId)
          .eq("clerk_user_id", userId);

        // Send session complete email if user has email notifications enabled
        try {
          const [user, { data: profile }] = await Promise.all([
            currentUser(),
            supabaseAdmin.from("profiles").select("notification_prefs").eq("clerk_user_id", userId).single(),
          ]);
          const emailEnabled = profile?.notification_prefs?.email !== false
            && profile?.notification_prefs?.sessionComplete !== false;
          const email = user?.emailAddresses?.[0]?.emailAddress;
          if (email && emailEnabled) {
            await sendSessionCompleteEmail({
              to:        email,
              name:      user?.firstName ?? "there",
              jobRole:   role,
              score,
              sessionId,
            });
          }
        } catch (emailErr) {
          // Never fail the request because of email
          console.error("Session complete email failed:", emailErr);
        }
      }
    }

    return NextResponse.json({ reply: text, isComplete, score });
  } catch (err: unknown) {
    console.error("[interviews] ERROR:", err);
    Sentry.captureException(err);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
