"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { blogPostSchema, type BlogPostInput } from "@/lib/validations";

export type ActionState = { success: boolean; error?: string };

function revalidatePublic() {
  revalidatePath("/");
  revalidatePath("/blog");
  revalidatePath("/blog/[slug]", "page");
  revalidatePath("/sitemap.xml");
}

function cleanInsertPayload(data: ReturnType<typeof blogPostSchema.parse>) {
  return {
    ...data,
    excerpt: data.excerpt || null,
    content: data.content || null,
    cover_image_url: data.cover_image_url || null,
    meta_title: data.meta_title || null,
    meta_description: data.meta_description || null,
    published_at: data.status === "published" ? new Date().toISOString() : null,
  };
}

export async function createPost(input: BlogPostInput): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { success: false, error: "Unauthorized" };

  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const { error } = await supabase.from("blog_posts").insert(cleanInsertPayload(parsed.data));

  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/blog");
  revalidatePublic();
  return { success: true };
}

export async function updatePost(id: string, input: BlogPostInput): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { success: false, error: "Unauthorized" };

  const parsed = blogPostSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  // Preserve the original published_at once a post has been published.
  const { data: existing } = await supabase
    .from("blog_posts")
    .select("status, published_at")
    .eq("id", id)
    .maybeSingle();

  const payload = cleanInsertPayload(parsed.data);
  if (existing?.published_at && parsed.data.status === "published") {
    payload.published_at = existing.published_at;
  }

  const { error } = await supabase.from("blog_posts").update(payload).eq("id", id);

  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/blog");
  revalidatePublic();
  return { success: true };
}

export async function deletePost(id: string): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/blog");
  revalidatePublic();
  return { success: true };
}
