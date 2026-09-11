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
import { ResumeFileCard } from "@/components/dashboard/resume-file-card";
import { getAllResumeEntries, getSettings } from "@/lib/data/admin";
import { deleteResumeEntry } from "@/app/dashboard/resume/actions";

export default async function DashboardResumePage() {
  const [entries, settings] = await Promise.all([getAllResumeEntries(), getSettings()]);

  return (
    <div className="flex flex-col gap-6">
      <ResumeFileCard url={settings?.resume_url ?? null} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{entries.length} timeline entries</p>
        <Button asChild size="sm" className="glow-cerulean-hover">
          <Link href="/dashboard/resume/new">
            <Plus className="size-4" /> New entry
          </Link>
        </Button>
      </div>

      <div className="glass overflow-hidden rounded-2xl">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="hidden sm:table-cell">Organization</TableHead>
              <TableHead className="w-24 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">
                  <Link href={`/dashboard/resume/${entry.id}`} className="hover:text-cerulean">
                    {entry.title}
                  </Link>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {entry.entry_type}
                  </Badge>
                </TableCell>
                <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">
                  {entry.organization}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/dashboard/resume/${entry.id}`}>Edit</Link>
                    </Button>
                    <DeleteButton itemLabel="entry" action={deleteResumeEntry.bind(null, entry.id)} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                  No timeline entries yet.
                </TableCell>
              </TableRow>
            ) : null}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
