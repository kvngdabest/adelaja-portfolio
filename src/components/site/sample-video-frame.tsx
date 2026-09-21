import { cn } from "cn";

/** Phone-style frame for a portrait (9:16) sample video. */
export function SampleVideoFrame({
  src,
  label,
  className,
}: {
  src: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glow-cerulean rounded-[2rem] border border-border/70 bg-black p-2",
        className
      )}
    >
      {/* Convention: a preview frame stored beside the video as
       * "<name>-poster.jpg" (the clip itself may open on black). */}
      <video
        src={src}
        poster={src.replace(/\.mp4$/i, "-poster.jpg")}
        controls
        playsInline
        preload="metadata"
        aria-label={label}
        className="aspect-[9/16] w-full rounded-[1.5rem] bg-black object-cover"
      />
    </div>
  );
}
