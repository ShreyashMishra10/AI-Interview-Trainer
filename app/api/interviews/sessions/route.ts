import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getOrCreateProfile } from "@/lib/supabase/profile";

// POST /api/interviews/sessions — create a new interview session
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { job_role, experience_level, mode } = await req.json();
  if (!job_role) return NextResponse.json({ error: "job_role is required" }, { status: 400 });

  // Ensure profile exists
  await getOrCreateProfile(userId);

  // Check free plan credit limit
  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("plan, interview_credits")
    .eq("clerk_user_id", userId)
    .single();

  if (profile?.plan === "free" && profile.interview_credits <= 0) {
    return NextResponse.json(
      { error: "Interview limit reached. Upgrade to Pro." },
      { status: 403 }
    );
  }

  // Create the session
  const { data: session, error } = await supabaseAdmin
    .from("interview_sessions")
    .insert({
      clerk_user_id:    userId,
      job_role,
      experience_level: experience_level ?? "mid",
      mode:             mode             ?? "chat",
      status:           "in_progress",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Deduct one credit for free users
  if (profile?.plan === "free") {
    await supabaseAdmin
      .from("profiles")
      .update({ interview_credits: profile.interview_credits - 1 })
      .eq("clerk_user_id", userId);
  }

  return NextResponse.json(session, { status: 201 });
}
