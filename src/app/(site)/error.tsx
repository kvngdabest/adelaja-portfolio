"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";
import { Container } from "@/components/site/container";
import { Button } from "@/components/ui/button";

export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="flex flex-1 items-center py-24">
      <Container className="flex flex-col items-center gap-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/10 text-destructive">
          <AlertTriangle className="size-7" />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-heading text-3xl font-semibold text-balance sm:text-4xl">
            Something went wrong
          </h1>
          <p className="max-w-md text-pretty text-muted-foreground">
            An unexpected error occurred loading this page. You can try again,
            or head back to the homepage.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button onClick={reset} size="lg" className="glow-cerulean-hover">
            <RotateCw className="size-4" /> Try again
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
