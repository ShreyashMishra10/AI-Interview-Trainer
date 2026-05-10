"use client";

import { useState, useEffect } from "react";

const PHRASES = [
  "real-time coding interviews.",
  "system design rounds.",
  "behavioral questions.",
  "DSA & algorithms live.",
  "mock interviews with AI feedback.",
];

export function TypewriterText() {
  const [displayed, setDisplayed] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const current = PHRASES[phraseIdx];

    if (isPaused) {
      const t = setTimeout(() => {
        setIsPaused(false);
        setIsDeleting(true);
      }, 1800);
      return () => clearTimeout(t);
    }

    if (isDeleting) {
      if (displayed.length === 0) {
        setIsDeleting(false);
        setPhraseIdx((i) => (i + 1) % PHRASES.length);
        return;
      }
      const t = setTimeout(() => setDisplayed((d) => d.slice(0, -1)), 40);
      return () => clearTimeout(t);
    }

    if (displayed.length === current.length) {
      setIsPaused(true);
      return;
    }

    const t = setTimeout(
      () => setDisplayed(current.slice(0, displayed.length + 1)),
      65
    );
    return () => clearTimeout(t);
  }, [displayed, phraseIdx, isDeleting, isPaused]);

  return (
    <>
      <span className="text-amber-500">{displayed}</span>
      <span className="inline-block w-[2px] h-[1em] bg-amber-500 ml-0.5 animate-blink align-middle" />
    </>
  );
}
