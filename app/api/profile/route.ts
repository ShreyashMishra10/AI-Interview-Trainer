import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getOrCreateProfile } from "@/lib/supabase/profile";

// GET /api/profile — get profile + usage stats
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await currentUser();

  // Get or create the profile
  const profile = await getOrCreateProfile(
    userId,
    user?.emailAddresses?.[0]?.emailAddress,
    user?.fullName
  );

  // Fetch usage counts in parallel
  const [{ count: totalSessions }, { count: completedSessions }, { count: totalCVs }] =
    await Promise.all([
      supabaseAdmin
        .from("interview_sessions")
        .select("*", { count: "exact", head: true })
        .eq("clerk_user_id", userId),
      supabaseAdmin
        .from("interview_sessions")
        .select("*", { count: "exact", head: true })
        .eq("clerk_user_id", userId)
        .eq("status", "completed"),
      supabaseAdmin
        .from("cv_generations")
        .select("*", { count: "exact", head: true })
        .eq("clerk_user_id", userId),
    ]);

  // Latest session score
  const { data: latestSession } = await supabaseAdmin
    .from("interview_sessions")
    .select("score, job_role, created_at")
    .eq("clerk_user_id", userId)
    .eq("status", "completed")
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  return NextResponse.json({
    ...profile,
    stats: {
      total_sessions:     totalSessions     ?? 0,
      completed_sessions: completedSessions ?? 0,
      total_cvs:          totalCVs          ?? 0,
      latest_session:     latestSession     ?? null,
    },
  });
}

// PATCH /api/profile — update display name or email
export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  // Only allow safe fields to be updated
  const allowedFields: Record<string, unknown> = {};
  if (typeof body.full_name === "string") allowedFields.full_name = body.full_name.trim();
  if (typeof body.email     === "string") allowedFields.email     = body.email.trim();

  if (Object.keys(allowedFields).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update(allowedFields)
    .eq("clerk_user_id", userId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
