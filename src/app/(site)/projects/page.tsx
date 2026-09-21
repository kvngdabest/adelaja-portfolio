import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { ProjectCard } from "@/components/site/project-card";
import { getPublishedProjects } from "@/lib/data/public";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Projects",
  description: "AI video pipelines, automation systems, and web products built by Adelaja Obanijesu Israel for product brands.",
};

export default async function ProjectsPage() {
  const projects = await getPublishedProjects();

  return (
    <section className="py-24">
      <Container className="flex flex-col gap-12">
        <Reveal immediate>
          <SectionHeading
            as="h1"
            eyebrow="Work"
            title="Projects"
            description="Real systems I've built for product brands — each one starts with a business pain point and ends with a working fix."
          />
        </Reveal>

        {projects.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <Reveal key={project.id} delay={(i % 3) * 0.08}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Projects coming soon.</p>
        )}
      </Container>
    </section>
  );
}
