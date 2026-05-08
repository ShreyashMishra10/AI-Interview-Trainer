import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { getRazorpay, PLAN_AMOUNTS, PlanType, CycleType } from "@/lib/razorpay";

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const plan  = body.plan  as PlanType;
  const cycle = body.cycle as CycleType;

  if (!["pro", "enterprise"].includes(plan) || !["monthly", "annual"].includes(cycle)) {
    return NextResponse.json({ error: "Invalid plan or cycle" }, { status: 400 });
  }

  const amount = PLAN_AMOUNTS[plan][cycle];

  const order = await getRazorpay().orders.create({
    amount,
    currency: "INR",
    notes: { clerk_user_id: userId, plan, cycle },
  });

  return NextResponse.json({ orderId: order.id, amount, currency: "INR" });
}
