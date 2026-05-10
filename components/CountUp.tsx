"use client";

import { useEffect, useRef, useState } from "react";

function parse(value: string): { target: number; suffix: string } {
  const match = value.match(/^(\d+)(\D*)$/);
  return match
    ? { target: parseInt(match[1], 10), suffix: match[2] }
    : { target: 0, suffix: "" };
}

export function CountUp({ value }: { value: string }) {
  const { target, suffix } = parse(value);
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          observer.disconnect();

          const duration = 1400;
          const startTime = performance.now();

          function tick(now: number) {
            const progress = Math.min((now - startTime) / duration, 1);
            const eased = 1 - (1 - progress) * (1 - progress);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          }

          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref}>
      {count}{suffix}
    </span>
  );
}
