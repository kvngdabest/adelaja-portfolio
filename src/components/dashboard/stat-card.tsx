import type { LucideIcon } from "lucide-react";

export function StatCard({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
}) {
  return (
    <div className="glass flex items-center gap-4 rounded-2xl p-6">
      <div className="flex size-11 items-center justify-center rounded-xl bg-primary/15 text-cerulean">
        <Icon className="size-5" />
      </div>
      <div className="flex flex-col">
        <span className="font-heading text-2xl font-semibold">{value}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}
