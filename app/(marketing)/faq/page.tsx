"use client";

import React, { useState } from "react";
import { HelpCircle, ChevronRight, ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";

const SECTIONS = [
  { id: "general",     title: "General"            },
  { id: "interviews",  title: "Mock Interviews"     },
  { id: "cv",          title: "CV Builder"          },
  { id: "voice",       title: "Voice Mode"          },
  { id: "analytics",   title: "Analytics"           },
  { id: "billing",     title: "Pricing & Billing"   },
  { id: "account",     title: "Account & Data"      },
  { id: "jp-sensei",   title: "JP-Sensei"           },
];

const FAQS: Record<string, { q: string; a: string }[]> = {
  general: [
    {
      q: "What is AI-Trainer?",
      a: "AI-Trainer is an AI-powered platform that helps software developers and CSE students prepare for technical interviews. It offers mock interview sessions, an AI CV builder, voice interview mode, Japanese language learning, and performance analytics — all in one place.",
    },
    {
      q: "Who is this platform built for?",
      a: "Primarily for computer science students and software engineers targeting roles in tech. Whether you're a fresher preparing for campus placements or an experienced developer aiming for FAANG, AI-Trainer adapts to your level.",
    },
    {
      q: "Is AI-Trainer free to use?",
      a: "Yes — the Free plan gives you 5 mock interviews, 2 CV generations, and 100 AI chat credits per month with no credit card required. Upgrade to Pro for unlimited access.",
    },
    {
      q: "What AI powers the platform?",
      a: "We use Anthropic's Claude — one of the most capable and safety-focused AI models available — for interview questions, feedback, and CV generation.",
    },
    {
      q: "Is AI-Trainer available on mobile?",
      a: "Yes, the platform is fully responsive and works on all modern browsers including mobile. Voice mode works best on Chrome and Edge on desktop.",
    },
  ],
  interviews: [
    {
      q: "How do mock interview sessions work?",
      a: "You select a job role and experience level, and the AI generates 10 progressively harder questions tailored to your profile — spanning DSA, system design, and behavioral topics. You answer in chat or voice mode and receive instant feedback after each response.",
    },
    {
      q: "Which job roles are supported?",
      a: "We support 20+ CSE roles including Frontend Developer, Backend Developer, Full-Stack, DevOps, Data Scientist, ML Engineer, Android Developer, iOS Developer, System Design, and more.",
    },
    {
      q: "How is my interview score calculated?",
      a: "Scores are based on technical accuracy, communication clarity, problem-solving approach, and confidence indicators — evaluated by the AI after each answer.",
    },
    {
      q: "Can I review my past interview sessions?",
      a: "Yes — Pro users can view full session history including transcripts, scores, and AI feedback. Free users see a summary of their most recent sessions only.",
    },
    {
      q: "Can I use AI-Trainer for non-tech interviews?",
      a: "Currently the platform focuses on CSE and tech roles. Non-tech and management interview support is planned for a future update.",
    },
  ],
  cv: [
    {
      q: "How does the AI CV Builder work?",
      a: "You fill in a 4-step form with your experience, projects, skills, and target role. The AI rewrites everything using impact-driven language and professional structure, producing a clean, recruiter-ready CV.",
    },
    {
      q: "Is my CV data stored on your servers?",
      a: "No. CV input is processed and immediately deleted after generation. We never store your resume content on our servers.",
    },
    {
      q: "Can I download my CV as a PDF?",
      a: "Yes — once generated, your CV can be exported as a downloadable PDF directly from the platform.",
    },
    {
      q: "How many CVs can I generate?",
      a: "Free users can generate 2 CVs per month. Pro and Enterprise users get unlimited CV generations.",
    },
  ],
  voice: [
    {
      q: "How does voice interview mode work?",
      a: "The AI speaks questions aloud using text-to-speech. You respond verbally and the platform transcribes your speech in real time using the Web Speech API, then evaluates your answer just like a chat response.",
    },
    {
      q: "Which browsers support voice mode?",
      a: "Voice mode works best on Chrome and Edge. Firefox has limited Web Speech API support. Safari on iOS has partial support.",
    },
    {
      q: "Does the platform record my audio or video?",
      a: "No. Voice input is transcribed locally in your browser using the Web Speech API — audio is never sent to our servers. The webcam feed is displayed locally only and is not recorded.",
    },
    {
      q: "Can I switch between chat and voice mid-session?",
      a: "Yes — you can seamlessly toggle between chat and voice mode at any point during an interview session.",
    },
  ],
  analytics: [
    {
      q: "What does the performance dashboard show?",
      a: "Your dashboard includes an Interview Readiness Score (0–100%), skill proficiency bars per domain, an annual activity heatmap, weekly progress streaks, and an AI Feedback Feed with strength and critical analysis.",
    },
    {
      q: "What is the Interview Readiness Score?",
      a: "It's a composite score from 0–100% calculated from your recent session performance, consistency, and improvement trend. It gives you a single number to track how ready you are for real interviews.",
    },
    {
      q: "Do Free users get analytics?",
      a: "Free users get basic analytics — readiness score and recent session scores. Full analytics including the activity heatmap, skill proficiency, and weekly AI reports are available on the Pro plan.",
    },
  ],
  billing: [
    {
      q: "What are the available plans?",
      a: "We offer three plans — Free (₹0 forever), Pro (₹499/month or ₹399/month billed annually), and Enterprise (₹1,999/month or ₹1,599/month billed annually).",
    },
    {
      q: "Can I cancel my subscription anytime?",
      a: "Yes — cancel anytime from Settings → Subscription. You retain Pro access until the end of your current billing period. No cancellation fees.",
    },
    {
      q: "Do you offer a refund?",
      a: "We don't offer pro-rated refunds for mid-cycle cancellations. Annual plan refunds may be considered within 7 days of purchase — contact support@ai-trainer.com.",
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept all major credit/debit cards, UPI, net banking, and popular wallets via Razorpay.",
    },
    {
      q: "How does annual billing work?",
      a: "Annual plans are billed once a year at roughly 20% off versus monthly pricing. You save ₹1,200/yr on Pro and ₹4,800/yr on Enterprise.",
    },
    {
      q: "Can I upgrade from Free to Pro mid-month?",
      a: "Yes — upgrades are applied immediately. Downgrades take effect at the start of the next billing cycle.",
    },
  ],
  account: [
    {
      q: "How do I delete my account?",
      a: "Go to Settings → Account → Delete Account. Deletion is permanent and removes all your data including session history, scores, and profile information.",
    },
    {
      q: "How is my data protected?",
      a: "All data is encrypted in transit using TLS 1.2+. Authentication is managed by Clerk — we never store passwords. Database access is restricted to authorised personnel only.",
    },
    {
      q: "Can I export my interview data?",
      a: "Pro and Enterprise users can export their interview history and session transcripts as JSON from the dashboard.",
    },
    {
      q: "How do I reset my password?",
      a: "Use the 'Forgot password' link on the login page. Password reset is handled securely by Clerk via email.",
    },
  ],
  "jp-sensei": [
    {
      q: "What is JP-Sensei?",
      a: "JP-Sensei is a structured Japanese language learning roadmap built specifically for CSE students and developers targeting jobs in Japan. It covers 4 phases from Foundation (Hiragana/Katakana) to Mastery (JLPT N1).",
    },
    {
      q: "Is JP-Sensei free?",
      a: "Yes — the full JP-Sensei roadmap is available on the Free plan. Pro users additionally get AI conversation practice in Japanese.",
    },
    {
      q: "How long does it take to complete the roadmap?",
      a: "The roadmap is designed for roughly 12–18 months of consistent daily study (1–2 hours/day). Each phase has time estimates and a prioritised topic list.",
    },
    {
      q: "What resources does JP-Sensei recommend?",
      a: "The roadmap curates 8+ resources including Anki, Genki, WaniKani, JapanesePod101, and Bunpro — with guidance on when and how to use each.",
    },
  ],
};

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={`border border-zinc-200 dark:border-border rounded-xl overflow-hidden transition-all duration-200 ${
        open ? "bg-white dark:bg-card shadow-sm" : "bg-white dark:bg-card hover:border-amber-400/30"
      }`}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-semibold text-foreground">{q}</span>
        {open
          ? <ChevronUp size={15} className="text-amber-400 shrink-0" />
          : <ChevronDown size={15} className="text-muted-foreground shrink-0" />
        }
      </button>
      {open && (
        <div className="px-5 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-zinc-100 dark:border-border pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

function Section({ id, title, faqs }: { id: string; title: string; faqs: { q: string; a: string }[] }) {
  return (
    <div id={id} className="mb-12 scroll-mt-24 animate-reveal">
      <h2 className="text-xl font-semibold text-foreground mb-5 flex items-center gap-3">
        <div className="w-1 h-6 bg-amber-400 rounded-full" />
        {title}
      </h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <FaqItem key={i} q={faq.q} a={faq.a} />
        ))}
      </div>
    </div>
  );
}

export default function FaqPage() {
  const [activeSection, setActiveSection] = useState("general");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 selection:bg-amber-400/30">
      <div className="max-w-[1100px] mx-auto px-6 py-12">

        <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-10">
          <ArrowLeft size={15} /> Back to Home
        </Link>

        <div className="mb-12 animate-reveal">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
              <HelpCircle size={18} className="text-amber-400" />
            </div>
            <span className="text-[11px] text-muted-foreground font-bold uppercase tracking-[0.3em]">Support</span>
          </div>
          <h1 className="text-4xl font-serif tracking-tight mb-3">Frequently Asked Questions</h1>
          <p className="text-muted-foreground text-sm max-w-lg">
            Everything you need to know about AI-Trainer. Can&apos;t find your answer?{" "}
            <a href="mailto:support@ai-trainer.com" className="text-amber-500 hover:underline font-medium">
              Email us
            </a>.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">

          {/* Sidebar TOC */}
          <div className="w-full lg:w-52 shrink-0 hidden lg:block">
            <div className="sticky top-24">
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest mb-4">Categories</p>
              <nav className="space-y-1">
                {SECTIONS.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => scrollTo(s.id)}
                    className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                      activeSection === s.id
                        ? "text-amber-400 bg-amber-400/10 font-medium"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                    }`}
                  >
                    {activeSection === s.id && <ChevronRight size={11} className="shrink-0" />}
                    {s.title}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="flex-1 min-w-0">
            {SECTIONS.map((s) => (
              <Section
                key={s.id}
                id={s.id}
                title={s.title}
                faqs={FAQS[s.id]}
              />
            ))}

          </div>

        </div>
      </div>
            <Footer/>
    </div>
  );
}
