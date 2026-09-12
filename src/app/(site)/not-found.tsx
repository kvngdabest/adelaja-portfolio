import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";

export default function SiteNotFound() {
  return (
    <section className="flex flex-1 items-center py-24">
      <Container className="flex flex-col items-center gap-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl border border-border/60 bg-card/60 text-cerulean">
          <Compass className="size-7" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="font-mono text-sm text-muted-foreground">404</span>
          <h1 className="font-heading text-3xl font-semibold text-balance sm:text-4xl">
            This page doesn&apos;t exist
          </h1>
          <p className="max-w-md text-pretty text-muted-foreground">
            The page you&apos;re looking for was moved, renamed, or never existed.
          </p>
        </div>
        <Button asChild size="lg" className="glow-cerulean-hover">
          <Link href="/">
            <ArrowLeft className="size-4" /> Back to home
          </Link>
        </Button>
      </Container>
    </section>
  );
}
