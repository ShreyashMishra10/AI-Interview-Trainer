"use client";

import { useState, useEffect } from "react";
import { Check, Loader2, Crown, Zap, Star, Receipt } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { SettingSection } from "./SettingsUI";
import { openCheckout } from "@/lib/checkout";

interface Profile {
  plan:                string;
  billing_cycle:       string | null;
  plan_expires_at:     string | null;
  razorpay_payment_id: string | null;
  interview_credits:   number;
  cv_credits:          number;
  chat_credits:        number;
  stats: {
    total_sessions:     number;
    completed_sessions: number;
    total_cvs:          number;
  };
}

interface Payment {
  id:                  string;
  plan:                string;
  billing_cycle:       string;
  amount:              number;
  currency:            string;
  created_at:          string;
  razorpay_payment_id: string;
}

const PLAN_LIMITS = {
  free:       { interviews: 5,         cvs: 2,         chat: 100       },
  pro:        { interviews: Infinity,  cvs: Infinity,  chat: Infinity  },
  enterprise: { interviews: Infinity,  cvs: Infinity,  chat: Infinity  },
};

const UPGRADE_PLANS = [
  {
    key:      "pro" as const,
    name:     "Pro",
    monthly:  "₹499",
    annual:   "₹399",
    icon:     <Star size={14} />,
    features: ["Unlimited mock interviews", "Unlimited CV generations", "Unlimited AI chat credits", "Full analytics + weekly AI reports", "Voice interview mode", "Priority support"],
    highlight: true,
  },
  {
    key:      "enterprise" as const,
    name:     "Enterprise",
    monthly:  "₹1,999",
    annual:   "₹1,599",
    icon:     <Crown size={14} />,
    features: ["Everything in Pro", "Team management dashboard", "Custom job role configuration", "API access", "Dedicated account manager", "SLA & compliance support"],
    highlight: false,
  },
];

export function SubscriptionTab() {
  const { user } = useUser();
  const [profile,  setProfile]  = useState<Profile | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [annual,   setAnnual]   = useState(false);
  const [paying,   setPaying]   = useState<string | null>(null);
  const [toast,    setToast]    = useState<{ type: "success" | "error"; msg: string } | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/profile").then((r) => r.json()),
      fetch("/api/payments/history").then((r) => r.json()),
    ])
      .then(([prof, hist]) => {
        setProfile(prof);
        setPayments(Array.isArray(hist) ? hist : []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function showToast(type: "success" | "error", msg: string) {
    setToast({ type, msg });
    setTimeout(() => setToast(null), 4000);
  }

  async function handleUpgrade(planKey: "pro" | "enterprise") {
    setPaying(planKey);
    await openCheckout({
      plan:      planKey,
      cycle:     annual ? "annual" : "monthly",
      userName:  user?.fullName ?? undefined,
      email:     user?.emailAddresses?.[0]?.emailAddress,
      onSuccess: (plan, expiresAt) => {
        setPaying(null);
        showToast("success", `Upgraded to ${plan.charAt(0).toUpperCase() + plan.slice(1)}! Active until ${new Date(expiresAt).toLocaleDateString()}.`);
        // Refresh profile
        fetch("/api/profile").then((r) => r.json()).then(setProfile);
        fetch("/api/payments/history").then((r) => r.json()).then((h) => setPayments(Array.isArray(h) ? h : []));
      },
      onError: (msg) => {
        setPaying(null);
        if (msg !== "Payment cancelled") showToast("error", msg);
      },
    });
  }

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
      label:     "Mock Interviews",
      used:      isPaid ? (profile?.stats.total_sessions ?? 0) : (limits.interviews - (profile?.interview_credits ?? 0)),
      total:     limits.interviews,
      remaining: profile?.interview_credits,
    },
    {
      label:     "CV Generations",
      used:      isPaid ? (profile?.stats.total_cvs ?? 0) : (limits.cvs - (profile?.cv_credits ?? 0)),
      total:     limits.cvs,
      remaining: profile?.cv_credits,
    },
    {
      label:     "AI Chat Credits",
      used:      isPaid ? 0 : (limits.chat - (profile?.chat_credits ?? 0)),
      total:     limits.chat,
      remaining: profile?.chat_credits,
    },
  ];

  return (
    <div className="relative">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-xl text-sm font-medium shadow-lg border ${
          toast.type === "success"
            ? "bg-zinc-900 border-amber-400/30 text-white"
            : "bg-zinc-900 border-red-400/30 text-red-400"
        }`}>
          {toast.msg}
        </div>
      )}

      {/* Current Plan */}
      <SettingSection title="Current Plan">
        <div className="p-5">
          <div className="flex items-start justify-between p-5 bg-zinc-50 dark:bg-[#0d0d16] rounded-xl border border-amber-400/20 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-bold text-zinc-900 dark:text-white capitalize">{plan} Plan</span>
                <span className="text-[9px] bg-amber-400/15 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Active</span>
                {profile?.plan_expires_at && (
                  <span className="text-[9px] text-zinc-500 border border-zinc-700 px-2 py-0.5 rounded-full">
                    until {new Date(profile.plan_expires_at).toLocaleDateString()}
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-600">
                {plan === "free"
                  ? "5 mock interviews/month · 2 CVs/month · 100 chat credits"
                  : plan === "pro"
                    ? "Unlimited interviews · Unlimited CVs · Unlimited chat"
                    : "Full Pro features + team management + API access"}
              </p>
              {profile?.billing_cycle && isPaid && (
                <p className="text-xs text-zinc-500 mt-0.5 capitalize">{profile.billing_cycle} billing</p>
              )}
            </div>
            <div className="flex items-center gap-1 text-zinc-400">
              {plan === "free"       && <Zap   size={14} className="text-zinc-500" />}
              {plan === "pro"        && <Star  size={14} className="text-amber-400" />}
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
                  <div className="h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
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

      {/* Upgrade — only when on free plan */}
      {!isPaid && (
        <SettingSection title="Upgrade Plan">
          {/* Billing toggle */}
          <div className="px-5 pt-5 flex items-center gap-3">
            <span className={`text-xs font-semibold ${!annual ? "text-foreground" : "text-zinc-500"}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className={`relative w-9 h-5 rounded-full transition-all ${annual ? "bg-amber-500" : "bg-zinc-300 dark:bg-zinc-700"}`}
            >
              <span className={`absolute left-0.5 top-0.5 w-4 h-4 rounded-full bg-white shadow-sm transition-transform ${annual ? "translate-x-4" : "translate-x-0"}`} />
            </button>
            <span className={`text-xs font-semibold ${annual ? "text-foreground" : "text-zinc-500"}`}>Annual</span>
            {annual && <span className="text-[9px] bg-amber-400/15 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Save 20%</span>}
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {UPGRADE_PLANS.map((p) => (
              <div
                key={p.key}
                className={`flex flex-col p-5 rounded-xl border transition-all duration-300 ${
                  p.highlight
                    ? "border-amber-400/30 bg-amber-400/5"
                    : "border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0d0d16]"
                }`}
              >
                {p.highlight && (
                  <div className="text-[9px] bg-amber-400/15 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider w-fit mb-3">
                    Most Popular
                  </div>
                )}
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-xl font-bold text-zinc-900 dark:text-white">{annual ? p.annual : p.monthly}</span>
                  <span className="text-xs text-zinc-600">/month</span>
                </div>
                <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-4 flex items-center gap-1.5">
                  {p.icon} {p.name}
                </p>
                <ul className="space-y-2 mb-5 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-xs text-zinc-500">
                      <Check size={12} className="text-amber-400 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleUpgrade(p.key)}
                  disabled={paying === p.key}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed ${
                    p.highlight
                      ? "bg-amber-500 hover:bg-amber-400 text-black"
                      : "border border-zinc-300 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:border-zinc-400 dark:hover:border-zinc-500 hover:text-zinc-900 dark:hover:text-white"
                  }`}
                >
                  {paying === p.key && <Loader2 size={12} className="animate-spin" />}
                  Upgrade to {p.name}
                </button>
              </div>
            ))}
          </div>
        </SettingSection>
      )}

      {/* Billing History */}
      <SettingSection title="Billing History">
        {payments.length === 0 ? (
          <div className="px-5 py-8 flex flex-col items-center text-center gap-2">
            <Receipt size={20} className="text-zinc-600" />
            <p className="text-sm text-zinc-500 font-medium">No payments yet.</p>
            <p className="text-xs text-zinc-700">Your invoices and receipts will appear here after your first purchase.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200 dark:divide-zinc-800">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-4">
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white capitalize">
                    {p.plan} Plan — <span className="capitalize">{p.billing_cycle}</span>
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    {" · "}
                    <span className="font-mono text-[10px]">{p.razorpay_payment_id}</span>
                  </p>
                </div>
                <span className="text-sm font-bold text-zinc-900 dark:text-white">
                  ₹{(p.amount / 100).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
          </div>
        )}
      </SettingSection>
    </div>
  );
}
