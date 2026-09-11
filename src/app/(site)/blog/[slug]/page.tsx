import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { Badge } from "@/components/ui/badge";
import { MdxContent } from "@/components/site/mdx-content";
import { getPostBySlug, getPublishedPosts } from "@/lib/data/public";

import "highlight.js/styles/github-dark.css";

export const revalidate = 300;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    openGraph: post.cover_image_url
      ? { images: [{ url: post.cover_image_url }] }
      : undefined,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  return (
    <article className="py-24">
      <Container className="flex flex-col gap-10">
        <Reveal immediate>
          <Link
            href="/blog"
            className="inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-3.5" /> All posts
          </Link>
        </Reveal>

        <Reveal immediate delay={0.06} className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {post.published_at ? (
              <time className="font-mono text-xs text-muted-foreground">
                {format(new Date(post.published_at), "MMMM d, yyyy")}
              </time>
            ) : null}
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="font-mono text-[0.7rem]">
                {tag}
              </Badge>
            ))}
          </div>
          <h1 className="max-w-2xl font-heading text-3xl font-semibold text-balance sm:text-5xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="max-w-2xl text-pretty text-lg text-muted-foreground">
              {post.excerpt}
            </p>
          ) : null}
        </Reveal>

        {post.cover_image_url ? (
          <Reveal delay={0.12}>
            <div className="glass relative aspect-video w-full overflow-hidden rounded-2xl">
              <Image
                src={post.cover_image_url}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </Reveal>
        ) : null}

        <Reveal delay={0.18}>
          {post.content ? (
            <MdxContent source={post.content} />
          ) : (
            <p className="text-muted-foreground">This post has no content yet.</p>
          )}
        </Reveal>
      </Container>
    </article>
  );
}
