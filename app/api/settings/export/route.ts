import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// GET /api/settings/export — download all user data as JSON
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const [
    { data: profile },
    { data: sessions },
    { data: messages },
    { data: cvs },
  ] = await Promise.all([
    supabaseAdmin.from("profiles").select("full_name, email, plan, notification_prefs, privacy_prefs, created_at").eq("clerk_user_id", userId).single(),
    supabaseAdmin.from("interview_sessions").select("id, job_role, experience_level, mode, status, score, created_at, completed_at").eq("clerk_user_id", userId).order("created_at", { ascending: false }),
    supabaseAdmin.from("session_messages").select("session_id, role, content, question_number, created_at")
      .in("session_id", (await supabaseAdmin.from("interview_sessions").select("id").eq("clerk_user_id", userId)).data?.map((s) => s.id) ?? []),
    supabaseAdmin.from("cv_generations").select("*").eq("clerk_user_id", userId).order("created_at", { ascending: false }),
  ]);

  const exportData = {
    exported_at:       new Date().toISOString(),
    profile:           profile ?? {},
    interview_sessions: sessions ?? [],
    session_messages:  messages ?? [],
    cv_generations:    cvs ?? [],
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type":        "application/json",
      "Content-Disposition": `attachment; filename="ai-trainer-export-${Date.now()}.json"`,
    },
  });
}
