import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUnreadMessageCount } from "@/lib/data/admin";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";

export const metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
