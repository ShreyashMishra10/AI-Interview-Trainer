"use client";

import { useState, useEffect } from "react";
import { Check, Loader2, Crown, Zap, Star } from "lucide-react";
import { SettingSection } from "./SettingsUI";
import Link from "next/link";

interface Profile {
  plan:              string;
  interview_credits: number;
  cv_credits:        number;
  chat_credits:      number;
  stats: {
    total_sessions:     number;
    completed_sessions: number;
    total_cvs:          number;
  };
}

const PLAN_LIMITS = {
  free:       { interviews: 5,         cvs: 2,         chat: 100       },
  pro:        { interviews: Infinity,  cvs: Infinity,  chat: Infinity  },
  enterprise: { interviews: Infinity,  cvs: Infinity,  chat: Infinity  },
};

export function SubscriptionTab() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then(setProfile)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const plans = [
    {
      name: "Pro",
      price: "₹499",
      period: "/month",
      icon: <Star size={14} />,
      features: ["Unlimited mock interviews", "Unlimited CV generations", "Unlimited AI chat credits", "Full analytics + weekly AI reports", "Voice interview mode", "Priority support"],
      highlight: true,
    },
    {
      name: "Enterprise",
      price: "₹1,999",
      period: "/month",
      icon: <Crown size={14} />,
      features: ["Everything in Pro", "Team management dashboard", "Custom job role configuration", "API access", "Dedicated account manager", "SLA & compliance support"],
      highlight: false,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 size={20} className="animate-spin text-amber-400" />
      </div>
    );
  }

  const plan    = profile?.plan ?? "free";
  const isPaid  = plan !== "free";
  const limits  = PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] ?? PLAN_LIMITS.free;

  const usage = [
    {
      label: "Mock Interviews",
      used:  isPaid ? (profile?.stats.total_sessions ?? 0) : (limits.interviews - (profile?.interview_credits ?? 0)),
      total: limits.interviews,
      remaining: profile?.interview_credits,
    },
    {
      label: "CV Generations",
      used:  isPaid ? (profile?.stats.total_cvs ?? 0) : (limits.cvs - (profile?.cv_credits ?? 0)),
      total: limits.cvs,
      remaining: profile?.cv_credits,
    },
    {
      label: "AI Chat Credits",
      used:  isPaid ? 0 : (limits.chat - (profile?.chat_credits ?? 0)),
      total: limits.chat,
      remaining: profile?.chat_credits,
    },
  ];

  return (
    <div>
      {/* Current Plan */}
      <SettingSection title="Current Plan">
        <div className="p-5">
          <div className="flex items-start justify-between p-5 bg-[#0d0d16] rounded-xl border border-amber-400/20 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-bold text-white capitalize">{plan} Plan</span>
                <span className="text-[9px] bg-amber-400/15 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Active</span>
              </div>
              <p className="text-xs text-zinc-600">
                {plan === "free"
                  ? "5 mock interviews/month · 2 CVs/month · 100 chat credits"
                  : plan === "pro"
                    ? "Unlimited interviews · Unlimited CVs · Unlimited chat"
                    : "Full Pro features + team management + API access"}
              </p>
            </div>
            <div className="flex items-center gap-1 text-zinc-400">
              {plan === "free"    && <Zap   size={14} className="text-zinc-500" />}
              {plan === "pro"     && <Star  size={14} className="text-amber-400" />}
              {plan === "enterprise" && <Crown size={14} className="text-amber-400" />}
              <span className="text-lg font-bold">
                {plan === "free" ? "₹0" : plan === "pro" ? "₹499" : "₹1,999"}
              </span>
              <span className="text-xs text-zinc-600">/mo</span>
            </div>
          </div>

          {/* Usage bars */}
          <div className="space-y-4">
            {usage.map((u) => {
              const pct = u.total === Infinity ? 0 : Math.min((u.used / u.total) * 100, 100);
              return (
                <div key={u.label}>
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="text-zinc-500">{u.label}</span>
                    <span className="text-zinc-600">
                      {u.total === Infinity
                        ? `${u.used} used (unlimited)`
                        : `${u.used} / ${u.total} used${u.remaining !== undefined ? ` · ${u.remaining} left` : ""}`}
                    </span>
                  </div>
                  <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    {u.total === Infinity ? (
                      <div className="h-full w-full rounded-full bg-amber-400/20" />
                    ) : (
                      <div
                        className={`h-full rounded-full transition-all ${pct > 80 ? "bg-red-400" : "bg-amber-400"}`}
                        style={{ width: `${pct}%` }}
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </SettingSection>

      {/* Upgrade — only show if on free plan */}
      {!isPaid && (
        <SettingSection title="Upgrade Plan">
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plans.map((p) => (
              <Link
                key={p.name}
                href="/pricing"
                className={`flex flex-col p-5 rounded-xl border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl group ${
                  p.highlight
                    ? "border-amber-400/30 bg-amber-400/5 hover:border-amber-400/60 hover:shadow-amber-500/10"
                    : "border-zinc-800 bg-[#0d0d16] hover:border-zinc-600 hover:shadow-black/30"
                }`}
              >
                {p.highlight && (
                  <div className="text-[9px] bg-amber-400/15 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider w-fit mb-3">
                    Most Popular
                  </div>
                )}
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-xl font-bold text-white">{p.price}</span>
                  <span className="text-xs text-zinc-600">{p.period}</span>
                </div>
                <p className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-1.5">
                  {p.icon} {p.name}
                </p>
                <ul className="space-y-2 mb-5 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-zinc-500">
                      <Check size={12} className="text-amber-400 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <div
                  className={`w-full py-2.5 rounded-xl text-xs font-bold text-center transition-all mt-auto ${
                    p.highlight
                      ? "bg-amber-500 group-hover:bg-amber-400 text-black"
                      : "border border-zinc-700 text-zinc-400 group-hover:border-zinc-500 group-hover:text-white"
                  }`}
                >
                  Upgrade to {p.name}
                </div>
              </Link>
            ))}
          </div>
        </SettingSection>
      )}

      {/* Billing history */}
      <SettingSection title="Billing History">
        <div className="px-5 py-8 flex flex-col items-center text-center gap-2">
          <p className="text-sm text-zinc-500 font-medium">Payment integration coming soon.</p>
          <p className="text-xs text-zinc-700">Once Razorpay is connected, your invoices and receipts will appear here.</p>
        </div>
      </SettingSection>
    </div>
  );
}
