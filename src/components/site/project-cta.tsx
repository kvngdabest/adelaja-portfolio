import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ProjectCta({
  title = "Have a workflow like this eating your time?",
  description = "I design and ship automations like this one — scoped to your actual bottleneck, not a generic template.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="glass glow-cerulean relative flex flex-col items-start gap-4 rounded-2xl p-8">
      <h2 className="font-heading text-xl font-semibold text-balance sm:text-2xl">
        {title}
      </h2>
      <p className="max-w-xl text-pretty text-muted-foreground">{description}</p>
      <Button asChild className="glow-cerulean-hover">
        <Link href="/contact">
          Let&apos;s talk about your workflow <ArrowRight className="size-4" />
        </Link>
      </Button>
    </div>
  );
}
