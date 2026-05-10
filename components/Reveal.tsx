"use client";

import { useEffect, useRef } from "react";

type RevealVariant = "rise" | "pop" | "fade";

const INITIAL_TRANSFORM: Record<RevealVariant, string> = {
  rise: "translateY(24px)",
  pop:  "translateY(16px) scale(0.97)",
  fade: "translateY(8px)",
};

const EASING: Record<RevealVariant, string> = {
  rise: "cubic-bezier(0.16, 1, 0.3, 1)",
  pop:  "cubic-bezier(0.34, 1.56, 0.64, 1)",
  fade: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
};

export function Reveal({
  children,
  delay = 0,
  className = "",
  variant = "rise",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  variant?: RevealVariant;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = "1";
          el.style.transform = "translateY(0) scale(1)";
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: 0,
        transform: INITIAL_TRANSFORM[variant],
        transition: `opacity 0.7s ${EASING[variant]} ${delay}ms, transform 0.7s ${EASING[variant]} ${delay}ms`,
      }}
      className={className}
    >
      {children}
    </div>
  );
}
