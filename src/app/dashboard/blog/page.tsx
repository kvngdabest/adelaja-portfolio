import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DeleteButton } from "@/components/dashboard/delete-button";
import { getAllPosts } from "@/lib/data/admin";
import { deletePost } from "@/app/dashboard/blog/actions";

export default async function DashboardBlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{posts.length} total</p>
        <Button asChild size="sm" className="glow-cerulean-hover">
          <Link href="/dashboard/blog/new">
            <Plus className="size-4" /> New post
          </Link>
        </Button>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Tags</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">
                  <Link href={`/dashboard/blog/${post.id}`} className="hover:text-cerulean">
                    {post.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={post.status === "published" ? "default" : "secondary"}>
                    {post.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                  {post.tags.slice(0, 3).join(", ")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/blog/${post.id}`}>Edit</Link>
                    </Button>
                    <DeleteButton itemLabel="post" action={deletePost.bind(null, post.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {posts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                  No posts yet.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
