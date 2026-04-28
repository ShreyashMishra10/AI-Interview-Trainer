import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("file") as File | null;

  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const ext    = file.name.split(".").pop()?.toLowerCase();

  try {
    let text = "";

    if (ext === "pdf") {
      const pdfParse = (await import("pdf-parse")).default;
      const result   = await pdfParse(buffer);
      text = result.text;
    } else if (ext === "docx") {
      const mammoth = await import("mammoth");
      const result  = await mammoth.extractRawText({ buffer });
      text = result.value;
    } else {
      return NextResponse.json({ error: "Only PDF and DOCX files are supported" }, { status: 400 });
    }

    // Trim to 3000 chars so it fits cleanly in the AI prompt
    const trimmed = text.replace(/\s+/g, " ").trim().slice(0, 3000);

    return NextResponse.json({ text: trimmed });
  } catch (err) {
    console.error("CV parse error:", err);
    return NextResponse.json({ error: "Failed to parse CV" }, { status: 500 });
  }
}
