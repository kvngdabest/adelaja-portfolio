-- ============================================================================
-- Adds a dedicated CV summary field to admin_settings, distinct from the
-- narrative About-page bio — a resume summary is a tighter, achievement-
-- oriented headline meant to be skimmed by a hiring manager in seconds.
-- ============================================================================

alter table public.admin_settings
  add column if not exists resume_summary text;
