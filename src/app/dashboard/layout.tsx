import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUnreadMessageCount } from "@/lib/data/admin";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";

export const metadata = {
  robots: { index: false, follow: false },
};

// Every dashboard page shows live, per-admin data behind auth — never
// prerender it. This also fixes a subtle build-time issue: createClient()
// now checks env vars before calling cookies(), so when Supabase isn't
// configured, Next's implicit dynamic-API detection never fires and it
// tries (and fails) to statically prerender these routes at build time.
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const user = supabase ? (await supabase.auth.getUser()).data.user : null;

  // Defense in depth — proxy.ts already redirects unauthenticated requests,
  // but a Server Component should never trust that alone.
  if (!user) {
    redirect("/login");
  }

  const unreadCount = await getUnreadMessageCount();

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar unreadCount={unreadCount} />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar />
        <main className="flex-1 px-4 py-8 md:px-8">{children}</main>
      </div>
    </div>
  );
}
