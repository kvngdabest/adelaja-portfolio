import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Clapperboard,
  Code,
  Film,
  Palette,
  Users,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/site/container";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { Badge } from "@/components/ui/badge";
import { BRANDS, PROCESS_STEPS, SERVICES } from "@/lib/content/positioning";

const SERVICE_ICONS: Record<string, LucideIcon> = {
  "Front-End Development": Code,
  "AI Video Content": Clapperboard,
  "Video Editing": Film,
  "Graphic Design": Palette,
  "Sales Team & CRM Management": Users,
  "Workflow Automation": Workflow,
};

export function ServicesSection() {
  return (
    <section className="py-24">
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="What I do"
            title="Built around the problems that hold brands back"
            description="Six services, one goal: help your brand look sharper, post more consistently, and close more of the leads it already has."
          />
        </Reveal>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service, i) => {
            const Icon = SERVICE_ICONS[service.title] ?? Code;
            return (
              <Reveal key={service.title} delay={(i % 3) * 0.08}>
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
    <section className="border-t border-border/60 py-24">
      <Container className="flex flex-col gap-12">
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
                  {brand.caseStudyHref ? (
                    <Link
                      href={brand.caseStudyHref}
                      className="inline-flex items-center gap-1 pt-2 text-xs font-medium text-cerulean hover:underline"
                    >
                      See the case studies <ArrowRight className="size-3" />
                    </Link>
                  ) : null}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

export function ProcessSection() {
  return (
    <section className="border-t border-border/60 py-24">
      <Container className="flex flex-col gap-12">
        <Reveal>
          <SectionHeading
            eyebrow="How I work"
            title="How I solve your problem"
            description="The same four steps on every job, whether it's a website, a video workflow or a sales pipeline."
          />
        </Reveal>
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {PROCESS_STEPS.map((step, i) => (
            <li key={step.title} className="list-none">
              <Reveal delay={i * 0.08} className="h-full">
                <div className="glass flex h-full flex-col gap-3 rounded-2xl p-6">
                  <span className="font-mono text-sm text-cerulean">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading text-lg font-semibold">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Container>
    </section>
  );
}
