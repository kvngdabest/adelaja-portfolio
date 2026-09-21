import Image from "next/image";
import { cn } from "cn";
import type { AdminSettings } from "@/types/database.types";

/**
 * Headshot card that floats above a blurred, slowly rotating gradient light.
 * The light is decorative and dropped in print.
 */
export function ProfileCard({
  settings,
  className,
}: {
  settings: AdminSettings | null;
  className?: string;
}) {
  return (
    <div className={cn("relative isolate", className)}>
      <div
        aria-hidden
        className="profile-halo pointer-events-none absolute -inset-6 -z-10 rounded-[2.5rem] print:hidden"
      />
      <div className="profile-float glass flex flex-col gap-4 rounded-2xl p-5 print:animate-none print:border-black/20 print:bg-transparent">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
          {settings?.avatar_url ? (
            <Image
              src={settings.avatar_url}
              alt="Adelaja Obanijesu Israel"
              fill
              sizes="(min-width: 1024px) 300px, 80vw"
              className="object-cover"
              priority
            />
          ) : (
            <div className="bg-mesh flex h-full w-full items-center justify-center font-heading text-2xl text-muted-foreground">
              AOI
            </div>
          )}
        </div>
        <dl className="grid grid-cols-1 gap-3 text-sm">
          <div className="flex justify-between gap-3 border-b border-border/60 pb-2">
            <dt className="text-muted-foreground">Based in</dt>
            <dd className="text-right">{settings?.location ?? "Lagos, Nigeria"}</dd>
          </div>
          <div className="flex justify-between gap-3 border-b border-border/60 pb-2">
            <dt className="text-muted-foreground">Focus</dt>
            <dd className="text-right">AI Automation · Front-End · AI Video</dd>
          </div>
          {settings?.contact_email ? (
            <div className="flex justify-between gap-3">
              <dt className="text-muted-foreground">Email</dt>
              <dd className="min-w-0 truncate">
                <a href={`mailto:${settings.contact_email}`} className="text-cerulean hover:underline">
                  {settings.contact_email}
                </a>
              </dd>
            </div>
          ) : null}
        </dl>
      </div>
    </div>
  );
}
