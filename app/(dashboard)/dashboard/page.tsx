"use client";

import React, { useMemo } from "react";
import { Mic2, Languages, ArrowUpRight } from "lucide-react";
import { PerformanceGauge } from "@/components/PerformanceGauge";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ActionCardProps {
  title: string;
  icon: React.ReactNode;
  subtitle?: string;
}

interface FeedbackItemProps {
  type: "CRITICAL" | "STRENGTH";
  text: string;
}

// ─── Activity Heatmap ─────────────────────────────────────────────────────────
// Only glows on days where an interview was completed (like GitHub but for interviews)

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

// Mock interview data — replace with real data from your DB
// Each entry is a date string "YYYY-MM-DD" where an interview was done
// const INTERVIEW_DATES = new Set([
//   "2025-01-06",
//   "2025-01-13",
//   "2025-01-20",
//   "2025-01-27",
//   "2025-02-03",
//   "2025-02-10",
//   "2025-02-17",
//   "2025-02-24",
//   "2025-03-03",
//   "2025-03-10",
//   "2025-03-17",
//   "2025-03-24",
//   "2025-03-31",
//   "2025-04-07",
//   "2025-04-14",
//   "2025-04-21",
//   "2025-04-28",
//   "2025-05-05",
//   "2025-05-12",
//   "2025-05-19",
//   "2025-05-26",
//   "2025-06-02",
//   "2025-06-09",
//   "2025-06-16",
//   "2025-06-23",
//   "2025-06-30",
//   "2025-07-07",
//   "2025-07-14",
//   "2025-07-21",
//   "2025-07-28",
//   "2025-08-04",
//   "2025-08-11",
//   "2025-08-18",
//   "2025-08-25",
//   "2025-09-01",
//   "2025-09-08",
//   "2025-09-15",
//   "2025-09-22",
//   "2025-09-29",
//   "2025-10-06",
//   "2025-10-13",
//   "2025-10-20",
//   "2025-10-27",
//   "2025-11-03",
//   "2025-11-10",
//   "2025-11-17",
//   "2025-11-24",
//   "2025-12-01",
//   "2025-12-08",
//   "2025-12-15",
//   "2025-12-22",
// ]);

const INTERVIEW_DATES = new Set<string>([]);

function ActivityHeatmap() {
  const { weeks, monthLabels } = useMemo(() => {
    const today = new Date();
    const yearStart = new Date(today.getFullYear(), 0, 1);

    // Go back to the Monday on or before Jan 1
    const startDay = new Date(yearStart);
    const dow = startDay.getDay(); // 0=Sun
    const offset = dow === 0 ? 6 : dow - 1;
    startDay.setDate(startDay.getDate() - offset);

    const weeksArr: { date: Date; dateStr: string }[][] = [];
    const cur = new Date(startDay);

    while (true) {
      const week: { date: Date; dateStr: string }[] = [];
      for (let d = 0; d < 7; d++) {
        week.push({
          date: new Date(cur),
          dateStr: cur.toISOString().split("T")[0],
        });
        cur.setDate(cur.getDate() + 1);
      }
      weeksArr.push(week);
      // Stop after we've passed Dec 31
      if (week[6].date.getFullYear() > today.getFullYear()) break;
      if (weeksArr.length > 56) break;
    }

    // Month labels — attach to the week where the 1st of that month first appears
    const seen = new Set<number>();
    const labels: { month: string; weekIndex: number }[] = [];
    weeksArr.forEach((week, wi) => {
      week.forEach(({ date }) => {
        const m = date.getMonth();
        const y = date.getFullYear();
        if (y === today.getFullYear() && !seen.has(m)) {
          seen.add(m);
          labels.push({ month: MONTHS[m], weekIndex: wi });
        }
      });
    });

    return { weeks: weeksArr, monthLabels: labels };
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];
  const CELL = 11; // cell size px
  const GAP  = 3;  // gap px

  return (
    <div className="w-full">
      {/* Scrollable wrapper */}
      <div className="overflow-x-auto pb-2 w-full">
  <div style={{ minWidth: `${weeks.length * (CELL + GAP) + 36}px`, width: "max-content" }}>

          {/* Month labels row */}
          <div className="flex ml-9 mb-1.5" style={{ gap: `${GAP}px` }}>
            {weeks.map((_week, wi) => {
  const label = monthLabels.find((l) => l.weekIndex === wi);
  return (
    <div
      key={wi}
      style={{ width: `${CELL}px`, flexShrink: 0, overflow: "visible" }}
      className="text-[9px] text-zinc-600 font-semibold whitespace-nowrap"
    >
      {label ? label.month : ""}
    </div>
  );
})}
          </div>

          {/* Grid: day labels + cells */}
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col shrink-0" style={{ gap: `${GAP}px`, width: "28px" }}>
              {DAYS.map((d, i) => (
                <div
                  key={d}
                  style={{ height: `${CELL}px` }}
                  className="text-[9px] text-zinc-700 font-medium flex items-center justify-end pr-1"
                >
                  {i % 2 === 0 ? d : ""}
                </div>
              ))}
            </div>

            {/* Week columns */}
            <div className="flex" style={{ gap: `${GAP}px` }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: `${GAP}px` }}>
                  {week.map(({ date, dateStr }) => {
                    const isFuture  = dateStr > todayStr;
                    const isToday   = dateStr === todayStr;
                    const hasInterview = INTERVIEW_DATES.has(dateStr);
                    const inYear    = date.getFullYear() === new Date().getFullYear();

                    let cellClass = "";
                    if (!inYear) {
  cellClass = "bg-zinc-900/20";
} else if (isFuture) {
  cellClass = "bg-zinc-800/30";
} else if (hasInterview) {
                      cellClass = "bg-amber-400/85 shadow-[0_0_6px_rgba(251,191,36,0.65)] hover:bg-amber-300 hover:shadow-[0_0_10px_rgba(251,191,36,0.9)] cursor-pointer";
                    } else {
                      cellClass = "bg-zinc-800/70 hover:bg-zinc-700/70";
                    }

                    return (
                      <div
                        key={dateStr}
                        title={hasInterview ? `✓ Interview — ${dateStr}` : dateStr}
                        style={{ width: `${CELL}px`, height: `${CELL}px` }}
                        className={`rounded-[2px] transition-all duration-150 ${cellClass} ${
                          isToday ? "ring-1 ring-amber-400/60" : ""
                        }`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-2 mt-3 ml-9">
            <span className="text-[10px] text-zinc-700">No interview</span>
            <div style={{ width: CELL, height: CELL }} className="rounded-[2px] bg-zinc-800/70" />
            <div style={{ width: CELL, height: CELL }} className="rounded-[2px] bg-amber-400/40" />
            <div style={{ width: CELL, height: CELL }} className="rounded-[2px] bg-amber-400/85 shadow-[0_0_6px_rgba(251,191,36,0.5)]" />
            <span className="text-[10px] text-zinc-700">Interview done</span>
          </div>

        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-1000">
      {/* Header */}
      <section className="py-4">
        <h1 className="text-5xl font-serif text-white tracking-tight">
          Welcome back, <span className="text-amber-400/90">Shreyash.</span>
        </h1>
        <p className="text-zinc-600 mt-2 text-sm font-medium tracking-wide">
          Your architectural progress is currently ahead of schedule.
        </p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Left Column ── */}
        <div className="lg:col-span-7 space-y-8">
          {/* Performance Gauge Card */}
          <section
            className="min-h-[440px] flex flex-col items-center justify-center relative overflow-hidden
            bg-[#08080e] border border-zinc-800/60 rounded-3xl shadow-2xl
            before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.04),transparent_60%)]"
          >
            <h3 className="absolute top-8 left-8 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">
              Performance Pulse
            </h3>
            {/* Subtle corner accent */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/3 rounded-bl-full blur-2xl" />
            <div className="text-center space-y-2 relative z-10">
              <h2 className="text-zinc-500 text-sm font-medium uppercase tracking-widest mb-6">
                Interview Readiness Score
              </h2>
              <PerformanceGauge percentage={85} />
              <div
                className="mt-8 px-6 py-2 bg-amber-400/8 border border-amber-400/20
                text-amber-500/80 text-[11px] font-bold uppercase tracking-widest
                rounded-full mx-auto w-fit hover:bg-amber-400/12 transition-all cursor-default
                shadow-[0_0_20px_rgba(251,191,36,0.08)]"
              >
                Ready for Kratya.AI
              </div>
            </div>
          </section>

          {/* Activity Heatmap Card */}
          <section
            className="p-8 bg-[#08080e] border border-zinc-800/60 rounded-3xl shadow-xl
            before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_bottom_left,rgba(251,191,36,0.03),transparent_70%)]
            relative overflow-hidden"
          >
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                  Annual Commitment
                </h3>
                <p className="text-zinc-700 text-xs mt-1">
                  Interview activity — glows on completed sessions
                </p>
              </div>
              <div className="h-2 w-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse" />
            </div>
            <ActivityHeatmap />
          </section>
        </div>

        {/* ── Right Column ── */}
        <div className="lg:col-span-5 space-y-8">
          {/* Action Cards */}
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
          <section
            className="h-[460px] p-8 flex flex-col
            bg-[#08080e] border border-zinc-800/60 rounded-3xl relative overflow-hidden
            before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.03),transparent_60%)]"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                AI Feedback Feed
              </h3>
              <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-amber-400/60" />
                <div className="w-1 h-1 rounded-full bg-amber-400/40" />
                <div className="w-1 h-1 rounded-full bg-amber-400/20" />
              </div>
            </div>

            <div
              className="flex-1 overflow-y-auto pr-2 space-y-3
              scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800"
            >
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

            {/* Fade overlay */}
            <div
              className="absolute bottom-0 left-0 right-0 h-16
              bg-gradient-to-t from-[#08080e] to-transparent pointer-events-none"
            />
          </section>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function ActionCard({ title, icon, subtitle }: ActionCardProps) {
  return (
    <div
      className="p-6 group cursor-pointer transition-all duration-300
      bg-[#08080e] border border-zinc-800/60 rounded-2xl
      hover:border-amber-400/30 hover:bg-[#0d0d16]
      hover:shadow-[0_0_30px_rgba(251,191,36,0.06)]
      relative overflow-hidden"
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(251,191,36,0.04),transparent_70%)]
        opacity-0 group-hover:opacity-100 transition-opacity duration-300"
      />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <span
          className="text-zinc-600 group-hover:text-amber-400/80 transition-colors duration-300
          p-2 bg-zinc-900/80 rounded-lg border border-zinc-800/60 group-hover:border-amber-400/20"
        >
          {icon}
        </span>
        <ArrowUpRight
          size={14}
          className="text-zinc-700 group-hover:text-amber-400/70 transition-all duration-300
            transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>
      <p
        className="text-xs font-bold text-zinc-300 tracking-tight leading-tight relative z-10
        group-hover:text-zinc-200 transition-colors"
      >
        {title}
      </p>
      {subtitle && (
        <p
          className="text-[9px] text-zinc-600 font-semibold mt-2 uppercase tracking-widest relative z-10
          group-hover:text-amber-500/50 transition-colors"
        >
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
      className={`p-4 rounded-xl border transition-all duration-300 group cursor-default ${
        isCritical
          ? "bg-red-500/4 border-red-500/10 hover:border-red-500/25 hover:bg-red-500/7"
          : "bg-amber-400/3 border-amber-400/10 hover:border-amber-400/25 hover:bg-amber-400/6"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <div
          className={`w-1 h-1 rounded-full ${isCritical ? "bg-red-400" : "bg-amber-400"}`}
        />
        <p
          className={`text-[9px] font-bold uppercase tracking-[0.2em] ${
            isCritical ? "text-red-500/80" : "text-amber-500/70"
          }`}
        >
          {type} Analysis
        </p>
      </div>
      <p className="text-xs text-zinc-500 leading-relaxed font-medium group-hover:text-zinc-400 transition-colors">
        {text}
      </p>
    </div>
  );
}
