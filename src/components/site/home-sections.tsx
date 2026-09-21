import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bot,
  Clapperboard,
  Code,
  Palette,
  TriangleAlert,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/site/container";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { TiltCard } from "@/components/site/tilt-card";
import { SampleVideoFrame } from "@/components/site/sample-video-frame";
import { IntroVideo } from "@/components/site/intro-video";
import { ParallaxDecor } from "@/components/site/parallax-decor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  BRANDS,
  PIPELINE_STEPS,
  PROCESS_STEPS,
  SERVICES,
  TICKER_ITEMS,
} from "@/lib/content/positioning";

const SERVICE_ICONS: Record<string, LucideIcon> = {
  "AI Workflow Automation": Workflow,
  "AI Agents & Chatbots": Bot,
  "CRM & Lead Automation": Users,
  "AI Video & Social Content": Clapperboard,
  "Front-End Development": Code,
  "Graphic Design": Palette,
};

export function Ticker() {
  const row = (
    <ul className="flex shrink-0 items-center gap-8 pr-8">
      {TICKER_ITEMS.map((item) => (
        <li
          key={item}
          className="flex items-center gap-8 font-mono text-xs tracking-[0.18em] whitespace-nowrap text-muted-foreground uppercase"
        >
          {item}
          <span className="text-cerulean">◆</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      aria-hidden
      className="relative overflow-hidden border-b border-border/60 bg-card/30 py-3.5 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
    >
      <div className="flex w-max animate-[marquee_45s_linear_infinite] hover:[animation-play-state:paused]">
        {row}
        {row}
      </div>
    </div>
  );
}

export function ServicesSection() {
  return (
    <section className="relative overflow-hidden py-24">
      <ParallaxDecor side="right" />
      <Container className="relative z-10 flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="What I do"
            title="Built around the problems that hold brands back"
            description="Six services, one goal: help your brand run on autopilot where it can, look sharper where it counts, and close more of the leads it already has."
          />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => {
            const Icon = SERVICE_ICONS[service.title] ?? Code;
            return (
              <Reveal key={service.title} delay={(i % 3) * 0.08}>
                <TiltCard>
                  <div className="glass flex h-full flex-col gap-4 rounded-2xl p-6">
                    <div className="flex size-11 items-center justify-center rounded-xl border border-border/60 bg-background/40 text-cerulean">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <h3 className="font-heading text-lg font-semibold">
                      {service.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">The problem: </span>
                      {service.problem}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-cerulean">How I fix it: </span>
                      {service.fix}
                    </p>
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
                      {service.tools.map((tool) => (
                        <Badge
                          key={tool}
                          variant="secondary"
                          className="font-mono text-[0.7rem]"
                        >
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </TiltCard>
              </Reveal>
            );
          })}
        </div>
        <Reveal>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-cerulean hover:underline"
          >
            Tell me which problem sounds like yours <ArrowRight className="size-3.5" />
          </Link>
        </Reveal>
      </Container>
    </section>
  );
}

export function BrandsSection() {
  return (
    <section className="relative overflow-hidden border-t border-border/60 py-24">
      <ParallaxDecor side="left" />
      <Container className="relative z-10 flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="Brands I've worked with"
            title="Product brands I've helped run smoother"
            description="I support sales teams and content production for product businesses, so the people making the product can stay focused on making it."
          />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BRANDS.map((brand, i) => (
            <Reveal key={brand.name} delay={i * 0.08}>
              <TiltCard>
                <div className="glass flex h-full flex-col gap-4 rounded-2xl p-6">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-heading text-lg font-semibold">{brand.name}</h3>
                    {brand.url ? (
                      <a
                        href={brand.url}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`Visit ${brand.name} (opens in a new tab)`}
                        className="text-muted-foreground transition-colors hover:text-cerulean"
                      >
                        <ArrowUpRight className="size-4" />
                      </a>
                    ) : null}
                  </div>
                  <p className="text-sm text-muted-foreground">{brand.sells}</p>
                  {brand.facts?.length ? (
                    <div className="flex flex-wrap gap-1.5">
                      {brand.facts.map((fact) => (
                        <span
                          key={fact}
                          className="rounded-full border border-border/60 px-2 py-0.5 font-mono text-[0.65rem] text-muted-foreground"
                        >
                          {fact}
                        </span>
                      ))}
                    </div>
                  ) : null}
                  <div className="mt-auto flex flex-col gap-2 pt-2">
                    <span className="font-mono text-[0.7rem] tracking-wide text-cerulean uppercase">
                      What I did
                    </span>
                    <ul className="flex flex-col gap-1 text-sm">
                      {brand.did.map((item) => (
                        <li key={item} className="flex gap-2">
                          <span aria-hidden className="text-cerulean">
                            •
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2">
                      {brand.caseStudyHref ? (
                        <Link
                          href={brand.caseStudyHref}
                          className="inline-flex items-center gap-1 text-xs font-medium text-cerulean hover:underline"
                        >
                          See the case studies <ArrowRight className="size-3" />
                        </Link>
                      ) : null}
                      {brand.instagram ? (
                        <a
                          href={brand.instagram}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-cerulean"
                        >
                          Instagram <ArrowUpRight className="size-3" />
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function PipelineSection({
  video,
}: {
  video: { src: string; href: string } | null;
}) {
  const last = PIPELINE_STEPS.length - 1;

  return (
    <section className="relative overflow-hidden border-t border-border/60 py-24">
      <ParallaxDecor side="right" />
      <Container className="relative z-10 flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="See it run"
            title="One product image in. A finished ad, posted everywhere."
            description="This is the pipeline I built for Seraman. n8n runs every step: a product image goes in, the client approves the scenes, and the finished video is posted to every platform with no editing, exporting or uploading by hand."
          />
        </Reveal>

        <ol className="grid gap-6 lg:grid-cols-6 lg:gap-8">
          {PIPELINE_STEPS.map((step, i) => (
            <li key={step.title} className="relative">
              <div
                className="glass flex h-full animate-[node-lit_7s_ease-in-out_infinite] flex-col gap-1.5 rounded-2xl p-5"
                style={{ animationDelay: `${i * 0.9}s` }}
              >
                <span className="font-mono text-[0.65rem] tracking-[0.2em] text-cerulean uppercase">
                  {String(i + 1).padStart(2, "0")} · {step.label}
                </span>
                <h3 className="font-heading text-base font-semibold">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.detail}</p>
              </div>
              {i < last ? (
                <>
                  <span
                    aria-hidden
                    className="absolute top-1/2 left-full hidden h-px w-8 -translate-y-1/2 overflow-hidden bg-border lg:block"
                  >
                    <span
                      className="absolute top-0 h-px w-1/2 animate-[pulse-x_7s_linear_infinite] bg-gradient-to-r from-transparent via-cerulean to-brand-white"
                      style={{ animationDelay: `${i * 0.9 + 0.45}s` }}
                    />
                  </span>
                  <span
                    aria-hidden
                    className="absolute top-full left-1/2 block h-6 w-px -translate-x-1/2 overflow-hidden bg-border lg:hidden"
                  >
                    <span
                      className="absolute left-0 h-1/2 w-px animate-[pulse-y_7s_linear_infinite] bg-gradient-to-b from-transparent via-cerulean to-brand-white"
                      style={{ animationDelay: `${i * 0.9 + 0.45}s` }}
                    />
                  </span>
                </>
              ) : null}
            </li>
          ))}
        </ol>

        <Reveal>
          <div className="glass flex items-start gap-3 rounded-2xl p-5 text-sm text-muted-foreground">
            <TriangleAlert className="mt-0.5 size-4 shrink-0 text-cerulean" aria-hidden />
            <p>
              <span className="font-medium text-foreground">If any step fails, </span>
              an email with a direct link to the failed run goes out immediately, so
              nothing fails silently.
            </p>
          </div>
        </Reveal>

        {video ? (
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-16">
            <Reveal className="flex flex-col gap-5">
              <h3 className="font-heading text-2xl font-semibold text-balance">
                The final output: a finished product ad
              </h3>
              <p className="max-w-lg text-pretty text-muted-foreground">
                This is the actual video the pipeline produced for Seraman, made and
                published by the workflow. Press play to watch it.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button asChild className="glow-cerulean-hover">
                  <Link href={video.href}>
                    Read the case study <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/contact">Build one for your brand</Link>
                </Button>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <SampleVideoFrame
                src={video.src}
                label="Sample product video generated by the Seraman pipeline"
                className="mx-auto w-[240px] sm:w-[270px]"
              />
            </Reveal>
          </div>
        ) : null}
      </Container>
    </section>
  );
}

export function MeetSection() {
  return (
    <section className="relative overflow-hidden border-t border-border/60 py-24">
      <ParallaxDecor side="right" />
      <Container className="relative z-10 grid items-center gap-10 lg:grid-cols-[1fr_1.35fr] lg:gap-16">
        <Reveal className="flex flex-col gap-5">
          <SectionHeading
            eyebrow="Meet me"
            title="The person behind the workflows"
            description="In 50 seconds: how I find where the friction is in a business, and how I turn it into a system that runs on its own."
          />
          <div className="flex flex-wrap gap-3">
            <Button asChild className="glow-cerulean-hover">
              <Link href="/contact">
                Work with me <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/about">More about me</Link>
            </Button>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <IntroVideo />
        </Reveal>
      </Container>
    </section>
  );
}

export function ProcessSection() {
  return (
    <section className="relative overflow-hidden border-t border-border/60 py-24">
      <ParallaxDecor side="left" />
      <Container className="relative z-10 flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="How I work"
            title="How I solve your problem"
            description="The same four steps on every job, whether it's an automation, a video workflow, a sales pipeline or a website."
          />
        </Reveal>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, i) => (
            <li key={step.title} className="list-none">
              <Reveal delay={i * 0.08} className="h-full">
                <TiltCard>
                  <div className="glass flex h-full flex-col gap-3 rounded-2xl p-6">
                    <span className="font-mono text-sm text-cerulean">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-heading text-lg font-semibold">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.body}</p>
                  </div>
                </TiltCard>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
