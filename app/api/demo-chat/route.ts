import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { rateLimit } from "@/lib/ratelimit";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SYSTEM_PROMPT = `You are a friendly AI interview coach. Reply naturally to whatever the user says. Keep responses short (2-3 sentences max).`;

interface Message {
  role: "user" | "assistant";
  content: string;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { success } = await rateLimit(`demo:${ip}`, 15, 60 * 60 * 1000);
  if (!success) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  let messages: Message[] = [];
  try {
    const body = await req.json();
    if (Array.isArray(body.messages)) {
      messages = body.messages
        .filter((m: unknown) =>
          typeof m === "object" && m !== null &&
          (m as Message).role &&
          typeof (m as Message).content === "string"
        )
        .slice(-6) // keep last 6 messages for context
        .map((m: Message) => ({ role: m.role, content: m.content.slice(0, 500) }));
    }
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (messages.length === 0) {
    return NextResponse.json({ error: "No messages provided" }, { status: 400 });
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      max_tokens: 150,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content?.trim() ?? "Great answer! Can you walk me through a challenging project you've worked on?";
    return NextResponse.json({ reply });
  } catch {
    return NextResponse.json({ error: "AI unavailable" }, { status: 500 });
  }
}
