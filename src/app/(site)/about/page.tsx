import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/site/container";
import { IntroVideo } from "@/components/site/intro-video";
import { ProfileCard } from "@/components/site/profile-card";
import { Button } from "@/components/ui/button";
import { ABOUT_MEDIA } from "@/lib/content/positioning";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { getSiteSettings } from "@/lib/data/public";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About",
  description: "About Adelaja Obanijesu Israel — AI automation engineer and front-end developer who also creates AI video and supports sales teams, based in Lagos, Nigeria.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <section className="py-24">
      <Container className="flex flex-col gap-16">
        <Reveal immediate>
          <SectionHeading as="h1" eyebrow="About" title="Developer, creator, and problem-solver" />
        </Reveal>

        <Reveal immediate delay={0.04}>
          <IntroVideo />
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Reveal immediate delay={0.08} className="order-2 lg:order-1">
            <div className="flex flex-col gap-5 text-pretty leading-relaxed text-muted-foreground">
              {(settings?.about_bio ??
                "I'm Adelaja Obanijesu Israel, a front-end developer and content creator based in Lagos, Nigeria."
              )
                .split("\n")
                .filter(Boolean)
                .map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
            </div>
          </Reveal>

          <Reveal immediate delay={0.16} className="order-1 lg:order-2">
            <ProfileCard settings={settings} className="mx-auto w-full max-w-[320px]" />
          </Reveal>
        </div>

        <Reveal>
          <div className="glass grid items-center gap-8 rounded-2xl p-6 lg:grid-cols-[1.25fr_1fr] lg:p-8">
            <div className="relative aspect-[1622/970] w-full overflow-hidden rounded-xl">
              <Image
                src={ABOUT_MEDIA.servicesBanner}
                alt="AI workflow automation services: task automation, AI agents, RAG and voice agents, social media automation, CRM automation, and API and tool integration, across HighLevel, n8n, Make and Zapier"
                fill
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="font-heading text-2xl font-semibold text-balance">
                AI workflow automation, end to end
              </h2>
              <p className="text-pretty text-muted-foreground">
                Task automation, AI agents and voice agents, social media and CRM
                automation, and the API integrations that tie your tools together,
                across n8n, Make, Zapier and HighLevel.
              </p>
              <div>
                <Button asChild className="glow-cerulean-hover">
                  <Link href="/contact">
                    Start a project <ArrowRight className="size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
