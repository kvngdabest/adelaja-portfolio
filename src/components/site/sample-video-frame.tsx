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
      <div className="relative overflow-hidden rounded-[1.5rem]">
        <video
          src={src}
          controls
          playsInline
          preload="metadata"
          aria-label={label}
          className="aspect-[9/16] w-full bg-black object-cover"
        />
        {/* The current Seraman clip has an internal comparison label burned
         * into its top edge. Masked here until a clean export is uploaded. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[11%] bg-gradient-to-b from-black from-75% to-transparent"
        />
      </div>
    </div>
  );
}
