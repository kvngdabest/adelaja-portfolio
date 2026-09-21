"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrambleText } from "@/components/site/scramble-text"

interface HeroProps {
  /** Decorative layer rendered above the section background, below the content. */
  backdrop?: ReactNode
  /** Extra content rendered directly under the call-to-action buttons. */
  belowCta?: ReactNode
  eyebrow?: string
  /** Only renders the eyebrow as a link if provided — otherwise it's a plain badge. */
  eyebrowHref?: string
  title: ReactNode
  subtitle: string
  ctaLabel?: string
  ctaHref?: string
  secondaryCtaLabel?: string
  secondaryCtaHref?: string
}

export function Hero({
  backdrop,
  belowCta,
  eyebrow = "Innovate Without Limits",
  eyebrowHref,
  title,
  subtitle,
  ctaLabel = "Explore Now",
  ctaHref = "#",
  secondaryCtaLabel,
  secondaryCtaHref = "#",
}: HeroProps) {
  const eyebrowContent = eyebrow ? (
    <span
      className="mx-auto flex w-fit items-center justify-center rounded-3xl
      border border-border/60 bg-card/60 px-5 py-2 font-mono text-xs
      tracking-tight text-muted-foreground uppercase"
    >
      <ScrambleText text={eyebrow} />
      {eyebrowHref ? (
        <ChevronRight className="inline w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
      ) : null}
    </span>
  ) : null

  return (
    <section
      id="hero"
      className="bg-mesh relative mx-auto w-full min-h-[calc(100svh-4rem)]
      overflow-hidden px-6 pt-32 text-center md:px-8 md:pt-40"
    >
      {/* Grid BG */}
      <div
        className="bg-grid absolute -z-10 inset-0 h-[600px] w-full opacity-80"
      />

      {backdrop ? <div className="absolute inset-0 z-0">{backdrop}</div> : null}

      <div className="relative z-10">
      {/* Eyebrow */}
      {eyebrowContent ? (
        eyebrowHref ? (
          <Link href={eyebrowHref} className="group">
            {eyebrowContent}
          </Link>
        ) : (
          eyebrowContent
        )
      ) : null}

      {/* Title */}
      <h1
        className="animate-fade-in -translate-y-4 text-balance
        bg-gradient-to-br from-foreground from-30% to-foreground/40
        bg-clip-text py-6 text-5xl font-semibold leading-[1.05] tracking-tighter
        text-transparent opacity-0 sm:text-6xl md:text-7xl lg:text-8xl"
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        className="animate-fade-in mb-12 -translate-y-4 text-balance
        text-lg tracking-tight text-muted-foreground
        opacity-0 md:text-xl mx-auto max-w-2xl"
      >
        {subtitle}
      </p>

      {/* CTA */}
      {ctaLabel && (
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="btn-gradient glow-cerulean-hover z-20 w-fit tracking-tighter text-lg"
          >
            <Link href={ctaHref}>
              {ctaLabel} <ArrowRight className="size-4" />
            </Link>
          </Button>
          {secondaryCtaLabel ? (
            <Button asChild variant="outline" size="lg" className="z-20 w-fit tracking-tighter text-lg">
              <Link href={secondaryCtaHref}>{secondaryCtaLabel}</Link>
            </Button>
          ) : null}
        </div>
      )}

      {belowCta}
      </div>

      {/* Bottom Fade */}
      <div
        className="animate-fade-up relative mt-32 opacity-0 [perspective:2000px]
        after:absolute after:inset-0 after:z-50
        after:[background:linear-gradient(to_top,var(--background)_10%,transparent)]"
      />
    </section>
  )
}
