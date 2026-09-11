"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export function RotatingText({ items }: { items: string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % items.length);
    }, 2600);
    return () => clearInterval(id);
  }, [items.length]);

  return (
    // h-[2.6em] (not 1.3em) leaves room for the longest phrase to wrap to
    // two lines on narrow viewports — a fixed single-line height clips
    // wrapped text and centers it into the line above, causing overlap.
    <span className="relative inline-flex h-[2.6em] items-center overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span
          key={items[index]}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="text-cerulean"
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
