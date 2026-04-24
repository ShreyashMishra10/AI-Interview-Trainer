"use client";

import{ useState } from "react";
import {
  Mic2,
  FileText,
  Languages,
  BarChart3,
  Radio,
  Check,
  ArrowUpRight,
  Zap,
  Star,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SERVICES = [
  {
    icon: <Mic2 size={22} />,
    title: "AI Mock Interviews",
    tag: "Core Feature",
    tagColor: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    description:
      "Practice real interviews with an AI interviewer tailored to your exact job role and experience level. Get asked progressive questions — from DSA to system design to behavioral — and receive instant feedback after every answer.",
    highlights: [
      "10 questions per session, progressively harder",
      "Tailored to 20+ CSE roles and domains",
      "Real-time AI feedback on every answer",
      "Voice and chat mode supported",
      "Session history and score tracking",
    ],
    free: "5 sessions/month",
    pro: "Unlimited sessions",
    color: "hover:border-amber-500/40",
    glow: "hover:shadow-[0_0_30px_rgba(251,191,36,0.1)]",
    iconBg: "bg-amber-500/10 text-amber-500",
  },
  {
    icon: <FileText size={22} />,
    title: "AI CV Builder",
    tag: "Career Tool",
    tagColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    description:
      "Stop staring at a blank page. Fill in your experience, projects, and skills — our AI rewrites everything into a polished, professional CV with impact-driven language that gets noticed by recruiters.",
    highlights: [
      "4-step guided input flow",
      "AI rewrites your experience with impact language",
      "Structured JSON output for clean formatting",
      "Downloadable PDF export",
      "Tailored to your target role",
    ],
    free: "2 CVs/month",
    pro: "Unlimited CVs",
    color: "hover:border-emerald-500/40",
    glow: "hover:shadow-[0_0_30px_rgba(52,211,153,0.1)]",
    iconBg: "bg-emerald-500/10 text-emerald-500",
  },
  {
    icon: <Languages size={22} />,
    title: "JP-Sensei Japanese Learning",
    tag: "Language",
    tagColor: "text-violet-500 bg-violet-500/10 border-violet-500/20",
    description:
      "A structured, efficient roadmap to Japanese fluency — built specifically for CSE students and developers. From Hiragana to JLPT N1, every topic is prioritized, timed, and explained with actionable tips.",
    highlights: [
      "4-phase learning roadmap (Foundation → Mastery)",
      "20+ topics with time estimates and expert tips",
      "Daily study routine with 6 structured sessions",
      "8 curated resources (Anki, Genki, WaniKani etc.)",
      "Track progress by checking off completed topics",
    ],
    free: "Full access",
    pro: "Full access + AI conversation practice",
    color: "hover:border-violet-500/40",
    glow: "hover:shadow-[0_0_30px_rgba(167,139,250,0.1)]",
    iconBg: "bg-violet-500/10 text-violet-500",
  },
  {
    icon: <BarChart3 size={22} />,
    title: "Performance Analytics",
    tag: "Insights",
    tagColor: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    description:
      "Your dashboard is your command center. Track interview readiness, monitor skill proficiency across domains, view your annual activity heatmap, and get AI-generated feedback that tells you exactly what to improve.",
    highlights: [
      "Interview Readiness Score (0–100%)",
      "Skill proficiency bars per domain",
      "Annual activity heatmap (interview-only glow)",
      "AI Feedback Feed with strength & critical analysis",
      "Weekly progress streaks",
    ],
    free: "Basic analytics",
    pro: "Full analytics + weekly AI reports",
    color: "hover:border-blue-500/40",
    glow: "hover:shadow-[0_0_30px_rgba(96,165,250,0.1)]",
    iconBg: "bg-blue-500/10 text-blue-500",
  },
  {
    icon: <Radio size={22} />,
    title: "Voice Interview Mode",
    tag: "Advanced",
    tagColor: "text-rose-500 bg-rose-500/10 border-rose-500/20",
    description:
      "Simulate a real interview environment with full voice support. The AI asks questions aloud, you speak your answers, and the system transcribes and evaluates your response — all in real time.",
    highlights: [
      "AI speaks questions using text-to-speech",
      "Browser-based voice recognition (no install)",
      "Live waveform and speaking indicator",
      "Webcam feed for realistic interview feel",
      "Seamlessly switch between voice and chat",
    ],
    free: "Available in chat sessions",
    pro: "Full voice mode with AI auto-speak",
    color: "hover:border-rose-500/40",
    glow: "hover:shadow-[0_0_30px_rgba(251,113,133,0.1)]",
    iconBg: "bg-rose-500/10 text-rose-500",
  },
];

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    period: "forever",
    description: "Get started with the essentials",
    features: [
      "5 mock interviews per month",
      "2 CV generations per month",
      "100 AI chat credits",
      "Basic performance analytics",
      "JP-Sensei roadmap access",
      "Chat mode interviews",
    ],
    cta: "Get Started Free",
    highlight: false,
    icon: <Zap size={16} />,
  },
  {
    name: "Pro",
    price: "₹499",
    period: "/month",
    description: "Unlock your full interview potential",
    features: [
      "Unlimited mock interviews",
      "Unlimited CV generations",
      "Unlimited AI chat credits",
      "Full analytics + weekly AI reports",
      "Voice interview mode",
      "Priority AI response speed",
      "Interview history & export",
      "Priority support",
    ],
    cta: "Upgrade to Pro",
    highlight: true,
    icon: <Star size={16} />,
  },
  {
    name: "Enterprise",
    price: "₹1,999",
    period: "/month",
    description: "For teams and institutions",
    features: [
      "Everything in Pro",
      "Team management dashboard",
      "Custom job role configuration",
      "Bulk interview sessions",
      "API access",
      "Dedicated account manager",
      "Custom branding options",
      "SLA & compliance support",
    ],
    cta: "Contact Us",
    highlight: false,
    icon: <Crown size={16} />,
  },
];

const FAQS = [
  {
    q: "Can I cancel my Pro subscription anytime?",
    a: "Yes — cancel anytime from Settings → Subscription. You'll retain Pro access until the end of your billing period.",
  },
  {
    q: "Does voice mode work on all browsers?",
    a: "Voice mode uses the Web Speech API, which works best on Chrome and Edge. Firefox has limited support.",
  },
  {
    q: "Is my CV data stored on your servers?",
    a: "No. CV input is processed and immediately deleted after generation. We never store your resume content.",
  },
  {
    q: "What AI powers the interview questions?",
    a: "We use Anthropic's Claude (claude-haiku) — one of the most capable and safe AI models available.",
  },
  {
    q: "How is the interview score calculated?",
    a: "Scores are based on technical accuracy, communication clarity, problem-solving approach, and confidence indicators.",
  },
  {
    q: "Can I use this for non-tech interviews?",
    a: "Currently the platform focuses on CSE and tech roles. Non-tech support is planned for a future update.",
  },
];

// ─── Components ──────────────────────────────────────────────────────────────

function ServiceCard({ service }: { service: (typeof SERVICES)[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`
        bg-white shadow-sm border-zinc-200 
        dark:bg-card dark:border-border dark:shadow-none
        rounded-2xl p-6 transition-all duration-300 cursor-pointer border
        ${service.color} ${service.glow}
      `}
      onClick={() => setExpanded((v) => !v)}
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-center gap-4">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${service.iconBg}`}
          >
            {service.icon}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-semibold text-foreground">
                {service.title}
              </h3>
              <span
                className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${service.tagColor}`}
              >
                {service.tag}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground font-medium">
              <span>Free: {service.free}</span>
              <span>·</span>
              <span className="text-amber-500/80">Pro: {service.pro}</span>
            </div>
          </div>
        </div>
        <ArrowUpRight
          size={16}
          className={`text-muted-foreground shrink-0 transition-transform duration-300 ${expanded ? "rotate-90 text-foreground" : ""}`}
        />
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-4">
        {service.description}
      </p>

      {expanded && (
        <div className="border-t border-border pt-4 mt-2 space-y-2 animate-in fade-in duration-200">
          {service.highlights.map((h, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-xs text-muted-foreground font-medium"
            >
              <Check size={12} className="text-amber-500 shrink-0" />
              {h}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function PlanCard({ plan }: { plan: (typeof PLANS)[0] }) {
  return (
    <div
      className={`
      relative flex flex-col rounded-2xl border p-6 transition-all duration-300
      bg-white shadow-md border-zinc-200
      dark:bg-card dark:border-border dark:shadow-none
      ${plan.highlight ? "ring-1 ring-amber-500/30 border-amber-500/30 dark:bg-amber-500/[0.03]" : ""}
    `}
    >
      {plan.highlight && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
          Most Popular
        </div>
      )}

      <div className="mb-5">
        <div
          className={`flex items-center gap-2 mb-3 ${plan.highlight ? "text-amber-500" : "text-muted-foreground"}`}
        >
          {plan.icon}
          <span className="text-xs font-bold uppercase tracking-widest">
            {plan.name}
          </span>
        </div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-3xl font-bold text-foreground">
            {plan.price}
          </span>
          <span className="text-sm text-muted-foreground">{plan.period}</span>
        </div>
        <p className="text-xs text-muted-foreground font-medium">
          {plan.description}
        </p>
      </div>

      <ul className="space-y-2.5 flex-1 mb-6">
        {plan.features.map((f) => (
          <li
            key={f}
            className="flex items-center gap-2 text-xs text-muted-foreground font-medium"
          >
            <Check
              size={12}
              className={
                plan.highlight
                  ? "text-amber-500 shrink-0"
                  : "text-muted-foreground/40 shrink-0"
              }
            />
            {f}
          </li>
        ))}
      </ul>

      <Link
        href="/dashboard"
        className={`w-full py-3 rounded-xl text-xs font-bold text-center transition-all block ${
          plan.highlight
            ? "bg-amber-500 text-black hover:bg-amber-400"
            : "bg-zinc-50 dark:bg-zinc-900 border border-border text-muted-foreground hover:text-foreground"
        }`}
      >
        {plan.cta}
      </Link>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-[1100px] mx-auto space-y-20 animate-in fade-in duration-700 py-12 px-6">
        {/* Hero */}
        <section className="text-center pt-8">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
            <Zap size={12} className="text-amber-500" />
            <span className="text-[11px] text-amber-500 font-bold uppercase tracking-widest">
              Services
            </span>
          </div>
          <h1 className="text-5xl font-serif text-foreground tracking-tight mb-4 leading-tight">
            Everything you need to
            <br />
            <span className="text-amber-500">land your dream job.</span>
          </h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed font-medium">
            AI-Interview Trainer provides tools and feedback to walk into any
            interview with confidence — from mock sessions to professional CVs.
          </p>
        </section>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { value: "20+", label: "Job Roles" },
            { value: "10", label: "Questions" },
            { value: "4", label: "JP Phases" },
            { value: "∞", label: "Practice" },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white dark:bg-card border border-zinc-200 dark:border-border shadow-sm rounded-2xl p-5 text-center"
            >
              <div className="text-2xl font-bold text-amber-500 mb-1">
                {s.value}
              </div>
              <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Services */}
        <section>
          <div className="mb-8">
            <h2 className="text-2xl font-serif text-foreground mb-2">
              Our Services
            </h2>
            <p className="text-muted-foreground text-sm font-medium">
              Click any service to see what's included.
            </p>
          </div>
          <div className="space-y-4">
            {SERVICES.map((service, i) => (
              <ServiceCard key={service.title} service={service} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-white dark:bg-card border border-amber-500/20 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-sm dark:shadow-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.04),transparent_70%)]" />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
              <Crown size={24} className="text-amber-500" />
            </div>
            <h2 className="text-3xl font-serif text-foreground mb-3">
              Unlock Your Full Potential
            </h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-8 leading-relaxed font-medium">
              The free plan gets you started, but{" "}
              <strong className="text-foreground">Pro</strong> removes every
              limit — unlimited interviews, CVs, and AI reports.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/dashboard/settings"
                className="px-6 py-3 rounded-xl bg-amber-500 text-black text-sm font-bold hover:bg-amber-400 transition-all"
              >
                Upgrade to Pro — ₹499/mo
              </Link>
              <Link
                href="/dashboard"
                className="px-6 py-3 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:border-foreground transition-all"
              >
                Start for Free
              </Link>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-serif text-foreground mb-2">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground text-sm font-medium">
              No hidden fees. Cancel anytime.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan) => (
              <PlanCard key={plan.name} plan={plan} />
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="pb-12">
          <h2 className="text-2xl font-serif text-foreground mb-8 text-center">
            Common Questions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-xl p-5 hover:border-amber-500/30 transition-all shadow-sm dark:shadow-none"
              >
                <p className="text-sm font-semibold text-foreground mb-2">
                  {faq.q}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}
