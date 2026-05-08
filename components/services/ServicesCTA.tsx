"use client";

import { useEffect, useState } from "react";
import { Crown, Star } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { openCheckout } from "@/lib/checkout";

export function ServicesCTA() {
  const { isSignedIn } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<string | null | undefined>(undefined);

  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/profile").then((r) => r.json()).then((p) => setCurrentPlan(p.plan ?? "free")).catch(() => setCurrentPlan(null));
    } else if (isSignedIn === false) {
      setCurrentPlan(null);
    }
  }, [isSignedIn]);

  const isPro = currentPlan === "pro" || currentPlan === "enterprise";

  async function handleUpgrade() {
    if (!isSignedIn) { window.location.href = "/sign-up"; return; }
    await openCheckout({
      plan: "pro", cycle: "monthly",
      onSuccess: () => { window.location.href = "/dashboard/settings?tab=subscription"; },
      onError: () => {},
    });
  }

  return (
    <section className="bg-white dark:bg-card border border-amber-500/20 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-sm dark:shadow-none">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,191,36,0.04),transparent_70%)]" />
      <div className="relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-5">
          {isPro ? <Star size={24} className="text-amber-500" /> : <Crown size={24} className="text-amber-500" />}
        </div>
        <h2 className="text-3xl font-serif text-foreground mb-3">
          {isPro ? "You're on Pro — enjoy every limit removed." : "Unlock Your Full Potential"}
        </h2>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-8 leading-relaxed font-medium">
          {isPro
            ? "Unlimited interviews, CVs, voice mode, and AI reports are all yours. Head to your dashboard to keep practising."
            : <>The free plan gets you started, but <strong className="text-foreground">Pro</strong> removes every limit — unlimited interviews, CVs, and AI reports.</>}
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {isPro ? (
            <Link href="/dashboard" className="px-6 py-3 rounded-xl bg-amber-500 text-black text-sm font-bold hover:bg-amber-400 transition-all">
              Go to Dashboard
            </Link>
          ) : (
            <button onClick={handleUpgrade} className="px-6 py-3 rounded-xl bg-amber-500 text-black text-sm font-bold hover:bg-amber-400 transition-all">
              Upgrade to Pro — ₹499/mo
            </button>
          )}
          {!isPro && (
            <Link href="/dashboard" className="px-6 py-3 rounded-xl border border-border text-muted-foreground text-sm font-medium hover:border-foreground transition-all">
              Start for Free
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
