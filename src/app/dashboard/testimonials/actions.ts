"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { testimonialSchema, type TestimonialInput } from "@/lib/validations";

export type ActionState = { success: boolean; error?: string };

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/testimonials");
}

export async function createTestimonial(input: TestimonialInput): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { success: false, error: "Unauthorized" };

  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { error } = await supabase.from("testimonials").insert({
    ...parsed.data,
    author_role: parsed.data.author_role || null,
    author_company: parsed.data.author_company || null,
    avatar_url: parsed.data.avatar_url || null,
  });

  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/testimonials");
  revalidatePublic();
  return { success: true };
}

export async function updateTestimonial(id: string, input: TestimonialInput): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { success: false, error: "Unauthorized" };

  const parsed = testimonialSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { error } = await supabase
    .from("testimonials")
    .update({
      ...parsed.data,
      author_role: parsed.data.author_role || null,
      author_company: parsed.data.author_company || null,
      avatar_url: parsed.data.avatar_url || null,
    })
    .eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/testimonials");
  revalidatePublic();
  return { success: true };
}

export async function deleteTestimonial(id: string): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/testimonials");
  revalidatePublic();
  return { success: true };
}
