"use client";

import React, { useMemo, useEffect, useState } from "react";
import { Mic2, Languages, ArrowUpRight, Crown, Zap, Star } from "lucide-react";
import { PerformanceGauge } from "@/components/PerformanceGauge";
import Link from "next/link";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface ActionCardProps {
  title:     string;
  icon:      React.ReactNode;
  subtitle?: string;
  href:      string;
}


interface Profile {
  full_name:          string | null;
  plan:               string;
  interview_credits:  number;
  cv_credits:         number;
  stats: {
    total_sessions:     number;
    completed_sessions: number;
    total_cvs:          number;
    latest_session:     { score: number | null; job_role: string; created_at: string } | null;
  };
}

interface Session {
  id:               string;
  job_role:         string;
  status:           string;
  score:            number | null;
  created_at:       string;
  completed_at:     string | null;
  experience_level: string;
  mode:             string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function calculateReadiness(profile: Profile): number {
  const { completed_sessions, latest_session } = profile.stats;
  if (completed_sessions === 0) return 0;
  if (latest_session?.score) return latest_session.score;
  return Math.min(75, completed_sessions * 12);
}

function getPlanIcon(plan: string) {
  if (plan === "pro")        return <Star  size={10} className="text-amber-400" />;
  if (plan === "enterprise") return <Crown size={10} className="text-amber-400" />;
  return <Zap size={10} className="text-zinc-500" />;
}

// ─── Activity Heatmap ──────────────────────────────────────────────────────────

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS   = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];

function ActivityHeatmap({ interviewDates }: { interviewDates: Set<string> }) {
  const { weeks, monthLabels } = useMemo(() => {
    const today    = new Date();
    const yearStart = new Date(today.getFullYear(), 0, 1);
    const startDay  = new Date(yearStart);
    const dow       = startDay.getDay();
    const offset    = dow === 0 ? 6 : dow - 1;
    startDay.setDate(startDay.getDate() - offset);

    const weeksArr: { date: Date; dateStr: string }[][] = [];
    const cur = new Date(startDay);

    while (true) {
      const week: { date: Date; dateStr: string }[] = [];
      for (let d = 0; d < 7; d++) {
        week.push({ date: new Date(cur), dateStr: cur.toISOString().split("T")[0] });
        cur.setDate(cur.getDate() + 1);
      }
      weeksArr.push(week);
      if (week[6].date.getFullYear() > today.getFullYear()) break;
      if (weeksArr.length > 56) break;
    }

    const seen: Set<number> = new Set();
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
  const CELL = 9;
  const GAP  = 2;

  return (
    <div className="w-full">
      <div className="w-full overflow-x-auto scrollbar-none">
        <div style={{ minWidth: "580px" }}>
          <div className="flex ml-8 mb-1" style={{ gap: `${GAP}px` }}>
            {weeks.map((_week, wi) => {
              const label = monthLabels.find((l) => l.weekIndex === wi);
              return (
                <div key={wi} style={{ width: `${CELL}px`, flexShrink: 0, overflow: "visible" }}
                  className="text-[8px] text-zinc-600 font-semibold whitespace-nowrap">
                  {label ? label.month : ""}
                </div>
              );
            })}
          </div>

          <div className="flex gap-1">
            <div className="flex flex-col shrink-0" style={{ gap: `${GAP}px`, width: "24px" }}>
              {DAYS.map((d, i) => (
                <div key={d} style={{ height: `${CELL}px` }}
                  className="text-[8px] text-zinc-700 font-medium flex items-center justify-end pr-1">
                  {i % 2 === 0 ? d : ""}
                </div>
              ))}
            </div>

            <div className="flex" style={{ gap: `${GAP}px` }}>
              {weeks.map((week, wi) => (
                <div key={wi} className="flex flex-col" style={{ gap: `${GAP}px` }}>
                  {week.map(({ date, dateStr }) => {
                    const isFuture     = dateStr > todayStr;
                    const isToday      = dateStr === todayStr;
                    const hasInterview = interviewDates.has(dateStr);
                    const inYear       = date.getFullYear() === new Date().getFullYear();

                    const isActive = hasInterview && inYear && !isFuture;

                    let cellClass = "";
                    if (!inYear)       cellClass = "bg-zinc-900/20";
                    else if (isFuture) cellClass = "bg-zinc-800/30";
                    else if (isActive) cellClass = "bg-amber-400/85 cursor-pointer";
                    else               cellClass = "bg-zinc-800/70 hover:bg-zinc-700/70";

                    return (
                      <div key={dateStr}
                        title={hasInterview ? `✓ Interview — ${dateStr}` : dateStr}
                        style={{
                          width:     `${CELL}px`,
                          height:    `${CELL}px`,
                          boxShadow: isActive  ? `0 0 6px var(--accent-glow2)` : undefined,
                        }}
                        className={`rounded-xs transition-all duration-150 ${cellClass} ${isToday ? "ring-1 ring-amber-400/60" : ""}`}
                      />
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-3 ml-8">
            <span className="text-[10px] text-zinc-700">No interview</span>
            <div style={{ width: CELL, height: CELL }} className="rounded-xs bg-zinc-800/70" />
            <div style={{ width: CELL, height: CELL }} className="rounded-xs bg-amber-400/40" />
            <div style={{ width: CELL, height: CELL, boxShadow: "0 0 6px var(--accent-glow2)" }} className="rounded-xs bg-amber-400/85" />
            <span className="text-[10px] text-zinc-700">Interview done</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Dashboard Page ────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const [profile,  setProfile]  = useState<Profile | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, sessionsRes] = await Promise.all([
          fetch("/api/profile"),
          fetch("/api/interviews"),
        ]);
        if (profileRes.ok)  setProfile(await profileRes.json());
        if (sessionsRes.ok) setSessions(await sessionsRes.json());
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  // Build interview dates set for heatmap
  const interviewDates = useMemo(() => {
    return new Set(
      sessions
        .filter((s) => s.status === "completed" && s.completed_at)
        .map((s) => s.completed_at!.split("T")[0])
    );
  }, [sessions]);

  const readiness    = profile ? calculateReadiness(profile) : 0;
  const firstName    = profile?.full_name?.split(" ")[0] ?? "there";
  const latestRole   = sessions[0]?.job_role ?? null;
  const recentDone   = sessions.slice(0, 4);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-full border-[3px] border-zinc-700 border-t-amber-400 animate-spin" />
          <p className="text-zinc-600 text-xs uppercase tracking-widest font-medium">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-[1400px] mx-auto space-y-10 animate-in fade-in duration-1000">

      {/* Header */}
      <section className="py-4 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-5xl font-serif text-white tracking-tight">
            Welcome back, <span className="text-amber-400/90">{firstName}.</span>
          </h1>
          <p className="text-zinc-600 mt-2 text-sm font-medium tracking-wide">
            {profile?.stats.completed_sessions
              ? `${profile.stats.completed_sessions} interview${profile.stats.completed_sessions > 1 ? "s" : ""} completed · ${profile.stats.total_cvs} CV${profile.stats.total_cvs !== 1 ? "s" : ""} generated`
              : "Start your first interview to begin tracking progress."}
          </p>
        </div>

        {/* Plan badge + credits */}
        {profile && (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-zinc-900/60 border border-zinc-800 rounded-full">
              {getPlanIcon(profile.plan)}
              <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                {profile.plan} plan
              </span>
            </div>
            {profile.plan === "free" && (
              <div className="text-[10px] text-zinc-600 font-medium">
                <span className="text-amber-500 font-bold">{profile.interview_credits}</span> interviews ·{" "}
                <span className="text-amber-500 font-bold">{profile.cv_credits}</span> CVs left
              </div>
            )}
          </div>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── Left Column ── */}
        <div className="lg:col-span-7 space-y-8">

          {/* Performance Gauge */}
          <section className="min-h-[440px] flex flex-col items-center justify-center relative overflow-hidden
            bg-[#08080e] border border-zinc-800/60 rounded-3xl shadow-2xl
            before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,rgba(251,191,36,0.04),transparent_60%)]">
            <h3 className="absolute top-8 left-8 text-zinc-600 text-[10px] font-bold uppercase tracking-[0.3em]">
              Performance Pulse
            </h3>
            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/3 rounded-bl-full blur-2xl" />
            <div className="text-center space-y-2 relative z-10">
              <h2 className="text-zinc-500 text-sm font-medium uppercase tracking-widest mb-6">
                Interview Readiness Score
              </h2>
              <PerformanceGauge percentage={readiness} />
              <div
                style={{ boxShadow: "0 0 20px var(--accent-glow)" }}
                className="mt-8 px-6 py-2 bg-amber-400/8 border border-amber-400/20
                  text-amber-500/80 text-[11px] font-bold uppercase tracking-widest
                  rounded-full mx-auto w-fit hover:bg-amber-400/12 transition-all cursor-default"
              >
                {readiness >= 80 ? "Interview Ready" : readiness >= 50 ? "Building Momentum" : "Getting Started"}
              </div>
            </div>
          </section>

          {/* Activity Heatmap */}
          <section className="p-8 bg-[#08080e] border border-zinc-800/60 rounded-3xl shadow-xl
            before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_bottom_left,rgba(251,191,36,0.03),transparent_70%)]
            relative overflow-hidden">
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
            <ActivityHeatmap interviewDates={interviewDates} />
          </section>
        </div>

        {/* ── Right Column ── */}
        <div className="lg:col-span-5 space-y-8">

          {/* Action Cards */}
          <div className="grid grid-cols-2 gap-4">
            <ActionCard
              title="Start Mock Interview"
              icon={<Mic2 size={16} />}
              subtitle={latestRole ? `Last: ${latestRole}` : "Pick your role"}
              href="/dashboard/interviews"
            />
            <ActionCard
              title="JP-Sensei Practice"
              icon={<Languages size={16} />}
              subtitle="Japanese roadmap"
              href="/dashboard/japanese-sensei"
            />
          </div>

          {/* Recent Sessions / Feedback Feed */}
          <section className="h-[460px] p-8 flex flex-col
            bg-[#08080e] border border-zinc-800/60 rounded-3xl relative overflow-hidden
            before:absolute before:inset-0 before:pointer-events-none before:bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.03),transparent_60%)]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.3em]">
                Recent Sessions
              </h3>
              <Link href="/dashboard/interviews"
                className="px-3 py-1.5 rounded-lg border border-zinc-800 hover:border-amber-500/40 hover:text-amber-400 text-zinc-500 text-[10px] font-semibold uppercase tracking-widest transition-all">
                View all →
              </Link>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800">
              {recentDone.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <Mic2 size={24} className="text-zinc-700" />
                  <p className="text-zinc-600 text-xs font-medium">No sessions yet.</p>
                  <Link href="/dashboard/interviews"
                    className="text-[10px] text-amber-500 hover:text-amber-400 font-bold uppercase tracking-widest transition-colors">
                    Start your first interview →
                  </Link>
                </div>
              ) : (
                recentDone.map((s) => (
                  <Link key={s.id} href={`/dashboard/interviews/${s.id}`}>
                    <div className="p-4 rounded-xl border border-zinc-800/60 bg-zinc-900/40 hover:border-amber-500/20 hover:bg-zinc-900/70 transition-all duration-200 cursor-pointer group">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-xs font-semibold text-zinc-200 truncate group-hover:text-white transition-colors">{s.job_role}</p>
                        {s.score !== null ? (
                          <span className={`text-[11px] font-bold ml-2 shrink-0 ${s.score >= 70 ? "text-emerald-400" : "text-red-400"}`}>
                            {s.score}/100
                          </span>
                        ) : (
                          <span className={`text-[10px] ml-2 shrink-0 font-medium ${s.status === "completed" ? "text-zinc-600" : "text-amber-500"}`}>
                            {s.status === "completed" ? "No score" : "In progress"}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-zinc-600 capitalize">{s.experience_level} · {s.mode} mode</p>
                    </div>
                  </Link>
                ))
              )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-16
              bg-gradient-to-t from-[#08080e] to-transparent pointer-events-none" />
          </section>
        </div>
      </div>
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function ActionCard({ title, icon, subtitle, href }: ActionCardProps) {
  return (
    <Link href={href}>
      <div className="p-6 group cursor-pointer transition-all duration-300
        bg-[#08080e] border border-zinc-800/60 rounded-2xl
        hover:border-amber-400/30 hover:bg-[#0d0d16]
        hover:shadow-[0_0_30px_rgba(251,191,36,0.06)]
        relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(251,191,36,0.04),transparent_70%)]
          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="flex justify-between items-start mb-6 relative z-10">
          <span className="text-zinc-600 group-hover:text-amber-400/80 transition-colors duration-300
            p-2 bg-zinc-900/80 rounded-lg border border-zinc-800/60 group-hover:border-amber-400/20">
            {icon}
          </span>
          <ArrowUpRight size={14} className="text-zinc-700 group-hover:text-amber-400/70 transition-all duration-300
            transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </div>
        <p className="text-xs font-bold text-zinc-300 tracking-tight leading-tight relative z-10
          group-hover:text-zinc-200 transition-colors">
          {title}
        </p>
        {subtitle && (
          <p className="text-[9px] text-zinc-600 font-semibold mt-2 uppercase tracking-widest relative z-10
            group-hover:text-amber-500/50 transition-colors">
            {subtitle}
          </p>
        )}
      </div>
    </Link>
  );
}

