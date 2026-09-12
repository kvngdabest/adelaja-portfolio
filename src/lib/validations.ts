import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const slugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(120)
  .regex(slugRegex, "Use lowercase letters, numbers, and hyphens only");

export const contentStatusSchema = z.enum(["draft", "published"]);

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------
export const projectSchema = z.object({
  title: z.string().min(1, "Title is required").max(160),
  slug: slugSchema,
  summary: z.string().max(280).optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  cover_image_url: z.string().url().optional().or(z.literal("")),
  tech_stack: z.array(z.string().min(1)).default([]),
  project_url: z.string().url().optional().or(z.literal("")),
  repo_url: z.string().url().optional().or(z.literal("")),
  is_featured: z.boolean().default(false),
  status: contentStatusSchema.default("draft"),
  sort_order: z.coerce.number().int().default(0),
});
export type ProjectInput = z.input<typeof projectSchema>;

// ---------------------------------------------------------------------------
// Blog posts
// ---------------------------------------------------------------------------
export const blogPostSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: slugSchema,
  excerpt: z.string().max(300).optional().or(z.literal("")),
  content: z.string().optional().or(z.literal("")),
  cover_image_url: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string().min(1)).default([]),
  meta_title: z.string().max(160).optional().or(z.literal("")),
  meta_description: z.string().max(300).optional().or(z.literal("")),
  status: contentStatusSchema.default("draft"),
});
export type BlogPostInput = z.input<typeof blogPostSchema>;

// ---------------------------------------------------------------------------
// Testimonials
// ---------------------------------------------------------------------------
export const testimonialSchema = z.object({
  author_name: z.string().min(1, "Name is required").max(120),
  author_role: z.string().max(120).optional().or(z.literal("")),
  author_company: z.string().max(120).optional().or(z.literal("")),
  avatar_url: z.string().url().optional().or(z.literal("")),
  quote: z.string().min(1, "Quote is required").max(600),
  sort_order: z.coerce.number().int().default(0),
  is_published: z.boolean().default(true),
});
export type TestimonialInput = z.input<typeof testimonialSchema>;

// ---------------------------------------------------------------------------
// Skills
// ---------------------------------------------------------------------------
export const skillSchema = z.object({
  name: z.string().min(1, "Name is required").max(80),
  category: z.string().min(1, "Category is required").max(80),
  proficiency: z.coerce.number().int().min(1).max(100).optional(),
  sort_order: z.coerce.number().int().default(0),
});
export type SkillInput = z.input<typeof skillSchema>;

// ---------------------------------------------------------------------------
// Resume entries
// ---------------------------------------------------------------------------
export const resumeEntrySchema = z.object({
  title: z.string().min(1, "Title is required").max(160),
  organization: z.string().max(160).optional().or(z.literal("")),
  entry_type: z.enum(["experience", "education"]).default("experience"),
  start_date: z.string().optional().or(z.literal("")),
  end_date: z.string().optional().or(z.literal("")),
  is_current: z.boolean().default(false),
  description: z.string().optional().or(z.literal("")),
  sort_order: z.coerce.number().int().default(0),
});
export type ResumeEntryInput = z.input<typeof resumeEntrySchema>;

// ---------------------------------------------------------------------------
// Site settings
// ---------------------------------------------------------------------------
export const siteSettingsSchema = z.object({
  hero_tagline: z.string().max(200).optional().or(z.literal("")),
  hero_subheading: z.string().max(400).optional().or(z.literal("")),
  about_bio: z.string().optional().or(z.literal("")),
  resume_summary: z.string().max(600).optional().or(z.literal("")),
  location: z.string().max(120).optional().or(z.literal("")),
  avatar_url: z.string().url().optional().or(z.literal("")),
  contact_email: z.string().email().optional().or(z.literal("")),
  maintenance_mode: z.boolean().default(false),
  social_github: z.string().url().optional().or(z.literal("")),
  social_linkedin: z.string().url().optional().or(z.literal("")),
  social_twitter: z.string().url().optional().or(z.literal("")),
  social_upwork: z.string().url().optional().or(z.literal("")),
});
export type SiteSettingsInput = z.input<typeof siteSettingsSchema>;

// ---------------------------------------------------------------------------
// Contact form (public) — honeypot field must stay empty
// ---------------------------------------------------------------------------
export const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(120),
  email: z.string().email("Enter a valid email"),
  subject: z.string().max(160).optional().or(z.literal("")),
  message: z.string().min(10, "Message must be at least 10 characters").max(4000),
  company: z.string().max(0, "").optional().or(z.literal("")), // honeypot
});
export type ContactFormInput = z.infer<typeof contactFormSchema>;

// ---------------------------------------------------------------------------
// Auth
// ---------------------------------------------------------------------------
export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type LoginInput = z.infer<typeof loginSchema>;
