import { cn } from "cn";

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
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
          {eyebrow}
        </span>
      ) : null}
      <h2 className="text-3xl font-semibold text-balance sm:text-4xl">
        {title}
      </h2>
      {description ? (
        <p className="max-w-2xl text-base text-muted-foreground text-pretty">
          {description}
        </p>
      ) : null}
    </div>
  );
}
