import { createClient } from "@/lib/supabase/server";

export async function getAllProjects() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getProjectById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function getAllPosts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getPostById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function getAllTestimonials() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getTestimonialById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function getAllSkills() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("skills")
    .select("*")
    .order("category", { ascending: true })
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getSkillById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("skills").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function getAllResumeEntries() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("resume_entries")
    .select("*")
    .order("entry_type", { ascending: true })
    .order("sort_order", { ascending: true });
  return data ?? [];
}

export async function getResumeEntryById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("resume_entries").select("*").eq("id", id).maybeSingle();
  return data;
}

export async function getAllMessages() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getUnreadMessageCount() {
  const supabase = await createClient();
  const { count } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("is_read", false)
    .eq("is_archived", false);
  return count ?? 0;
}

export async function getSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("admin_settings").select("*").limit(1).maybeSingle();
  return data;
}

export async function getDashboardStats() {
  const supabase = await createClient();
  const [projects, posts, unread] = await Promise.all([
    supabase.from("projects").select("*", { count: "exact", head: true }).eq("status", "published"),
    supabase.from("blog_posts").select("*", { count: "exact", head: true }).eq("status", "published"),
    getUnreadMessageCount(),
  ]);

  return {
    publishedProjects: projects.count ?? 0,
    publishedPosts: posts.count ?? 0,
    unreadMessages: unread,
  };
}
