import { cn } from "cn";
import { ABOUT_MEDIA } from "@/lib/content/positioning";

/** The owner's 50-second video introduction (16:9, with sound). */
export function IntroVideo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "glow-cerulean overflow-hidden rounded-2xl border border-border/70 bg-black",
        className
      )}
    >
      <video
        src={ABOUT_MEDIA.intro}
        poster={ABOUT_MEDIA.introPoster}
        controls
        playsInline
        preload="metadata"
        aria-label="Adelaja Obanijesu Israel introduces how he approaches AI automation"
        className="aspect-video w-full bg-black object-cover"
      />
    </div>
  );
}
