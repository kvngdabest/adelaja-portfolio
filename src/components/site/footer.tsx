import Link from "next/link";
import { Briefcase } from "lucide-react";
import { Container } from "@/components/site/container";
import { getSiteSettings } from "@/lib/data/public";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/site/brand-icons";

const links = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

export async function Footer() {
  const settings = await getSiteSettings();
  const social = settings?.social_links ?? {};

  const socialLinks = [
    { key: "github", href: social.github, icon: GithubIcon, label: "GitHub" },
    { key: "linkedin", href: social.linkedin, icon: LinkedinIcon, label: "LinkedIn" },
    { key: "twitter", href: social.twitter, icon: XIcon, label: "Twitter" },
    { key: "upwork", href: social.upwork, icon: Briefcase, label: "Upwork" },
  ].filter((s) => Boolean(s.href));

  return (
    <footer className="mt-24 border-t border-border/60 print:hidden">
      <Container className="flex flex-col gap-8 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="font-heading text-sm font-semibold">
            Adelaja Obanijesu Israel
          </span>
          <p className="text-sm text-muted-foreground">
            {settings?.location ?? "Lagos, Nigeria"} — AI Automation Engineer & Front-End Developer
          </p>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {socialLinks.length > 0 ? (
          <div className="flex items-center gap-4">
            {socialLinks.map(({ key, href, icon: Icon, label }) => (
              <a
                key={key}
                href={href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={label}
                className="text-muted-foreground transition-colors hover:text-cerulean"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        ) : null}
      </Container>
      <Container className="pb-8 text-xs text-muted-foreground">
        © {new Date().getFullYear()} Adelaja Obanijesu Israel. All rights reserved.
      </Container>
    </footer>
  );
}
