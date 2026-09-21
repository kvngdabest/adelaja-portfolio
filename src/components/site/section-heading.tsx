import { cn } from "cn";
import { ScrambleText } from "@/components/site/scramble-text";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
  as: Heading = "h2",
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
  /** Use "h1" when this is a page's primary heading (there should be
   * exactly one <h1> per page) — defaults to "h2" for section headings
   * on pages that already have their own <h1> (e.g. the homepage hero). */
  as?: "h1" | "h2";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow ? (
        <span className="font-mono text-xs tracking-[0.2em] text-cerulean uppercase">
          <ScrambleText text={eyebrow} />
        </span>
      ) : null}
      <Heading className="text-3xl font-semibold text-balance sm:text-4xl">
        {title}
      </Heading>
      {description ? (
        <p className="max-w-2xl text-base text-muted-foreground text-pretty">
          {description}
        </p>
      ) : null}
    </div>
  );
}
