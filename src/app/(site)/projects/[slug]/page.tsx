import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight, FolderGit2 } from "lucide-react";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProjectCta } from "@/components/site/project-cta";
import { SampleVideoFrame } from "@/components/site/sample-video-frame";
import { getProjectBySlug, getPublishedProjects } from "@/lib/data/public";

export const revalidate = 300;

export async function generateStaticParams() {
  const projects = await getPublishedProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return {};
  return {
    title: project.title,
    description: project.summary ?? undefined,
    openGraph: project.cover_image_url
      ? { images: [{ url: project.cover_image_url }] }
      : undefined,
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="py-24">
      <Container className="flex flex-col gap-10">
        <Reveal immediate>
          <Link
            href="/projects"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> All projects
          </Link>
        </Reveal>

        <Reveal immediate delay={0.06} className="flex flex-col gap-4">
          <h1 className="max-w-2xl font-heading text-3xl font-semibold text-balance sm:text-5xl">
            {project.title}
          </h1>
          {project.summary ? (
            <p className="max-w-2xl text-pretty text-lg text-muted-foreground">
              {project.summary}
            </p>
          ) : null}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {project.tech_stack.map((tech) => (
              <Badge key={tech} variant="secondary" className="font-mono text-xs">
                {tech}
              </Badge>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            {project.project_url ? (
              <Button asChild className="glow-cerulean-hover">
                <a href={project.project_url} target="_blank" rel="noreferrer noopener">
                  Visit project <ArrowUpRight className="size-4" />
                </a>
              </Button>
            ) : null}
            {project.repo_url ? (
              <Button asChild variant="outline">
                <a href={project.repo_url} target="_blank" rel="noreferrer noopener">
                  <FolderGit2 className="size-4" /> View source
                </a>
              </Button>
            ) : null}
          </div>
        </Reveal>

        {project.cover_image_url ? (
          <Reveal delay={0.12}>
            <div className="glass relative aspect-video w-full overflow-hidden rounded-2xl">
              <Image
                src={project.cover_image_url}
                alt={project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </Reveal>
        ) : null}

        {project.description || project.video_url ? (
          <div
            className={
              project.video_url
                ? "grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start"
                : "grid gap-10"
            }
          >
            {project.description ? (
              <Reveal delay={0.18}>
                <div className="max-w-2xl text-pretty leading-relaxed text-foreground/90">
                  {project.description.split("\n").filter(Boolean).map((p, i) => (
                    <p key={i} className="mb-4">
                      {p}
                    </p>
                  ))}
                </div>
              </Reveal>
            ) : (
              <div />
            )}
            {project.video_url ? (
              <Reveal delay={0.2}>
                <figure className="mx-auto flex w-[240px] flex-col gap-3 sm:w-[270px] lg:sticky lg:top-24 lg:mx-0">
                  <SampleVideoFrame
                    src={project.video_url}
                    label={`Sample output from ${project.title}`}
                  />
                  <figcaption className="text-center font-mono text-[0.65rem] tracking-wide text-muted-foreground uppercase">
                    Sample output from this project
                  </figcaption>
                </figure>
              </Reveal>
            ) : null}
          </div>
        ) : null}

        <Reveal delay={0.24}>
          <ProjectCta />
        </Reveal>
      </Container>
    </article>
  );
}
