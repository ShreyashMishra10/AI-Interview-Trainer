import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getRazorpay, PLAN_AMOUNTS, PlanType, CycleType } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body as {
    razorpay_order_id:   string;
    razorpay_payment_id: string;
    razorpay_signature:  string;
  };

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Verify HMAC signature using timing-safe comparison
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  const sigValid = crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(razorpay_signature)
  );
  if (!sigValid) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

  // Fetch plan + cycle from Razorpay order notes — never trust the client for these
  const order = await getRazorpay().orders.fetch(razorpay_order_id);
  const notes = order.notes as Record<string, string> | undefined;
  const plan  = notes?.plan  as PlanType  | undefined;
  const cycle = notes?.cycle as CycleType | undefined;

  if (!plan || !cycle || !["pro", "enterprise"].includes(plan) || !["monthly", "annual"].includes(cycle)) {
    return NextResponse.json({ error: "Invalid order notes" }, { status: 400 });
  }

  // Verify the order belongs to this user
  if (notes?.clerk_user_id !== userId) {
    return NextResponse.json({ error: "Order does not belong to this user" }, { status: 403 });
  }

  // Amount is authoritative from our own PLAN_AMOUNTS — never trust client
  const amount = PLAN_AMOUNTS[plan][cycle];

  // Calculate plan expiry
  const expiresAt = new Date();
  if (cycle === "monthly") expiresAt.setMonth(expiresAt.getMonth() + 1);
  else                      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  // Upgrade profile
  const { error: profileError } = await supabaseAdmin
    .from("profiles")
    .update({
      plan,
      billing_cycle:       cycle,
      plan_expires_at:     expiresAt.toISOString(),
      razorpay_payment_id: razorpay_payment_id,
    })
    .eq("clerk_user_id", userId);

  if (profileError) return NextResponse.json({ error: profileError.message }, { status: 500 });

  // Record payment — UNIQUE constraint on razorpay_payment_id prevents duplicates with webhook
  await supabaseAdmin.from("payments").upsert(
    {
      clerk_user_id:       userId,
      razorpay_order_id,
      razorpay_payment_id,
      plan,
      billing_cycle:       cycle,
      amount,
      currency:            "INR",
    },
    { onConflict: "razorpay_payment_id", ignoreDuplicates: true }
  );

  return NextResponse.json({ success: true, plan, expiresAt });
}
