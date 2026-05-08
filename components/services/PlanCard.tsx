"use client";

import { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { openCheckout } from "@/lib/checkout";
import { PLANS } from "./ServicesData";

type Plan = (typeof PLANS)[0];

export function PlanCard({ plan }: { plan: Plan }) {
  const { isSignedIn } = useAuth();
  // undefined = still loading, string = known plan, null = not signed in
  const [currentPlan, setCurrentPlan] = useState<string | null | undefined>(undefined);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/profile")
        .then((r) => r.json())
        .then((p) => setCurrentPlan(p.plan ?? "free"))
        .catch(() => setCurrentPlan(null));
    } else if (isSignedIn === false) {
      setCurrentPlan(null);
    }
  }, [isSignedIn]);

  async function handleUpgrade(planKey: "pro" | "enterprise") {
    if (!isSignedIn) { window.location.href = "/sign-up"; return; }
    setPaying(true);
    await openCheckout({
      plan:      planKey,
      cycle:     "monthly",
      onSuccess: () => { setPaying(false); window.location.href = "/dashboard/settings?tab=subscription"; },
      onError:   () => setPaying(false),
    });
  }

  const isLoading = currentPlan === undefined;
  const isCurrent = plan.planKey !== null && currentPlan === plan.planKey;

  return (
    <div className={`relative flex flex-col rounded-2xl border p-6 transition-all duration-300 bg-white shadow-md border-zinc-200 dark:bg-card dark:border-border dark:shadow-none hover:-translate-y-2 hover:shadow-xl ${
      plan.highlight ? "ring-1 ring-amber-500/30 border-amber-500/30 dark:bg-amber-500/[0.03]" : ""
    } ${isCurrent ? "-translate-y-2 shadow-xl ring-2 ring-amber-500/50" : ""}`}>
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
          <span className="text-3xl font-bold text-foreground">{plan.price}</span>
          <span className="text-sm text-muted-foreground">{plan.period}</span>
        </div>
        <p className="text-xs text-muted-foreground font-medium">{plan.description}</p>
      </div>

      <ul className="space-y-2.5 flex-1 mb-6">
        {plan.features.map((f) => (
          <li key={f} className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
            <Check size={12} className={plan.highlight ? "text-amber-500 shrink-0" : "text-muted-foreground/40 shrink-0"} />
            {f}
          </li>
        ))}
      </ul>

      {plan.planKey ? (
        <button
          onClick={() => !isCurrent && !isLoading && handleUpgrade(plan.planKey!)}
          disabled={paying || isCurrent || isLoading}
          className={`w-full py-3 rounded-xl text-xs font-bold text-center transition-all flex items-center justify-center gap-2 disabled:cursor-not-allowed ${
            isCurrent
              ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-500"
              : isLoading
                ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-400 animate-pulse"
                : plan.highlight
                  ? "bg-amber-500 text-black hover:bg-amber-400"
                  : "bg-zinc-50 dark:bg-zinc-900 border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          {paying && <Loader2 size={12} className="animate-spin" />}
          {isCurrent ? "Current Plan" : isLoading ? "Loading..." : plan.cta}
        </button>
      ) : (
        <Link
          href={plan.href}
          className="w-full py-3 rounded-xl text-xs font-bold text-center transition-all block bg-zinc-50 dark:bg-zinc-900 border border-border text-muted-foreground hover:text-foreground"
        >
          {plan.cta}
        </Link>
      )}
    </div>
  );
}
