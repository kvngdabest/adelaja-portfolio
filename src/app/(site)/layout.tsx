import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { ScrollProgress } from "@/components/site/scroll-progress";
import { SceneBackdrop } from "@/components/site/scene-backdrop";
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
      <a
        href="#main-content"
        className="fixed top-2 left-2 z-[100] -translate-y-16 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-transform focus:translate-y-0"
      >
        Skip to content
      </a>
      <SceneBackdrop />
      <ScrollProgress />
      <Navbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer />
    </>
  );
}
