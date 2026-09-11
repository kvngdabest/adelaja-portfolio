import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { getSiteSettings } from "@/lib/data/public";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  if (settings?.maintenance_mode) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-6 text-center">
        <div aria-hidden className="bg-grid bg-mesh pointer-events-none absolute inset-0" />
        <span className="relative z-10 font-heading text-lg font-semibold">
          Adelaja<span className="text-cerulean">.</span>
        </span>
        <h1 className="relative z-10 font-heading text-2xl font-semibold">Back shortly</h1>
        <p className="relative z-10 max-w-sm text-muted-foreground">
          The site is undergoing scheduled maintenance. Please check back soon.
        </p>
      </main>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
