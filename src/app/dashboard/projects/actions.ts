"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { projectSchema, type ProjectInput } from "@/lib/validations";

export type ActionState = { success: boolean; error?: string };

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/projects/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

export async function createProject(input: ProjectInput): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { success: false, error: "Unauthorized" };

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { error } = await supabase.from("projects").insert({
    ...parsed.data,
    cover_image_url: parsed.data.cover_image_url || null,
    video_url: parsed.data.video_url || null,
    project_url: parsed.data.project_url || null,
    repo_url: parsed.data.repo_url || null,
    summary: parsed.data.summary || null,
    description: parsed.data.description || null,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/projects");
  revalidatePublic();
  return { success: true };
}

export async function updateProject(id: string, input: ProjectInput): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { success: false, error: "Unauthorized" };

  const parsed = projectSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { error } = await supabase
    .from("projects")
    .update({
      ...parsed.data,
      cover_image_url: parsed.data.cover_image_url || null,
      video_url: parsed.data.video_url || null,
      project_url: parsed.data.project_url || null,
      repo_url: parsed.data.repo_url || null,
      summary: parsed.data.summary || null,
      description: parsed.data.description || null,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/projects");
  revalidatePublic();
  return { success: true };
}

export async function deleteProject(id: string): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/projects");
  revalidatePublic();
  return { success: true };
}
