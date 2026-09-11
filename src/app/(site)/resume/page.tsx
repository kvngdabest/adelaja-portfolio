import type { Metadata } from "next";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { Container } from "@/components/site/container";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { Button } from "@/components/ui/button";
import { getResumeEntries, getSiteSettings } from "@/lib/data/public";
import type { ResumeEntry } from "@/types/database.types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Resume",
  description: "Experience and background — download the full resume or browse the timeline.",
};

function formatRange(entry: ResumeEntry) {
  const start = entry.start_date ? format(new Date(entry.start_date), "MMM yyyy") : null;
  const end = entry.is_current
    ? "Present"
    : entry.end_date
      ? format(new Date(entry.end_date), "MMM yyyy")
      : null;
  return [start, end].filter(Boolean).join(" — ");
}

function Timeline({ title, entries }: { title: string; entries: ResumeEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <div className="flex flex-col gap-6">
      <h3 className="font-heading text-lg font-semibold text-cerulean">{title}</h3>
      <ol className="flex flex-col gap-8 border-l border-border/60 pl-6">
        {entries.map((entry) => (
          <li key={entry.id} className="relative">
            <span className="absolute top-1.5 -left-[27px] size-2.5 rounded-full bg-cerulean" />
            <div className="flex flex-col gap-1">
              <span className="font-mono text-xs text-muted-foreground">
                {formatRange(entry)}
              </span>
              <h4 className="font-medium">{entry.title}</h4>
              {entry.organization ? (
                <span className="text-sm text-muted-foreground">{entry.organization}</span>
              ) : null}
              {entry.description ? (
                <p className="mt-1 text-sm text-pretty text-foreground/80">
                  {entry.description}
                </p>
              ) : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default async function ResumePage() {
  const [entries, settings] = await Promise.all([getResumeEntries(), getSiteSettings()]);
  const experience = entries.filter((e) => e.entry_type === "experience");
  const education = entries.filter((e) => e.entry_type === "education");

  return (
    <section className="py-24">
      <Container className="flex flex-col gap-16">
        <Reveal immediate className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Background" title="Resume" />
          {settings?.resume_url ? (
            <Button asChild className="glow-cerulean-hover">
              <a href={settings.resume_url} target="_blank" rel="noreferrer noopener" download>
                <Download className="size-4" /> Download PDF
              </a>
            </Button>
          ) : null}
        </Reveal>

        {entries.length > 0 ? (
          <div className="grid gap-16 lg:grid-cols-2">
            <Reveal immediate delay={0.08}>
              <Timeline title="Experience" entries={experience} />
            </Reveal>
            <Reveal immediate delay={0.14}>
              <Timeline title="Education" entries={education} />
            </Reveal>
          </div>
        ) : (
          <p className="text-muted-foreground">Resume details coming soon.</p>
        )}
      </Container>
    </section>
  );
}
