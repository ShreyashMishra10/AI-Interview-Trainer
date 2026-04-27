import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — AI-Trainer",
  description: "AI-Trainer's terms of service. Read our terms covering account usage, subscriptions, payments, intellectual property, and governing law.",
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
