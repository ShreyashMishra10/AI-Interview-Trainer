"use client";
import { useState, useRef, useCallback, useEffect } from "react";

interface UseVoiceOptions {
  onTranscript: (text: string) => void;
}

export function useVoice({ onTranscript }: UseVoiceOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking,  setIsSpeaking]  = useState(false);
  const [transcript,  setTranscript]  = useState("");
  const [supported,   setSupported]   = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef  = useRef<any>(null);
  const synthRef        = useRef<SpeechSynthesis | null>(null);
  const shouldListenRef = useRef(false); // true while user wants mic on
  const onTranscriptRef = useRef(onTranscript);

  useEffect(() => { onTranscriptRef.current = onTranscript; }, [onTranscript]);

  // Cancel everything when the component unmounts (navigation, back, reload)
  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      synthRef.current?.cancel();
    };
  }, []);

  useEffect(() => {
    const hasSR = typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window as unknown as boolean);
    const hasSS = typeof window !== "undefined" && "speechSynthesis" in window;
    setSupported(hasSR && hasSS);
    if (hasSS) synthRef.current = window.speechSynthesis;
  }, []);

  const createRecognition = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const r  = new SR();
    r.continuous      = true;
    r.interimResults  = true;
    r.lang            = "en-US";

    r.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (event: any) => {
      let interim = "";
      let final   = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final  += t;
        else                           interim += t;
      }

      // Show live transcript in bubble
      setTranscript(interim || final);

      // Send each final phrase immediately
      if (final.trim()) {
        onTranscriptRef.current(final.trim().slice(0, 1000));
        setTranscript(""); // Clear after sending
      }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onerror = (e: any) => {
      if (e.error === "aborted" || e.error === "no-speech") return;
      console.error("[useVoice] SpeechRecognition error:", e.error);
      shouldListenRef.current = false;
      setIsListening(false);
      setTranscript("");
    };

    r.onend = () => {
      // Auto-restart with a FRESH instance — Chrome won't restart the same object
      if (shouldListenRef.current) {
        const next = createRecognition();
        recognitionRef.current = next;
        try { next.start(); } catch { /* already starting */ }
      } else {
        setIsListening(false);
        setTranscript("");
      }
    };

    return r;
  }, []);

  const startListening = useCallback(() => {
    console.log("[useVoice] startListening called, supported:", supported);
    if (!supported) return;
    shouldListenRef.current = true;
    const r = createRecognition();
    recognitionRef.current = r;
    try {
      r.start();
    } catch (err) {
      console.error("[useVoice] r.start() threw:", err);
      shouldListenRef.current = false;
      setIsListening(false);
    }
  }, [supported, createRecognition]);

  const stopListening = useCallback(() => {
    shouldListenRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    setTranscript("");
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    // Pause mic while AI speaks to prevent echo feedback
    const wasListening = shouldListenRef.current;
    if (wasListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    }

    const u = new SpeechSynthesisUtterance(text);
    u.rate   = 0.95;
    u.pitch  = 1;
    u.volume = 1;
    const voices = synthRef.current.getVoices();
    const preferred = voices.find(
      (v) => v.lang.startsWith("en") && (v.name.includes("Google") || v.name.includes("Natural"))
    );
    if (preferred) u.voice = preferred;
    u.onstart = () => setIsSpeaking(true);
    u.onend = () => {
      setIsSpeaking(false);
      onEnd?.();
      // Resume mic after AI finishes speaking
      if (wasListening && shouldListenRef.current) {
        const next = createRecognition();
        recognitionRef.current = next;
        try { next.start(); } catch { /* already starting */ }
      }
    };
    u.onerror = () => {
      setIsSpeaking(false);
      if (wasListening && shouldListenRef.current) {
        const next = createRecognition();
        recognitionRef.current = next;
        try { next.start(); } catch { /* already starting */ }
      }
    };
    synthRef.current.speak(u);
  }, [createRecognition]);

  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
  }, []);

  return { isListening, isSpeaking, transcript, supported, startListening, stopListening, speak, stopSpeaking };
}
