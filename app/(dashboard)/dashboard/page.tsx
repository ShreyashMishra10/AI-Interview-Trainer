"use client";

import React from "react";
import { Mic2, Languages, ArrowUpRight } from "lucide-react";
import { PerformanceGauge } from "@/components/PerformanceGauge";
import { ActivityHeatmap } from "@/components/ActivityHeatmap";

// Types for modularity and strict linting
interface ActionCardProps {
  title: string;
  icon: React.ReactNode;
  subtitle?: string;
  onClick?: () => void;
}

interface FeedbackItemProps {
  type: "CRITICAL" | "STRENGTH";
  text: string;
}

export default function DashboardPage() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-1000 ">
      
      <section className="py-4">
        <h1 className="text-5xl font-serif text-white tracking-tight">
          Welcome back, <span className="text-white/90">Shreyash.</span>
        </h1>
        <p className="text-zinc-500 mt-2 text-sm font-medium tracking-wide">
          Your architectural progress is currently ahead of schedule.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Metrics & Analytics */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Performance Gauge Card */}
          <section className="dashboard-card min-h-[440px] flex flex-col items-center justify-center relative overflow-hidden bg-[#0A0A0F] border border-zinc-900 rounded-3xl shadow-2xl">
            <h3 className="absolute top-8 left-8 text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">
              Performance Pulse
            </h3>
            <div className="text-center space-y-2">
              <h2 className="text-zinc-400 text-sm font-medium uppercase tracking-widest mb-6">
                Interview Readiness Score
              </h2>
              <PerformanceGauge percentage={85} />
              <div className="ready-badge mt-8 px-6 py-2 bg-gold-accent/10 border border-gold-accent/20 text-gold-muted text-[11px] font-bold uppercase tracking-widest rounded-full mx-auto w-fit">
                Ready for Kratya.AI
              </div>
            </div>
          </section>

          {/* Activity Heatmap Card */}
          <section className="dashboard-card p-8 bg-[#0A0A0F] border border-zinc-900 rounded-3xl shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-zinc-400 text-[10px] font-bold uppercase tracking-[0.3em]">
                  Annual Commitment
                </h3>
                <p className="text-zinc-600 text-xs mt-1">Daily interview and practice history</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-gold-accent animate-pulse" />
            </div>
            <ActivityHeatmap />
          </section>
        </div>

        {/* Right Column: Actions & Feedback */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Quick Action Cards */}
          <div className="grid grid-cols-2 gap-4">
            <ActionCard
              title="Simulate Mock Interview"
              icon={<Mic2 size={16} />}
              subtitle="Target role: Full-Stack Architect" 
            />
            <ActionCard 
              title="JP-Sensei Japanese Practice" 
              icon={<Languages size={16} />}
              subtitle="Current Level: N3 Mastery" 
            />
          </div>

          {/* Feedback Feed */}
          <section className="dashboard-card h-[460px] p-8 flex flex-col bg-[#0A0A0F] border border-zinc-900 rounded-3xl relative overflow-hidden">
            <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-8">
              AI Feedback Feed
            </h3>
            
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
              <FeedbackItem
                type="CRITICAL"
                text="Inconsistent use of honorifics (~desu/~masu) during the Japanese self-introduction module."
              />
              <FeedbackItem
                type="STRENGTH"
                text="High technical accuracy on System Architecture and Next.js 16 optimization questions."
              />
              <FeedbackItem
                type="STRENGTH"
                text="Natural flow and sophisticated vocabulary in the English Literature breakdown section."
              />
              <FeedbackItem
                type="STRENGTH"
                text="Clean code structure observed in the React-based Todo implementation."
              />
            </div>

            {/* Gradient Overlay for Fade Effect */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0A0A0F] to-transparent pointer-events-none" />
          </section>
        </div>
      </div>
    </div>
  );
}

// Sub-components moved outside for performance and clarity
function ActionCard({ title, icon, subtitle }: ActionCardProps) {
  return (
    <div className="dashboard-card p-6 group cursor-pointer hover:border-gold-accent/40 transition-all border-zinc-900 bg-[#0C0C12] rounded-2xl">
      <div className="flex justify-between items-start mb-6">
        <span className="text-zinc-600 group-hover:text-gold-accent transition-colors p-2 bg-zinc-900/50 rounded-lg">
          {icon}
        </span>
        <ArrowUpRight
          size={14}
          className="text-zinc-800 group-hover:text-gold-accent transition-all transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>
      <p className="text-xs font-bold text-zinc-200 tracking-tight leading-tight">{title}</p>
      {subtitle && (
        <p className="text-[9px] text-gold-muted/60 font-semibold mt-2 uppercase tracking-widest">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function FeedbackItem({ type, text }: FeedbackItemProps) {
  const isCritical = type === "CRITICAL";
  return (
    <div
      className={`p-5 rounded-xl border transition-all duration-300 ${
        isCritical 
          ? "bg-red-500/5 border-red-500/10 hover:border-red-500/20" 
          : "bg-gold-accent/5 border-gold-accent/10 hover:border-gold-accent/20"
      }`}
    >
      <p
        className={`text-[9px] font-bold uppercase mb-2 tracking-[0.2em] ${
          isCritical ? "text-red-400" : "text-gold-muted"
        }`}
      >
        {type} Analysis
      </p>
      <p className="text-xs text-zinc-400 leading-relaxed font-medium">
        {text}
      </p>
    </div>
  );
}