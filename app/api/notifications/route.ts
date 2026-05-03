import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

// GET /api/notifications — fetch all notifications for the current user
export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("notifications")
    .select("id, type, title, message, read, created_at")
    .eq("clerk_user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

// PATCH /api/notifications — mark all notifications as read
export async function PATCH() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabaseAdmin
    .from("notifications")
    .update({ read: true })
    .eq("clerk_user_id", userId)
    .eq("read", false);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// POST /api/notifications — insert a notification (called from webhooks, e.g. Razorpay)
export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const ALLOWED_TYPES = new Set(["system", "payment", "interview", "cv"]);

  const type    = ALLOWED_TYPES.has(body.type) ? body.type : "system";
  const title   = typeof body.title   === "string" ? body.title.trim().slice(0, 200)  : null;
  const message = typeof body.message === "string" ? body.message.trim().slice(0, 500) : null;

  if (!title) return NextResponse.json({ error: "title is required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("notifications")
    .insert({ clerk_user_id: userId, type, title, message })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
