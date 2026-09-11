import { notFound } from "next/navigation";
import { SkillForm } from "@/components/dashboard/skill-form";
import { getSkillById } from "@/lib/data/admin";

export default async function EditSkillPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const skill = await getSkillById(id);
  if (!skill) notFound();

  return (
    <div className="flex max-w-xl flex-col gap-6">
      <SkillForm skill={skill} />
    </div>
  );
}
