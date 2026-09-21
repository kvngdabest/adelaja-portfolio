-- ============================================================================
-- Security hardening.
--
-- Before this, every write policy (and the dashboard) trusted ANY signed-in
-- user, and public sign-ups were enabled, so anyone could register and then
-- read contact messages or rewrite the site. Access is now limited to users
-- listed in public.admins, checked by public.is_admin().
-- Also: database-level spam limits and size limits on the contact form,
-- which is reachable directly through the public API key, not just the site.
-- ============================================================================

create table if not exists public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);
-- RLS on with no policies: only the security-definer function below can read it.
alter table public.admins enable row level security;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

-- The site owner. Further admins: insert their auth user id here.
insert into public.admins (user_id)
select id from auth.users where email = 'obanijesu7@gmail.com'
on conflict do nothing;

-- ---- table policies: "any authenticated user" -> "admin" --------------------
do $$
declare
  t text;
begin
  foreach t in array array['admin_settings', 'projects', 'blog_posts', 'testimonials', 'skills', 'resume_entries'] loop
    execute format('alter policy %I on public.%I using (public.is_admin()) with check (public.is_admin())',
      t || '_admin_update', t);
    execute format('alter policy %I on public.%I using (public.is_admin())',
      t || '_admin_delete', t);
  end loop;
end $$;

alter policy "admin_settings_admin_write" on public.admin_settings with check (public.is_admin());
alter policy "projects_admin_insert" on public.projects with check (public.is_admin());
alter policy "blog_posts_admin_insert" on public.blog_posts with check (public.is_admin());
alter policy "testimonials_admin_insert" on public.testimonials with check (public.is_admin());
alter policy "skills_admin_insert" on public.skills with check (public.is_admin());
alter policy "resume_entries_admin_insert" on public.resume_entries with check (public.is_admin());

alter policy "projects_admin_read_all" on public.projects using (public.is_admin());
alter policy "blog_posts_admin_read_all" on public.blog_posts using (public.is_admin());
alter policy "testimonials_admin_read_all" on public.testimonials using (public.is_admin());

alter policy "messages_admin_read" on public.messages using (public.is_admin());
alter policy "messages_admin_update" on public.messages using (public.is_admin()) with check (public.is_admin());
alter policy "messages_admin_delete" on public.messages using (public.is_admin());

-- ---- storage: admin-only writes; listing files is admin-only too -----------
-- (Public buckets still serve files by URL without a select policy.)
alter policy "storage_admin_insert" on storage.objects
  with check (public.is_admin() and bucket_id in ('project-images', 'blog-images', 'testimonials', 'resume', 'site'));
alter policy "storage_admin_update" on storage.objects
  using (public.is_admin() and bucket_id in ('project-images', 'blog-images', 'testimonials', 'resume', 'site'))
  with check (public.is_admin() and bucket_id in ('project-images', 'blog-images', 'testimonials', 'resume', 'site'));
alter policy "storage_admin_delete" on storage.objects
  using (public.is_admin() and bucket_id in ('project-images', 'blog-images', 'testimonials', 'resume', 'site'));
alter policy "storage_public_read" on storage.objects
  using (public.is_admin() and bucket_id in ('project-images', 'blog-images', 'testimonials', 'resume', 'site'));

-- ---- contact form: size limits the API can't bypass -----------------------
alter table public.messages
  add constraint messages_name_len check (char_length(name) between 1 and 120),
  add constraint messages_email_len check (char_length(email) between 3 and 254),
  add constraint messages_subject_len check (subject is null or char_length(subject) <= 160),
  add constraint messages_message_len check (char_length(message) between 10 and 4000);

-- ---- contact form: rate limits (checked in the database, so direct API
-- calls are limited too). Error code P0001 with a recognisable message.
create or replace function public.messages_rate_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.messages where created_at > now() - interval '1 minute') >= 5 then
    raise exception 'rate_limited: too many messages right now';
  end if;
  if (select count(*) from public.messages
      where lower(email) = lower(new.email) and created_at > now() - interval '1 hour') >= 3 then
    raise exception 'rate_limited: too many messages from this address';
  end if;
  if (select count(*) from public.messages where created_at > now() - interval '1 day') >= 150 then
    raise exception 'rate_limited: daily message limit reached';
  end if;
  -- Visitors can't pre-mark their own message as read/archived.
  new.is_read := false;
  new.is_archived := false;
  return new;
end;
$$;

drop trigger if exists messages_rate_limit on public.messages;
create trigger messages_rate_limit
  before insert on public.messages
  for each row execute function public.messages_rate_limit();
