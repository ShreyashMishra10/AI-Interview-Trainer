import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

const ALLOWED_MODES = new Set(["chat", "voice"]);

// PATCH /api/interviews/sessions/[id] — update mode or mark completed
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;

  let body: Record<string, unknown> = {};
  try { body = await req.json(); } catch { /* no body = mark completed */ }

  const updates: Record<string, unknown> = {};
  if (typeof body.mode === "string" && ALLOWED_MODES.has(body.mode)) {
    updates.mode = body.mode;
  } else {
    updates.status       = "completed";
    updates.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabaseAdmin
    .from("interview_sessions")
    .update(updates)
    .eq("id", id)
    .eq("clerk_user_id", userId)
    .select("id");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data || data.length === 0)
    return NextResponse.json({ error: "Session not found" }, { status: 404 });

  return NextResponse.json({ success: true });
}
