"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { cn } from "cn";
import { useLiteMotion } from "@/components/site/lite-motion-provider";

/**
 * Decorative depth layers that drift at different speeds as the section
 * scrolls past. Sits behind content (the parent section must be
 * `relative overflow-hidden` and its content `relative z-10`).
 *
 * Split so useScroll (a live scroll listener + rAF sync for as long as
 * it's mounted) is never instantiated on lite/reduced devices, rather than
 * mounted and its output simply unused.
 */
export function ParallaxDecor({ side = "right" }: { side?: "left" | "right" }) {
  const reduced = useReducedMotion();
  const lite = useLiteMotion();
  if (reduced || lite) return <StaticDecor side={side} />;
  return <AnimatedDecor side={side} />;
}

function StaticDecor({ side }: { side: "left" | "right" }) {
  const anchor = side === "right" ? "right-[-8%]" : "left-[-8%]";
  const anchorAlt = side === "right" ? "left-[4%]" : "right-[4%]";
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className={cn(
          "bg-grid absolute top-[8%] hidden size-[380px] opacity-60 md:block",
          anchor
        )}
      />
      <div
        className={cn(
          "absolute top-[30%] hidden size-[300px] rounded-full border border-dashed border-cerulean/25 md:block",
          anchor
        )}
      />
      <div
        className={cn(
          "absolute top-[55%] hidden size-[180px] rounded-full border border-cerulean/20 md:block",
          anchorAlt
        )}
      />
      <span
        className={cn(
          "absolute top-[18%] font-mono text-2xl leading-none text-cerulean/40 select-none",
          anchorAlt
        )}
      >
        +
      </span>
      <span
        className={cn(
          "absolute top-[70%] font-mono text-xl leading-none text-cerulean/30 select-none",
          anchor
        )}
      >
        +
      </span>
    </div>
  );
}

function AnimatedDecor({ side }: { side: "left" | "right" }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const far = useTransform(scrollYProgress, [0, 1], [70, -70]);
  const mid = useTransform(scrollYProgress, [0, 1], [-50, 130]);
  const near = useTransform(scrollYProgress, [0, 1], [150, -170]);
  const spin = useTransform(scrollYProgress, [0, 1], [0, 140]);

  const anchor = side === "right" ? "right-[-8%]" : "left-[-8%]";
  const anchorAlt = side === "right" ? "left-[4%]" : "right-[4%]";

  return (
    <div ref={ref} aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        style={{ y: far }}
        className={cn(
          "bg-grid absolute top-[8%] hidden size-[380px] opacity-60 md:block",
          anchor
        )}
      />
      <motion.div
        style={{ y: mid, rotate: spin }}
        className={cn(
          "absolute top-[30%] hidden size-[300px] rounded-full border border-dashed border-cerulean/25 md:block",
          anchor
        )}
      />
      <motion.div
        style={{ y: far }}
        className={cn(
          "absolute top-[55%] hidden size-[180px] rounded-full border border-cerulean/20 md:block",
          anchorAlt
        )}
      />
      <motion.span
        style={{ y: near }}
        className={cn(
          "absolute top-[18%] font-mono text-2xl leading-none text-cerulean/40 select-none",
          anchorAlt
        )}
      >
        +
      </motion.span>
      <motion.span
        style={{ y: mid }}
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
