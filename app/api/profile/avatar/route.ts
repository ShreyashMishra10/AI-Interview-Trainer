import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const MAX_BYTES  = 2 * 1024 * 1024; // 2 MB
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/gif", "image/webp"]);

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const file = formData.get("avatar") as File | null;
  if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

  if (file.size > MAX_BYTES)
    return NextResponse.json({ error: "File must be under 2 MB" }, { status: 413 });

  if (!ALLOWED_MIME.has(file.type))
    return NextResponse.json({ error: "Only JPG, PNG, GIF or WebP allowed" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());

  // Verify image magic bytes
  const isJPEG = buffer[0] === 0xFF && buffer[1] === 0xD8;
  const isPNG  = buffer[0] === 0x89 && buffer[1] === 0x50;
  const isGIF  = buffer[0] === 0x47 && buffer[1] === 0x49;
  const isWEBP = buffer.subarray(8, 12).toString() === "WEBP";
  if (!isJPEG && !isPNG && !isGIF && !isWEBP)
    return NextResponse.json({ error: "Invalid image file" }, { status: 400 });

  const ext      = file.type.split("/")[1].replace("jpeg", "jpg");
  const filePath = `${userId}/avatar.${ext}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from("avatars")
    .upload(filePath, buffer, {
      contentType:  file.type,
      upsert:       true,
    });

  if (uploadError)
    return NextResponse.json({ error: uploadError.message }, { status: 500 });

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from("avatars")
    .getPublicUrl(filePath);

  // Cache-bust the URL so browsers fetch the new image
  const avatarUrl = `${publicUrl}?t=${Date.now()}`;

  const { error: dbError } = await supabaseAdmin
    .from("profiles")
    .update({ avatar_url: avatarUrl })
    .eq("clerk_user_id", userId);

  if (dbError)
    return NextResponse.json({ error: dbError.message }, { status: 500 });

  return NextResponse.json({ avatar_url: avatarUrl });
}
