"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useVoice } from "@/hooks/useVoice";
import {
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
  MessageSquare,
  Radio,
  ChevronLeft,
  Loader2,
  CheckCircle2,
  User,
  Bot,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}
type Mode = "voice" | "chat";

// ── Webcam Feed (replaces status pill) ────────────────────────────────────────
function WebcamFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasCamera, setHasCamera] = useState(false);

  useEffect(() => {
    let stream: MediaStream;
    let cancelled = false;

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((s) => {
        if (cancelled) {
          s.getTracks().forEach((t) => t.stop());
          return;
        }
        stream = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          setHasCamera(true);
        }
      })
      .catch(() => setHasCamera(false));

    return () => {
      cancelled = true;
      stream?.getTracks().forEach((t) => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, []);

  return (
    <div className="w-full rounded-xl overflow-hidden border border-[#272731] bg-[#1c1c26] aspect-video relative">
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`w-full h-full object-cover scale-x-[-1] ${hasCamera ? "block" : "hidden"}`}
      />
      {!hasCamera && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-[#4A4A6A]">
          <span className="text-2xl">📷</span>
          <span className="text-[11px]">Camera unavailable</span>
        </div>
      )}
      {hasCamera && (
        <div className="absolute top-2 left-2 flex items-center gap-1.5 bg-black/60 rounded-full px-2 py-1">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] text-white font-medium">LIVE</span>
        </div>
      )}
    </div>
  );
}

// ── Waveform ──────────────────────────────────────────────────────────────────
function Waveform({ active }: { active: boolean }) {
  const bars = [3, 5, 8, 5, 10, 6, 12, 7, 9, 5, 7, 4, 8, 6, 10, 5, 8, 4, 6, 3];
  return (
    <div className="flex items-center justify-center gap-[3px] h-10">
      {bars.map((h, i) => (
        <div
          key={i}
          className={`w-[3px] rounded-full transition-all duration-150 ${active ? "bg-[#6C63FF]" : "bg-white/15"}`}
          style={{
            height: active ? `${h * 2}px` : "3px",
            animation: active
              ? `waveBar ${0.6 + (i % 4) * 0.15}s ease-in-out ${i * 0.05}s infinite alternate`
              : "none",
          }}
        />
      ))}
      <style>{`
        @keyframes waveBar {
          from { transform: scaleY(0.3); opacity: 0.6; }
          to { transform: scaleY(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── AI Orb — glows ONLY when speaking ────────────────────────────────────────
function AIOrb({
  speaking,
  listening,
}: {
  speaking: boolean;
  listening: boolean;
}) {
  return (
    <div className="relative flex items-center justify-center w-full h-full">
      {/* Glow rings — only when AI is speaking */}
      {speaking && (
        <>
          <div
            className="absolute w-56 h-56 rounded-full bg-[#6C63FF]/5 animate-ping"
            style={{ animationDuration: "2s" }}
          />
          <div
            className="absolute w-44 h-44 rounded-full bg-[#6C63FF]/10 animate-pulse"
            style={{ animationDuration: "1.5s" }}
          />
          <div
            className="absolute w-36 h-36 rounded-full bg-[#6C63FF]/15 animate-pulse"
            style={{ animationDuration: "1s" }}
          />
        </>
      )}

      {/* Main orb — glows purple when speaking, normal otherwise */}
      <div
        className={`relative w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 ${
          speaking
            ? "bg-[#6C63FF] shadow-[0_0_80px_30px_rgba(108,99,255,0.7)] scale-110"
            : "bg-[#1c1c26] border border-[#2d2d3d] shadow-[0_0_30px_rgba(0,0,0,0.5)]"
        }`}
      >
        <Bot
          size={40}
          className={`transition-all duration-300 ${speaking ? "text-white" : "text-[#6C63FF]"}`}
        />
      </div>
      {/* NO label below orb — removed as requested */}
    </div>
  );
}

// ── Message Bubble ────────────────────────────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5 ${isUser ? "bg-[#6C63FF]" : "bg-[#1c1c26] border border-[#2d2d3d]"}`}
      >
        {isUser ? (
          <User size={12} className="text-white" />
        ) : (
          <Bot size={12} className="text-[#6C63FF]" />
        )}
      </div>
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-[13px] leading-relaxed ${
          isUser
            ? "bg-[#6C63FF] text-white rounded-tr-sm"
            : "bg-[#1c1c26] text-gray-200 border border-[#2d2d3d] rounded-tl-sm"
        }`}
      >
        <p>{message.content}</p>
        <p
          className={`text-[10px] mt-1 ${isUser ? "text-indigo-200" : "text-[#4A4A6A]"}`}
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function InterviewSessionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const candidateName = searchParams.get("name") || "Candidate";
  const role = searchParams.get("role") || "Software Engineer";
  const experience = searchParams.get("experience") || "Mid";

  const [mode, setMode] = useState<Mode>("chat");
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [started, setStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    isListening,
    isSpeaking,
    transcript,
    supported,
    startListening,
    stopListening,
    speak,
    stopSpeaking,
  } = useVoice({ onTranscript: (text) => sendMessage(text) });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!content.trim() || isLoading || isComplete) return;
      const userMsg: Message = {
        role: "user",
        content: content.trim(),
        timestamp: new Date(),
      };
      const updated = [...messages, userMsg];
      setMessages(updated);
      setInput("");
      setIsLoading(true);
      try {
        const res = await fetch("/api/interviews", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: updated.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            role,
            candidateName,
            experience,
            questionCount,
          }),
        });
        const data = await res.json();
        if (data.reply) {
          const aiMsg: Message = {
            role: "assistant",
            content: data.reply,
            timestamp: new Date(),
          };
          setMessages((prev) => [...prev, aiMsg]);
          setQuestionCount((p) => p + 1);
          if (data.isComplete) setIsComplete(true);
          if (autoSpeak || mode === "voice") speak(data.reply);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    },
    [
      messages,
      isLoading,
      isComplete,
      role,
      candidateName,
      experience,
      questionCount,
      mode,
      autoSpeak,
      speak,
    ],
  );

  const startInterview = useCallback(async () => {
    setStarted(true);
    setIsLoading(true);
    try {
      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `Hello, I'm ${candidateName}. Ready for my ${role} interview.`,
            },
          ],
          role,
          candidateName,
          experience,
          questionCount: 0,
        }),
      });
      const data = await res.json();
      if (data.reply) {
        setMessages([
          { role: "assistant", content: data.reply, timestamp: new Date() },
        ]);
        setQuestionCount(1);
        if (autoSpeak || mode === "voice") speak(data.reply);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [candidateName, role, experience, autoSpeak, mode, speak]);

  const handleVoiceToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      stopSpeaking();
      startListening();
    }
  };
  const handleSend = () => {
    if (input.trim()) sendMessage(input);
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Pre-start screen ─────────────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="fixed inset-0 bg-[#0d0d14] flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#7A7A9A] hover:text-white transition mb-10 mx-auto text-sm"
          >
            <ChevronLeft size={16} /> Back
          </button>
          <div className="w-24 h-24 rounded-full bg-[#6C63FF]/15 border border-[#6C63FF]/30 flex items-center justify-center mx-auto mb-6">
            <Bot size={40} className="text-[#6C63FF]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">
            Ready to Begin?
          </h1>
          <p className="text-[#7A7A9A] text-sm mb-1">
            AI Interviewer for{" "}
            <span className="text-[#6C63FF] font-medium">{role}</span>
          </p>
          <p className="text-[#4A4A6A] text-xs mb-8">
            {candidateName} · {experience}
          </p>
          <div className="flex gap-2 mb-8 bg-[#12121a] rounded-xl p-1.5 border border-[#272731]">
            <button
              onClick={() => setMode("chat")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === "chat" ? "bg-[#6C63FF] text-white" : "text-[#7A7A9A] hover:text-white"}`}
            >
              <MessageSquare size={15} /> Chat Mode
            </button>
            <button
              onClick={() => supported && setMode("voice")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${mode === "voice" ? "bg-[#6C63FF] text-white" : "text-[#7A7A9A] hover:text-white"} ${!supported ? "opacity-40 cursor-not-allowed" : ""}`}
            >
              <Radio size={15} /> Voice Mode
            </button>
          </div>
          <div className="bg-[#12121a] border border-[#272731] rounded-xl p-4 mb-8 text-left space-y-2.5">
            {[
              "10 tailored questions based on your role & experience",
              "Real-time feedback after each answer",
              "Final assessment with strengths & improvements",
              mode === "voice"
                ? "Speak answers — AI listens & responds aloud"
                : "Type answers in the chat panel",
            ].map((t, i) => (
              <div
                key={i}
                className="flex items-start gap-2 text-xs text-[#7A7A9A]"
              >
                <CheckCircle2
                  size={13}
                  className="text-[#6C63FF] mt-0.5 shrink-0"
                />{" "}
                {t}
              </div>
            ))}
          </div>
          <button
            onClick={startInterview}
            className="w-full py-3.5 rounded-xl bg-[#6C63FF] hover:bg-[#7C74FF] text-white font-semibold transition-all text-sm shadow-lg shadow-[#6C63FF]/20"
          >
            Start Interview →
          </button>
        </div>
      </div>
    );
  }

  // ── Complete screen ───────────────────────────────────────────────────────────
  if (isComplete) {
    return (
      <div className="fixed inset-0 bg-[#0d0d14] flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/15 border border-green-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={36} className="text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Interview Complete!
          </h2>
          <p className="text-[#7A7A9A] text-sm mb-8">
            Great job, {candidateName}.
          </p>
          {messages.length > 0 && (
            <div className="bg-[#12121a] border border-[#272731] rounded-xl p-5 mb-8 text-left">
              <div className="text-[10px] text-[#7A7A9A] mb-3 font-bold uppercase tracking-widest">
                Final Assessment
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                {messages[messages.length - 1].content}
              </p>
            </div>
          )}
          <div className="flex gap-3">
            <button
              onClick={() => router.push("/dashboard/interviews")}
              className="flex-1 py-3 rounded-xl border border-[#272731] text-[#7A7A9A] hover:text-white hover:bg-[#1c1c26] transition text-sm"
            >
              View History
            </button>
            <button
              onClick={() => {
                setMessages([]);
                setQuestionCount(0);
                setIsComplete(false);
                setStarted(false);
              }}
              className="flex-1 py-3 rounded-xl bg-[#6C63FF] hover:bg-[#7C74FF] text-white transition text-sm font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main Layout ───────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 bg-[#0d0d14] flex flex-col overflow-hidden">
      {/* Top Bar — unchanged */}
      <div className="shrink-0 h-14 flex items-center justify-between px-5 border-b border-[#272731] bg-[#12121a] z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="text-[#7A7A9A] hover:text-white transition"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <p className="text-sm font-semibold text-white leading-none">
              {role}
            </p>
            <p className="text-[11px] text-[#7A7A9A] mt-0.5">
              {candidateName} · {experience}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 mr-2">
            <span className="text-[11px] text-[#7A7A9A]">
              Q {Math.min(questionCount, 10)}/10
            </span>
            <div className="w-24 h-1 bg-[#272731] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6C63FF] rounded-full transition-all duration-700"
                style={{
                  width: `${Math.min((questionCount / 10) * 100, 100)}%`,
                }}
              />
            </div>
          </div>
          <button
            onClick={() => {
              setAutoSpeak((v) => !v);
              if (isSpeaking) stopSpeaking();
            }}
            className={`w-8 h-8 rounded-lg border flex items-center justify-center transition ${autoSpeak ? "border-[#6C63FF]/40 bg-[#6C63FF]/10 text-[#6C63FF]" : "border-[#272731] text-[#7A7A9A] hover:text-white"}`}
          >
            {autoSpeak ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>
          <div className="flex items-center gap-1.5 bg-[#1c1c26] border border-[#272731] rounded-lg px-3 py-1.5">
  {mode === "chat"
    ? <><MessageSquare size={12} className="text-[#6C63FF]" /><span className="text-xs text-[#7A7A9A]">Chat</span></>
    : <><Radio size={12} className="text-[#6C63FF]" /><span className="text-xs text-[#7A7A9A]">Voice</span></>
  }
</div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: AI Panel */}
        <div className="w-[300px] shrink-0 border-r border-[#272731] bg-[#0f0f18] flex flex-col items-center justify-between py-6 px-4">
          {/* TOP: Webcam feed instead of status pill */}
          <div className="w-full">
            <WebcamFeed />
          </div>

          {/* CENTER: AI Orb */}
          <div
            className="w-full flex-1 flex items-center justify-center relative"
            style={{ minHeight: "200px" }}
          >
            <AIOrb speaking={isSpeaking} listening={isListening} />
          </div>

          {/* Waveform */}
          <div className="w-full mb-5">
            <Waveform active={isListening || isSpeaking} />
          </div>

          {/* Controls — unchanged */}
          <div className="w-full flex flex-col items-center gap-3">
            {mode === "voice" ? (
              <>
                <p className="text-[11px] text-[#7A7A9A] text-center min-h-[32px]">
                  {isListening
                    ? transcript || "Listening... speak now"
                    : isSpeaking
                      ? "AI is responding..."
                      : isLoading
                        ? "Processing..."
                        : "Press mic to answer"}
                </p>
                <button
                  onClick={handleVoiceToggle}
                  disabled={isLoading || isSpeaking || isComplete}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${
                    isListening
                      ? "bg-red-500 shadow-red-500/30 scale-110"
                      : "bg-[#6C63FF] hover:bg-[#7C74FF] shadow-[#6C63FF]/30 hover:scale-105"
                  } disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100`}
                >
                  {isListening ? (
                    <MicOff size={22} className="text-white" />
                  ) : (
                    <Mic size={22} className="text-white" />
                  )}
                </button>
                <p className="text-[10px] text-[#4A4A6A]">
                  {isListening ? "Tap to stop" : "Tap to speak"}
                </p>
              </>
            ) : (
              <p className="text-[11px] text-[#4A4A6A] text-center">
                Type your answer in the chat →
              </p>
            )}
          </div>
        </div>

        {/* RIGHT: Chat — unchanged */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#0d0d14]">
          <div className="flex-1 overflow-y-auto px-5 py-5 space-y-4 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#272731]">
            {messages.length === 0 && isLoading && (
              <div className="flex justify-center items-center h-full">
                <div className="flex items-center gap-3 text-[#7A7A9A]">
                  <Loader2 size={18} className="animate-spin" />
                  <span className="text-sm">Starting your interview...</span>
                </div>
              </div>
            )}
            {messages.map((msg, i) => (
              <MessageBubble key={i} message={msg} />
            ))}
            {isLoading && messages.length > 0 && (
              <div className="flex gap-2.5">
                <div className="shrink-0 w-7 h-7 rounded-full bg-[#1c1c26] border border-[#2d2d3d] flex items-center justify-center">
                  <Bot size={12} className="text-[#6C63FF]" />
                </div>
                <div className="bg-[#1c1c26] border border-[#2d2d3d] rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1 items-center h-4">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="shrink-0 border-t border-[#272731] bg-[#12121a] px-4 py-3">
            <div className="flex gap-2 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  isComplete
                    ? "Interview complete"
                    : isLoading
                      ? "AI is thinking..."
                      : mode === "voice"
                        ? "Or type your answer here..."
                        : "Type your answer... (Enter to send)"
                }
                disabled={isLoading || isComplete}
                rows={1}
                onInput={(e) => {
                  const el = e.currentTarget;
                  el.style.height = "auto";
                  el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
                }}
                className="flex-1 bg-[#1c1c26] border border-[#2d2d3d] rounded-xl px-4 py-2.5 text-[13px] text-white placeholder:text-[#4A4A6A] outline-none focus:border-[#6C63FF] transition resize-none disabled:opacity-50 min-h-[42px] max-h-[120px]"
              />
              {supported && mode === "voice" && (
                <button
                  onClick={handleVoiceToggle}
                  disabled={isLoading || isSpeaking || isComplete}
                  className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border transition ${isListening ? "bg-red-500 border-red-500 text-white" : "border-[#2d2d3d] text-[#7A7A9A] hover:border-[#6C63FF]/50 hover:text-[#6C63FF]"} disabled:opacity-40`}
                >
                  {isListening ? <MicOff size={15} /> : <Mic size={15} />}
                </button>
              )}
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading || isComplete}
                className="shrink-0 w-10 h-10 rounded-xl bg-[#6C63FF] hover:bg-[#7C74FF] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center transition"
              >
                {isLoading ? (
                  <Loader2 size={15} className="animate-spin text-white" />
                ) : (
                  <Send size={15} className="text-white" />
                )}
              </button>
            </div>
            <p className="text-[10px] text-[#4A4A6A] mt-1.5 text-center">
              Enter to send · Shift+Enter for new line
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
