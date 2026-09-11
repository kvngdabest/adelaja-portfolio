import { cache } from "react";
import { createPublicClient } from "@/lib/supabase/public";
import type {
  AdminSettings,
  BlogPost,
  Project,
  ResumeEntry,
  Skill,
  Testimonial,
} from "@/types/database.types";

/**
 * Wraps a Supabase query so a missing client (env vars not configured) or a
 * transient Supabase outage degrades to a safe fallback instead of crashing
 * the page — the public site should never 500 because the CMS is down.
 */
async function safe<T>(
  fallback: T,
  run: (supabase: NonNullable<ReturnType<typeof createPublicClient>>) => Promise<T>
): Promise<T> {
  const supabase = createPublicClient();
  if (!supabase) return fallback;
  try {
    return await run(supabase);
  } catch (error) {
    console.error("[supabase] public query failed:", error);
    return fallback;
  }
}

export const getSiteSettings = cache((): Promise<AdminSettings | null> =>
  safe(null, async (supabase) => {
    const { data } = await supabase
      .from("admin_settings")
      .select("*")
      .limit(1)
      .maybeSingle();
    return data;
  })
);

export const getPublishedProjects = cache((): Promise<Project[]> =>
  safe([], async (supabase) => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "published")
      .order("sort_order", { ascending: true });
    return data ?? [];
  })
);

export const getFeaturedProjects = cache(async (): Promise<Project[]> => {
  const projects = await getPublishedProjects();
  return projects.filter((p) => p.is_featured);
});

export const getProjectBySlug = cache((slug: string): Promise<Project | null> =>
  safe(null, async (supabase) => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    return data;
  })
);

export const getPublishedPosts = cache((): Promise<BlogPost[]> =>
  safe([], async (supabase) => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("status", "published")
      .order("published_at", { ascending: false });
    return data ?? [];
  })
);

export const getPostBySlug = cache((slug: string): Promise<BlogPost | null> =>
  safe(null, async (supabase) => {
    const { data } = await supabase
      .from("blog_posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();
    return data;
  })
);

export const getPublishedTestimonials = cache((): Promise<Testimonial[]> =>
  safe([], async (supabase) => {
    const { data } = await supabase
      .from("testimonials")
      .select("*")
      .eq("is_published", true)
      .order("sort_order", { ascending: true });
    return data ?? [];
  })
);

export const getSkills = cache((): Promise<Skill[]> =>
  safe([], async (supabase) => {
    const { data } = await supabase
      .from("skills")
      .select("*")
      .order("sort_order", { ascending: true });
    return data ?? [];
  })
);

export const getSkillsByCategory = cache(async (): Promise<Record<string, Skill[]>> => {
  const skills = await getSkills();
  return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    acc[skill.category] = acc[skill.category] ?? [];
    acc[skill.category].push(skill);
    return acc;
  }, {});
});

export const getResumeEntries = cache((): Promise<ResumeEntry[]> =>
  safe([], async (supabase) => {
    const { data } = await supabase
      .from("resume_entries")
      .select("*")
      .order("sort_order", { ascending: true });
    return data ?? [];
  })
);
