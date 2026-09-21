import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { SkillBar } from "@/components/site/skill-bar";
import { getSkillsByCategory } from "@/lib/data/public";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Skills",
  description: "AI automation, CRM and lead systems, AI video and design, and front-end development — n8n, Make, Zapier, GoHighLevel, Claude, CorelDRAW, React/Next.js.",
};

export default async function SkillsPage() {
  const skillsByCategory = await getSkillsByCategory();
  const categories = Object.keys(skillsByCategory);

  return (
    <section className="py-24">
      <Container className="flex flex-col gap-16">
        <Reveal immediate>
          <SectionHeading
            as="h1"
            eyebrow="Toolbox"
            title="Skills & tools"
            description="Automation, AI and CRM systems on the business side; video, design and front-end craft on the creative side — the mix that helps a brand sell."
          />
        </Reveal>

        {categories.length > 0 ? (
          <div className="grid gap-10 lg:grid-cols-2">
            {categories.map((category, i) => (
              <Reveal key={category} delay={i * 0.1}>
                <div className="glass flex flex-col gap-6 rounded-2xl p-8">
                  <h3 className="font-heading text-lg font-semibold text-cerulean">
                    {category}
                  </h3>
                  <div className="flex flex-col gap-5">
                    {skillsByCategory[category].map((skill) => (
                      <SkillBar key={skill.id} skill={skill} />
                    ))}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Skills coming soon.</p>
        )}
      </Container>
    </section>
  );
}
