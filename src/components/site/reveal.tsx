"use client";

import { motion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

const variants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function Reveal({
  children,
  delay = 0,
  className,
  immediate = false,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** Animate in on mount instead of on scroll-into-view — use for
   * above-the-fold content that's already visible on load, since it never
   * gets a scroll moment to trigger `whileInView`. */
  immediate?: boolean;
}) {
  const transition = { duration: 0.5, delay, ease: "easeOut" as const };

  if (immediate) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        animate="visible"
        variants={variants}
        transition={transition}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
