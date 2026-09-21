/**
 * Hand-written to match supabase/migrations/0001_init_schema.sql.
 * Once the project is linked to a live Supabase project, regenerate with:
 *   npx supabase gen types typescript --project-id <ref> > src/types/database.types.ts
 */

export type ContentStatus = "draft" | "published";
export type ResumeEntryType = "experience" | "education";

export interface Database {
  public: {
    Tables: {
      admin_settings: {
        Row: {
          id: string;
          hero_tagline: string | null;
          hero_subheading: string | null;
          about_bio: string | null;
          resume_summary: string | null;
          location: string | null;
          avatar_url: string | null;
          social_links: Record<string, string>;
          seo_defaults: { title?: string; description?: string };
          resume_url: string | null;
          contact_email: string | null;
          maintenance_mode: boolean;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["admin_settings"]["Row"]>;
        Update: Partial<Database["public"]["Tables"]["admin_settings"]["Row"]>;
        Relationships: [];
      };
      projects: {
        Row: {
          id: string;
          title: string;
          slug: string;
          summary: string | null;
          description: string | null;
          cover_image_url: string | null;
          video_url: string | null;
          tech_stack: string[];
          project_url: string | null;
          repo_url: string | null;
          is_featured: boolean;
          status: ContentStatus;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["projects"]["Row"]> & {
          title: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["projects"]["Row"]>;
        Relationships: [];
      };
      blog_posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          excerpt: string | null;
          content: string | null;
          cover_image_url: string | null;
          tags: string[];
          meta_title: string | null;
          meta_description: string | null;
          status: ContentStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["blog_posts"]["Row"]> & {
          title: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["blog_posts"]["Row"]>;
        Relationships: [];
      };
      testimonials: {
        Row: {
          id: string;
          author_name: string;
          author_role: string | null;
          author_company: string | null;
          avatar_url: string | null;
          quote: string;
          sort_order: number;
          is_published: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["testimonials"]["Row"]> & {
          author_name: string;
          quote: string;
        };
        Update: Partial<Database["public"]["Tables"]["testimonials"]["Row"]>;
        Relationships: [];
      };
      skills: {
        Row: {
          id: string;
          name: string;
          category: string;
          proficiency: number | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["skills"]["Row"]> & {
          name: string;
          category: string;
        };
        Update: Partial<Database["public"]["Tables"]["skills"]["Row"]>;
        Relationships: [];
      };
      resume_entries: {
        Row: {
          id: string;
          title: string;
          organization: string | null;
          entry_type: ResumeEntryType;
          start_date: string | null;
          end_date: string | null;
          is_current: boolean;
          description: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["resume_entries"]["Row"]> & {
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["resume_entries"]["Row"]>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          subject: string | null;
          message: string;
          is_read: boolean;
          is_archived: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["messages"]["Row"]> & {
          name: string;
          email: string;
          message: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Project = Database["public"]["Tables"]["projects"]["Row"];
export type BlogPost = Database["public"]["Tables"]["blog_posts"]["Row"];
export type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];
export type Skill = Database["public"]["Tables"]["skills"]["Row"];
export type ResumeEntry = Database["public"]["Tables"]["resume_entries"]["Row"];
export type Message = Database["public"]["Tables"]["messages"]["Row"];
export type AdminSettings = Database["public"]["Tables"]["admin_settings"]["Row"];
