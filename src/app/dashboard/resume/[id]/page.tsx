import { notFound } from "next/navigation";
import { ResumeEntryForm } from "@/components/dashboard/resume-entry-form";
import { getResumeEntryById } from "@/lib/data/admin";

export default async function EditResumeEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const entry = await getResumeEntryById(id);
  if (!entry) notFound();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <ResumeEntryForm entry={entry} />
    </div>
  );
}
