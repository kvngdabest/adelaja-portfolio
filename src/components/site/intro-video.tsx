import { cn } from "cn";
import { ABOUT_MEDIA } from "@/lib/content/positioning";

/** The owner's 50-second video introduction (16:9, with sound). */
export function IntroVideo({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "gradient-border rounded-2xl bg-black p-[1.5px]",
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
        className="aspect-video w-full rounded-[14px] bg-black object-cover"
      />
    </div>
  );
}
