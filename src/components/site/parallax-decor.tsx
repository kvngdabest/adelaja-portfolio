"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "cn";

/**
 * Decorative depth layers that drift at different speeds as the section
 * scrolls past. Sits behind content (the parent section must be
 * `relative overflow-hidden` and its content `relative z-10`).
 */
export function ParallaxDecor({ side = "right" }: { side?: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const far = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const mid = useTransform(scrollYProgress, [0, 1], [-50, 130]);
  const near = useTransform(scrollYProgress, [0, 1], [150, -170]);
  const spin = useTransform(scrollYProgress, [0, 1], [0, 140]);

  const still = reduced ? { y: 0, rotate: 0 } : null;
  const anchor = side === "right" ? "right-[-8%]" : "left-[-8%]";
  const anchorAlt = side === "right" ? "left-[4%]" : "right-[4%]";

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        style={still ?? { y: far }}
        className={cn(
          "bg-grid absolute top-[8%] hidden size-[380px] opacity-60 md:block",
          anchor
        )}
      />
      <motion.div
        style={still ?? { y: mid, rotate: spin }}
        className={cn(
          "absolute top-[30%] hidden size-[300px] rounded-full border border-dashed border-cerulean/25 md:block",
          anchor
        )}
      />
      <motion.div
        style={still ?? { y: far }}
        className={cn(
          "absolute top-[55%] hidden size-[180px] rounded-full border border-cerulean/20 md:block",
          anchorAlt
        )}
      />
      <motion.span
        style={still ?? { y: near }}
        className={cn(
          "absolute top-[18%] font-mono text-2xl leading-none text-cerulean/40 select-none",
          anchorAlt
        )}
      >
        +
      </motion.span>
      <motion.span
        style={still ?? { y: mid }}
        className={cn(
          "absolute top-[70%] font-mono text-xl leading-none text-cerulean/30 select-none",
          anchor
        )}
      >
        +
      </motion.span>
    </div>
  );
}
