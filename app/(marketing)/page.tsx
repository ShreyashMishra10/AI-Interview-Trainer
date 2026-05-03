import type { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { ChatInterface } from "@/components/chat-interface";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import {
  Mic2, FileText, Languages, BarChart3, Radio, Zap,
  ArrowRight, Star, BookOpen, Trophy,
} from "lucide-react";
import Link from "next/link";

/* ── SEO Metadata ──────────────────────────────────────────── */
export const metadata: Metadata = {
  title: "AI-Trainer — Ace Your Technical Interview With an AI Mentor",
  description:
    "Practice real-time coding, DSA, and behavioral interviews with an AI that adapts to your skill level. Mock interviews, AI CV builder, voice mode, and performance analytics — all in one platform.",
  keywords: [
    "AI interview trainer",
    "technical interview practice",
    "mock interview AI",
    "coding interview prep",
    "DSA practice",
    "AI CV builder",
    "voice interview",
    "system design interview",
    "software engineering interview",
  ],
  openGraph: {
    title: "AI-Trainer — Ace Your Technical Interview With an AI Mentor",
    description:
      "Practice coding, DSA, and behavioral interviews with an AI mentor that adapts to your skill level. Free to start.",
    type: "website",
    url: "https://ai-interview-trainer.com",
    siteName: "AI-Trainer",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI-Trainer — Ace Your Technical Interview With an AI Mentor",
    description:
      "Practice coding and behavioral interviews with an AI mentor. Mock sessions, CV builder, voice mode, analytics.",
  },
  alternates: {
    canonical: "https://ai-interview-trainer.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

/* ── Structured data ───────────────────────────────────────── */
const APP_JSONLD = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "AI-Trainer",
  applicationCategory: "EducationApplication",
  operatingSystem: "Web",
  url: "https://ai-interview-trainer.com",
  description: "Practice real-time coding, DSA, and behavioral interviews with an AI mentor. Includes CV builder, voice mode, and performance analytics.",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "INR",
    availability: "https://schema.org/InStock",
  },
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    ratingCount: "120",
  },
};

/* ── Static data (server-safe) ─────────────────────────────── */
const STATS = [
  { icon: <Trophy   size={20} aria-hidden />, value: "20+",  label: "Job Roles Covered"    },
  { icon: <BookOpen size={20} aria-hidden />, value: "10",   label: "Questions Per Session" },
  { icon: <Mic2     size={20} aria-hidden />, value: "3",    label: "Practice Modes"        },
  { icon: <Star     size={20} aria-hidden />, value: "100",  label: "Max Score Per Session" },
];

const STEPS = [
  {
    num: "01",
    title: "Pick your role",
    body: "Select from 20+ CSE roles and set your experience level. The AI tailors every question to your exact profile.",
  },
  {
    num: "02",
    title: "Practice live",
    body: "Answer real-time questions in chat or voice mode. The AI probes deeper, just like a real interviewer would.",
  },
  {
    num: "03",
    title: "Get feedback",
    body: "Receive instant, surgical feedback on every answer — technical accuracy, communication, and confidence score.",
  },
];

const FEATURES = [
  {
    icon: <Mic2      size={20} aria-hidden />,
    title: "AI Mock Interviews",
    body: "10 progressive questions per session, tailored to your role and experience.",
    color: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: <FileText  size={20} aria-hidden />,
    title: "AI CV Builder",
    body: "Turn raw experience into a polished, recruiter-ready CV in minutes.",
    color: "text-emerald-500",
    bg: "bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: <Radio     size={20} aria-hidden />,
    title: "Voice Interview Mode",
    body: "Speak your answers aloud. The AI listens, transcribes, and evaluates in real time.",
    color: "text-rose-500",
    bg: "bg-rose-500/10 border-rose-500/20",
  },
  {
    icon: <BarChart3 size={20} aria-hidden />,
    title: "Performance Analytics",
    body: "Track your readiness score, skill gaps, and weekly progress over time.",
    color: "text-blue-500",
    bg: "bg-blue-500/10 border-blue-500/20",
  },
  {
    icon: <Languages size={20} aria-hidden />,
    title: "JP-Sensei",
    body: "A structured roadmap from Hiragana to JLPT N1 — built for developers.",
    color: "text-violet-500",
    bg: "bg-violet-500/10 border-violet-500/20",
  },
  {
    icon: <Zap       size={20} aria-hidden />,
    title: "Instant Feedback",
    body: "No waiting. Every answer gets critiqued the moment you submit it.",
    color: "text-amber-500",
    bg: "bg-amber-500/10 border-amber-500/20",
  },
];


const MARQUEE_ITEMS = [
  "React", "Next.js", "Node.js", "MongoDB", "DSA",
  "Java", "TypeScript", "System Design",
];

/* ── Page (Server Component) ───────────────────────────────── */
export default async function Home() {
  const { userId } = await auth();
  const isLoggedIn = !!userId;

  return (
    <main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(APP_JSONLD) }} />
      {/* ── HERO ──────────────────────────────────────────── */}
      <section
        aria-label="Hero"
        className="relative flex flex-col lg:flex-row items-center justify-center min-h-[calc(100vh-81px)] px-6 sm:px-12 lg:px-20 xl:px-32 gap-10 overflow-hidden"
      >
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-40 -left-40 w-[640px] h-[640px] rounded-full bg-amber-500/[0.06] blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-[480px] h-[480px] rounded-full bg-amber-500/[0.04] blur-3xl" />

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.35] dark:opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, oklch(0.5 0 0 / 0.25) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Hero text — centered when logged in, left-aligned when not */}
        <div className={`space-y-6 relative z-10 self-center ${isLoggedIn ? "w-full text-center flex flex-col items-center" : "flex-1"}`}>
          <div
            className="animate-reveal inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5"
            style={{ animationDelay: "0ms" }}
          >
            <Zap size={12} className="text-amber-500" aria-hidden />
            <span className="text-[11px] text-amber-500 font-bold uppercase tracking-widest">
              AI-Powered Interview Training
            </span>
          </div>

          <h1
            className={`animate-reveal font-bold tracking-tight leading-tight ${isLoggedIn ? "text-5xl lg:text-8xl" : "text-5xl lg:text-7xl"}`}
            style={{ animationDelay: "150ms" }}
          >
            Nail Your Next Big <br /> Interview With an <br />
            <span className="text-amber-500">AI Mentor</span>
          </h1>

          <p
            className="animate-reveal text-lg text-muted-foreground max-w-xl"
            style={{ animationDelay: "300ms" }}
          >
            Practice real-time coding and behavioral questions with an AI that
            adapts to your skill level.
          </p>

          <div
            className="animate-reveal flex flex-col sm:flex-row items-center gap-4"
            style={{ animationDelay: "450ms" }}
          >
            {isLoggedIn ? (
              <Link href="/dashboard">
                <Button className="h-12 px-10 text-base font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_24px_rgba(251,191,36,0.35)] transition-all">
                  Go to Dashboard →
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/sign-up">
                  <Button className="h-12 px-8 text-base font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_24px_rgba(251,191,36,0.35)] transition-all">
                    Start Training for Free
                  </Button>
                </Link>
                <Link
                  href="/services"
                  className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1.5 group"
                >
                  See all features
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </>
            )}
          </div>

        </div>

        {/* Right: live demo — only shown to logged-out users */}
        {!isLoggedIn && (
          <div
            className="animate-reveal flex-1 flex justify-center lg:justify-end w-full relative z-10 self-center"
            style={{ animationDelay: "200ms" }}
          >
            <ChatInterface />
          </div>
        )}
      </section>

      {/* ── STATS ─────────────────────────────────────────── */}
      <section aria-label="Platform statistics" className="py-12">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-20">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {STATS.map((s, i) => (
              <Reveal key={s.label} delay={i * 80}>
                <div className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-2xl p-6 shadow-sm dark:shadow-none flex flex-col items-center text-center gap-2 hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.07)] transition-all duration-300">
                  <div className="text-amber-500">{s.icon}</div>
                  <div className="text-3xl font-bold tracking-tight text-foreground">{s.value}</div>
                  <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section aria-label="How it works" className="max-w-[1100px] mx-auto px-6 lg:px-20 py-24">
        <Reveal className="mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-5">
            <Zap size={12} className="text-amber-500" aria-hidden />
            <span className="text-[11px] text-amber-500 font-bold uppercase tracking-widest">How It Works</span>
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
            From zero to interview-ready<br />
            <span className="text-amber-500">in three steps.</span>
          </h2>
        </Reveal>

        <div className="flex flex-col md:flex-row md:items-stretch gap-4 md:gap-0">
          {STEPS.flatMap((step, i) => {
            const card = (
              <Reveal key={step.num} delay={i * 120} className="flex-1">
                <div className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-2xl p-7 shadow-sm dark:shadow-none hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.07)] transition-all duration-300 h-full">
                  <span className="block text-5xl font-black text-zinc-300 dark:text-zinc-800 mb-5 font-mono leading-none">
                    {step.num}
                  </span>
                  <h3 className="text-lg font-bold tracking-tight text-foreground mb-2">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
                </div>
              </Reveal>
            );
            if (i < STEPS.length - 1) {
              return [
                card,
                <div key={`arrow-${i}`} className="hidden md:flex items-center justify-center px-3 shrink-0">
                  <ArrowRight size={16} className="text-amber-500/50" aria-hidden />
                </div>,
              ];
            }
            return [card];
          })}
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────── */}
      <section
        aria-label="Features"
        className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20"
      >
        <div className="max-w-[1100px] mx-auto px-6 lg:px-20 py-24">
          <Reveal className="mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-5">
              <Star size={12} className="text-amber-500" aria-hidden />
              <span className="text-[11px] text-amber-500 font-bold uppercase tracking-widest">Features</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight">
              Everything you need.<br />
              <span className="text-amber-500">Nothing you don&apos;t.</span>
            </h2>
            <p className="text-muted-foreground mt-4 max-w-md">
              Every tool on this platform was built to close one specific gap between
              where you are and where you want to be.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 70}>
                <div className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-2xl p-6 shadow-sm dark:shadow-none hover:border-amber-500/20 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] hover:-translate-y-2 transition-all duration-300 h-full">
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-4 ${f.bg} ${f.color}`}>
                    {f.icon}
                  </div>
                  <h3 className="font-bold tracking-tight text-foreground mb-1.5">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ───────────────────────────────────────── */}
      <section
        aria-label="Domains covered"
        className="py-16 border-y border-zinc-200 dark:border-zinc-800 overflow-hidden bg-white dark:bg-transparent"
      >
        <Reveal className="px-6 lg:px-20 max-w-[1100px] mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-4">
            <span className="text-[11px] text-amber-500 font-bold uppercase tracking-widest">Domains Covered</span>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Practice across the full modern stack.
          </h2>
        </Reveal>
        <div className="relative flex" aria-hidden>
          <div className="animate-marquee whitespace-nowrap flex items-center gap-12 lg:gap-24">
            {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((t, i) => (
              <span
                key={i}
                className="text-5xl lg:text-7xl font-black tracking-tighter text-zinc-300 dark:text-zinc-800 uppercase"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── EARLY ACCESS CTA ──────────────────────────────────── */}
      <section aria-label="Early access" className="max-w-[1100px] mx-auto px-6 lg:px-20 py-24">
        <Reveal>
          <div className="bg-white dark:bg-card border border-amber-500/20 rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden shadow-sm dark:shadow-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.05),transparent_70%)]" />
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
                <Star size={12} className="text-amber-500" aria-hidden />
                <span className="text-[11px] text-amber-500 font-bold uppercase tracking-widest">Early Access</span>
              </div>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
                Be among the first<br />
                <span className="text-amber-500">to train smarter.</span>
              </h2>
              <p className="text-muted-foreground text-base max-w-lg mx-auto mb-8 leading-relaxed">
                AI-Trainer is just getting started. Sign up free today — your feedback shapes what we build next.
              </p>
              <Link href="/sign-up">
                <Button className="h-12 px-10 text-base font-bold bg-amber-500 hover:bg-amber-400 text-black shadow-[0_0_24px_rgba(251,191,36,0.35)] transition-all">
                  Start for Free →
                </Button>
              </Link>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </main>
  );
}
