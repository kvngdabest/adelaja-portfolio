import Link from "next/link";
import { FolderKanban, Newspaper, Mail, ArrowUpRight } from "lucide-react";
import { StatCard } from "@/components/dashboard/stat-card";
import { getDashboardStats, getAllMessages } from "@/lib/data/admin";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardOverviewPage() {
  const [stats, messages] = await Promise.all([getDashboardStats(), getAllMessages()]);
  const recentMessages = messages.slice(0, 5);

  return (
    <div className="flex flex-col gap-8">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Published projects" value={stats.publishedProjects} icon={FolderKanban} />
        <StatCard label="Published posts" value={stats.publishedPosts} icon={Newspaper} />
        <StatCard label="Unread messages" value={stats.unreadMessages} icon={Mail} />
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold">Recent messages</h2>
          <Link
            href="/dashboard/messages"
            className="inline-flex items-center gap-1 text-sm text-cerulean hover:underline"
          >
            View all <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
        {recentMessages.length > 0 ? (
          <ul className="flex flex-col divide-y divide-border/60">
            {recentMessages.map((message) => (
              <li key={message.id} className="flex items-center justify-between gap-4 py-3">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {message.name}{" "}
                    {!message.is_read ? (
                      <span className="ml-1 inline-block size-1.5 rounded-full bg-cerulean align-middle" />
                    ) : null}
                  </span>
                  <span className="line-clamp-1 text-xs text-muted-foreground">
                    {message.message}
                  </span>
                </div>
                <span className="shrink-0 font-mono text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-muted-foreground">No messages yet.</p>
        )}
      </div>
    </div>
  );
}
