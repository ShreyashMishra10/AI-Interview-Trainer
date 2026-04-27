import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — AI-Trainer",
  description: "Answers to common questions about AI-Trainer — mock interviews, CV builder, voice mode, pricing, billing, account management, and JP-Sensei.",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
