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
import { getAllTestimonials } from "@/lib/data/admin";
import { deleteTestimonial } from "@/app/dashboard/testimonials/actions";

export default async function DashboardTestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{testimonials.length} total</p>
        <Button asChild size="sm" className="glow-cerulean-hover">
          <Link href="/dashboard/testimonials/new">
            <Plus className="size-4" /> New testimonial
          </Link>
        </Button>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead className="hidden sm:table-cell">Quote</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {testimonials.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium">
                  <Link href={`/dashboard/testimonials/${t.id}`} className="hover:text-cerulean">
                    {t.author_name}
                  </Link>
                </TableCell>
                <TableCell className="hidden max-w-xs truncate text-xs text-muted-foreground sm:table-cell">
                  {t.quote}
                </TableCell>
                <TableCell>
                  <Badge variant={t.is_published ? "default" : "secondary"}>
                    {t.is_published ? "published" : "hidden"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/testimonials/${t.id}`}>Edit</Link>
                    </Button>
                    <DeleteButton itemLabel="testimonial" action={deleteTestimonial.bind(null, t.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {testimonials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                  No testimonials yet.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
