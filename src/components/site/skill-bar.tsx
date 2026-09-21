import type { Skill } from "@/types/database.types";

export function SkillBar({ skill }: { skill: Skill }) {
  if (skill.proficiency == null) {
    return (
      <div className="flex items-center gap-2.5 text-sm font-medium">
        <span aria-hidden className="size-1.5 rounded-full bg-cerulean" />
        {skill.name}
      </div>
    );
  }

  const value = skill.proficiency;
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-medium">{skill.name}</span>
        {skill.proficiency != null ? (
          <span className="font-mono text-xs text-muted-foreground">
            {skill.proficiency}%
          </span>
        ) : null}
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-gradient-to-r from-yale-blue to-cerulean"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
