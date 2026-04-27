import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing — AI-Trainer",
  description: "Simple, transparent pricing. Start free with 5 mock interviews/month. Upgrade to Pro for ₹499/month and get unlimited interviews, CV generations, voice mode, and analytics.",
};

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
