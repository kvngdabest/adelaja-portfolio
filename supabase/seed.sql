-- ============================================================================
-- Placeholder seed content — swap for real content via the /dashboard CMS.
-- Matches Adelaja Obanijesu Israel's real skill set (n8n, AI agents, Claude
-- API, React/Next.js, Python, Django) so the site reads correctly on day one.
-- ============================================================================

insert into public.admin_settings (hero_tagline, hero_subheading, about_bio, resume_summary, location, social_links, seo_defaults, contact_email)
values (
  'AI Automation Engineer | n8n & AI Agents | Claude API | Python',
  'I design and ship automation systems and AI agent pipelines that remove manual work from real businesses — then wrap them in full-stack products people actually use.',
  'I''m Adelaja Obanijesu Israel, an AI automation developer, full-stack web developer, and entrepreneur based in Lagos, Nigeria. My work sits at the intersection of workflow automation (n8n), AI agent engineering (Claude API and friends), and product engineering (React/Next.js, Python, Django). I care about building systems that quietly save people time, and about shipping them with the same craft I''d want in a product I use myself.',
  'AI Automation Engineer and full-stack developer with a track record of designing production n8n workflows and Claude API-powered agent pipelines that cut manual operational work for real teams, then shipping the full-stack products (React/Next.js, Python, Django) that surface them. Comfortable owning a project end to end — from architecture and API integration through to a client-facing dashboard.',
  'Lagos, Nigeria',
  '{"github": "https://github.com/", "linkedin": "https://www.linkedin.com/", "twitter": "https://twitter.com/", "upwork": "https://www.upwork.com/"}'::jsonb,
  '{"title": "Adelaja Obanijesu Israel — AI Automation & Full-Stack Developer", "description": "AI Automation Engineer building n8n workflows, AI agents, and full-stack products with React/Next.js, Python, and Django."}'::jsonb,
  'hello@example.com'
);

insert into public.skills (name, category, proficiency, sort_order) values
  ('n8n Workflow Automation', 'Automation & AI', 95, 1),
  ('AI Agent Engineering', 'Automation & AI', 90, 2),
  ('Claude API', 'Automation & AI', 90, 3),
  ('Prompt Engineering', 'Automation & AI', 88, 4),
  ('API Integrations', 'Automation & AI', 92, 5),
  ('React / Next.js', 'Engineering', 92, 1),
  ('TypeScript', 'Engineering', 88, 2),
  ('Python', 'Engineering', 90, 3),
  ('Django', 'Engineering', 82, 4),
  ('PostgreSQL / Supabase', 'Engineering', 85, 5),
  ('REST & Webhook APIs', 'Engineering', 90, 6);

insert into public.projects (title, slug, summary, description, tech_stack, project_url, repo_url, is_featured, status, sort_order) values
  (
    'AI Support Triage Agent',
    'ai-support-triage-agent',
    'An n8n + Claude API pipeline that classifies, prioritizes, and drafts responses for inbound support tickets.',
    'Built an end-to-end automation that ingests support emails, uses the Claude API to classify intent and urgency, drafts a first-pass reply, and routes edge cases to a human. Reduced first-response time significantly for a small support team without adding headcount.',
    array['n8n', 'Claude API', 'PostgreSQL', 'Webhooks'],
    null,
    null,
    true,
    'published',
    1
  ),
  (
    'Lead Enrichment & Outreach Pipeline',
    'lead-enrichment-outreach-pipeline',
    'Automated pipeline that enriches inbound leads and triggers personalized outreach sequences.',
    'Designed an n8n workflow that enriches new leads from form submissions with public data, scores them, and hands off qualified leads to a personalized outreach sequence — cutting manual research time to near zero.',
    array['n8n', 'Python', 'REST APIs'],
    null,
    null,
    true,
    'published',
    2
  ),
  (
    'Portfolio & Client Dashboard Platform',
    'portfolio-client-dashboard-platform',
    'A Next.js + Supabase product template for freelancers to showcase work and manage client-facing dashboards.',
    'A full-stack Next.js and Supabase application with authenticated dashboards, row-level security, and a content model that lets non-technical users manage their own site content.',
    array['Next.js', 'Supabase', 'TypeScript', 'Tailwind CSS'],
    null,
    null,
    false,
    'published',
    3
  );

insert into public.blog_posts (title, slug, excerpt, content, tags, meta_title, meta_description, status, published_at) values
  (
    'Why n8n Is My Default Choice for AI Automation',
    'why-n8n-is-my-default-choice-for-ai-automation',
    'A practical look at when workflow automation tools beat hand-rolled scripts for AI-powered systems.',
    '# Why n8n Is My Default Choice for AI Automation

When I''m prototyping an AI-powered workflow, I reach for n8n before I reach for a blank Python file. Here''s why.

## Visibility over cleverness

A workflow you can see beats a script you have to read. When a pipeline breaks at 2am, a visual execution log saves you from grepping through logs.

## It plays well with LLM APIs

Native HTTP nodes plus Claude API integration means I can prototype an agent step in minutes, then harden it later.

## Where I still reach for Python

Anything with real data-processing complexity, or anything I want under proper test coverage, still gets written in Python and called from n8n as a step.',
    array['n8n', 'automation', 'ai'],
    'Why n8n Is My Default Choice for AI Automation',
    'A practical look at when workflow automation tools beat hand-rolled scripts for AI-powered systems.',
    'published',
    now()
  );

insert into public.testimonials (author_name, author_role, author_company, quote, sort_order, is_published) values
  (
    'Sarah Chen',
    'Operations Lead',
    'Northwind Logistics',
    'Adelaja automated a workflow that used to eat three hours a day of manual triage. It has run without a single issue since launch.',
    1,
    true
  ),
  (
    'Marcus Webb',
    'Founder',
    'Webb & Co',
    'Clear communicator, fast shipper, and genuinely thinks about the business problem before reaching for a tool.',
    2,
    true
  );

insert into public.resume_entries (title, organization, entry_type, start_date, end_date, is_current, description, sort_order) values
  (
    'AI Automation Developer',
    'Independent / Freelance',
    'experience',
    '2023-01-01',
    null,
    true,
    'Designed and shipped production n8n workflows and Claude API-powered agent pipelines for clients across support, sales, and operations.
Built an AI support-triage agent that classifies and drafts responses to inbound tickets, cutting first-response time without adding headcount.
Automated lead enrichment and outreach for a sales team, reducing manual research time to near zero.
Owned client relationships end to end — requirements, architecture, delivery, and ongoing support.',
    1
  ),
  (
    'Full-Stack Web Developer',
    'Independent / Freelance',
    'experience',
    '2021-01-01',
    '2023-01-01',
    false,
    'Built and shipped full-stack web applications with React, Next.js, Python, and Django for small businesses and startups.
Delivered authenticated dashboards, REST APIs, and database-backed content systems for non-technical clients to self-manage.
Worked directly with founders to scope features and ship iteratively rather than working from fixed specs.',
    2
  );

-- Add your education via /dashboard/resume — intentionally left blank rather
-- than seeded with a placeholder institution/degree, since a resume's
-- education section should never show unverified content.
