import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container } from "@/components/site/container";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { RotatingText } from "@/components/site/rotating-text";
import { ProjectCard } from "@/components/site/project-card";
import { TestimonialCard } from "@/components/site/testimonial-card";
import { Button } from "@/components/ui/button";
import {
  getFeaturedProjects,
  getPublishedTestimonials,
  getSiteSettings,
  getSkillsByCategory,
} from "@/lib/data/public";

export const revalidate = 300;

const rotatingRoles = [
  "n8n Workflow Automation",
  "AI Agent Pipelines",
  "Claude API Integrations",
  "React & Next.js Products",
];

export default async function HomePage() {
  const [settings, featuredProjects, testimonials, skillsByCategory] =
    await Promise.all([
      getSiteSettings(),
      getFeaturedProjects(),
      getPublishedTestimonials(),
      getSkillsByCategory(),
    ]);

  const categories = Object.keys(skillsByCategory);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/60">
        <div aria-hidden className="bg-grid bg-mesh pointer-events-none absolute inset-0" />
        <Container className="relative z-10 flex min-h-[calc(100svh-4rem)] flex-col justify-center gap-8 py-24">
          <Reveal immediate>
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-card/60 px-3 py-1 font-mono text-xs text-muted-foreground">
              <Sparkles className="size-3 text-cerulean" />
              Available for select automation & full-stack projects
            </span>
          </Reveal>

          <Reveal immediate delay={0.08}>
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.1] text-balance sm:text-6xl">
              Adelaja Obanijesu Israel builds{" "}
              <RotatingText items={rotatingRoles} />
            </h1>
          </Reveal>

          <Reveal immediate delay={0.16}>
            <p className="max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
              {settings?.hero_subheading ??
                "AI Automation Engineer based in Lagos, Nigeria — designing n8n workflows and AI agent pipelines, and shipping them as full-stack products."}
            </p>
          </Reveal>

          <Reveal immediate delay={0.24}>
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="glow-cerulean-hover">
                <Link href="/projects">
                  View my work <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Get in touch</Link>
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* Featured projects */}
      {featuredProjects.length > 0 ? (
        <section className="py-24">
          <Container className="flex flex-col gap-12">
            <Reveal>
              <SectionHeading
                eyebrow="Selected work"
                title="Featured projects"
                description="Automation systems and products I've built end to end — from workflow design to production deployment."
              />
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project, i) => (
                <Reveal key={project.id} delay={i * 0.08}>
                  <ProjectCard project={project} />
                </Reveal>
              ))}
            </div>
            <Reveal>
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-cerulean hover:underline"
              >
                View all projects <ArrowRight className="size-3.5" />
              </Link>
            </Reveal>
          </Container>
        </section>
      ) : null}

      {/* Skills snapshot */}
      {categories.length > 0 ? (
        <section className="border-t border-border/60 py-24">
          <Container className="flex flex-col gap-12">
            <Reveal>
              <SectionHeading
                eyebrow="Toolbox"
                title="What I work with"
                description="Automation and AI on one side, full-stack engineering on the other."
              />
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2">
              {categories.map((category, i) => (
                <Reveal key={category} delay={i * 0.1}>
                  <div className="glass rounded-2xl p-6">
                    <h3 className="mb-4 font-heading text-sm font-semibold tracking-wide text-cerulean uppercase">
                      {category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skillsByCategory[category].map((skill) => (
                        <span
                          key={skill.id}
                          className="rounded-full border border-border/60 bg-background/40 px-3 py-1 font-mono text-xs"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* Testimonials */}
      {testimonials.length > 0 ? (
        <section className="border-t border-border/60 py-24">
          <Container className="flex flex-col gap-12">
            <Reveal>
              <SectionHeading
                eyebrow="Kind words"
                title="What clients say"
                align="center"
                className="mx-auto"
              />
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.slice(0, 3).map((t, i) => (
                <Reveal key={t.id} delay={i * 0.08}>
                  <TestimonialCard testimonial={t} />
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      {/* CTA */}
      <section className="border-t border-border/60 py-24">
        <Container>
          <Reveal>
            <div className="glass glow-cerulean flex flex-col items-center gap-6 rounded-3xl px-8 py-16 text-center">
              <h2 className="max-w-xl text-3xl font-semibold text-balance sm:text-4xl">
                Have a workflow that still eats your afternoon?
              </h2>
              <p className="max-w-md text-pretty text-muted-foreground">
                Let&apos;s talk about automating it.
              </p>
              <Button asChild size="lg" className="glow-cerulean-hover">
                <Link href="/contact">
                  Start a conversation <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
