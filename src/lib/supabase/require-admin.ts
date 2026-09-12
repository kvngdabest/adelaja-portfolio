import { createClient } from "@/lib/supabase/server";

/**
 * Every dashboard Server Action is a POST endpoint reachable by anyone who
 * can send the request, regardless of whether they went through the UI
 * (the /dashboard pages only gate rendering, not the actions themselves).
 * RLS also enforces this at the database layer, but checking here first
 * avoids leaking raw Postgres errors and fails fast with a clear message.
 */
export async function requireAdmin() {
  const supabase = await createClient();
  if (!supabase) {
    return null;
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return supabase;
}
