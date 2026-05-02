"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ChevronLeft, Bot, User, CheckCircle2, Clock,
  Mic2, MessageSquare, AlertCircle, Loader2,
} from "lucide-react";

interface Message {
  role:            "user" | "assistant";
  content:         string;
  question_number: number;
  created_at:      string;
}

interface Session {
  id:               string;
  job_role:         string;
  experience_level: string;
  mode:             string;
  status:           string;
  score:            number | null;
  created_at:       string;
  completed_at:     string | null;
}

function scoreColor(score: number) {
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

function scoreLabel(score: number) {
  if (score >= 75) return "Strong Performance";
  if (score >= 50) return "Average Performance";
  return "Needs Improvement";
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

function formatDuration(start: string, end: string | null) {
  if (!end) return "Ongoing";
  const ms   = new Date(end).getTime() - new Date(start).getTime();
  const mins = Math.round(ms / 60000);
  return `${mins} min`;
}

export default function SessionDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();
  const [session,  setSession]  = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");

  useEffect(() => {
    fetch(`/api/interviews/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return; }
        setSession(data.session);
        setMessages(data.messages);
      })
      .catch(() => setError("Failed to load session."))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]">
      <Loader2 size={24} className="animate-spin text-amber-400" />
    </div>
  );

  if (error || !session) return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
      <AlertCircle size={32} className="text-red-400" />
      <p className="text-zinc-400">{error || "Session not found."}</p>
      <button onClick={() => router.back()} className="text-amber-500 text-sm hover:text-amber-400">Go back</button>
    </div>
  );

  const isCompleted = session.status === "completed";

  return (
    <div className="max-w-[900px] mx-auto space-y-6 pb-10">

      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-zinc-500 hover:text-white transition text-sm"
      >
        <ChevronLeft size={16} /> Back to sessions
      </button>

      {/* Header card */}
      <div className="bg-[#0f0f18] border border-zinc-800/60 rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold text-white mb-1">{session.job_role}</h1>
            <p className="text-sm text-zinc-500 capitalize">
              {session.experience_level} level · {session.mode} mode
            </p>
          </div>
          {isCompleted && session.score !== null ? (
            <div className="text-right">
              <div className={`text-4xl font-bold ${scoreColor(session.score)}`}>{session.score}</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">/100 · {scoreLabel(session.score)}</div>
            </div>
          ) : (
            <span className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
              {isCompleted ? "No Score" : "In Progress"}
            </span>
          )}
        </div>

        {/* Meta row */}
        <div className="flex items-center gap-5 mt-5 pt-5 border-t border-zinc-800/60 flex-wrap">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Clock size={13} className="text-zinc-600" />
            {formatDate(session.created_at)}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            {isCompleted
              ? <CheckCircle2 size={13} className="text-emerald-500" />
              : <AlertCircle  size={13} className="text-amber-500" />}
            {isCompleted ? "Completed" : "In Progress"}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            <Clock size={13} className="text-zinc-600" />
            Duration: {formatDuration(session.created_at, session.completed_at)}
          </div>
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            {session.mode === "voice"
              ? <Mic2          size={13} className="text-zinc-600" />
              : <MessageSquare size={13} className="text-zinc-600" />}
            {messages.length} messages
          </div>
        </div>
      </div>

      {/* Transcript */}
      <div>
        <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4">Interview Transcript</h2>

        {messages.length === 0 ? (
          <div className="text-center py-16 text-zinc-600 text-sm">
            No messages recorded for this session.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg, i) => {
              const isAI = msg.role === "assistant";
              return (
                <div key={i} className={`flex gap-3 ${isAI ? "" : "flex-row-reverse"}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                    isAI
                      ? "bg-[#6C63FF]/20 border border-[#6C63FF]/30"
                      : "bg-amber-500/10 border border-amber-500/20"
                  }`}>
                    {isAI
                      ? <Bot  size={14} className="text-[#6C63FF]" />
                      : <User size={14} className="text-amber-400" />}
                  </div>

                  <div className={`max-w-[75%] flex flex-col gap-1 ${isAI ? "" : "items-end"}`}>
                    <div className={`text-[10px] font-semibold ${isAI ? "text-[#6C63FF]" : "text-amber-400"}`}>
                      {isAI ? "Sarah (AI Interviewer)" : "You"}
                    </div>
                    <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      isAI
                        ? "bg-[#1a1a28] border border-zinc-800/60 text-zinc-300"
                        : "bg-amber-500/10 border border-amber-500/20 text-zinc-200"
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
