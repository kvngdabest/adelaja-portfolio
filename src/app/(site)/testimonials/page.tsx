import type { Metadata } from "next";
import { Container } from "@/components/site/container";
import { SectionHeading } from "@/components/site/section-heading";
import { Reveal } from "@/components/site/reveal";
import { TestimonialCard } from "@/components/site/testimonial-card";
import { getPublishedTestimonials } from "@/lib/data/public";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Testimonials",
  description: "What clients and collaborators say about working with Adelaja Obanijesu Israel.",
};

export default async function TestimonialsPage() {
  const testimonials = await getPublishedTestimonials();

  return (
    <section className="py-24">
      <Container className="flex flex-col gap-12">
        <Reveal immediate>
          <SectionHeading
            eyebrow="Kind words"
            title="Testimonials"
            description="Feedback from clients and collaborators I've worked with."
          />
        </Reveal>

        {testimonials.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t, i) => (
              <Reveal key={t.id} delay={(i % 3) * 0.08}>
                <TestimonialCard testimonial={t} />
              </Reveal>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No testimonials yet.</p>
        )}
      </Container>
    </section>
  );
}
