import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// DELETE /api/settings/history — permanently delete all interview sessions + messages
export async function DELETE() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Messages are deleted automatically via ON DELETE CASCADE on session_id FK.
  // If cascade isn't set, delete messages first.
  const { data: sessions } = await supabaseAdmin
    .from("interview_sessions")
    .select("id")
    .eq("clerk_user_id", userId);

  const sessionIds = (sessions ?? []).map((s) => s.id);

  if (sessionIds.length > 0) {
    await supabaseAdmin.from("session_messages").delete().in("session_id", sessionIds);
  }

  const { error } = await supabaseAdmin
    .from("interview_sessions")
    .delete()
    .eq("clerk_user_id", userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, deleted: sessionIds.length });
}
