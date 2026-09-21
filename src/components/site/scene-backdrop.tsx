"use client";

import dynamic from "next/dynamic";

// Three.js is loaded only in the browser, after the page is interactive.
const Scene3D = dynamic(() => import("@/components/site/scene-3d"), { ssr: false });

export function SceneBackdrop() {
  return <Scene3D />;
}
