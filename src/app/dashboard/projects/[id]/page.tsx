import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/dashboard/project-form";
import { getProjectById } from "@/lib/data/admin";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await getProjectById(id);
  if (!project) notFound();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <ProjectForm project={project} />
    </div>
  );
}
