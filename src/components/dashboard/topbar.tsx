"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, LogOut } from "lucide-react";
import {
  LayoutDashboard,
  FolderKanban,
  Newspaper,
  Quote,
  Sparkles,
  FileText,
  Mail,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { logout } from "@/app/login/actions";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/blog", label: "Blog", icon: Newspaper },
  { href: "/dashboard/testimonials", label: "Testimonials", icon: Quote },
  { href: "/dashboard/skills", label: "Skills", icon: Sparkles },
  { href: "/dashboard/resume", label: "Resume", icon: FileText },
  { href: "/dashboard/messages", label: "Messages", icon: Mail },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const titles: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/projects": "Projects",
  "/dashboard/blog": "Blog",
  "/dashboard/testimonials": "Testimonials",
  "/dashboard/skills": "Skills",
  "/dashboard/resume": "Resume",
  "/dashboard/messages": "Messages",
  "/dashboard/settings": "Settings",
};

export function DashboardTopbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const activeTitle =
    Object.keys(titles)
      .sort((a, b) => b.length - a.length)
      .find((key) => pathname.startsWith(key)) ?? "/dashboard";

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border/60 bg-background/80 px-4 backdrop-blur-lg md:px-8">
      <div className="flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 bg-sidebar p-0">
            <SheetHeader className="h-16 justify-center border-b border-sidebar-border px-6">
              <SheetTitle className="font-heading text-sm">
                Adelaja<span className="text-cerulean">.</span> CMS
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 p-3">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                >
                  <item.icon className="size-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
        <h1 className="font-heading text-base font-semibold">{titles[activeTitle]}</h1>
      </div>

      <form action={logout}>
        <Button variant="ghost" size="sm" type="submit">
          <LogOut className="size-4" /> Sign out
        </Button>
      </form>
    </header>
  );
}
