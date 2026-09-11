"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FileUploadField } from "@/components/dashboard/file-upload-field";
import { updateResumeFile } from "@/app/dashboard/resume/actions";

export function ResumeFileCard({ url }: { url: string | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleChange(newUrl: string) {
    startTransition(async () => {
      const result = await updateResumeFile(newUrl);
      if (result.success) {
        toast.success(newUrl ? "Resume PDF updated" : "Resume PDF removed");
        router.refresh();
      } else {
        toast.error(result.error ?? "Something went wrong");
      }
    });
  }

  return (
    <div className="glass flex flex-col gap-3 rounded-2xl p-6">
      <h2 className="font-heading text-sm font-semibold">Resume PDF</h2>
      <p className="text-sm text-muted-foreground">
        Shown as a download button on the public /resume page.
      </p>
      <FileUploadField bucket="resume" value={url ?? undefined} onChange={handleChange} kind="pdf" />
      {pending ? <p className="text-xs text-muted-foreground">Saving...</p> : null}
    </div>
  );
}
