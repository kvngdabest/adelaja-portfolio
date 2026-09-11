import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import Image from "next/image";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import { cn } from "cn";

const components = {
  h1: (props: React.ComponentProps<"h1">) => (
    <h1 className="mt-10 mb-4 font-heading text-3xl font-semibold" {...props} />
  ),
  h2: (props: React.ComponentProps<"h2">) => (
    <h2 className="mt-10 mb-4 font-heading text-2xl font-semibold" {...props} />
  ),
  h3: (props: React.ComponentProps<"h3">) => (
    <h3 className="mt-8 mb-3 font-heading text-xl font-semibold" {...props} />
  ),
  p: (props: React.ComponentProps<"p">) => (
    <p className="mb-5 leading-relaxed text-foreground/90" {...props} />
  ),
  a: ({ href, className, ...props }: React.ComponentProps<"a">) => {
    const isInternal = href?.startsWith("/");
    if (isInternal && href) {
      return (
        <Link
          href={href}
          className={cn("text-cerulean underline underline-offset-4", className)}
          {...props}
        />
      );
    }
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        className={cn("text-cerulean underline underline-offset-4", className)}
        {...props}
      />
    );
  },
  ul: (props: React.ComponentProps<"ul">) => (
    <ul className="mb-5 ml-5 list-disc space-y-1.5 text-foreground/90" {...props} />
  ),
  ol: (props: React.ComponentProps<"ol">) => (
    <ol className="mb-5 ml-5 list-decimal space-y-1.5 text-foreground/90" {...props} />
  ),
  blockquote: (props: React.ComponentProps<"blockquote">) => (
    <blockquote
      className="mb-5 border-l-2 border-cerulean/60 pl-4 text-muted-foreground italic"
      {...props}
    />
  ),
  code: (props: React.ComponentProps<"code">) => (
    <code
      className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em]"
      {...props}
    />
  ),
  pre: (props: React.ComponentProps<"pre">) => (
    <pre
      className="mb-6 overflow-x-auto rounded-xl border border-border/60 bg-card p-4 font-mono text-sm [&_code]:bg-transparent [&_code]:p-0"
      {...props}
    />
  ),
  img: ({ src, alt }: React.ComponentProps<"img">) =>
    typeof src === "string" ? (
      <span className="mb-6 block overflow-hidden rounded-xl">
        <Image src={src} alt={alt ?? ""} width={1200} height={675} className="w-full" />
      </span>
    ) : null,
  hr: (props: React.ComponentProps<"hr">) => (
    <hr className="my-10 border-border/60" {...props} />
  ),
  table: (props: React.ComponentProps<"table">) => (
    <div className="mb-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props: React.ComponentProps<"th">) => (
    <th className="border-b border-border/60 px-3 py-2 text-left font-medium" {...props} />
  ),
  td: (props: React.ComponentProps<"td">) => (
    <td className="border-b border-border/40 px-3 py-2 text-muted-foreground" {...props} />
  ),
};

export function MdxContent({ source }: { source: string }) {
  return (
    <div className="max-w-2xl">
      <MDXRemote
        source={source}
        components={components}
        options={{
          mdxOptions: {
            remarkPlugins: [remarkGfm],
            rehypePlugins: [rehypeSlug, rehypeHighlight],
          },
        }}
      />
    </div>
  );
}
