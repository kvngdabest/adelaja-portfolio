"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FolderKanban,
  Newspaper,
  Quote,
  Sparkles,
  FileText,
  Mail,
  Settings,
  ExternalLink,
} from "lucide-react";
import { cn } from "cn";
import { Badge } from "@/components/ui/badge";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/blog", label: "Blog", icon: Newspaper },
  { href: "/dashboard/testimonials", label: "Testimonials", icon: Quote },
  { href: "/dashboard/skills", label: "Skills", icon: Sparkles },
  { href: "/dashboard/resume", label: "Resume", icon: FileText },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export function DashboardSidebar({ unreadCount }: { unreadCount: number }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
      <div className="flex h-16 items-center px-6">
        <Link href="/dashboard" className="font-heading text-sm font-semibold">
          Adelaja<span className="text-cerulean">.</span>{" "}
          <span className="text-muted-foreground">CMS</span>
        </Link>
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
                active && "bg-sidebar-accent text-sidebar-foreground"
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/dashboard/messages"
          className={cn(
            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground",
            pathname.startsWith("/dashboard/messages") &&
              "bg-sidebar-accent text-sidebar-foreground"
          )}
        >
          <Mail className="size-4" />
          Messages
          {unreadCount > 0 ? (
            <Badge className="ml-auto h-5 min-w-5 justify-center px-1 font-mono">
              {unreadCount}
            </Badge>
          ) : null}
        </Link>
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <a
          href="/"
          target="_blank"
          rel="noreferrer noopener"
          className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        >
          <ExternalLink className="size-4" />
          View site
        </a>
      </div>
    </aside>
  );
}
