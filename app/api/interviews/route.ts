import { NextResponse } from "next/server";
// import Anthropic from "@anthropic-ai/sdk";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface InterviewRequest {
  messages: Message[];
  role: string;
  candidateName: string;
  experience: string;
  questionCount: number;
}

export async function POST(req: Request) {
  try {
    const apiKey = process.env.ANTHROPIC_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key missing" }, { status: 500 });
    }

    const body: InterviewRequest = await req.json();
    const { messages, role, candidateName, experience, questionCount } = body;

    const client = new Anthropic({ apiKey });

    const systemPrompt = `You are an expert technical interviewer conducting a real job interview for the role of "${role}".

Candidate: ${candidateName}
Experience Level: ${experience}

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

    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: systemPrompt,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    });

    const text =
      response.content[0].type === "text" ? response.content[0].text : "";

    const isComplete =
      questionCount >= 10 ||
      text.toLowerCase().includes("goodbye") ||
      text.toLowerCase().includes("good luck") ||
      text.toLowerCase().includes("that concludes");

    return NextResponse.json({ reply: text, isComplete });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Internal Server Error";
    console.error("Interview API Error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}