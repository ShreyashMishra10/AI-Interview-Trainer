import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 500 });

    const body: InterviewRequest = await req.json();
    const { messages, role, candidateName, experience, questionCount, sessionId, cvContext } = body;

    const systemPrompt = `You are an expert technical interviewer conducting a real job interview for the role of "${role}".
Candidate: ${candidateName}
Experience Level: ${experience}
${cvContext ? `\nCandidate's CV / Resume:\n${cvContext}\n\nUse the CV to personalise your questions — ask about specific projects, technologies, and experience mentioned in their resume.` : ""}

INTERVIEW RULES:
- Ask ONE question at a time. Never ask multiple questions in one message.
- Start by greeting ${candidateName} warmly and asking your first technical question immediately.
- Ask progressively harder questions based on their answers.
- After each answer, give brief constructive feedback (1 sentence), then ask the next question.
- You are on question ${questionCount} of 10.
- After question 10, wrap up: give overall assessment with 2-3 strengths and 1-2 areas to improve, then say goodbye.
- Keep responses concise and conversational.
- Be encouraging but honest.
- No markdown, no bullet points. Plain conversational text only.`;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model:             "gemini-1.5-flash",
      systemInstruction: systemPrompt,
    });

    // Gemini uses "model" instead of "assistant"
    const history = messages.slice(0, -1).map((m) => ({
      role:  m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const lastMessage = messages[messages.length - 1]?.content ?? "";

    const chat   = model.startChat({ history });
    const result = await chat.sendMessage(lastMessage);
    const text   = result.response.text();

    const isComplete =
      questionCount >= 10 ||
      text.toLowerCase().includes("goodbye") ||
      text.toLowerCase().includes("good luck") ||
      text.toLowerCase().includes("that concludes");

    // Save messages to Supabase if session exists
    if (sessionId) {
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
          .update({ status: "completed", completed_at: new Date().toISOString() })
          .eq("id", sessionId);
      }
    }

    return NextResponse.json({ reply: text, isComplete });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Interview API Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
