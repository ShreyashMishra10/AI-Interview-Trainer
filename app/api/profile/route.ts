import { auth, currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getOrCreateProfile } from "@/lib/supabase/profile";

// GET /api/profile — get profile + usage stats (2 DB queries)
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await currentUser();

  const [profile, { data: stats, error: statsError }] = await Promise.all([
    getOrCreateProfile(
      userId,
      user?.emailAddresses?.[0]?.emailAddress,
      user?.fullName
    ),
    supabaseAdmin.rpc("get_profile_stats", { p_user_id: userId }),
  ]);

  if (statsError) return NextResponse.json({ error: statsError.message }, { status: 500 });

  return NextResponse.json({
    ...profile,
    stats: stats ?? {
      total_sessions:     0,
      completed_sessions: 0,
      total_cvs:          0,
      latest_session:     null,
    },
  });
}

// PATCH /api/profile — update display name or email
export async function PATCH(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  const allowedFields: Record<string, unknown> = {};
  if (typeof body.full_name          === "string") allowedFields.full_name          = body.full_name.trim().slice(0, 200);
  if (typeof body.email              === "string") allowedFields.email              = body.email.trim().slice(0, 200);
  if (body.notification_prefs !== undefined)       allowedFields.notification_prefs = body.notification_prefs;
  if (body.privacy_prefs      !== undefined)       allowedFields.privacy_prefs      = body.privacy_prefs;

  if (Object.keys(allowedFields).length === 0)
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update(allowedFields)
    .eq("clerk_user_id", userId)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
