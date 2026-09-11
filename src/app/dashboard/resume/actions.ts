"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { resumeEntrySchema, type ResumeEntryInput } from "@/lib/validations";

export type ActionState = { success: boolean; error?: string };

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/resume");
}

function cleanEntry(data: ReturnType<typeof resumeEntrySchema.parse>) {
  return {
    ...data,
    organization: data.organization || null,
    start_date: data.start_date || null,
    end_date: data.is_current ? null : data.end_date || null,
    description: data.description || null,
  };
}

export async function createResumeEntry(input: ResumeEntryInput): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { success: false, error: "Unauthorized" };

  const parsed = resumeEntrySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { error } = await supabase.from("resume_entries").insert(cleanEntry(parsed.data));
  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/resume");
  revalidatePublic();
  return { success: true };
}

export async function updateResumeEntry(id: string, input: ResumeEntryInput): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { success: false, error: "Unauthorized" };

  const parsed = resumeEntrySchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { error } = await supabase.from("resume_entries").update(cleanEntry(parsed.data)).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/resume");
  revalidatePublic();
  return { success: true };
}

export async function deleteResumeEntry(id: string): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from("resume_entries").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/resume");
  revalidatePublic();
  return { success: true };
}

export async function updateResumeFile(url: string): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { success: false, error: "Unauthorized" };

  const { data: existing } = await supabase.from("admin_settings").select("id").limit(1).maybeSingle();

  const { error } = existing
    ? await supabase.from("admin_settings").update({ resume_url: url || null }).eq("id", existing.id)
    : await supabase.from("admin_settings").insert({ resume_url: url || null });

  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/resume");
  revalidatePublic();
  return { success: true };
}
