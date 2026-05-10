"use client";
import { useState, useRef, useCallback, useEffect } from "react";

interface UseVoiceOptions {
  onTranscript: (text: string) => void;
}

const SUBMIT_DELAY_MS = 4000; // 4s of complete silence before auto-submit

export function useVoice({ onTranscript }: UseVoiceOptions) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking,  setIsSpeaking]  = useState(false);
  const [transcript,  setTranscript]  = useState("");
  const [supported,   setSupported]   = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef  = useRef<any>(null);
  const synthRef        = useRef<SpeechSynthesis | null>(null);
  const shouldListenRef = useRef(false); // recognition is actively running right now
  const wantsMicRef     = useRef(false); // user has voice mode on (survives auto-pause)
  const onTranscriptRef = useRef(onTranscript);
  const accumulatedRef  = useRef("");   // finalized words
  const interimRef      = useRef("");   // in-flight words not yet finalized by API
  const debounceRef     = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { onTranscriptRef.current = onTranscript; }, [onTranscript]);

  useEffect(() => {
    const stopAll = () => {
      wantsMicRef.current = false;
      shouldListenRef.current = false;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      recognitionRef.current?.stop();
      recognitionRef.current = null;
      synthRef.current?.cancel();
    };
    window.addEventListener("beforeunload", stopAll);
    return () => { window.removeEventListener("beforeunload", stopAll); stopAll(); };
  }, []);

  useEffect(() => {
    const hasSR = typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window as unknown as boolean);
    const hasSS = typeof window !== "undefined" && "speechSynthesis" in window;
    setSupported(hasSR && hasSS);
    if (hasSS) synthRef.current = window.speechSynthesis;
  }, []);

  // Pause recognition only — wantsMicRef stays true so mic restarts after AI speaks
  const pauseRecognition = useCallback(() => {
    shouldListenRef.current = false;
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
  }, []);

  const createRecognition = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const r  = new SR();
    r.continuous     = true;
    r.interimResults = true;
    r.lang           = "en-US";

    r.onstart = () => setIsListening(true);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onresult = (event: any) => {
      let interim = "";
      let final   = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) final  += t;
        else                           interim += t;
      }

      if (final.trim()) {
        accumulatedRef.current = (accumulatedRef.current + " " + final.trim()).trim();
        interimRef.current = "";
      }
      if (interim) interimRef.current = interim;

      // Reset timer on ANY speech (final OR interim) — only fire after true silence
      if (final.trim() || interim.trim()) {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
          debounceRef.current = null;
          // Include interim words that were in-flight when silence hit
          const text = (accumulatedRef.current + " " + interimRef.current).trim();
          accumulatedRef.current = "";
          interimRef.current = "";
          setTranscript("");
          pauseRecognition();
          if (text) onTranscriptRef.current(text.slice(0, 10000));
        }, SUBMIT_DELAY_MS);
      }

      setTranscript((accumulatedRef.current + (interim ? " " + interim : "")).trim());
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    r.onerror = (e: any) => {
      if (e.error === "aborted" || e.error === "no-speech") return;
      console.error("[useVoice] error:", e.error);
      shouldListenRef.current = false;
      setIsListening(false);
      setTranscript("");
    };

    r.onend = () => {
      if (shouldListenRef.current) {
        // Carry interim words into accumulated before restarting —
        // Chrome discards them when recognition stops mid-speech
        if (interimRef.current.trim()) {
          accumulatedRef.current = (accumulatedRef.current + " " + interimRef.current.trim()).trim();
          interimRef.current = "";
        }
        const next = createRecognition();
        recognitionRef.current = next;
        try { next.start(); } catch { /* already starting */ }
      } else {
        setIsListening(false);
      }
    };

    return r;
  }, [pauseRecognition]);

  const startListening = useCallback(() => {
    if (!supported) return;
    accumulatedRef.current = "";
    interimRef.current = "";
    setTranscript("");
    if (debounceRef.current) { clearTimeout(debounceRef.current); debounceRef.current = null; }
    wantsMicRef.current = true;
    shouldListenRef.current = true;
    const r = createRecognition();
    recognitionRef.current = r;
    try { r.start(); } catch (err) {
      console.error("[useVoice] start threw:", err);
      wantsMicRef.current = false;
      shouldListenRef.current = false;
      setIsListening(false);
    }
  }, [supported, createRecognition]);

  const stopListening = useCallback(() => {
    wantsMicRef.current = false;
    shouldListenRef.current = false;
    if (debounceRef.current) { clearTimeout(debounceRef.current); debounceRef.current = null; }
    recognitionRef.current?.stop();
    recognitionRef.current = null;
    setIsListening(false);
    setTranscript("");
    // Send immediately on manual stop — include any in-flight interim words
    const text = (accumulatedRef.current + " " + interimRef.current).trim();
    accumulatedRef.current = "";
    interimRef.current = "";
    if (text) onTranscriptRef.current(text.slice(0, 10000));
  }, []);

  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!synthRef.current) return;
    synthRef.current.cancel();

    if (debounceRef.current) { clearTimeout(debounceRef.current); debounceRef.current = null; }

    // Use wantsMicRef (not shouldListenRef) — mic may already be paused from auto-flush
    const willRestart = wantsMicRef.current;
    pauseRecognition(); // no-op if already paused

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

    const restartMic = () => {
      if (!willRestart) return;
      // Wait 800ms after onend — Chrome fires onend before audio actually stops,
      // causing the mic to pick up the tail of the AI's own voice.
      setTimeout(() => {
        // If synth is still playing (premature onend), wait a bit more
        if (synthRef.current?.speaking) {
          setTimeout(restartMic, 400);
          return;
        }
        accumulatedRef.current = "";
        interimRef.current = "";
        setTranscript("");
        shouldListenRef.current = true;
        const next = createRecognition();
        recognitionRef.current = next;
        try { next.start(); } catch { /* already starting */ }
      }, 800);
    };

    u.onend   = () => { setIsSpeaking(false); onEnd?.(); restartMic(); };
    u.onerror = () => { setIsSpeaking(false); restartMic(); };

    synthRef.current.speak(u);
  }, [createRecognition, pauseRecognition]);

  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel();
    setIsSpeaking(false);
  }, []);

  return { isListening, isSpeaking, transcript, supported, startListening, stopListening, speak, stopSpeaking };
}
