"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { SettingSection } from "./SettingsUI";

export function SubscriptionTab() {
  const [selectedPlan, setSelectedPlan] = useState<"Pro" | "Enterprise" | null>(null);

  const plans = [
    {
      name: "Pro" as const,
      price: "₹499",
      period: "/month",
      features: ["Unlimited mock interviews", "Advanced AI feedback", "CV builder (unlimited)", "Priority support", "Interview history & analytics"],
      highlight: true,
    },
    {
      name: "Enterprise" as const,
      price: "₹1,999",
      period: "/month",
      features: ["Everything in Pro", "Team management", "Custom job roles", "API access", "Dedicated account manager"],
      highlight: false,
    },
  ];

  const usage = [
    { label: "Mock Interviews", used: 3,  total: 5   },
    { label: "CV Generations",  used: 1,  total: 2   },
    { label: "AI Chat Credits", used: 45, total: 100 },
  ];

  return (
    <div>
      <SettingSection title="Current Plan">
        <div className="p-5">
          <div className="flex items-start justify-between p-5 bg-[#0d0d16] rounded-xl border border-amber-400/20 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-base font-bold text-white">Free Plan</span>
                <span className="text-[9px] bg-amber-400/15 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Active</span>
              </div>
              <p className="text-xs text-zinc-600">5 mock interviews/month · Basic feedback · No CV builder</p>
            </div>
            <span className="text-lg font-bold text-zinc-400">₹0<span className="text-xs text-zinc-600">/mo</span></span>
          </div>
          <div className="space-y-3">
            {usage.map((u) => (
              <div key={u.label}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-zinc-500">{u.label}</span>
                  <span className="text-zinc-600">{u.used}/{u.total}</span>
                </div>
                <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all ${u.used / u.total > 0.8 ? "bg-red-400" : "bg-amber-400"}`} style={{ width: `${(u.used / u.total) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </SettingSection>

      <SettingSection title="Upgrade Plan">
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <div
              key={plan.name}
              onClick={() => setSelectedPlan(plan.name)}
              className={`p-5 rounded-xl border transition-all cursor-pointer ${
                selectedPlan === plan.name
                  ? "border-amber-400/60 bg-amber-400/10 shadow-[0_0_20px_rgba(251,191,36,0.1)]"
                  : plan.highlight
                  ? "border-amber-400/30 bg-amber-400/5 hover:border-amber-400/50"
                  : "border-zinc-800 bg-[#0d0d16] hover:border-zinc-700"
              }`}
            >
              {plan.highlight && (
                <div className="text-[9px] bg-amber-400/15 text-amber-400 border border-amber-400/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider w-fit mb-3">
                  Most Popular
                </div>
              )}
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-xl font-bold text-white">{plan.price}</span>
                <span className="text-xs text-zinc-600">{plan.period}</span>
              </div>
              <p className="text-sm font-semibold text-zinc-300 mb-4">{plan.name}</p>
              <ul className="space-y-2 mb-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-xs text-zinc-500">
                    <Check size={12} className="text-amber-400 shrink-0" /> {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={(e) => { e.stopPropagation(); setSelectedPlan(plan.name); }}
                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                  selectedPlan === plan.name
                    ? "bg-amber-400 text-black hover:bg-amber-300"
                    : plan.highlight
                    ? "bg-amber-400/15 border border-amber-400/30 text-amber-400 hover:bg-amber-400/20"
                    : "border border-zinc-700 text-zinc-400 hover:border-zinc-600"
                }`}
              >
                {selectedPlan === plan.name ? "✓ Selected" : `Upgrade to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>
      </SettingSection>

      <SettingSection title="Billing History">
        <div className="px-5 py-4 text-sm text-zinc-600 text-center">
          No billing history — you are on the free plan.
        </div>
      </SettingSection>
    </div>
  );
}
