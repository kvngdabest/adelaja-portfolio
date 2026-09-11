import type { MetadataRoute } from "next";
import { getPublishedPosts, getPublishedProjects } from "@/lib/data/public";

const staticRoutes = [
  "",
  "/about",
  "/skills",
  "/projects",
  "/blog",
  "/testimonials",
  "/resume",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const [projects, posts] = await Promise.all([
    getPublishedProjects(),
    getPublishedPosts(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
  }));

  const projectEntries: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${siteUrl}/projects/${p.slug}`,
    lastModified: new Date(p.updated_at),
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteUrl}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at),
  }));

  return [...staticEntries, ...projectEntries, ...postEntries];
}
