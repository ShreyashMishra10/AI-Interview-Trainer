import { Zap } from "lucide-react";
import { STATS } from "./ServicesData";

export function ServicesHero() {
  return (
    <section className="text-center pt-8">
      <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
        <Zap size={12} className="text-amber-500" />
        <span className="text-[11px] text-amber-500 font-bold uppercase tracking-widest">Services</span>
      </div>
      <h1 className="text-5xl font-serif text-foreground tracking-tight mb-4 leading-tight">
        Everything you need to<br />
        <span className="text-amber-500">land your dream job.</span>
      </h1>
      <p className="text-muted-foreground text-base max-w-xl mx-auto leading-relaxed font-medium">
        AI-Interview Trainer provides tools and feedback to walk into any interview with confidence — from mock sessions to professional CVs.
      </p>
    </section>
  );
}

export function ServicesStats() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {STATS.map((s) => (
        <div key={s.label} className="bg-white dark:bg-card border border-zinc-200 dark:border-border shadow-sm rounded-2xl p-5 text-center">
          <div className="text-2xl font-bold text-amber-500 mb-1">{s.value}</div>
          <div className="text-[11px] text-muted-foreground font-bold uppercase tracking-wider">{s.label}</div>
        </div>
      ))}
    </div>
  );
}