import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { Reveal } from "@/components/Reveal";
import { Zap, Target, BarChart3, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "About — AI-Trainer",
  description: "Learn about AI-Trainer, founded by Shreyash Mishra. Our mission is to democratize elite technical interview coaching using AI.",
  keywords: ["about AI-Trainer", "Shreyash Mishra", "AI interview platform", "interview coaching AI", "tech startup India"],
  alternates: { canonical: "https://ai-interview-trainer.com/about" },
  openGraph: {
    title:       "About AI-Trainer — Our Mission & Story",
    description: "Meet the team behind AI-Trainer. Built to help engineers land their dream job through AI-powered mock interviews, voice mode, and smart CV generation.",
    url:         "https://ai-interview-trainer.com/about",
    type:        "website",
  },
  twitter: {
    card:        "summary_large_image",
    title:       "About AI-Trainer — Our Mission & Story",
    description: "Meet the team behind AI-Trainer. Built to help engineers land their dream job with AI-powered mock interviews.",
  },
};

const PILLARS = [
  {
    num: "01",
    icon: <Zap size={18} className="text-amber-500" />,
    title: "Adaptive Intelligence",
    body: "An AI that evolves with your stack. From React hooks to complex DSA patterns, it identifies exactly where your logic falters in real time.",
  },
  {
    num: "02",
    icon: <Target size={18} className="text-amber-500" />,
    title: "Real-Time Synthesis",
    body: "Eliminate the feedback gap. Get instant, surgical analysis on your technical communication the moment you finish a response.",
  },
  {
    num: "03",
    icon: <BarChart3 size={18} className="text-amber-500" />,
    title: "Precision Analytics",
    body: "Replace guesswork with data. Track progress through granular performance scores designed to meet the hiring bars of top-tier tech firms.",
  },
];

const STATS = [
  { value: "20+",  label: "Job Roles Covered" },
  { value: "24/7", label: "AI Availability"    },
  { value: "0%",   label: "Judgment"           },
  { value: "100%", label: "Privacy"            },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">

      {/* ── Hero ── */}
      <section className="max-w-[1100px] mx-auto px-6 lg:px-20 pt-20 pb-24 flex flex-col items-center text-center">
        <Reveal>
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
            <Zap size={12} className="text-amber-500" />
            <span className="text-[11px] text-amber-500 font-bold uppercase tracking-widest">Our Story</span>
          </div>
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight leading-tight mb-6 text-foreground">
            Our mission is<br />
            <span className="text-amber-500">technical interview mastery.</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 text-lg max-w-2xl leading-relaxed">
            AI-Trainer was founded by Shreyash Mishra, a developer who realized that the gap between a great engineer and a great job is often just a 45-minute conversation. Built to democratize elite coaching — so every candidate, regardless of background, can walk in with total confidence.
          </p>
        </Reveal>
      </section>

      {/* ── Image + Stats ── */}
      <section className="max-w-[1100px] mx-auto px-6 lg:px-20 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

          {/* Image */}
          <Reveal>
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-xl">
              <Image
                src="/ai-interview.webp"
                alt="AI interview session"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          {/* Stats grid */}
          <Reveal delay={100}>
            <div className="grid grid-cols-2 gap-4" style={{ height: "100%" }}>
              {STATS.map((s) => (
                <div
                  key={s.label}
                  className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-2xl flex flex-col items-center justify-center text-center gap-2 hover:border-amber-500/30 hover:shadow-[0_0_30px_rgba(251,191,36,0.07)] transition-all duration-300"
                >
                  <span className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">{s.value}</span>
                  <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-bold uppercase tracking-widest">{s.label}</span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Founder's Note ── */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-20 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <Reveal>
            <div className="flex flex-col gap-6">
              <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 w-fit">
                <span className="text-[11px] text-amber-500 font-bold uppercase tracking-widest">Founder&apos;s Note</span>
              </div>

              <h2 className="font-serif text-4xl lg:text-5xl text-foreground leading-[1.1] tracking-tight">
                The gap between a great engineer and a great job is often just a 45-minute conversation.
              </h2>

              <div className="flex flex-col gap-5 text-base text-zinc-500 dark:text-zinc-400 leading-relaxed">
                <p>I spent years mastering the syntax, only to realize that the industry doesn&apos;t just hire code — it hires people.</p>
                <div className="relative pl-6 border-l-2 border-amber-500/40 italic">
                  <p>I built AI-Trainer because elite interview coaching shouldn&apos;t be a luxury reserved for the few. Whether you&apos;re a student or a senior lead, your story deserves to be heard with clarity and confidence.</p>
                </div>
                <p>This platform is the mentor I wish I had when I was starting out — relentless, objective, and always available.</p>
              </div>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-base font-bold text-foreground">Shreyash Mishra</p>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium mt-0.5">Founder &amp; Lead Architect</p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="flex justify-center lg:justify-end">
              <Image
                src="/Admin.jpeg"
                alt="Shreyash Mishra — Founder of AI-Trainer"
                width={460}
                height={575}
                className="rounded-3xl object-cover aspect-[4/5] shadow-2xl border border-zinc-200/50 dark:border-zinc-800"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Pillars ── */}
      <section className="max-w-[1100px] mx-auto px-6 lg:px-20 py-24">
        <Reveal className="mb-14">
          <h2 className="font-serif text-4xl text-zinc-900 dark:text-zinc-100 mb-2">Engineering the future of technical interviews.</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm">Three principles that drive everything we build.</p>
        </Reveal>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {PILLARS.map((p, i) => (
            <Reveal key={p.num} delay={i * 80}>
              <div className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-2xl p-7 shadow-sm dark:shadow-none hover:border-amber-500/30 hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)] hover:-translate-y-2 transition-all duration-300 h-full flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    {p.icon}
                  </div>
                  <span className="text-2xl font-black text-zinc-300 dark:text-zinc-700 font-mono">{p.num}</span>
                </div>
                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 tracking-tight">{p.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Tech Marquee ── */}
      <section className="border-t border-zinc-200 dark:border-zinc-800 py-16 overflow-hidden bg-white dark:bg-transparent">
        <div className="relative flex" aria-hidden>
          <div className="animate-marquee whitespace-nowrap flex items-center gap-12 lg:gap-24">
            {["React", "Next.js", "Node.js", "MongoDB", "DSA", "Java", "TypeScript", "System Design",
              "React", "Next.js", "Node.js", "MongoDB", "DSA", "Java", "TypeScript", "System Design"].map((t, i) => (
              <span key={i} className="text-5xl lg:text-7xl font-black tracking-tighter text-zinc-200 dark:text-zinc-800 uppercase">
                {t}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-[1100px] mx-auto px-6 lg:px-20 py-24">
        <Reveal>
          <div className="bg-white dark:bg-card border border-amber-500/20 rounded-3xl p-10 sm:p-14 text-center relative overflow-hidden shadow-sm dark:shadow-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.05),transparent_70%)]" />
            <div className="relative z-10">
              <h2 className="text-3xl lg:text-4xl font-bold tracking-tight text-foreground mb-3">
                Ready to close the gap?
              </h2>
              <p className="text-muted-foreground text-sm max-w-md mx-auto mb-8 leading-relaxed">
                Start your first mock interview free. No credit card required.
              </p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <Link href="/sign-up" className="px-6 py-3 rounded-xl bg-amber-500 text-black text-sm font-bold hover:bg-amber-400 transition-all inline-flex items-center gap-2">
                  Start for Free <ArrowRight size={14} />
                </Link>
                <Link href="/pricing" className="px-6 py-3 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:border-foreground transition-all">
                  View pricing
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <Footer />
    </div>
  );
}
