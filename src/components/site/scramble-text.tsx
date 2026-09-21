"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "01<>/{}[]#$%&*+=?";

/**
 * Decodes from random glyphs into the real text the first time it scrolls
 * into view. Server-renders (and screen readers get) the final text.
 */
export function ScrambleText({
  text,
  className,
  delay = 0,
  duration = 800,
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const run = () => {
      const start = performance.now() + delay;
      const step = (now: number) => {
        const progress = Math.min(1, Math.max(0, (now - start) / duration));
        const revealed = Math.floor(progress * text.length);
        setDisplay(
          text
            .split("")
            .map((char, i) =>
              char === " " || i < revealed
                ? char
                : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
            )
            .join("")
        );
        if (progress < 1) raf = requestAnimationFrame(step);
        else setDisplay(text);
      };
      raf = requestAnimationFrame(step);
    };

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0.6 }
    );
    io.observe(el);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
    };
  }, [text, delay, duration]);

  return (
    <span ref={ref} className={className}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">{display}</span>
    </span>
  );
}
