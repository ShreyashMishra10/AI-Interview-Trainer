"use client";

import { useEffect } from "react";

export function AppearanceInit() {
  useEffect(() => {
    // Accent/font/compact/animations are applied synchronously via the inline
    // <script> in layout.tsx before first paint. Only lang needs a post-hydration
    // update since <html lang> is server-rendered.
    const lang = localStorage.getItem("appearance_language") ?? "en";
    document.documentElement.lang = lang;
  }, []);

  return null;
}
