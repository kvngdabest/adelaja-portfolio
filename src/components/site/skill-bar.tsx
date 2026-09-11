import type { Skill } from "@/types/database.types";

export function SkillBar({ skill }: { skill: Skill }) {
  const value = skill.proficiency ?? 0;
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
