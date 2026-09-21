import type { Metadata } from "next";
import { format } from "date-fns";
import { Download, Mail, MapPin } from "lucide-react";
import { Container } from "@/components/site/container";
import { Reveal } from "@/components/site/reveal";
import { ProfileCard } from "@/components/site/profile-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getResumeEntries,
  getSiteSettings,
  getSkillsByCategory,
} from "@/lib/data/public";
import type { ResumeEntry } from "@/types/database.types";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Resume",
  description: "Experience, skills, and background — download the full resume or browse the CV below.",
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

/** Description fields are written as one achievement per line in the
 * dashboard — render as bullets when there's more than one line, otherwise
 * as a plain paragraph so a short one-liner doesn't get a lone bullet. */
function EntryDescription({ description }: { description: string }) {
  const lines = description.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length <= 1) {
    return <p className="mt-1.5 text-sm text-pretty text-foreground/80">{lines[0] ?? description}</p>;
  }
  return (
    <ul className="mt-1.5 flex flex-col gap-1 text-sm text-foreground/80">
      {lines.map((line, i) => (
        <li key={i} className="flex gap-2">
          <span className="mt-2 size-1 shrink-0 rounded-full bg-cerulean/70" />
          <span className="text-pretty">{line}</span>
        </li>
      ))}
    </ul>
  );
}

function Timeline({ title, entries }: { title: string; entries: ResumeEntry[] }) {
  if (entries.length === 0) return null;
  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <h3 className="font-heading text-lg font-semibold text-cerulean print:text-black">{title}</h3>
      <ol className="flex flex-col gap-8 border-l border-border/60 pl-6 print:border-l-2 print:border-black/20">
        {entries.map((entry) => (
          <li key={entry.id} className="relative">
            <span className="absolute top-1.5 -left-[27px] size-2.5 rounded-full bg-cerulean print:bg-black" />
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                <h4 className="font-medium">{entry.title}</h4>
                <span className="font-mono text-xs text-muted-foreground">
                  {formatRange(entry)}
                </span>
              </div>
              {entry.organization ? (
                <span className="text-sm text-muted-foreground">{entry.organization}</span>
              ) : null}
              {entry.description ? <EntryDescription description={entry.description} /> : null}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export default async function ResumePage() {
  const [entries, settings, skillsByCategory] = await Promise.all([
    getResumeEntries(),
    getSiteSettings(),
    getSkillsByCategory(),
  ]);
  const experience = entries.filter((e) => e.entry_type === "experience");
  const education = entries.filter((e) => e.entry_type === "education");
  const categories = Object.keys(skillsByCategory);

  return (
    <section className="py-24 print:py-8">
      <Container className="flex flex-col gap-14 print:max-w-none print:gap-8 print:text-black">
        {/* CV header */}
        <Reveal immediate>
          <div className="grid items-center gap-12 border-b border-border/60 pb-12 lg:grid-cols-[minmax(0,1fr)_300px] print:block print:border-black/20">
          <div className="flex flex-col gap-6">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs tracking-[0.2em] text-cerulean uppercase print:text-black">
                  Resume
                </span>
                <h1 className="font-heading text-3xl font-semibold text-balance sm:text-4xl">
                  Adelaja Obanijesu Israel
                </h1>
                {settings?.hero_tagline ? (
                  <p className="max-w-xl text-pretty text-muted-foreground print:text-black/70">
                    {settings.hero_tagline}
                  </p>
                ) : null}
                <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-1 text-sm text-muted-foreground print:text-black/70">
                  {settings?.contact_email ? (
                    <a
                      href={`mailto:${settings.contact_email}`}
                      className="inline-flex items-center gap-1.5 hover:text-foreground print:text-black"
                    >
                      <Mail className="size-3.5 text-cerulean print:hidden" />
                      {settings.contact_email}
                    </a>
                  ) : null}
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-cerulean print:hidden" />
                    {settings?.location ?? "Lagos, Nigeria"}
                  </span>
                </div>
              </div>
              {settings?.resume_url ? (
                <Button asChild className="glow-cerulean-hover print:hidden">
                  <a href={settings.resume_url} target="_blank" rel="noreferrer noopener" download>
                    <Download className="size-4" /> Download PDF
                  </a>
                </Button>
              ) : null}
            </div>

            {settings?.resume_summary ? (
              <p className="max-w-3xl text-pretty leading-relaxed text-foreground/90">
                {settings.resume_summary}
              </p>
            ) : null}
          </div>
          <ProfileCard
            settings={settings}
            className="mx-auto w-full max-w-[300px] print:hidden"
          />
          </div>
        </Reveal>

        {/* Core skills */}
        {categories.length > 0 ? (
          <Reveal immediate delay={0.06}>
            <div className="flex flex-col gap-4">
              <h2 className="font-heading text-lg font-semibold text-cerulean print:text-black">
                Core skills
              </h2>
              <div className="flex flex-col gap-3">
                {categories.map((category) => (
                  <div key={category} className="flex flex-wrap items-baseline gap-x-3 gap-y-2">
                    <span className="w-full text-xs font-medium text-muted-foreground uppercase tracking-wide sm:w-40 print:text-black/60">
                      {category}
                    </span>
                    <div className="flex flex-1 flex-wrap gap-1.5">
                      {skillsByCategory[category].map((skill) => (
                        <Badge
                          key={skill.id}
                          variant="secondary"
                          className="font-mono text-xs print:border print:border-black/20 print:bg-transparent print:text-black"
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        ) : null}

        {/* Experience / Education */}
        {entries.length > 0 ? (
          <div
            className={`grid gap-14 print:grid-cols-1 ${
              experience.length > 0 && education.length > 0 ? "lg:grid-cols-2" : "lg:grid-cols-1"
            }`}
          >
            <Reveal immediate delay={0.1}>
              <Timeline title="Experience" entries={experience} />
            </Reveal>
            <Reveal immediate delay={0.16}>
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
