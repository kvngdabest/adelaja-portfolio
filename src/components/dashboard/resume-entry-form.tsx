"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { resumeEntrySchema, type ResumeEntryInput } from "@/lib/validations";
import type { ResumeEntry } from "@/types/database.types";
import { createResumeEntry, updateResumeEntry } from "@/app/dashboard/resume/actions";

export function ResumeEntryForm({ entry }: { entry?: ResumeEntry }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<ResumeEntryInput>({
    resolver: zodResolver(resumeEntrySchema),
    defaultValues: {
      title: entry?.title ?? "",
      organization: entry?.organization ?? "",
      entry_type: entry?.entry_type ?? "experience",
      start_date: entry?.start_date ?? "",
      end_date: entry?.end_date ?? "",
      is_current: entry?.is_current ?? false,
      description: entry?.description ?? "",
      sort_order: entry?.sort_order ?? 0,
    },
  });

  const isCurrent = form.watch("is_current");

  function onSubmit(values: ResumeEntryInput) {
    startTransition(async () => {
      const result = entry
        ? await updateResumeEntry(entry.id, values)
        : await createResumeEntry(values);
      if (result.success) {
        toast.success(entry ? "Entry updated" : "Entry created");
        router.push("/dashboard/resume");
        router.refresh();
      } else {
        toast.error(result.error ?? "Something went wrong");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
        <div className="glass flex flex-col gap-5 rounded-2xl p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. AI Automation Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="entry_type"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel>Type</FormLabel>
                <Select value={field.value ?? "experience"} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="experience">Experience</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-3">
            <FormField
              control={form.control}
              name="start_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="end_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End date</FormLabel>
                  <FormControl>
                    <Input type="date" disabled={isCurrent} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_current"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end gap-2">
                  <FormLabel>Current</FormLabel>
                  <FormControl>
                    <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="One achievement per line — each line becomes a bullet point"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Write one line per achievement (e.g. &quot;Cut first-response time by automating
                  ticket triage&quot;). Multiple lines render as bullets on the public /resume page.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="sort_order"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel>Sort order</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    {...field}
                    value={(field.value as number | string | undefined) ?? 0}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" className="glow-cerulean-hover" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {entry ? "Save changes" : "Create entry"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push("/dashboard/resume")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
