import { Container } from "@/components/site/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function SiteLoading() {
  return (
    <section className="py-24">
      <Container className="flex flex-col gap-12">
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-full max-w-xl" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="aspect-[4/3] w-full rounded-2xl" />
          ))}
        </div>
      </Container>
    </section>
  );
}
