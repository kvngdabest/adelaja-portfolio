# Adelaja Obanijesu Israel — Portfolio & CMS

Personal portfolio site with a private, full-CMS admin dashboard, built with
Next.js 16 (App Router), Supabase (Postgres + Auth + Storage), and shadcn/ui.

- **Public site:** home, about, skills, projects (+ case study pages), blog
  (MDX), testimonials, resume, contact.
- **Dashboard (`/dashboard`):** single-admin CMS with full CRUD over every
  piece of public content — no code changes needed to update the site.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router, Server Components, Server Actions, Turbopack) |
| Language | TypeScript (strict) |
| Database / Auth / Storage | Supabase (Postgres + Row Level Security, email/password auth, Storage) |
| UI | shadcn/ui (Radix primitives) + Tailwind CSS v4 |
| Forms | react-hook-form + zod |
| Motion | Framer Motion (respects `prefers-reduced-motion`) |
| Blog content | MDX (rendered server-side via `next-mdx-remote/rsc`) |
| Deployment | Vercel |

**Fonts:** Audiowide (headings) + Inter (body) + JetBrains Mono
(code/labels/stats), loaded via `next/font`.

**Palette** (exact tokens, `src/app/globals.css`):
`--prussian-blue: #0a1128`, `--deep-navy: #001f54`, `--yale-blue: #034078`,
`--cerulean: #1282a2`, `--brand-white: #fefcfb`. The site is dark-mode-first
— there is no light theme toggle.

## Local setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create a Supabase project

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run the migration in order:
   - `supabase/migrations/0001_init_schema.sql` — tables, RLS policies, storage buckets.
3. Optionally seed placeholder content: run `supabase/seed.sql`.
4. Create the single admin user: **Authentication → Users → Add user** (email
   + password). This is the only account with dashboard access — RLS grants
   write access to any authenticated user, and this project intentionally has
   no public sign-up.

If you have the [Supabase CLI](https://supabase.com/docs/guides/cli) linked
to the project instead, you can run migrations locally:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

### 3. Environment variables

Copy `.env.local.example` to `.env.local` and fill in the values from your
Supabase project's **Settings → API** page:

```bash
cp .env.local.example .env.local
```

| Variable | Where to find it | Notes |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Project Settings → API | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API | Public — RLS protects data |
| `SUPABASE_SERVICE_ROLE_KEY` | Project Settings → API | **Server-only.** Not currently used by the app, kept for future admin scripts. Never expose to the client. |
| `NEXT_PUBLIC_SITE_URL` | — | Used for metadata/OG tags and the sitemap |
| `RESEND_API_KEY` / `CONTACT_NOTIFY_EMAIL` | [resend.com](https://resend.com) | Optional — contact form still saves to the DB without these, just skips the email notification |

The site is designed to degrade gracefully without these set (public pages
render empty states instead of crashing), but the dashboard requires them.

### 4. Run it

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site and
`http://localhost:3000/login` to sign in to the dashboard with the admin
account you created in step 2.

## How content maps to the dashboard

| Dashboard section | Table | Public page(s) |
|---|---|---|
| Projects | `projects` | `/projects`, `/projects/[slug]` |
| Blog | `blog_posts` | `/blog`, `/blog/[slug]` |
| Testimonials | `testimonials` | `/testimonials`, home page |
| Skills | `skills` | `/skills`, home page |
| Resume | `resume_entries` + `admin_settings.resume_url` | `/resume` |
| Messages | `messages` | Contact form submissions land here |
| Settings | `admin_settings` | Hero copy, about bio, social links, contact email, maintenance mode |

Every table has `draft`/`published` status (or `is_published`/`is_featured`
flags) so content can be prepared before it goes live. Public pages only
ever query published rows — this is enforced twice: once in the query, and
once by Row Level Security, so a bug in the query code can't leak drafts.

### Adding a new content field

Example: adding a `location` field to projects.

1. **Migration:** add a new file in `supabase/migrations/`, e.g.
   `0002_project_location.sql`, with `alter table public.projects add column location text;`. Run it in the SQL editor (or `supabase db push`).
2. **Types:** add `location: string | null` to the `projects` `Row` (and
   `Insert`) shape in `src/types/database.types.ts`.
3. **Validation:** add the field to `projectSchema` in `src/lib/validations.ts`.
4. **Dashboard form:** add a `FormField` for it in
   `src/components/dashboard/project-form.tsx`.
5. **Server action:** if it needs special handling (e.g. normalizing an
   empty string to `null`), update `src/app/dashboard/projects/actions.ts`.
6. **Public display:** use it wherever relevant, e.g.
   `src/components/site/project-card.tsx` or the project detail page.

## Auth & security model

- Single admin account, email/password, via Supabase Auth. There is no
  public sign-up flow.
- `src/proxy.ts` (Next.js 16's renamed `middleware.ts`) redirects
  unauthenticated requests to `/dashboard/*` to `/login`, and redirects a
  signed-in user away from `/login`.
- `src/app/dashboard/layout.tsx` re-checks auth server-side (defense in
  depth — proxy alone is not the security boundary).
- Every dashboard Server Action calls `requireAdmin()`
  (`src/lib/supabase/require-admin.ts`) before touching the database, because
  a Server Action is a POST endpoint reachable by anyone, not just users who
  went through the dashboard UI.
- Row Level Security is the actual enforcement boundary: every table's write
  policies require `to authenticated`, and public reads are scoped to
  published rows only. Verify this by attempting an unauthenticated write
  against the Supabase REST API and confirming it's rejected.
- Storage buckets (`project-images`, `blog-images`, `testimonials`, `resume`,
  `site`) are public-read, authenticated-write only.

## Design tokens & components

- Design tokens live in `src/app/globals.css` (`@theme` block + `:root`).
- shadcn/ui components are in `src/components/ui/` — this project uses the
  **Radix** base library explicitly (the shadcn CLI defaults to an
  experimental Base UI style; re-run `npx shadcn@latest init -b radix` if
  you add components and it tries to switch you back).
- Custom site components (nav, footer, cards, motion wrappers) are in
  `src/components/site/`; dashboard-only components are in
  `src/components/dashboard/`.
- `Reveal` (`src/components/site/reveal.tsx`) is the scroll-reveal wrapper.
  Pass `immediate` for anything visible on initial page load (hero content,
  page headings) — `whileInView` never fires for content that's already in
  the viewport on mount, so it would stay invisible.

## Deployment (Vercel)

1. Push this repo to GitHub.
2. Import it in [Vercel](https://vercel.com/new).
3. Add the environment variables from `.env.local.example` in the Vercel
   project settings (Production + Preview). Keep
   `SUPABASE_SERVICE_ROLE_KEY` server-only — never prefix it with
   `NEXT_PUBLIC_`.
4. Deploy. Vercel builds with `next build` (Turbopack) automatically.
5. Add a custom domain under Project Settings → Domains once you have one;
   until then the `*.vercel.app` URL works fine — just make sure
   `NEXT_PUBLIC_SITE_URL` matches whichever URL is live, since it feeds
   metadata, Open Graph tags, and the sitemap.

## Project structure

```
src/
  app/
    (site)/          # public pages, share Navbar/Footer + maintenance-mode gate
    dashboard/        # admin CMS, auth-gated via proxy.ts + layout.tsx
    login/             # sign-in page + auth Server Actions
    sitemap.ts, robots.ts
  components/
    site/              # public-site UI (nav, footer, cards, motion)
    dashboard/         # CMS UI (forms, tables, file upload)
    ui/                # shadcn/ui primitives
  lib/
    data/              # read-only data fetchers (public.ts = anon client, admin.ts = authed client)
    supabase/          # Supabase client factories (browser, server, public, middleware, require-admin)
    validations.ts     # zod schemas shared by forms and Server Actions
  types/database.types.ts
supabase/
  migrations/          # versioned SQL migrations
  seed.sql             # placeholder content
```

## Testing

```bash
npm test
```

Unit tests cover the zod validation schemas (`src/lib/validations.ts`) and
the slug-generation helper. There is currently no integration test suite for
Server Actions or the dashboard CRUD flows — those were verified manually
(build, lint, and a Playwright smoke pass across the public pages). Adding
Playwright coverage for the contact form and a dashboard CRUD round-trip
against a real Supabase test project would be the natural next step.
