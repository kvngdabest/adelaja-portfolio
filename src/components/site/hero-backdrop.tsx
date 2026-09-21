"use client";

import { useEffect, useRef, useState } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface Pulse {
  a: number;
  b: number;
  t: number;
  speed: number;
}

const LINK_DISTANCE = 170;
const MOUSE_RADIUS = 170;

/**
 * A drifting network of nodes with signal pulses travelling between them,
 * loosely attracted to the cursor. Canvas 2D, paused off-screen and when the
 * tab is hidden; draws a single static frame under prefers-reduced-motion.
 */
export function HeroBackdrop() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!wrap || !canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0;
    let h = 0;
    let raf = 0;
    let visible = true;
    let nodes: Node[] = [];
    const pulses: Pulse[] = [];
    const mouse = { x: -9999, y: -9999 };
    let lastSpawn = 0;

    function resize() {
      const rect = wrap!.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = rect.width;
      h = rect.height;
      canvas!.width = w * dpr;
      canvas!.height = h * dpr;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, Math.max(22, (w * h) / 24000)));
      // Pulses hold indices into `nodes`, so they must not survive a rebuild.
      pulses.length = 0;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
      }));
    }

    function neighbours(i: number) {
      const out: number[] = [];
      for (let j = 0; j < nodes.length; j++) {
        if (j !== i && Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) < LINK_DISTANCE) {
          out.push(j);
        }
      }
      return out;
    }

    function draw(now: number) {
      ctx!.clearRect(0, 0, w, h);

      for (const n of nodes) {
        if (!reduced) {
          const dx = mouse.x - n.x;
          const dy = mouse.y - n.y;
          const d = Math.hypot(dx, dy);
          if (d < MOUSE_RADIUS && d > 1) {
            n.vx += (dx / d) * 0.012;
            n.vy += (dy / d) * 0.012;
          }
          n.vx *= 0.985;
          n.vy *= 0.985;
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -20) n.x = w + 20;
          if (n.x > w + 20) n.x = -20;
          if (n.y < -20) n.y = h + 20;
          if (n.y > h + 20) n.y = -20;
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
          if (d < LINK_DISTANCE) {
            ctx!.strokeStyle = `rgba(18,130,162,${(1 - d / LINK_DISTANCE) * 0.6})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(nodes[i].x, nodes[i].y);
            ctx!.lineTo(nodes[j].x, nodes[j].y);
            ctx!.stroke();
          }
        }
      }

      for (const n of nodes) {
        const near = Math.hypot(mouse.x - n.x, mouse.y - n.y) < MOUSE_RADIUS;
        ctx!.fillStyle = near ? "rgba(254,252,251,0.95)" : "rgba(40,170,205,0.95)";
        ctx!.beginPath();
        ctx!.arc(n.x, n.y, near ? 3 : 2.2, 0, Math.PI * 2);
        ctx!.fill();
      }

      if (!reduced) {
        if (now - lastSpawn > 450 && pulses.length < 14) {
          lastSpawn = now;
          const a = Math.floor(Math.random() * nodes.length);
          const options = neighbours(a);
          if (options.length) {
            pulses.push({
              a,
              b: options[Math.floor(Math.random() * options.length)],
              t: 0,
              speed: 0.012 + Math.random() * 0.012,
            });
          }
        }
        for (let p = pulses.length - 1; p >= 0; p--) {
          const pulse = pulses[p];
          pulse.t += pulse.speed;
          if (pulse.t >= 1) {
            pulses.splice(p, 1);
            continue;
          }
          const A = nodes[pulse.a];
          const B = nodes[pulse.b];
          if (!A || !B) {
            pulses.splice(p, 1);
            continue;
          }
          const x = A.x + (B.x - A.x) * pulse.t;
          const y = A.y + (B.y - A.y) * pulse.t;
          const glow = ctx!.createRadialGradient(x, y, 0, x, y, 9);
          glow.addColorStop(0, "rgba(254,252,251,0.95)");
          glow.addColorStop(0.35, "rgba(18,130,162,0.7)");
          glow.addColorStop(1, "rgba(18,130,162,0)");
          ctx!.fillStyle = glow;
          ctx!.beginPath();
          ctx!.arc(x, y, 9, 0, Math.PI * 2);
          ctx!.fill();
        }
      }
    }

    function loop(now: number) {
      if (visible && !document.hidden) draw(now);
      raf = requestAnimationFrame(loop);
    }

    resize();
    if (reduced) {
      draw(0);
    } else {
      raf = requestAnimationFrame(loop);
    }

    const ro = new ResizeObserver(() => {
      resize();
      if (reduced) draw(0);
    });
    ro.observe(wrap);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(wrap);

    function onPointerMove(e: PointerEvent) {
      if (e.pointerType !== "mouse") return;
      const rect = wrap!.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      // Whole layer drifts opposite to the cursor for a depth effect.
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      canvas!.style.transform = `translate3d(${-nx * 22}px, ${-ny * 14}px, 0)`;
    }
    function onPointerLeave() {
      mouse.x = -9999;
      mouse.y = -9999;
    }
    if (!reduced) {
      window.addEventListener("pointermove", onPointerMove, { passive: true });
      document.addEventListener("pointerleave", onPointerLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="pointer-events-none absolute -inset-6 [mask-image:linear-gradient(to_bottom,black_55%,transparent_100%)]"
    >
      <canvas ref={canvasRef} className="transition-transform duration-300 ease-out" />
    </div>
  );
}

function formatLagosTime(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Africa/Lagos",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(date);
}

/** Corner HUD readouts and a slow scan line over the hero. */
export function HeroHud() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const tick = () => setTime(formatLagosTime(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-24 animate-[scan_9s_linear_infinite] bg-gradient-to-b from-transparent via-cerulean/10 to-transparent" />

      <div className="absolute top-24 left-6 hidden font-mono text-[0.65rem] tracking-[0.2em] text-cerulean/80 uppercase md:block">
        <span className="mr-2 inline-block size-1.5 animate-pulse rounded-full bg-cerulean align-middle" />
        System online
      </div>
      <div className="absolute top-24 right-6 hidden font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase md:block">
        Automation stack / ready
      </div>
      <div className="absolute bottom-10 left-6 hidden font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase md:block">
        Lagos, NG · 6.5244°N 3.3792°E
      </div>
      <div className="absolute right-6 bottom-10 hidden font-mono text-[0.65rem] tracking-[0.2em] text-muted-foreground uppercase md:block">
        Local time {time ?? "--:--:--"} WAT
      </div>

      <span className="absolute top-20 left-4 size-4 border-t border-l border-cerulean/60" />
      <span className="absolute top-20 right-4 size-4 border-t border-r border-cerulean/60" />
      <span className="absolute bottom-6 left-4 size-4 border-b border-l border-cerulean/60" />
      <span className="absolute right-4 bottom-6 size-4 border-r border-b border-cerulean/60" />
    </div>
  );
}
