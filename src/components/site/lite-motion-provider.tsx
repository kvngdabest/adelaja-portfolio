"use client";

import { createContext, useContext, useSyncExternalStore, type ReactNode } from "react";

const LiteMotionContext = createContext(false);

/**
 * True on phones, touch devices and low-powered machines, where continuous
 * scroll-linked animation costs more than it adds (measured ~4-6fps while
 * scrolling on a throttled mid-range phone).
 *
 * Read once at the root via useSyncExternalStore rather than a
 * useEffect+setState per section — ten sections each doing that on mount
 * was a measured cascade of renders, not just a lint complaint.
 */
function getSnapshot() {
  const nav = navigator as Navigator & { deviceMemory?: number };
  return (
    window.innerWidth < 768 ||
    window.matchMedia("(pointer: coarse)").matches ||
    (nav.hardwareConcurrency ?? 8) <= 4 ||
    (nav.deviceMemory ?? 8) <= 4
  );
}

function getServerSnapshot() {
  return false;
}

function subscribe(onChange: () => void) {
  window.addEventListener("resize", onChange);
  return () => window.removeEventListener("resize", onChange);
}

export function LiteMotionProvider({ children }: { children: ReactNode }) {
  const lite = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return <LiteMotionContext.Provider value={lite}>{children}</LiteMotionContext.Provider>;
}

export function useLiteMotion() {
  return useContext(LiteMotionContext);
}
