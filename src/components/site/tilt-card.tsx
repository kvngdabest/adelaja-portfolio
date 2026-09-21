"use client";

import type { PointerEvent, ReactNode } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { cn } from "cn";

/**
 * Precise, slightly mechanical 3D tilt toward the cursor, plus HUD corner
 * brackets and a cursor spotlight (see .hud-corners in globals.css).
 * Mouse only: touch and reduced-motion users get a plain card.
 */
export function TiltCard({
  children,
  className,
  max = 5,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const reduced = useReducedMotion();
  const rotateX = useSpring(0, { stiffness: 220, damping: 22 });
  const rotateY = useSpring(0, { stiffness: 220, damping: 22 });

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (reduced || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    rotateY.set((px - 0.5) * 2 * max);
    rotateX.set(-(py - 0.5) * 2 * max);
    e.currentTarget.style.setProperty("--mx", `${px * 100}%`);
    e.currentTarget.style.setProperty("--my", `${py * 100}%`);
  }

  function onPointerLeave() {
    rotateX.set(0);
    rotateY.set(0);
  }

  return (
    <motion.div
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      className={cn("hud-corners relative h-full rounded-2xl", className)}
    >
      {children}
    </motion.div>
  );
}
