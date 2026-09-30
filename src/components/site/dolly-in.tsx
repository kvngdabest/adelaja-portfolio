"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useLiteMotion } from "@/components/site/lite-motion-provider";

/**
 * Scroll-linked "dolly in": the block starts slightly smaller, lower and
 * dimmer, and settles to full size as it reaches the upper part of the
 * viewport. Never fully hidden, so content is readable at any scroll point.
 *
 * Split into two components rather than one that computes useScroll and
 * then discards it: the hook keeps a live scroll listener + rAF sync
 * running for as long as it's mounted, whether or not its value is used
 * in render. ~10 instances of that idling on the homepage measurably hurt
 * scroll FPS on a throttled device, so lite/reduced devices never mount it.
 */
export function DollyIn({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const lite = useLiteMotion();
  if (reduced || lite) return <div>{children}</div>;
  return <AnimatedDollyIn>{children}</AnimatedDollyIn>;
}

function AnimatedDollyIn({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "start 0.35"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.92, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [70, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.45, 1]);

  return (
    <motion.div ref={ref} style={{ scale, y, opacity, transformOrigin: "50% 0%" }}>
      {children}
    </motion.div>
  );
}
