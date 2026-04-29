"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Mic2, CheckCircle2, Loader2, User, Bot,
} from "lucide-react";

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

interface Message {
  id:              string;
  role:            "user" | "assistant";
  content:         string;
  question_number: number | null;
  created_at:      string;
}

function scoreColor(score: number | null) {
  if (score === null) return "text-zinc-500";
  if (score >= 75) return "text-emerald-400";
  if (score >= 50) return "text-amber-400";
  return "text-red-400";
}

function scoreBg(score: number | null) {
  if (score === null) return "bg-zinc-800 border-zinc-700";
  if (score >= 75) return "bg-emerald-500/10 border-emerald-500/20";
  if (score >= 50) return "bg-amber-500/10 border-amber-500/20";
  return "bg-red-500/10 border-red-500/20";
}

export default function InterviewDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  const [session,  setSession]  = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/interviews/${id}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.error) { setError(data.error); return; }
        setSession(data.session);
        setMessages(data.messages);
      })
      .catch(() => setError("Failed to load session"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 size={24} className="animate-spin text-amber-500" />
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-zinc-400">{error ?? "Session not found"}</p>
        <button
          onClick={() => router.push("/dashboard/interviews")}
          className="text-amber-400 hover:text-amber-300 text-sm flex items-center gap-1"
        >
          <ArrowLeft size={14} /> Back to sessions
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-16">
      {/* Back */}
      <button
        onClick={() => router.push("/dashboard/interviews")}
        className="flex items-center gap-1.5 text-zinc-500 hover:text-zinc-200 text-sm mb-6 transition-colors"
      >
        <ArrowLeft size={15} /> Back to sessions
      </button>

      {/* Header card */}
      <div className="bg-[#171721] border border-[#272731] rounded-2xl p-6 mb-6 flex items-center gap-5">
        <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
          <Mic2 size={20} className="text-amber-500" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-white truncate">{session.job_role}</h1>
          <p className="text-sm text-zinc-500 mt-0.5 capitalize">
            {session.experience_level} level · {session.mode} mode
          </p>
          <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full mt-2 bg-emerald-500/10 text-emerald-400">
            <CheckCircle2 size={10} /> Completed
          </span>
        </div>
        {session.score !== null && (
          <div className={`flex flex-col items-center justify-center w-20 h-20 rounded-2xl border shrink-0 ${scoreBg(session.score)}`}>
            <span className={`text-3xl font-bold leading-none ${scoreColor(session.score)}`}>
              {session.score}
            </span>
            <span className="text-[11px] text-zinc-500 mt-1">/ 100</span>
          </div>
        )}
      </div>

      {/* Transcript */}
      <h2 className="text-[13px] font-semibold uppercase tracking-wider text-zinc-600 mb-4">
        Interview transcript
      </h2>

      {messages.length === 0 ? (
        <p className="text-zinc-500 text-sm">No messages recorded for this session.</p>
      ) : (
        <div className="space-y-4">
          {messages.map((msg) => {
            const isAI = msg.role === "assistant";
            return (
              <div key={msg.id} className={`flex gap-3 ${isAI ? "" : "flex-row-reverse"}`}>
                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  isAI ? "bg-amber-500/10 border border-amber-500/20" : "bg-zinc-800 border border-zinc-700"
                }`}>
                  {isAI
                    ? <Bot size={14} className="text-amber-400" />
                    : <User size={14} className="text-zinc-400" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  isAI
                    ? "bg-[#171721] border border-[#272731] text-zinc-200 rounded-tl-sm"
                    : "bg-zinc-800 border border-zinc-700 text-zinc-200 rounded-tr-sm"
                }`}>
                  {msg.content}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
