"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mic, Send, Bot, User, Sparkles } from "lucide-react";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function ChatInterface() {
  const [message, setMessage] = useState([
    { role: "assistant", message: "Hi! I'm your AI interviewer. Which role are you targeting today?" },
  ]);

  const [input, setInput]               = useState("");
  const [isLoading, setIsLoading]       = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isLoggedIn]                    = useState(false);

  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [message, isLoading]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading || (messageCount >= 3 && !isLoggedIn)) return;

    const userMessage = input.trim();
    const updatedMessages = [...message, { role: "user", message: userMessage }];
    setMessage(updatedMessages);
    setInput("");
    setIsLoading(true);
    setMessageCount((prev) => prev + 1);

    try {
      const res = await fetch("/api/demo-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.message })),
        }),
      });
      const data = await res.json();
      setMessage((prev) => [
        ...prev,
        { role: "assistant", message: data.reply ?? "Great answer! Tell me about a challenging project you've worked on." },
      ]);
    } catch {
      setMessage((prev) => [
        ...prev,
        { role: "assistant", message: "Interesting! Can you walk me through your problem-solving process?" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex-1 flex justify-center lg:justify-end w-full">
      {/* Outer glow wrapper */}
      <div className="relative w-full max-w-[480px]">
        <div className="absolute inset-0 rounded-3xl bg-amber-500/10 blur-2xl pointer-events-none" />

        <div className="relative rounded-3xl overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-2xl bg-zinc-300 dark:bg-zinc-950">

          {/* ── Header ── */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100 dark:border-zinc-800 bg-zinc-300 dark:bg-zinc-900">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Sparkles size={14} className="text-amber-500" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground tracking-wide">AI Interview Trainer</p>
                <p className="text-[10px] text-muted-foreground font-medium">Live Interview Simulation</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Live</span>
            </div>
          </div>

          {/* ── Messages ── */}
          <div
            ref={scrollContainerRef}
            className="h-[380px] p-5 space-y-5 overflow-y-auto no-scrollbar bg-zinc-300 dark:bg-zinc-950"
          >
            {message.map((msg, i) => (
              <div
                key={i}
                className={`flex items-end gap-2.5 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                {/* Avatar */}
                {msg.role === "assistant" ? (
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                    <Bot size={14} className="text-amber-500" />
                  </div>
                ) : (
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 flex items-center justify-center shrink-0">
                    <User size={14} className="text-zinc-500" />
                  </div>
                )}

                {/* Bubble */}
                <div
                  className={`max-w-[78%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === "user"
                      ? "bg-amber-500 text-white rounded-tr-sm shadow-lg shadow-amber-500/20"
                      : "bg-zinc-200 dark:bg-zinc-800/80 text-zinc-800 dark:text-zinc-100 rounded-tl-sm border border-zinc-200 dark:border-zinc-700/50"
                  }`}
                >
                  {msg.message}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-end gap-2.5 flex-row">
                <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                  <Bot size={14} className="text-amber-500" />
                </div>
                <div className="bg-zinc-200 dark:bg-zinc-800/80 px-4 py-3 rounded-2xl rounded-tl-sm border border-zinc-200 dark:border-zinc-700/50">
                  <div className="flex gap-1 items-center">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}

            {/* Trial limit */}
            {messageCount >= 3 && !isLoggedIn && (
              <div className="flex flex-col items-center justify-center p-5 bg-amber-50 dark:bg-amber-500/5 rounded-2xl border border-dashed border-amber-300 dark:border-amber-500/20 animate-in fade-in zoom-in duration-300">
                <Sparkles size={16} className="text-amber-500 mb-2" />
                <p className="text-xs text-amber-700 dark:text-amber-400 font-semibold mb-3 text-center">
                  Free trial limit reached.<br />Sign up to keep practicing.
                </p>
                <Link href="/sign-up">
                  <button className="bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold px-5 py-2 rounded-full transition-all">
                    Sign Up Free →
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* ── Input ── */}
          <div className="px-4 py-3 border-t border-zinc-100 dark:border-zinc-800 bg-zinc-300 dark:bg-zinc-900 flex gap-2 items-center">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={messageCount >= 3 && !isLoggedIn}
              placeholder={messageCount >= 3 && !isLoggedIn ? "Trial ended — sign up to continue" : "Type your response..."}
              className="rounded-full pl-4 h-10 border-zinc-200 dark:border-zinc-700 bg-zinc-200 dark:bg-zinc-800 text-sm focus-visible:ring-amber-500 flex-1"
            />
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <span tabIndex={0}>
                    <Button
                      size="icon"
                      disabled={!isLoggedIn}
                      aria-label="Voice input"
                      className={`rounded-full h-10 w-10 shrink-0 transition-colors ${
                        !isLoggedIn
                          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-300 dark:text-zinc-600 cursor-not-allowed"
                          : "bg-amber-500 text-black hover:bg-amber-400"
                      }`}
                    >
                      <Mic className="h-4 w-4" />
                    </Button>
                  </span>
                </TooltipTrigger>
                {!isLoggedIn && (
                  <TooltipContent side="top" className="text-xs font-medium">
                    Login to use voice mode
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={messageCount >= 3 && !isLoggedIn}
              aria-label="Send message"
              className="rounded-full h-10 w-10 shrink-0 bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white hover:opacity-80 transition-opacity"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

        </div>
      </div>
    </section>
  );
}
