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
import { getAllSkills } from "@/lib/data/admin";
import { deleteSkill } from "@/app/dashboard/skills/actions";

export default async function DashboardSkillsPage() {
  const skills = await getAllSkills();

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{skills.length} total</p>
        <Button asChild size="sm" className="glow-cerulean-hover">
          <Link href="/dashboard/skills/new">
            <Plus className="size-4" /> New skill
          </Link>
        </Button>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="hidden sm:table-cell">Proficiency</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {skills.map((skill) => (
              <TableRow key={skill.id}>
                <TableCell className="font-medium">
                  <Link href={`/dashboard/skills/${skill.id}`} className="hover:text-cerulean">
                    {skill.name}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">{skill.category}</Badge>
                </TableCell>
                <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                  {skill.proficiency != null ? `${skill.proficiency}%` : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/skills/${skill.id}`}>Edit</Link>
                    </Button>
                    <DeleteButton itemLabel="skill" action={deleteSkill.bind(null, skill.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {skills.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                  No skills yet.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
