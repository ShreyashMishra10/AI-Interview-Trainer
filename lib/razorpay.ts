import Razorpay from "razorpay";

let _razorpay: Razorpay | null = null;

export function getRazorpay(): Razorpay {
  if (!_razorpay) {
    if (!process.env.RAZORPAY_KEY_SECRET) throw new Error("RAZORPAY_KEY_SECRET is not set");
    _razorpay = new Razorpay({
      key_id:     process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return _razorpay;
}

export const PLAN_AMOUNTS = {
  pro: {
    monthly: 49900,   // ₹499 in paise
    annual:  478800,  // ₹399 × 12 in paise
  },
  enterprise: {
    monthly: 199900,  // ₹1,999 in paise
    annual:  1918800, // ₹1,599 × 12 in paise
  },
} as const;

export type PlanType   = "pro" | "enterprise";
export type CycleType  = "monthly" | "annual";
