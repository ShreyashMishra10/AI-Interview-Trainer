import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// GET /api/interviews/[id] — fetch session + messages
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  const [{ data: session, error: sessionError }, { data: messages, error: msgError }] =
    await Promise.all([
      supabaseAdmin
        .from("interview_sessions")
        .select("*")
        .eq("id", id)
        .eq("clerk_user_id", userId)
        .single(),
      supabaseAdmin
        .from("session_messages")
        .select("*")
        .eq("session_id", id)
        .order("created_at", { ascending: true }),
    ]);

  if (sessionError) return NextResponse.json({ error: "Not found" }, { status: 404 });
  if (msgError)     return NextResponse.json({ error: msgError.message }, { status: 500 });

  return NextResponse.json({ session, messages: messages ?? [] });
}
