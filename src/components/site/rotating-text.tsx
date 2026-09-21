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
    // flex (not inline-flex) so every phrase gets its own centered line; with
    // inline-flex, phrases short enough to sit beside "builds" overflowed the
    // container on desktop while longer ones wrapped, so layout varied per phrase.
    // Only wide screens fit every phrase on one line, so only they get the
    // single-line height (keeps the CTA buttons above the fold).
    <span className="relative flex h-[2.6em] items-center justify-center overflow-hidden min-[1400px]:h-[1.3em]">
      <AnimatePresence mode="wait">
        <motion.span
          key={items[index]}
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -16, opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="text-gradient-flow text-center"
        >
          {items[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
