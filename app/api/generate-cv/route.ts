import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getOrCreateProfile } from "@/lib/supabase/profile";
import { rateLimit } from "@/lib/ratelimit";

interface CVRequest {
  name:        string;
  email:       string;
  bio:         string;
  experience:  string;
  projects:    string;
  skills:      string;
  target_role: string;
}

// GET /api/generate-cv — fetch past CV generations for the user
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("cv_generations")
    .select("*")
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/generate-cv — generate a new CV and save it
export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { success } = await rateLimit(`generate-cv:${userId}`, 5, 60_000);
    if (!success)
      return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "API key missing" }, { status: 500 });

    const body = await req.json();
    const data: CVRequest = {
      name:        String(body.name        ?? "").trim().slice(0, 200),
      email:       String(body.email       ?? "").trim().slice(0, 200),
      bio:         String(body.bio         ?? "").trim().slice(0, 2000),
      experience:  String(body.experience  ?? "").trim().slice(0, 5000),
      projects:    String(body.projects    ?? "").trim().slice(0, 3000),
      skills:      String(body.skills      ?? "").trim().slice(0, 1000),
      target_role: String(body.target_role ?? "").trim().slice(0, 100),
    };

    if (!data.name || !data.target_role)
      return NextResponse.json({ error: "name and target_role are required" }, { status: 400 });

    // Ensure profile exists and get plan
    const profile = await getOrCreateProfile(userId);

    // Free plan: atomically decrement credit (fails if already 0)
    if (profile?.plan === "free") {
      const { data: granted, error: rpcError } = await supabaseAdmin.rpc(
        "decrement_cv_credits",
        { p_user_id: userId }
      );
      if (rpcError) return NextResponse.json({ error: rpcError.message }, { status: 500 });
      if (!granted)
        return NextResponse.json(
          { error: "CV generation limit reached. Upgrade to Pro." },
          { status: 403 }
        );
    }

    // Generate CV with Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are a Career Architect and expert CV writer. Rewrite the following information into a polished, professional CV using impact-driven language that gets noticed by recruiters.

Candidate Details:
Name: ${data.name}
Email: ${data.email}
Bio / Summary: ${data.bio}
Work Experience: ${data.experience}
Projects: ${data.projects}
Skills: ${data.skills}
Target Role: ${data.target_role || "Software Engineer"}

REQUIREMENTS:
- Return ONLY a valid JSON object. No markdown, no explanation, no code blocks.
- JSON must have exactly these keys: "name", "email", "summary", "experience", "projects", "skills", "target_role"
- "summary": a 3-sentence professional summary with strong action verbs
- "experience": array of objects with keys "title", "company", "duration", "bullets" (array of 3 impact-driven bullet points starting with action verbs)
- "projects": array of objects with keys "name", "description", "tech_stack", "impact"
- "skills": object with keys "technical" (array), "soft" (array), "languages" (array)
- Use quantified achievements where possible (e.g., "Reduced load time by 40%")`;

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("AI response timed out. Please try again.")), 30_000)
    );
    const result  = await Promise.race([model.generateContent(prompt), timeout]);
    const aiText  = result.response.text().replace(/```json|```/g, "").trim();

    // Parse and validate JSON
    let cvData: Record<string, unknown>;
    try {
      cvData = JSON.parse(aiText);
    } catch {
      return NextResponse.json({ error: "AI returned invalid JSON. Please try again." }, { status: 500 });
    }

    // Save to Supabase — if save fails, surface the error (don't silently continue)
    const { data: saved, error: saveError } = await supabaseAdmin
      .from("cv_generations")
      .insert({
        clerk_user_id: userId,
        target_role:   data.target_role || "Software Engineer",
        cv_data:       cvData,
      })
      .select()
      .single();

    if (saveError)
      return NextResponse.json({ error: "Failed to save CV. Please try again." }, { status: 500 });

    return NextResponse.json({
      result: aiText,
      cv_id:  saved.id,
    });

  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    console.error("CV Generation Error:", msg);
    return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
