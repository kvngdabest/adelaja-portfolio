import { notFound } from "next/navigation";
import { TestimonialForm } from "@/components/dashboard/testimonial-form";
import { getTestimonialById } from "@/lib/data/admin";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await getTestimonialById(id);
  if (!testimonial) notFound();

  return (
    <div className="flex max-w-2xl flex-col gap-6">
      <TestimonialForm testimonial={testimonial} />
    </div>
  );
}
