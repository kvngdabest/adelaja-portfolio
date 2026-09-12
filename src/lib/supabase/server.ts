import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/database.types";

/**
 * Server Component / Server Action / Route Handler client.
 * Reads the session from cookies; writes are a no-op when called from a
 * Server Component (cookies can only be mutated in a Server Action or
 * Route Handler — middleware keeps the session refreshed regardless).
 *
 * Returns null when Supabase env vars aren't configured yet, so every
 * caller (login, dashboard Server Actions, dashboard data fetchers) can
 * fail gracefully instead of crashing with a raw Supabase client error —
 * @supabase/ssr throws synchronously if the URL/key are missing.
 */
export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component — safe to ignore, middleware
          // refreshes the session on every request.
        }
      },
    },
  });
}
