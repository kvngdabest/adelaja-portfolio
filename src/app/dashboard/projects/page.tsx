import Link from "next/link";
import { Plus, Star } from "lucide-react";
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
import { getAllProjects } from "@/lib/data/admin";
import { deleteProject } from "@/app/dashboard/projects/actions";

export default async function DashboardProjectsPage() {
  const projects = await getAllProjects();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{projects.length} total</p>
        <Button asChild size="sm" className="glow-cerulean-hover">
          <Link href="/dashboard/projects/new">
            <Plus className="size-4" /> New project
          </Link>
        </Button>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="hidden sm:table-cell">Tech</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell className="font-medium">
                  <Link href={`/dashboard/projects/${project.id}`} className="hover:text-cerulean">
                    <span className="flex items-center gap-1.5">
                      {project.is_featured ? <Star className="size-3.5 text-cerulean" /> : null}
                      {project.title}
                    </span>
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant={project.status === "published" ? "default" : "secondary"}>
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                  {project.tech_stack.slice(0, 3).join(", ")}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/projects/${project.id}`}>Edit</Link>
                    </Button>
                    <DeleteButton
                      itemLabel="project"
                      action={deleteProject.bind(null, project.id)}
                    />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {projects.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                  No projects yet.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
