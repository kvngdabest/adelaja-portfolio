import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Cookie-free Supabase client for public, unauthenticated reads.
 * Use this (not the cookie-bound server client) in public-site data
 * fetchers so those pages can be statically generated / ISR'd instead of
 * forced into per-request dynamic rendering.
 *
 * Returns null when Supabase env vars aren't configured yet (e.g. before
 * the project has been linked to a live Supabase instance) so callers can
 * degrade gracefully instead of crashing the build or the page.
 */
export function createPublicClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return createSupabaseClient<Database>(url, key, {
    auth: { persistSession: false },
  });
}
