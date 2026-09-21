import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/site/container";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { RotatingText } from "@/components/site/rotating-text";
import { ProjectCard } from "@/components/site/project-card";
import { TestimonialCard } from "@/components/site/testimonial-card";
import { Button } from "@/components/ui/button";
import { Hero } from "@/components/ui/hero-1";
import { FloatingPaths } from "@/components/ui/background-paths";
import { IntegrationsGrid } from "@/components/site/integrations-grid";
import {
  BrandsSection,
  MeetSection,
  PipelineSection,
  ProcessSection,
  ServicesSection,
  Ticker,
} from "@/components/site/home-sections";
import { Aurora, HeroBackdrop, HeroHud } from "@/components/site/hero-backdrop";
import { BootLine } from "@/components/site/boot-line";
import { TiltCard } from "@/components/site/tilt-card";
import {
  getFeaturedProjects,
  getPublishedTestimonials,
  getSiteSettings,
  getSkillsByCategory,
} from "@/lib/data/public";

export const revalidate = 300;

const rotatingRoles = [
  "AI Workflow Automation",
  "AI Agents & Chatbots",
  "CRM & Lead Systems",
  "AI Product Videos",
  "Front-End Websites",
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
  const videoProject = featuredProjects.find((p) => p.video_url);

  return (
    <>
      {/* Hero */}
      <div>
        <Hero
          backdrop={
            <>
              <Aurora />
              <HeroBackdrop />
              <HeroHud />
            </>
          }
          belowCta={<BootLine />}
          eyebrow="Available for AI automation projects"
          title={
            <>
              Adelaja Obanijesu Israel builds{" "}
              <RotatingText items={rotatingRoles} />
            </>
          }
          subtitle={
            settings?.hero_subheading ??
            "AI automation engineer based in Lagos, Nigeria — building AI automations, agents and CRM systems that remove manual work, plus the AI video, design and front-end that help product brands sell."
          }
          ctaLabel="View my work"
          ctaHref="/projects"
          secondaryCtaLabel="Get in touch"
          secondaryCtaHref="/contact"
        />
      </div>

      <Ticker />
      <MeetSection />
      <ServicesSection />
      <BrandsSection />
      <PipelineSection
        video={
          videoProject?.video_url
            ? {
                src: videoProject.video_url,
                href: `/projects/${videoProject.slug}`,
              }
            : null
        }
      />

      {/* Featured projects */}
      {featuredProjects.length > 0 ? (
        <section className="border-t border-border/60 py-24">
          <Container className="flex flex-col gap-12">
            <Reveal>
              <SectionHeading
                eyebrow="Selected work"
                title="Featured projects"
                description="Real systems built for product brands — each one starts with a business pain point and ends with a working fix."
              />
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredProjects.map((project, i) => (
                <Reveal key={project.id} delay={i * 0.08}>
                  <TiltCard>
                    <ProjectCard project={project} />
                  </TiltCard>
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

      <ProcessSection />

      {/* Skills snapshot */}
      {categories.length > 0 ? (
        <section className="border-t border-border/60 py-24">
          <Container className="flex flex-col gap-12">
            <Reveal>
              <SectionHeading
                eyebrow="Toolbox"
                title="What I work with"
                description="Front-end craft, design and video on the creative side; sales operations and automation on the business side."
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

      {/* Integrations */}
      <section className="border-t border-border/60 py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="Connected"
              title="Plugs into the tools you already use"
              description="35+ tools I build with every day, from AI models to CRMs to the apps your team already runs on. No rip-and-replace, no new tools to learn. Hover a tile to see its name; tap it to visit the tool."
            />
          </Reveal>
          <Reveal delay={0.1}>
            <IntegrationsGrid />
          </Reveal>
        </Container>
      </section>

      {/* Testimonials */}
      {testimonials.length > 0 ? (
        <section className="border-t border-border/60 py-24">
          <Container className="flex flex-col gap-12">
            <Reveal>
              <SectionHeading
                eyebrow="Kind words"
                title="What clients say"
                description="5-star reviews from clients I've delivered for."
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
            <div className="glass gradient-border relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl px-8 py-16 text-center">
              <FloatingPaths position={1} />
              <h2 className="relative z-10 max-w-xl text-3xl font-semibold text-balance sm:text-4xl">
                Ready to fix what&apos;s slowing your brand down?
              </h2>
              <p className="relative z-10 max-w-md text-pretty text-muted-foreground">
                Tell me about the workflow, content or sales pipeline you want handled.
              </p>
              <Button asChild size="lg" className="btn-gradient glow-cerulean-hover relative z-10">
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
