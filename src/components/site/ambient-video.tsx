"use client";

import { useEffect, useRef } from "react";

/**
 * Muted looping video that only plays while on screen. React doesn't reliably
 * server-render the `muted` attribute, so it is set (and play() called) on
 * mount to satisfy browser autoplay rules. Static first frame for reduced motion.
 */
export function AmbientVideo({
  src,
  className,
  label,
}: {
  src: string;
  className?: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    video.muted = true;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) video.play().catch(() => {});
      else video.pause();
    });
    io.observe(video);
    return () => io.disconnect();
  }, []);

  return (
    <video
      ref={ref}
      src={src}
      loop
      muted
      playsInline
      preload="auto"
      aria-label={label}
      className={className}
    />
  );
}
