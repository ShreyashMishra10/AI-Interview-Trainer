"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Mic, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

export function ChatInterface() {
  const [message, setMessage] = useState([
    {
      role: "user",
      message: "How are you?"
    },
    {
      role: "assistant",
      message: "I am good Shreyash.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messageCount, setMessageCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [message, isLoading]); 

  const handleSendMessage = () => {
    if (messageCount >= 3 && !isLoggedIn) {
      alert("Limit reached! Please sign up.");
      return;
    }

    if (!input.trim() || isLoading) return;

    const newMessage = { role: "user", message: input };

    setMessage((prev) => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);
    setMessageCount((prev) => prev + 1);

    setTimeout(() => {
      setMessage((prev) => [
        ...prev,
        {
          role: "assistant",
          message: "That sounds challenging. How did you measure the success of your solution?",
        },
      ]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <section className="flex-1 flex justify-center lg:justify-end w-full">
      <Card className="dark:bg-zinc-900 border-zinc-900 dark:border-zinc-800 shadow-2xl rounded-3xl w-full max-w-[480px] overflow-hidden">
        <CardHeader className="border-b border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/50">
          <CardTitle className="text-sm font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-widest">
            Live Interview Simulation
          </CardTitle>
        </CardHeader>

        <CardContent className="h-[400px] p-6 space-y-6 overflow-y-auto custom-scrollbar">
          {message.map((msg, i) => (
            <div
              key={i}
              className={`flex items-end gap-2 ${
                msg.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div className="flex-shrink-0">
                <Image
                  src={msg.role === "assistant" ? "/robot.png" : "/user.png"}
                  alt={msg.role}
                  width={40}
                  height={40}
                  className="rounded-full border dark:border-zinc-800 shadow-sm"
                />
              </div>

              <div
                className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white rounded-tr-none shadow-md shadow-blue-500/10"
                    : "bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-100 rounded-tl-none border border-zinc-200 dark:border-zinc-700 shadow-sm"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-end gap-2 flex-row">
              <Image
                src="/robot.png"
                width={40}
                height={40}
                alt="Bot"
                className="rounded-full"
              />
              <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-2xl rounded-tl-none border border-zinc-200 dark:border-zinc-700 shadow-sm">
                <div className="flex gap-1 py-1 px-2">
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1.5 h-1.5 bg-zinc-400 rounded-full animate-bounce"></span>
                </div>
              </div>
            </div>
          )}

          {messageCount >= 3 && !isLoggedIn && (
            <div className="flex flex-col items-center justify-center p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-dashed border-blue-200 dark:border-blue-800 animate-in fade-in zoom-in duration-300">
              <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-3">
                Free trial limit reached.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-6 h-8 text-xs">
                Sign Up to Continue
              </Button>
            </div>
          )}

          <div ref={scrollRef} className="h-1" />
        </CardContent>

        <CardFooter className="p-4 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-400 dark:border-zinc-800 flex gap-3">
          <div className="relative flex-1">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={messageCount >= 3 && !isLoggedIn}
              placeholder={messageCount >= 3 && !isLoggedIn ? "Trial ended" : "Type your response..."}
              className="rounded-full pl-4 pr-10 h-10 border-zinc-300 dark:border-zinc-700 focus:ring-blue-500 bg-white dark:bg-zinc-800"
            />
          </div>
          <Button
            size="icon"
            className={`rounded-full shadow-sm transition-colors ${
              !isLoggedIn ? "bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed" : "bg-blue-600 text-white"
            }`}
            disabled={!isLoggedIn}
          >
            <Mic className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            onClick={handleSendMessage}
            className="rounded-full bg-zinc-900 dark:bg-white dark:text-zinc-900 text-white shadow-sm hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </section>
  );
}