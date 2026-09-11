-- ============================================================================
-- Adelaja Portfolio — initial schema
-- Single-admin CMS: any authenticated user is treated as the admin (Supabase
-- Auth has exactly one account for this project — see README for setup).
-- ============================================================================

create extension if not exists "pgcrypto";

-- ----------------------------------------------------------------------------
-- updated_at helper
-- ----------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ----------------------------------------------------------------------------
-- admin_settings — single row of site-wide settings
-- ----------------------------------------------------------------------------
create table public.admin_settings (
  id uuid primary key default gen_random_uuid(),
  hero_tagline text,
  hero_subheading text,
  about_bio text,
  location text default 'Lagos, Nigeria',
  avatar_url text,
  social_links jsonb not null default '{}'::jsonb,
  seo_defaults jsonb not null default '{}'::jsonb,
  resume_url text,
  contact_email text,
  maintenance_mode boolean not null default false,
  updated_at timestamptz not null default now()
);

create trigger admin_settings_set_updated_at
  before update on public.admin_settings
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- projects
-- ----------------------------------------------------------------------------
create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  summary text,
  description text,
  cover_image_url text,
  tech_stack text[] not null default '{}',
  project_url text,
  repo_url text,
  is_featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft', 'published')),
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index projects_status_idx on public.projects (status, sort_order);
create index projects_slug_idx on public.projects (slug);

create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- blog_posts
-- ----------------------------------------------------------------------------
create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  content text, -- MDX source
  cover_image_url text,
  tags text[] not null default '{}',
  meta_title text,
  meta_description text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index blog_posts_status_idx on public.blog_posts (status, published_at desc);
create index blog_posts_slug_idx on public.blog_posts (slug);

create trigger blog_posts_set_updated_at
  before update on public.blog_posts
  for each row execute function public.set_updated_at();

-- ----------------------------------------------------------------------------
-- testimonials
-- ----------------------------------------------------------------------------
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  author_name text not null,
  author_role text,
  author_company text,
  avatar_url text,
  quote text not null,
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);

create index testimonials_published_idx on public.testimonials (is_published, sort_order);

-- ----------------------------------------------------------------------------
-- skills
-- ----------------------------------------------------------------------------
create table public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null, -- e.g. 'Automation & AI', 'Engineering'
  proficiency int check (proficiency between 1 and 100),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index skills_category_idx on public.skills (category, sort_order);

-- ----------------------------------------------------------------------------
-- resume_entries — timeline (experience/education) shown on /resume
-- ----------------------------------------------------------------------------
create table public.resume_entries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  organization text,
  entry_type text not null default 'experience' check (entry_type in ('experience', 'education')),
  start_date date,
  end_date date,
  is_current boolean not null default false,
  description text,
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create index resume_entries_sort_idx on public.resume_entries (entry_type, sort_order);

-- ----------------------------------------------------------------------------
-- messages — contact form submissions
-- ----------------------------------------------------------------------------
create table public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  is_read boolean not null default false,
  is_archived boolean not null default false,
  created_at timestamptz not null default now()
);

create index messages_created_idx on public.messages (created_at desc);
create index messages_unread_idx on public.messages (is_read, is_archived);

-- ============================================================================
-- Row Level Security
-- ============================================================================
alter table public.admin_settings enable row level security;
alter table public.projects enable row level security;
alter table public.blog_posts enable row level security;
alter table public.testimonials enable row level security;
alter table public.skills enable row level security;
alter table public.resume_entries enable row level security;
alter table public.messages enable row level security;

-- admin_settings: public can read, only authenticated admin can write
create policy "admin_settings_public_read" on public.admin_settings
  for select using (true);
create policy "admin_settings_admin_write" on public.admin_settings
  for insert to authenticated with check (true);
create policy "admin_settings_admin_update" on public.admin_settings
  for update to authenticated using (true) with check (true);
create policy "admin_settings_admin_delete" on public.admin_settings
  for delete to authenticated using (true);

-- projects: public reads published only, admin reads/writes everything
create policy "projects_public_read_published" on public.projects
  for select using (status = 'published');
create policy "projects_admin_read_all" on public.projects
  for select to authenticated using (true);
create policy "projects_admin_insert" on public.projects
  for insert to authenticated with check (true);
create policy "projects_admin_update" on public.projects
  for update to authenticated using (true) with check (true);
create policy "projects_admin_delete" on public.projects
  for delete to authenticated using (true);

-- blog_posts: public reads published only, admin reads/writes everything
create policy "blog_posts_public_read_published" on public.blog_posts
  for select using (status = 'published');
create policy "blog_posts_admin_read_all" on public.blog_posts
  for select to authenticated using (true);
create policy "blog_posts_admin_insert" on public.blog_posts
  for insert to authenticated with check (true);
create policy "blog_posts_admin_update" on public.blog_posts
  for update to authenticated using (true) with check (true);
create policy "blog_posts_admin_delete" on public.blog_posts
  for delete to authenticated using (true);

-- testimonials: public reads published only, admin reads/writes everything
create policy "testimonials_public_read_published" on public.testimonials
  for select using (is_published = true);
create policy "testimonials_admin_read_all" on public.testimonials
  for select to authenticated using (true);
create policy "testimonials_admin_insert" on public.testimonials
  for insert to authenticated with check (true);
create policy "testimonials_admin_update" on public.testimonials
  for update to authenticated using (true) with check (true);
create policy "testimonials_admin_delete" on public.testimonials
  for delete to authenticated using (true);

-- skills: fully public read (no draft state), admin-only write
create policy "skills_public_read" on public.skills
  for select using (true);
create policy "skills_admin_insert" on public.skills
  for insert to authenticated with check (true);
create policy "skills_admin_update" on public.skills
  for update to authenticated using (true) with check (true);
create policy "skills_admin_delete" on public.skills
  for delete to authenticated using (true);

-- resume_entries: fully public read, admin-only write
create policy "resume_entries_public_read" on public.resume_entries
  for select using (true);
create policy "resume_entries_admin_insert" on public.resume_entries
  for insert to authenticated with check (true);
create policy "resume_entries_admin_update" on public.resume_entries
  for update to authenticated using (true) with check (true);
create policy "resume_entries_admin_delete" on public.resume_entries
  for delete to authenticated using (true);

-- messages: anyone can submit (insert), only admin can read/update/delete
create policy "messages_public_insert" on public.messages
  for insert to anon, authenticated with check (true);
create policy "messages_admin_read" on public.messages
  for select to authenticated using (true);
create policy "messages_admin_update" on public.messages
  for update to authenticated using (true) with check (true);
create policy "messages_admin_delete" on public.messages
  for delete to authenticated using (true);

-- ============================================================================
-- Storage buckets — public read, admin-only write
-- ============================================================================
insert into storage.buckets (id, name, public)
values
  ('project-images', 'project-images', true),
  ('blog-images', 'blog-images', true),
  ('testimonials', 'testimonials', true),
  ('resume', 'resume', true),
  ('site', 'site', true)
on conflict (id) do nothing;

create policy "storage_public_read"
  on storage.objects for select
  using (bucket_id in ('project-images', 'blog-images', 'testimonials', 'resume', 'site'));

create policy "storage_admin_insert"
  on storage.objects for insert to authenticated
  with check (bucket_id in ('project-images', 'blog-images', 'testimonials', 'resume', 'site'));

create policy "storage_admin_update"
  on storage.objects for update to authenticated
  using (bucket_id in ('project-images', 'blog-images', 'testimonials', 'resume', 'site'))
  with check (bucket_id in ('project-images', 'blog-images', 'testimonials', 'resume', 'site'));

create policy "storage_admin_delete"
  on storage.objects for delete to authenticated
  using (bucket_id in ('project-images', 'blog-images', 'testimonials', 'resume', 'site'));
