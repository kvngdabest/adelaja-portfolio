-- ============================================================================
-- Optional sample/demo video per project (e.g. an example output of an
-- automation pipeline), shown on the project detail page with the cover
-- image as its poster.
-- ============================================================================

alter table public.projects
  add column if not exists video_url text;
