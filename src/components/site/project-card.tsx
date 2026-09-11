import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, FolderGit2 } from "lucide-react";
import type { Project } from "@/types/database.types";
import { Badge } from "@/components/ui/badge";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group glass glow-cerulean-hover flex flex-col overflow-hidden rounded-2xl transition-transform hover:-translate-y-1"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(min-width: 1024px) 33vw, 100vw"
          />
        ) : (
          <div className="bg-mesh flex h-full w-full items-center justify-center">
            <span className="font-heading text-lg text-muted-foreground">
              {project.title}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-heading text-lg font-semibold">{project.title}</h3>
          <ArrowUpRight className="size-4 shrink-0 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-cerulean" />
        </div>
        {project.summary ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {project.summary}
          </p>
        ) : null}
        {project.tech_stack.length > 0 ? (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-2">
            {project.tech_stack.slice(0, 4).map((tech) => (
              <Badge key={tech} variant="secondary" className="font-mono text-[0.7rem]">
                {tech}
              </Badge>
            ))}
          </div>
        ) : null}
        {project.repo_url ? (
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <FolderGit2 className="size-3" /> View source
          </span>
        ) : null}
      </div>
    </Link>
  );
}
