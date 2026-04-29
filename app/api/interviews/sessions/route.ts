import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getOrCreateProfile } from "@/lib/supabase/profile";

const ALLOWED_MODES = ["chat", "voice"] as const;
const ALLOWED_LEVELS = ["fresher", "junior", "mid", "senior", "lead"] as const;

// POST /api/interviews/sessions — create a new interview session
export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const job_role:         string = typeof body.job_role         === "string" ? body.job_role.trim().slice(0, 100)         : "";
  const experience_level: string = typeof body.experience_level === "string" ? body.experience_level.trim().toLowerCase() : "mid";
  const mode:             string = typeof body.mode             === "string" ? body.mode.trim().toLowerCase()             : "chat";

  if (!job_role)
    return NextResponse.json({ error: "job_role is required" }, { status: 400 });
  if (!ALLOWED_LEVELS.includes(experience_level as typeof ALLOWED_LEVELS[number]))
    return NextResponse.json({ error: "Invalid experience_level" }, { status: 400 });
  if (!ALLOWED_MODES.includes(mode as typeof ALLOWED_MODES[number]))
    return NextResponse.json({ error: "Invalid mode" }, { status: 400 });

  // Ensure profile exists and get plan
  const profile = await getOrCreateProfile(userId);

  // Free plan: atomically decrement credit (fails if already 0)
  if (profile?.plan === "free") {
    const { data: granted, error: rpcError } = await supabaseAdmin.rpc(
      "decrement_interview_credits",
      { p_user_id: userId }
    );
    if (rpcError) return NextResponse.json({ error: rpcError.message }, { status: 500 });
    if (!granted)
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
      experience_level,
      mode,
      status:           "in_progress",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(session, { status: 201 });
}
