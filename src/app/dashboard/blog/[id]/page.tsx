import { notFound } from "next/navigation";
import { BlogForm } from "@/components/dashboard/blog-form";
import { getPostById } from "@/lib/data/admin";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div className="flex max-w-3xl flex-col gap-6">
      <BlogForm post={post} />
    </div>
  );
}
