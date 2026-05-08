import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { PLAN_AMOUNTS, PlanType, CycleType } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  if (!secret) throw new Error("RAZORPAY_WEBHOOK_SECRET is not set");

  const body      = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";

  // Verify webhook signature using timing-safe comparison
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");

  const sigValid = crypto.timingSafeEqual(
    Buffer.from(expected),
    Buffer.from(signature.padEnd(expected.length, " ")) // pad to equal length to avoid length leak
  );
  if (!sigValid) return NextResponse.json({ error: "Invalid signature" }, { status: 400 });

  const event = JSON.parse(body);

  // Only handle successful payments
  if (event.event !== "payment.captured") {
    return NextResponse.json({ ok: true });
  }

  const payment = event.payload.payment.entity;
  const notes   = payment.notes as Record<string, unknown> | undefined;

  // Validate all required fields from notes — never trust without checking type
  const clerkUserId = typeof notes?.clerk_user_id === "string" ? notes.clerk_user_id : null;
  const plan        = typeof notes?.plan  === "string" && ["pro", "enterprise"].includes(notes.plan)
    ? (notes.plan as PlanType) : null;
  const cycle       = typeof notes?.cycle === "string" && ["monthly", "annual"].includes(notes.cycle)
    ? (notes.cycle as CycleType) : null;

  if (!clerkUserId || !plan || !cycle) {
    return NextResponse.json({ error: "Missing or invalid notes" }, { status: 400 });
  }

  // Idempotency — check if already processed (use limit(1) to avoid .single() error on duplicates)
  const { data: existing } = await supabaseAdmin
    .from("payments")
    .select("id")
    .eq("razorpay_payment_id", payment.id)
    .limit(1);

  if (existing && existing.length > 0) return NextResponse.json({ ok: true });

  // Amount is authoritative from our own PLAN_AMOUNTS — never trust Razorpay notes
  const amount = PLAN_AMOUNTS[plan][cycle];

  // Calculate expiry
  const expiresAt = new Date();
  if (cycle === "monthly") expiresAt.setMonth(expiresAt.getMonth() + 1);
  else                      expiresAt.setFullYear(expiresAt.getFullYear() + 1);

  // Upgrade plan
  await supabaseAdmin
    .from("profiles")
    .update({
      plan,
      billing_cycle:       cycle,
      plan_expires_at:     expiresAt.toISOString(),
      razorpay_payment_id: payment.id,
    })
    .eq("clerk_user_id", clerkUserId);

  // Record payment — upsert prevents duplicate rows if verify also ran
  await supabaseAdmin.from("payments").upsert(
    {
      clerk_user_id:       clerkUserId,
      razorpay_order_id:   payment.order_id,
      razorpay_payment_id: payment.id,
      plan,
      billing_cycle:       cycle,
      amount,
      currency:            payment.currency ?? "INR",
    },
    { onConflict: "razorpay_payment_id", ignoreDuplicates: true }
  );

  return NextResponse.json({ ok: true });
}
