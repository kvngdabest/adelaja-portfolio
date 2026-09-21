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
  SiMake,
  SiZapier,
  SiClaude,
  SiGooglegemini,
  SiPerplexity,
  SiDeepseek,
  SiMistralai,
  SiElevenlabs,
  SiHuggingface,
  SiLangchain,
  SiHubspot,
  SiAirtable,
  SiNotion,
  SiClickup,
  SiSupabase,
  SiPostgresql,
  SiPython,
  SiGithub,
  SiGmail,
  SiWhatsapp,
  SiTelegram,
  SiDiscord,
  SiCalendly,
  SiGooglesheets,
  SiGoogledrive,
  SiGooglecalendar,
  SiStripe,
  SiShopify,
  SiNextdotjs,
  SiFigma,
  SiCoreldraw,
} from "@icons-pack/react-simple-icons";

type IconComponent = ComponentType<{ size?: number; color?: string; title?: string }>;

interface Tool {
  name: string;
  href: string;
  /** Brand colour, or "currentColor" for black/white marks so they work in both themes. */
  color: string;
  Icon?: IconComponent;
  /** Text mark for brands whose logos aren't in the icon set. */
  monogram?: string;
}

const MONO = "currentColor";

const TOOLS: Tool[] = [
  { name: "n8n", href: "https://n8n.io", color: "#EA4B71", Icon: SiN8n },
  { name: "Make", href: "https://www.make.com", color: "#6D00CC", Icon: SiMake },
  { name: "Zapier", href: "https://zapier.com", color: "#FF4F00", Icon: SiZapier },
  { name: "GoHighLevel", href: "https://www.gohighlevel.com", color: "#188BF6", monogram: "GHL" },
  { name: "Claude", href: "https://claude.ai", color: "#D97757", Icon: SiClaude },
  { name: "OpenAI", href: "https://openai.com", color: MONO, monogram: "GPT" },
  { name: "Gemini", href: "https://gemini.google.com", color: "#8E75B2", Icon: SiGooglegemini },

  { name: "Perplexity", href: "https://www.perplexity.ai", color: "#1FB8CD", Icon: SiPerplexity },
  { name: "DeepSeek", href: "https://www.deepseek.com", color: "#5786FE", Icon: SiDeepseek },
  { name: "Mistral AI", href: "https://mistral.ai", color: "#FA520F", Icon: SiMistralai },
  { name: "ElevenLabs", href: "https://elevenlabs.io", color: MONO, Icon: SiElevenlabs },
  { name: "Hugging Face", href: "https://huggingface.co", color: "#FFB800", Icon: SiHuggingface },
  { name: "LangChain", href: "https://www.langchain.com", color: "#1C8C7C", Icon: SiLangchain },
  { name: "HubSpot", href: "https://www.hubspot.com", color: "#FF7A59", Icon: SiHubspot },

  { name: "Airtable", href: "https://www.airtable.com", color: "#FFBF00", Icon: SiAirtable },
  { name: "Notion", href: "https://www.notion.so", color: MONO, Icon: SiNotion },
  { name: "ClickUp", href: "https://clickup.com", color: "#7B68EE", Icon: SiClickup },
  { name: "Supabase", href: "https://supabase.com", color: "#3FCF8E", Icon: SiSupabase },
  { name: "PostgreSQL", href: "https://www.postgresql.org", color: "#4169E1", Icon: SiPostgresql },
  { name: "Python", href: "https://www.python.org", color: "#3776AB", Icon: SiPython },
  { name: "GitHub", href: "https://github.com", color: MONO, Icon: SiGithub },

  { name: "Gmail", href: "https://mail.google.com", color: "#EA4335", Icon: SiGmail },
  { name: "WhatsApp", href: "https://www.whatsapp.com", color: "#25D366", Icon: SiWhatsapp },
  { name: "Telegram", href: "https://telegram.org", color: "#26A5E4", Icon: SiTelegram },
  { name: "Discord", href: "https://discord.com", color: "#5865F2", Icon: SiDiscord },
  { name: "Calendly", href: "https://calendly.com", color: "#006BFF", Icon: SiCalendly },
  { name: "Google Sheets", href: "https://www.google.com/sheets/about/", color: "#34A853", Icon: SiGooglesheets },
  { name: "Google Drive", href: "https://www.google.com/drive/", color: "#4285F4", Icon: SiGoogledrive },

  { name: "Google Calendar", href: "https://calendar.google.com", color: "#4285F4", Icon: SiGooglecalendar },
  { name: "Stripe", href: "https://stripe.com", color: "#635BFF", Icon: SiStripe },
  { name: "Shopify", href: "https://www.shopify.com", color: "#7AB55C", Icon: SiShopify },
  { name: "Next.js", href: "https://nextjs.org", color: MONO, Icon: SiNextdotjs },
  { name: "Figma", href: "https://www.figma.com", color: "#F24E1E", Icon: SiFigma },
  { name: "Photoshop", href: "https://www.adobe.com/products/photoshop.html", color: "#31A8FF", monogram: "Ps" },
  { name: "CorelDRAW", href: "https://www.coreldraw.com", color: "#44A046", Icon: SiCoreldraw },
];

const REPEL_RADIUS = 110;
const REPEL_STRENGTH = 26;

function ToolTile({
  tool,
  index,
  mouseX,
  mouseY,
  reducedMotion,
}: {
  tool: Tool;
  index: number;
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
      const parentRect = el?.closest("[data-integrations-grid]")?.getBoundingClientRect();
      if (!el || !parentRect) return;
      const rect = el.getBoundingClientRect();
      const dx = rect.left + rect.width / 2 - parentRect.left - mouseX.get();
      const dy = rect.top + rect.height / 2 - parentRect.top - mouseY.get();
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

  const floatDuration = 3.6 + (index % 4) * 0.5;
  const floatDelay = -((index * 0.37) % floatDuration);

  return (
    <motion.div
      ref={tileRef}
      style={{ x, y }}
      className="group relative flex items-center justify-center hover:z-20 focus-within:z-20"
    >
      <motion.a
        href={tool.href}
        target="_blank"
        rel="noreferrer noopener"
        aria-label={`${tool.name} (opens the official site)`}
        whileHover={reducedMotion ? undefined : { scale: 1.12 }}
        whileTap={{ scale: 0.85 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className={
          "flex aspect-square w-full max-w-16 items-center justify-center rounded-2xl " +
          "border border-border bg-card text-foreground shadow-sm transition-colors " +
          "hover:border-cerulean/60 outline-none focus-visible:ring-2 focus-visible:ring-cerulean " +
          "focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
        {tool.Icon ? (
          <tool.Icon size={22} color={tool.color} />
        ) : (
          <span
            className="font-sans text-[0.7rem] font-extrabold tracking-tight sm:text-xs"
            style={{ color: tool.color }}
          >
            {tool.monogram}
          </span>
        )}
      </motion.a>

      <span
        aria-hidden
        className={
          "pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 translate-y-1 whitespace-nowrap " +
          "rounded-md bg-foreground px-2 py-1 text-[0.7rem] font-bold text-background opacity-0 shadow-lg " +
          "transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100 " +
          "group-focus-within:translate-y-0 group-focus-within:opacity-100"
        }
      >
        {tool.name}
      </span>
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
        // Touch has no hover/leave, so a tap would leave a tile displaced.
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
      className="relative mx-auto grid w-full max-w-xl grid-cols-7 gap-2 pt-8 sm:gap-3"
    >
      {TOOLS.map((tool, i) => (
        <ToolTile
          key={tool.name}
          tool={tool}
          index={i}
          mouseX={mouseX}
          mouseY={mouseY}
          reducedMotion={!!shouldReduceMotion}
        />
      ))}
    </div>
  );
}
