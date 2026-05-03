import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ — AI-Trainer",
  description: "Answers to common questions about AI-Trainer — mock interviews, CV builder, voice mode, pricing, billing, account management, and JP-Sensei.",
  keywords: ["AI-Trainer FAQ", "mock interview questions", "how does AI interview work", "CV builder help", "pricing FAQ"],
  alternates: { canonical: "https://ai-interview-trainer.com/faq" },
  openGraph: {
    title:       "FAQ — AI-Trainer",
    description: "Everything you need to know about AI mock interviews, CV builder, voice mode, pricing, and JP-Sensei.",
    url:         "https://ai-interview-trainer.com/faq",
    type:        "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "FAQ — AI-Trainer",
    description: "Everything you need to know about AI mock interviews, CV builder, voice mode, pricing, and JP-Sensei.",
  },
};

const FAQ_JSONLD = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is AI-Trainer free to use?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. The Free plan gives you 5 mock interviews and 1 CV generation per month at no cost. Pro is ₹499/month for unlimited access." },
    },
    {
      "@type": "Question",
      name: "How does the AI mock interview work?",
      acceptedAnswer: { "@type": "Answer", text: "You select a job role and experience level, then Sarah (our AI interviewer) asks real technical and behavioral questions. You can respond via text or voice. At the end you get a score and detailed feedback." },
    },
    {
      "@type": "Question",
      name: "Does the CV builder use AI?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. You upload an existing CV or fill in your details, and the AI generates a polished, ATS-friendly CV in Google XYZ format tailored to your target role." },
    },
    {
      "@type": "Question",
      name: "What is voice interview mode?",
      acceptedAnswer: { "@type": "Answer", text: "Voice mode lets you practice speaking your answers out loud using your microphone. The AI responds with synthesized speech so it feels like a real interview call." },
    },
    {
      "@type": "Question",
      name: "What is JP-Sensei?",
      acceptedAnswer: { "@type": "Answer", text: "JP-Sensei is our Japanese language and business culture coach. It helps you prepare for technical interviews at Japanese companies with industry-specific vocabulary and communication tips." },
    },
    {
      "@type": "Question",
      name: "Can I cancel my subscription anytime?",
      acceptedAnswer: { "@type": "Answer", text: "Yes. You can cancel your Pro or Enterprise subscription at any time. You retain access until the end of your current billing period." },
    },
  ],
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_JSONLD) }} />
      {children}
    </>
  );
}
