import Link from "next/link";
import type { Metadata } from "next";
import { format } from "date-fns";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/site/container";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { Badge } from "@/components/ui/badge";
import { getPublishedPosts } from "@/lib/data/public";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Blog",
  description: "Notes on AI automation, n8n workflows, and full-stack engineering from Adelaja Obanijesu Israel.",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <section className="py-24">
      <Container className="flex flex-col gap-12">
        <Reveal immediate>
          <SectionHeading
            eyebrow="Writing"
            title="Blog"
            description="Notes on automation, AI agents, and building full-stack products."
          />
        </Reveal>

        {posts.length > 0 ? (
          <div className="flex flex-col divide-y divide-border/60">
            {posts.map((post, i) => (
              <Reveal key={post.id} delay={i * 0.06}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex flex-col gap-2 py-8 first:pt-0"
                >
                  <div className="flex flex-wrap items-center gap-3">
                    {post.published_at ? (
                      <time className="font-mono text-xs text-muted-foreground">
                        {format(new Date(post.published_at), "MMM d, yyyy")}
                      </time>
                    ) : null}
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="font-mono text-[0.7rem]">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h2 className="flex items-center gap-2 font-heading text-2xl font-semibold transition-colors group-hover:text-cerulean">
                    {post.title}
                    <ArrowUpRight className="size-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </h2>
                  {post.excerpt ? (
                    <p className="max-w-2xl text-muted-foreground">{post.excerpt}</p>
                  ) : null}
                </Link>
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No posts yet — check back soon.</p>
        )}
      </Container>
    </section>
  );
}
