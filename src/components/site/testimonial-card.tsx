import { Quote } from "lucide-react";
import type { Testimonial } from "@/types/database.types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

function initials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <figure className="glass flex h-full flex-col gap-6 rounded-2xl p-6">
      <Quote className="size-6 text-cerulean/70" />
      <blockquote className="flex-1 text-pretty text-sm leading-relaxed text-foreground/90">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>
      <figcaption className="flex items-center gap-3">
        <Avatar className="size-9">
          <AvatarImage src={testimonial.avatar_url ?? undefined} alt={testimonial.author_name} />
          <AvatarFallback className="bg-accent text-xs">
            {initials(testimonial.author_name)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium">{testimonial.author_name}</span>
          <span className="text-xs text-muted-foreground">
            {[testimonial.author_role, testimonial.author_company]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </div>
      </figcaption>
    </figure>
  );
}
