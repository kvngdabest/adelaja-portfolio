"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { skillSchema, type SkillInput } from "@/lib/validations";
import type { Skill } from "@/types/database.types";
import { createSkill, updateSkill } from "@/app/dashboard/skills/actions";

export function SkillForm({ skill }: { skill?: Skill }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<SkillInput>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: skill?.name ?? "",
      category: skill?.category ?? "",
      proficiency: skill?.proficiency ?? undefined,
      sort_order: skill?.sort_order ?? 0,
    },
  });

  function onSubmit(values: SkillInput) {
    startTransition(async () => {
      const result = skill ? await updateSkill(skill.id, values) : await createSkill(values);
      if (result.success) {
        toast.success(skill ? "Skill updated" : "Skill created");
        router.push("/dashboard/skills");
        router.refresh();
      } else {
        toast.error(result.error ?? "Something went wrong");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="glass flex flex-col gap-5 rounded-2xl p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. n8n Workflow Automation" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Automation & AI" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="proficiency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Proficiency (1-100)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      {...field}
                      value={(field.value as number | string | undefined) ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sort_order"
              render={({ field }) => (
                <FormItem>
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
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" className="glow-cerulean-hover" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {skill ? "Save changes" : "Create skill"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push("/dashboard/skills")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
