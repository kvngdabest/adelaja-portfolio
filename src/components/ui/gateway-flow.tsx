"use client";

import { useEffect, useRef } from "react";
import { cn } from "cn";

/**
 * Original recreation of the "Gateway Flow" visual concept (converging
 * particle streams toward a bright vanishing point, click-triggered
 * ripples) — built from scratch in Canvas 2D rather than the source
 * WebGL/Three.js implementation, which wasn't accessible to copy. Keeps
 * this dependency-free (no Three.js) and themed to the site's own
 * palette instead of a generic white-on-black look.
 */

interface Stream {
  startX: number;
  startY: number;
  ctrlX: number;
  ctrlY: number;
  particles: { offset: number; speed: number; size: number }[];
  hue: "cerulean" | "sky";
}

interface Ripple {
  x: number;
  y: number;
  start: number;
}

const CERULEAN = [18, 130, 162] as const;
// A lighter cerulean-toward-white tint for stream variety — yale-blue
// (#034078) reads almost identically to the navy background at low alpha.
const SKY = [110, 190, 214] as const;
const BRAND_WHITE = [254, 252, 251] as const;

function quadPoint(
  p0x: number,
  p0y: number,
  cx: number,
  cy: number,
  p2x: number,
  p2y: number,
  t: number
) {
  const u = 1 - t;
  const x = u * u * p0x + 2 * u * t * cx + t * t * p2x;
  const y = u * u * p0y + 2 * u * t * cy + t * t * p2y;
  return [x, y] as const;
}

export function GatewayFlow({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let streams: Stream[] = [];
    let ripples: Ripple[] = [];
    let stars: { x: number; y: number; r: number; phase: number }[] = [];
    let rafId = 0;
    let visible = true;

    function buildStreams() {
      const list: Stream[] = [];
      const streamCount = Math.max(24, Math.min(42, Math.round(width / 28)));
      for (let side = -1; side <= 1; side += 2) {
        for (let i = 0; i < streamCount; i++) {
          const t = i / (streamCount - 1);
          // Bias toward the vertical center so lines bunch up near the
          // horizontal axis (the "bowtie" shape) with a few outliers.
          const spread = Math.pow(t * 2 - 1, 3);
          const startY = (spread * height) / 2 + height / 2;
          const startX = side * width * 0.6;
          const particleCount = 10 + Math.round(Math.random() * 6);
          const particles = Array.from({ length: particleCount }, (_, p) => ({
            offset: p / particleCount,
            speed: 0.06 + Math.random() * 0.05,
            size: 0.6 + Math.random() * 1.1,
          }));
          list.push({
            startX,
            startY,
            ctrlX: side * width * 0.12,
            ctrlY: startY,
            particles,
            hue: Math.random() > 0.35 ? "cerulean" : "sky",
          });
        }
      }
      streams = list;
    }

    function buildStars() {
      const count = Math.round((width * height) / 9000);
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 1.2 + 0.2,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildStreams();
      buildStars();
    }

    function drawFrame(time: number) {
      ctx!.clearRect(0, 0, width, height);
      const cx = width / 2;
      const cy = height / 2;

      // Ambient stars
      for (const star of stars) {
        const twinkle = 0.5 + 0.5 * Math.sin(time * 0.0008 + star.phase);
        ctx!.fillStyle = `rgba(${BRAND_WHITE.join(",")},${(0.15 + twinkle * 0.35).toFixed(3)})`;
        ctx!.beginPath();
        ctx!.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Converging particle streams. Two layers per stream: a faint dotted
      // trace of the full path (so the "gateway" shape reads clearly even
      // where the login card covers the brightest, closest-to-center
      // segment) plus brighter particles flowing along it for motion.
      for (const stream of streams) {
        const color = stream.hue === "cerulean" ? CERULEAN : SKY;
        const p0x = stream.startX + cx;
        const p0y = stream.startY;
        const c1x = stream.ctrlX + cx;
        const c1y = stream.ctrlY;

        ctx!.strokeStyle = `rgba(${color.join(",")},0.16)`;
        ctx!.lineWidth = 1;
        ctx!.setLineDash([1, 5]);
        ctx!.beginPath();
        ctx!.moveTo(p0x, p0y);
        ctx!.quadraticCurveTo(c1x, c1y, cx, cy);
        ctx!.stroke();
        ctx!.setLineDash([]);

        for (const particle of stream.particles) {
          const t = prefersReducedMotion
            ? particle.offset
            : (particle.offset + time * 0.00002 * (1 + particle.speed)) % 1;
          const [px, py] = quadPoint(p0x, p0y, c1x, c1y, cx, cy, t);
          // Brightest mid-flight, tapering at both ends — keeps the
          // effect visible across the whole path, not just near the
          // (card-obscured) center.
          const taper = Math.sin(Math.PI * t);
          const alpha = 0.28 + taper * 0.55;
          const size = Math.max(0.4, particle.size * (0.7 + taper * 0.9));
          ctx!.fillStyle = `rgba(${color.join(",")},${alpha.toFixed(3)})`;
          ctx!.beginPath();
          ctx!.arc(px, py, size, 0, Math.PI * 2);
          ctx!.fill();
        }
      }

      // Bright vanishing-point core
      const coreGlow = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 42);
      coreGlow.addColorStop(0, `rgba(${BRAND_WHITE.join(",")},0.9)`);
      coreGlow.addColorStop(0.25, `rgba(${CERULEAN.join(",")},0.5)`);
      coreGlow.addColorStop(1, `rgba(${CERULEAN.join(",")},0)`);
      ctx!.fillStyle = coreGlow;
      ctx!.beginPath();
      ctx!.arc(cx, cy, 42, 0, Math.PI * 2);
      ctx!.fill();

      // Click ripples. `progress` can briefly go negative for a ripple
      // created moments ago — rAF's timestamp is captured at the start of
      // the frame, so it can race behind a performance.now() call made in
      // an event handler between frames. Clamp rather than let ctx.arc
      // throw on a negative radius (which halts the whole rAF loop).
      ripples = ripples.filter((r) => time - r.start < 1400);
      for (const ripple of ripples) {
        const elapsed = time - ripple.start;
        const progress = Math.min(1, Math.max(0, elapsed / 1400));
        const radius = progress * Math.max(width, height) * 0.6;
        ctx!.strokeStyle = `rgba(${CERULEAN.join(",")},${(1 - progress) * 0.5})`;
        ctx!.lineWidth = 1.5;
        ctx!.beginPath();
        ctx!.arc(ripple.x, ripple.y, Math.max(0, radius), 0, Math.PI * 2);
        ctx!.stroke();
      }
    }

    function tick(time: number) {
      if (visible) {
        try {
          drawFrame(time);
        } catch (err) {
          // A decorative canvas effect should never take the page down —
          // skip the bad frame and keep the loop alive.
          console.error("[GatewayFlow] frame error:", err);
        }
      }
      rafId = requestAnimationFrame(tick);
    }

    function handleClick(e: MouseEvent) {
      const rect = canvas!.getBoundingClientRect();
      ripples.push({ x: e.clientX - rect.left, y: e.clientY - rect.top, start: performance.now() });
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);
    resize();

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && !document.hidden;
      },
      { threshold: 0 }
    );
    visibilityObserver.observe(canvas);

    document.addEventListener("visibilitychange", () => {
      visible = !document.hidden && visible;
    });

    canvas.addEventListener("click", handleClick);
    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("block h-full w-full cursor-pointer", className)}
    />
  );
}
