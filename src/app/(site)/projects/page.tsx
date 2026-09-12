import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { ProjectCard } from "@/components/site/project-card";
import { getPublishedProjects } from "@/lib/data/public";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Projects",
  description: "Automation systems, AI agent pipelines, and full-stack products built by Adelaja Obanijesu Israel.",
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
            description="A selection of automation systems, AI agent pipelines, and full-stack products I've shipped."
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
