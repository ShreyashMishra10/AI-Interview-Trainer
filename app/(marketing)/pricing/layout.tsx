import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — AI-Trainer",
  description: "Simple, transparent pricing. Start free with 5 mock interviews/month. Upgrade to Pro for ₹499/month — unlimited interviews, CV generations, voice mode, and analytics.",
  keywords: ["AI-Trainer pricing", "interview prep subscription", "free mock interview", "Pro plan ₹499"],
  alternates: { canonical: "https://ai-interview-trainer.com/pricing" },
  openGraph: {
    title:       "Pricing — AI-Trainer",
    description: "Start free. Pro at ₹499/month. Unlimited AI mock interviews, CV builder, voice mode, and analytics.",
    url:         "https://ai-interview-trainer.com/pricing",
    type:        "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "Pricing — AI-Trainer",
    description: "Start free. Pro at ₹499/month. Unlimited AI mock interviews, CV builder, voice mode, and analytics.",
  },
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
