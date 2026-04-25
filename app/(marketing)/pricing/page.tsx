"use client";

import { useState } from "react";
import { Check, X, Zap, Star, Crown, ShieldCheck, BadgeCheck, Headphones } from "lucide-react";
import Link from "next/link";
import { Footer } from "@/components/Footer";

const PLANS = [
  {
    name: "Free",
    monthlyPrice: "₹0",
    annualPrice: "₹0",
    period: "forever",
    annualPeriod: "forever",
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
    href: "/sign-up",
    highlight: false,
    icon: <Zap size={16} />,
  },
  {
    name: "Pro",
    monthlyPrice: "₹499",
    annualPrice: "₹399",
    period: "/month",
    annualPeriod: "/month",
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
    href: "/sign-up",
    highlight: true,
    icon: <Star size={16} />,
    savings: "Save ₹1,200/yr",
  },
  {
    name: "Enterprise",
    monthlyPrice: "₹1,999",
    annualPrice: "₹1,599",
    period: "/month",
    annualPeriod: "/month",
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
    href: "/about",
    highlight: false,
    icon: <Crown size={16} />,
    savings: "Save ₹4,800/yr",
  },
];

const FEATURES: {
  name: string;
  free: string | boolean;
  pro: string | boolean;
  enterprise: string | boolean;
}[] = [
  { name: "Mock Interviews",       free: "5/month",    pro: "Unlimited",        enterprise: "Unlimited" },
  { name: "CV Generations",        free: "2/month",    pro: "Unlimited",        enterprise: "Unlimited" },
  { name: "AI Chat Credits",       free: "100/month",  pro: "Unlimited",        enterprise: "Unlimited" },
  { name: "Voice Interview Mode",  free: false,        pro: true,               enterprise: true },
  { name: "Performance Analytics", free: "Basic",      pro: "Full",             enterprise: "Full + Custom" },
  { name: "Weekly AI Reports",     free: false,        pro: true,               enterprise: true },
  { name: "JP-Sensei Access",      free: true,         pro: true,               enterprise: true },
  { name: "Interview Export",      free: false,        pro: true,               enterprise: true },
  { name: "Team Dashboard",        free: false,        pro: false,              enterprise: true },
  { name: "API Access",            free: false,        pro: false,              enterprise: true },
  { name: "Custom Branding",       free: false,        pro: false,              enterprise: true },
  { name: "Support",               free: "Community",  pro: "Priority",         enterprise: "Dedicated" },
];

const FAQS = [
  {
    q: "Can I cancel my Pro subscription anytime?",
    a: "Yes — cancel anytime from Settings → Subscription. You'll retain Pro access until the end of your billing period.",
  },
  {
    q: "Is there a free trial for Pro?",
    a: "You can use the Free plan indefinitely to explore the core features before deciding to upgrade.",
  },
  {
    q: "How does annual billing work?",
    a: "Annual plans are billed once a year at a ~20% discount. You save ₹1,200/yr on Pro and ₹4,800/yr on Enterprise.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit/debit cards, UPI, net banking, and popular wallets via Razorpay.",
  },
  {
    q: "Can I upgrade or downgrade mid-cycle?",
    a: "Yes — upgrades are prorated and apply immediately. Downgrades take effect at the next billing cycle.",
  },
  {
    q: "Is there a student or team discount?",
    a: "Enterprise plans cover teams. Reach out via the About page for custom student or institution pricing.",
  },
];

function FeatureCell({ value }: { value: string | boolean }) {
  if (value === true)  return <Check size={14} className="text-amber-500 mx-auto" />;
  if (value === false) return <X size={14} className="text-muted-foreground/30 mx-auto" />;
  return <span className="text-xs text-muted-foreground font-medium">{value}</span>;
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="max-w-[1100px] mx-auto space-y-20 animate-in fade-in duration-700 py-12 px-6">

        {/* ── Hero ── */}
        <section className="text-center pt-8">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
            <Star size={12} className="text-amber-500" />
            <span className="text-[11px] text-amber-500 font-bold uppercase tracking-widest">Pricing</span>
          </div>
          <h1 className="text-5xl font-serif text-foreground tracking-tight mb-4 leading-tight">
            Simple, transparent pricing.<br />
            <span className="text-amber-500">No surprises. Ever.</span>
          </h1>
          <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed font-medium">
            Start free and upgrade when you're ready. Every plan gives you access to our core AI interview tools — Pro just removes every limit.
          </p>
        </section>

        {/* ── Billing toggle ── */}
        <div className="flex items-center justify-center gap-4">
          <span className={`text-sm font-semibold transition-colors ${!annual ? "text-foreground" : "text-muted-foreground"}`}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 ${
              annual ? "bg-amber-500" : "bg-zinc-300 dark:bg-zinc-700"
            }`}
          >
            <span
              className={`absolute left-0.5 top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-300 ${
                annual ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
          <span className={`text-sm font-semibold transition-colors ${annual ? "text-foreground" : "text-muted-foreground"}`}>
            Annual
          </span>
          {annual && (
            <span className="bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
              Save 20%
            </span>
          )}
        </div>

        {/* ── Plan cards ── */}
        <section>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan) => {
              const price  = annual ? plan.annualPrice  : plan.monthlyPrice;
              const period = annual ? plan.annualPeriod : plan.period;

              return (
                <div
                  key={plan.name}
                  className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 bg-white shadow-md border-zinc-200 dark:bg-card dark:border-border dark:shadow-none ${
                    plan.highlight ? "ring-1 ring-amber-500/30 border-amber-500/30 dark:bg-amber-500/[0.03]" : ""
                  }`}
                >
                  {plan.highlight && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full shadow-lg">
                      Most Popular
                    </div>
                  )}

                  <div className="mb-5">
                    <div className={`flex items-center gap-2 mb-3 ${plan.highlight ? "text-amber-500" : "text-muted-foreground"}`}>
                      {plan.icon}
                      <span className="text-xs font-bold uppercase tracking-widest">{plan.name}</span>
                    </div>
                    <div className="flex items-baseline gap-1 mb-1">
                      <span className="text-3xl font-bold text-foreground">{price}</span>
                      <span className="text-sm text-muted-foreground">{period}</span>
                    </div>
                    {annual && plan.savings && (
                      <p className="text-[11px] text-amber-500 font-bold mb-1">{plan.savings}</p>
                    )}
                    <p className="text-xs text-muted-foreground font-medium">{plan.description}</p>
                  </div>

                  <ul className="space-y-2.5 flex-1 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Check
                          size={12}
                          className={`shrink-0 ${plan.highlight ? "text-amber-500" : "text-muted-foreground/40"}`}
                        />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href={plan.href}
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
            })}
          </div>
        </section>

        {/* ── Trust badges ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <ShieldCheck size={18} className="text-amber-500" />, title: "No hidden fees", body: "The price you see is the price you pay. Taxes calculated at checkout." },
            { icon: <BadgeCheck size={18} className="text-amber-500" />, title: "Cancel anytime", body: "No lock-in. Cancel your subscription in one click from Settings." },
            { icon: <Headphones size={18} className="text-amber-500" />, title: "Priority support", body: "Pro and Enterprise users get fast-track responses from our team." },
          ].map((item) => (
            <div key={item.title} className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-2xl p-5 shadow-sm dark:shadow-none flex gap-4 items-start">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-0.5">{item.title}</p>
                <p className="text-xs text-muted-foreground font-medium leading-relaxed">{item.body}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Feature comparison ── */}
        <section>
          <div className="text-center mb-10">
            <h2 className="text-2xl font-serif text-foreground mb-2">Compare all features</h2>
            <p className="text-muted-foreground text-sm font-medium">Every detail, side by side.</p>
          </div>

          <div className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
            {/* Table header */}
            <div className="grid grid-cols-4 border-b border-zinc-200 dark:border-border">
              <div className="p-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">Feature</div>
              {[
                { label: "Free",       highlight: false },
                { label: "Pro",        highlight: true  },
                { label: "Enterprise", highlight: false },
              ].map(({ label, highlight }) => (
                <div
                  key={label}
                  className={`p-4 text-center text-xs font-bold uppercase tracking-widest ${
                    highlight ? "text-amber-500" : "text-muted-foreground"
                  }`}
                >
                  {label}
                </div>
              ))}
            </div>

            {/* Table rows */}
            {FEATURES.map((row, i) => (
              <div
                key={row.name}
                className={`grid grid-cols-4 border-b border-zinc-200 dark:border-border last:border-b-0 transition-colors ${
                  i % 2 === 0 ? "bg-transparent" : "bg-zinc-50/50 dark:bg-zinc-900/20"
                }`}
              >
                <div className="p-4 text-xs font-semibold text-foreground flex items-center">{row.name}</div>
                <div className="p-4 flex items-center justify-center"><FeatureCell value={row.free} /></div>
                <div className="p-4 flex items-center justify-center"><FeatureCell value={row.pro} /></div>
                <div className="p-4 flex items-center justify-center"><FeatureCell value={row.enterprise} /></div>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="pb-4">
          <h2 className="text-2xl font-serif text-foreground mb-8 text-center">Common Questions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {FAQS.map((faq) => (
              <div
                key={faq.q}
                className="bg-white dark:bg-card border border-zinc-200 dark:border-border rounded-xl p-5 hover:border-amber-500/30 transition-all shadow-sm dark:shadow-none"
              >
                <p className="text-sm font-semibold text-foreground mb-2">{faq.q}</p>
                <p className="text-xs text-muted-foreground leading-relaxed font-medium">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="bg-white dark:bg-card border border-amber-500/20 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-sm dark:shadow-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.04),transparent_70%)]" />
          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
              <Star size={24} className="text-amber-500" />
            </div>
            <h2 className="text-3xl font-serif text-foreground mb-3">Ready to ace your next interview?</h2>
            <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-8 leading-relaxed font-medium">
              The free plan gets you started, but <strong className="text-foreground">Pro</strong> removes every limit — unlimited interviews, CVs, voice mode, and AI reports.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link
                href="/sign-up"
                className="px-6 py-3 rounded-xl bg-amber-500 text-black text-sm font-bold hover:bg-amber-400 transition-all"
              >
                Upgrade to Pro — ₹499/mo
              </Link>
              <Link
                href="/sign-up"
                className="px-6 py-3 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:border-foreground transition-all"
              >
                Start for Free
              </Link>
            </div>
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}
