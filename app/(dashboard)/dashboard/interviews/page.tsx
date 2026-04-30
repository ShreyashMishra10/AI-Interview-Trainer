"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import NewSessionDialog from "@/components/NewSessionDialog";
import { Mic2, CheckCircle2, AlertCircle, Loader2, Play, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Session {
  id:               string;
  job_role:         string;
  experience_level: string;
  mode:             string;
  score:            number | null;
  status:           string;
  created_at:       string;
  completed_at:     string | null;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days  = Math.floor(diff / 86400000);
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function scoreColor(score: number | null) {
  if (score === null) return "text-zinc-500";
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

function SessionCard({ session, onClick }: { session: Session; onClick: () => void }) {
  const isCompleted = session.status === "completed";

  return (
    <div
      onClick={onClick}
      className="bg-[#171721] border border-[#272731] rounded-[14px] p-[18px_20px] flex items-center gap-4 cursor-pointer transition-all hover:border-[#373741] hover:bg-[#1D1D28] hover:-translate-y-[1px]"
    >
      {/* Icon */}
      <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
        <Mic2 size={18} className="text-amber-500" />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-medium mb-1 text-white truncate">{session.job_role}</div>
        <div className="text-[12px] text-[#7A7A9A] flex items-center gap-3 flex-wrap">
          <span>{timeAgo(session.created_at)}</span>
          <span className="w-[3px] h-[3px] rounded-full bg-[#4A4A6A]" />
          <span className="capitalize">{session.experience_level} level</span>
          <span className="w-[3px] h-[3px] rounded-full bg-[#4A4A6A]" />
          <span className="capitalize">{session.mode} mode</span>
        </div>
        <span className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full mt-1.5 ${
          isCompleted
            ? "bg-emerald-500/10 text-emerald-400"
            : "bg-amber-500/10 text-amber-400"
        }`}>
          {isCompleted
            ? <CheckCircle2 size={10} />
            : <AlertCircle size={10} />}
          {isCompleted ? "Completed" : "In Progress"}
        </span>
      </div>

      {/* Score */}
      <div className="text-right shrink-0">
        {isCompleted ? (
          <>
            <div className={`text-[22px] font-bold ${scoreColor(session.score)}`}>
              {session.score ?? "—"}
            </div>
            <div className="text-[11px] text-[#7A7A9A]">score</div>
          </>
        ) : (
          <div className="text-[11px] text-[#7A7A9A]">ongoing</div>
        )}
      </div>
    </div>
  );
}

function ResumeDiscardModal({ session, onResume, onDiscard, onClose }: {
  session:   Session;
  onResume:  () => void;
  onDiscard: () => void;
  onClose:   () => void;
}) {
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#12121a] border border-[#272731] rounded-2xl w-full max-w-md p-7 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
          <Mic2 size={18} className="text-amber-500" />
        </div>
        <h2 className="text-lg font-bold text-white mb-1">Session in progress</h2>
        <p className="text-sm text-zinc-500 mb-1 font-medium">{session.job_role}</p>
        <p className="text-sm text-zinc-600 mb-6">This session was never finished. Do you want to resume it or discard it?</p>
        <div className="flex gap-3">
          <button onClick={onResume}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-all">
            <Play size={14} /> Resume
          </button>
          <button onClick={onDiscard}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-sm font-semibold transition-all">
            <Trash2 size={14} /> Discard
          </button>
        </div>
        <button onClick={onClose} className="w-full mt-3 text-xs text-zinc-600 hover:text-zinc-400 transition-colors">Cancel</button>
      </div>
    </div>
  );
}

export default function InterviewsPage() {
  const router = useRouter();
  const [isDialogOpen,   setIsDialogOpen]   = useState(false);
  const [sessions,       setSessions]       = useState<Session[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [filter,         setFilter]         = useState("All");
  const [resumeSession,  setResumeSession]  = useState<Session | null>(null);

  const FILTERS = ["All", "Frontend", "Backend", "ML / AI", "DevOps", "DSA"];

  useEffect(() => {
    fetch("/api/interviews")
      .then((r) => r.json())
      .then((data) => setSessions(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDiscard = async (session: Session) => {
    await fetch(`/api/interviews/sessions/${session.id}`, { method: "PATCH" });
    setSessions((prev) => prev.map((s) => s.id === session.id ? { ...s, status: "completed" } : s));
    setResumeSession(null);
    toast.success("Session discarded.");
  };

  const filtered = filter === "All"
    ? sessions
    : sessions.filter((s) => s.job_role.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="min-h-screen text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-[26px] font-bold tracking-tight text-white">Interview sessions</h1>
          <p className="text-[#7A7A9A] text-[14px] mt-1">All your practice sessions — review, retake, or start fresh.</p>
        </div>
        <button
          onClick={() => setIsDialogOpen(true)}
          className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black border-none rounded-xl px-5 py-2.5 text-[14px] font-semibold cursor-pointer transition-all shrink-0 shadow-lg shadow-amber-500/20"
        >
          <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          New session
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-[13px] border transition-all ${
              filter === f
                ? "border-amber-500/50 text-amber-400 bg-amber-500/10"
                : "border-[#272731] bg-transparent text-[#7A7A9A] hover:border-amber-500/30 hover:text-amber-400/70"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Sessions list */}
      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 size={22} className="animate-spin text-amber-500" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <Mic2 size={24} className="text-amber-500" />
          </div>
          <p className="text-white font-semibold">No sessions yet</p>
          <p className="text-[#7A7A9A] text-sm max-w-xs">
            {filter !== "All" ? `No ${filter} sessions found.` : "Start your first mock interview to begin tracking progress."}
          </p>
          {filter === "All" && (
            <button
              onClick={() => setIsDialogOpen(true)}
              className="mt-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-sm font-semibold transition-all"
            >
              Start first interview →
            </button>
          )}
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((s) => (
            <SessionCard
              key={s.id}
              session={s}
              onClick={() => {
                if (s.status === "in_progress") {
                  setResumeSession(s);
                } else if (s.status === "completed") {
                  router.push(`/dashboard/interviews/${s.id}`);
                }
              }}
            />
          ))}
        </div>
      )}

      <NewSessionDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />

      {resumeSession && (
        <ResumeDiscardModal
          session={resumeSession}
          onResume={() => {
            const params = new URLSearchParams({ role: resumeSession.job_role, experience: resumeSession.experience_level, sessionId: resumeSession.id, name: "You" });
            window.location.href = `/dashboard/interviews/session?${params.toString()}`;
          }}
          onDiscard={() => handleDiscard(resumeSession)}
          onClose={() => setResumeSession(null)}
        />
      )}
    </div>
  );
}
