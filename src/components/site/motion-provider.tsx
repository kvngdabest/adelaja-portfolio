"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Makes every Framer Motion animation in the app (Reveal, RotatingText,
 * FloatingPaths) respect the user's OS-level prefers-reduced-motion
 * setting. The global CSS override in globals.css only catches pure-CSS
 * @keyframes animations — Framer Motion drives transforms via the Web
 * Animations API directly and ignores that override entirely.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
