"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { FileUploadField } from "@/components/dashboard/file-upload-field";
import { TagInput } from "@/components/dashboard/tag-input";
import { MdxContent } from "@/components/site/mdx-content";
import { blogPostSchema, type BlogPostInput } from "@/lib/validations";
import { slugify } from "@/lib/slug";
import type { BlogPost } from "@/types/database.types";
import { createPost, updatePost } from "@/app/dashboard/blog/actions";

export function BlogForm({ post }: { post?: BlogPost }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<BlogPostInput>({
    resolver: zodResolver(blogPostSchema),
    defaultValues: {
      title: post?.title ?? "",
      slug: post?.slug ?? "",
      excerpt: post?.excerpt ?? "",
      content: post?.content ?? "",
      cover_image_url: post?.cover_image_url ?? "",
      tags: post?.tags ?? [],
      meta_title: post?.meta_title ?? "",
      meta_description: post?.meta_description ?? "",
      status: post?.status ?? "draft",
    },
  });

  function onSubmit(values: BlogPostInput) {
    startTransition(async () => {
      const result = post ? await updatePost(post.id, values) : await createPost(values);
      if (result.success) {
        toast.success(post ? "Post updated" : "Post created");
        router.push("/dashboard/blog");
        router.refresh();
      } else {
        toast.error(result.error ?? "Something went wrong");
      }
    });
  }

  const contentValue = form.watch("content") ?? "";

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="glass flex flex-col gap-5 rounded-2xl p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        if (!post) form.setValue("slug", slugify(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slug"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Slug</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>/blog/{field.value || "..."}</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="excerpt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Excerpt</FormLabel>
                <FormControl>
                  <Textarea rows={2} placeholder="Shown on the blog list and in search results" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cover_image_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cover image</FormLabel>
                <FormControl>
                  <FileUploadField bucket="blog-images" value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tags"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tags</FormLabel>
                <FormControl>
                  <TagInput value={field.value ?? []} onChange={field.onChange} placeholder="Type a tag and press Enter" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content (MDX)</FormLabel>
                <Tabs defaultValue="write">
                  <TabsList>
                    <TabsTrigger value="write">Write</TabsTrigger>
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                  </TabsList>
                  <TabsContent value="write">
                    <FormControl>
                      <Textarea rows={18} className="font-mono text-sm" placeholder="# Heading&#10;&#10;Write MDX here..." {...field} />
                    </FormControl>
                  </TabsContent>
                  <TabsContent value="preview">
                    <div className="min-h-[20rem] rounded-lg border border-border/60 bg-card p-4">
                      {contentValue ? (
                        <MdxContent source={contentValue} />
                      ) : (
                        <p className="text-sm text-muted-foreground">Nothing to preview yet.</p>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="meta_title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO title</FormLabel>
                  <FormControl>
                    <Input placeholder="Defaults to title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="meta_description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SEO description</FormLabel>
                  <FormControl>
                    <Input placeholder="Defaults to excerpt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="max-w-xs">
                <FormLabel>Status</FormLabel>
                <Select value={field.value ?? "draft"} onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" className="glow-cerulean-hover" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {post ? "Save changes" : "Create post"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push("/dashboard/blog")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
