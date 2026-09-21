const LINE = "> stack.init()  n8n · claude · crm · video · web  ...  ready";

/**
 * Terminal-style status line revealed with a stepped clip-path sweep, in pure
 * CSS so the server and client render identical HTML. Reduced-motion users
 * get the finished line via the global animation override.
 */
export function BootLine() {
  return (
    <p
      aria-hidden
      className="mx-auto mt-10 flex w-fit max-w-full items-end justify-center gap-0.5 font-mono text-[0.7rem] text-cerulean/90 sm:text-xs"
    >
      <span
        className="inline-block max-w-full text-center"
        style={{ animation: "type 2.2s steps(36) 0.9s both" }}
      >
        {LINE}
      </span>
      <span className="mb-0.5 inline-block h-3 w-1.5 shrink-0 animate-[caret-blink_1s_steps(1)_infinite] bg-cerulean" />
    </p>
  );
}
