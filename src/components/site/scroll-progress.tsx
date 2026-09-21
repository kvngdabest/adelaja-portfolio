"use client";

import { motion, useScroll, useSpring } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[90] h-0.5 origin-left bg-[linear-gradient(90deg,var(--grad-1),var(--grad-2),var(--grad-3))] shadow-[0_0_10px_var(--grad-2)]"
    />
  );
}
