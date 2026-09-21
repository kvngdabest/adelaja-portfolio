"use client";

import { useEffect, useRef } from "react";
import type { ComponentType } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import {
  SiN8n,
  SiClaude,
  SiGmail,
  SiNotion,
  SiGithub,
  SiGooglesheets,
  SiAirtable,
  SiStripe,
  SiDiscord,
  SiWhatsapp,
  SiGooglecalendar,
  SiSupabase,
  SiPython,
} from "@icons-pack/react-simple-icons";

interface IntegrationIcon {
  Icon: ComponentType<{ size?: number; color?: string; title?: string }>;
  name: string;
  color: string;
  col: number;
  row: number;
}

// Positions are a sparse 6x5 grid (some cells left empty) for the same
// organic, scattered layout as the reference — not every cell filled.
const ICONS: IntegrationIcon[] = [
  { Icon: SiN8n, name: "n8n", color: "#EA4B71", col: 2, row: 0 },
  { Icon: SiClaude, name: "Claude", color: "#D97757", col: 4, row: 0 },
  { Icon: SiAirtable, name: "Airtable", color: "#FFBF00", col: 0, row: 0 },
  { Icon: SiNotion, name: "Notion", color: "#fefcfb", col: 1, row: 1 },
  { Icon: SiGithub, name: "GitHub", color: "#fefcfb", col: 5, row: 1 },
  { Icon: SiSupabase, name: "Supabase", color: "#3FCF8E", col: 0, row: 2 },
  { Icon: SiWhatsapp, name: "WhatsApp", color: "#25D366", col: 2, row: 2 },
  { Icon: SiGmail, name: "Gmail", color: "#EA4335", col: 4, row: 2 },
  { Icon: SiPython, name: "Python", color: "#3776AB", col: 1, row: 3 },
  { Icon: SiGooglesheets, name: "Google Sheets", color: "#34A853", col: 3, row: 3 },
  { Icon: SiStripe, name: "Stripe", color: "#635BFF", col: 5, row: 3 },
  { Icon: SiGooglecalendar, name: "Google Calendar", color: "#4285F4", col: 2, row: 4 },
  { Icon: SiDiscord, name: "Discord", color: "#5865F2", col: 4, row: 4 },
];

const COLS = 6;
const ROWS = 5;
const REPEL_RADIUS = 130;
const REPEL_STRENGTH = 46;

function IntegrationTile({
  icon,
  mouseX,
  mouseY,
  reducedMotion,
}: {
  icon: IntegrationIcon;
  mouseX: MotionValue<number>;
  mouseY: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const tileRef = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.6 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (reducedMotion) return;

    function update() {
      const el = tileRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const parent = el.closest("[data-integrations-grid]");
      const parentRect = parent?.getBoundingClientRect();
      if (!parentRect) return;

      const tileCenterX = rect.left + rect.width / 2 - parentRect.left;
      const tileCenterY = rect.top + rect.height / 2 - parentRect.top;
      const dx = tileCenterX - mouseX.get();
      const dy = tileCenterY - mouseY.get();
      const dist = Math.hypot(dx, dy);

      if (dist < REPEL_RADIUS && dist > 0.01) {
        const force = (1 - dist / REPEL_RADIUS) * REPEL_STRENGTH;
        x.set((dx / dist) * force);
        y.set((dy / dist) * force);
      } else {
        x.set(0);
        y.set(0);
      }
    }

    const unsubX = mouseX.on("change", update);
    const unsubY = mouseY.on("change", update);
    return () => {
      unsubX();
      unsubY();
    };
  }, [mouseX, mouseY, reducedMotion, x, y]);

  const style = {
    gridColumn: icon.col + 1,
    gridRow: icon.row + 1,
  };

  const floatDuration = 3.5 + ((icon.col + icon.row) % 3) * 0.6;
  const floatDelay = ((icon.col * 0.37 + icon.row * 0.53) % 1) * -floatDuration;

  return (
    <motion.div
      ref={tileRef}
      style={{ ...style, x, y }}
      className="flex items-center justify-center"
    >
      <motion.button
        type="button"
        aria-label={icon.name}
        title={icon.name}
        whileHover={reducedMotion ? undefined : { scale: 1.1 }}
        whileTap={{ scale: 0.82 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className={
          "group glow-cerulean-hover flex size-14 items-center justify-center rounded-2xl " +
          "border border-border/60 bg-card/60 backdrop-blur-sm sm:size-16 " +
          "outline-none focus-visible:ring-2 focus-visible:ring-cerulean focus-visible:ring-offset-2 " +
          "focus-visible:ring-offset-background"
        }
        style={
          reducedMotion
            ? undefined
            : {
                animation: `integration-float ${floatDuration}s ease-in-out infinite`,
                animationDelay: `${floatDelay}s`,
              }
        }
      >
        <icon.Icon size={24} color={icon.color} />
      </motion.button>
    </motion.div>
  );
}

export function IntegrationsGrid() {
  const shouldReduceMotion = useReducedMotion();
  const mouseX = useMotionValue(-9999);
  const mouseY = useMotionValue(-9999);

  return (
    <div
      data-integrations-grid
      onPointerMove={(e) => {
        // Touch has no hover/leave concept — a tap would set a position that
        // never resets, permanently scattering whichever icon was nearest.
        // Restrict the repel effect to an actual mouse/pen pointer.
        if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
        const rect = e.currentTarget.getBoundingClientRect();
        mouseX.set(e.clientX - rect.left);
        mouseY.set(e.clientY - rect.top);
      }}
      onPointerLeave={(e) => {
        if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
        mouseX.set(-9999);
        mouseY.set(-9999);
      }}
      className="relative mx-auto grid aspect-[6/5] w-full max-w-lg gap-2 sm:gap-4"
      style={{
        gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
        gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
      }}
    >
      {ICONS.map((icon) => (
        <IntegrationTile
          key={icon.name}
          icon={icon}
          mouseX={mouseX}
          mouseY={mouseY}
          reducedMotion={!!shouldReduceMotion}
        />
      ))}
    </div>
  );
}
