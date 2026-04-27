import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — AI-Trainer",
  description: "AI-Trainer's privacy policy. Learn how we collect, use, and protect your data. We never sell your personal data or store your CV content.",
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
