import Image from "next/image";
import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { getSiteSettings } from "@/lib/data/public";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "About",
  description: "About Adelaja Obanijesu Israel — AI Automation Engineer and full-stack developer based in Lagos, Nigeria.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <section className="py-24">
      <Container className="flex flex-col gap-16">
        <Reveal immediate>
          <SectionHeading as="h1" eyebrow="About" title="The person behind the automations" />
        </Reveal>

        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Reveal immediate delay={0.08} className="order-2 lg:order-1">
            <div className="flex flex-col gap-5 text-pretty leading-relaxed text-muted-foreground">
              {(settings?.about_bio ??
                "I'm Adelaja Obanijesu Israel, an AI automation developer, full-stack web developer, and entrepreneur based in Lagos, Nigeria."
              )
                .split("\n")
                .filter(Boolean)
                .map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
            </div>
          </Reveal>

          <Reveal immediate delay={0.16} className="order-1 lg:order-2">
            <div className="glass flex flex-col gap-4 rounded-2xl p-6">
              <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
                {settings?.avatar_url ? (
                  <Image
                    src={settings.avatar_url}
                    alt="Adelaja Obanijesu Israel"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="bg-mesh flex h-full w-full items-center justify-center font-heading text-2xl text-muted-foreground">
                    AOI
                  </div>
                )}
              </div>
              <dl className="grid grid-cols-1 gap-3 text-sm">
                <div className="flex justify-between border-b border-border/60 pb-2">
                  <dt className="text-muted-foreground">Based in</dt>
                  <dd>{settings?.location ?? "Lagos, Nigeria"}</dd>
                </div>
                <div className="flex justify-between pb-2">
                  <dt className="text-muted-foreground">Focus</dt>
                  <dd className="text-right">AI Automation & Full-Stack</dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
