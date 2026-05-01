import * as Sentry from "@sentry/nextjs";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { rateLimit } from "@/lib/ratelimit";

const MAX_FILE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES  = ["pdf", "docx"];

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { success } = await rateLimit(`parse-cv:${userId}`, 10, 60_000);
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

  // Verify magic bytes — reject files that lie about their extension
  // PDF: %PDF (25 50 44 46) | DOCX/ZIP: PK (50 4B)
  const isPDF  = buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46;
  const isDOCX = buffer[0] === 0x50 && buffer[1] === 0x4B;
  if (ext === "pdf"  && !isPDF)  return NextResponse.json({ error: "Invalid PDF file" },  { status: 400 });
  if (ext === "docx" && !isDOCX) return NextResponse.json({ error: "Invalid DOCX file" }, { status: 400 });

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
    Sentry.captureException(err);
    return NextResponse.json({ error: "Failed to parse CV" }, { status: 500 });
  }
}
