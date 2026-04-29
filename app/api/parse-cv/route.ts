import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/ratelimit";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES  = ["pdf", "docx"];

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { success } = rateLimit(`parse-cv:${userId}`, 10, 60_000);
  if (!success)
    return NextResponse.json({ error: "Too many requests. Please wait a minute." }, { status: 429 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  if (file.size > MAX_FILE_BYTES)
    return NextResponse.json({ error: "File must be under 5 MB" }, { status: 413 });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (!ALLOWED_TYPES.includes(ext))
    return NextResponse.json({ error: "Only PDF and DOCX files are supported" }, { status: 400 });

  // Read buffer only after size and type are validated
  const buffer = Buffer.from(await file.arrayBuffer());

  try {
    let text = "";

    if (ext === "pdf") {
      const { PDFParse } = await import("pdf-parse");
      const parser = new PDFParse({ data: buffer });
      const result = await parser.getText();
      text = result.text;
    } else {
      const mammoth = await import("mammoth");
      const result  = await mammoth.extractRawText({ buffer });
      text = result.value;
    }

    const trimmed = text.replace(/\s+/g, " ").trim().slice(0, 3000);
    return NextResponse.json({ text: trimmed });
  } catch (err) {
    console.error("CV parse error:", err);
    return NextResponse.json({ error: "Failed to parse CV" }, { status: 500 });
  }
}
