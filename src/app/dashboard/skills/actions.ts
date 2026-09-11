"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { skillSchema, type SkillInput } from "@/lib/validations";

export type ActionState = { success: boolean; error?: string };

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/skills");
}

export async function createSkill(input: SkillInput): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { success: false, error: "Unauthorized" };

  const parsed = skillSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { error } = await supabase.from("skills").insert(parsed.data);
  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/skills");
  revalidatePublic();
  return { success: true };
}

export async function updateSkill(id: string, input: SkillInput): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { success: false, error: "Unauthorized" };

  const parsed = skillSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { error } = await supabase.from("skills").update(parsed.data).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/skills");
  revalidatePublic();
  return { success: true };
}

export async function deleteSkill(id: string): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from("skills").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/skills");
  revalidatePublic();
  return { success: true };
}
