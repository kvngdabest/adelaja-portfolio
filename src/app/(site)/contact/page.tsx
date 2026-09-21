import type { Metadata } from "next";
import { Mail, MapPin } from "lucide-react";
import { Container } from "@/components/site/container";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { ContactForm } from "@/components/site/contact-form";
import { getSiteSettings } from "@/lib/data/public";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Adelaja Obanijesu Israel about a website, AI video content, or sales and automation project.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();

  return (
    <section className="py-24">
      <Container className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
        <Reveal immediate className="flex flex-col gap-8">
          <SectionHeading
            as="h1"
            eyebrow="Contact"
            title="Let's build something"
            description="Need a website, AI-made video content, a tidier sales pipeline, or a workflow automated? Tell me what's slowing you down."
          />
          <div className="flex flex-col gap-4 text-sm text-muted-foreground">
            {settings?.contact_email ? (
              <div className="flex items-center gap-2">
                <Mail className="size-4 text-cerulean" />
                <a href={`mailto:${settings.contact_email}`} className="hover:text-foreground">
                  {settings.contact_email}
                </a>
              </div>
            ) : null}
            <div className="flex items-center gap-2">
              <MapPin className="size-4 text-cerulean" />
              {settings?.location ?? "Lagos, Nigeria"}
            </div>
          </div>
        </Reveal>

        <Reveal immediate delay={0.1}>
          <ContactForm />
        </Reveal>
      </Container>
    </section>
  );
}
