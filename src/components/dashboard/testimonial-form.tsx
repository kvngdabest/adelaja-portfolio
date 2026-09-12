"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUploadField } from "@/components/dashboard/file-upload-field";
import { testimonialSchema, type TestimonialInput } from "@/lib/validations";
import type { Testimonial } from "@/types/database.types";
import { createTestimonial, updateTestimonial } from "@/app/dashboard/testimonials/actions";

export function TestimonialForm({ testimonial }: { testimonial?: Testimonial }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<TestimonialInput>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      author_name: testimonial?.author_name ?? "",
      author_role: testimonial?.author_role ?? "",
      author_company: testimonial?.author_company ?? "",
      avatar_url: testimonial?.avatar_url ?? "",
      quote: testimonial?.quote ?? "",
      sort_order: testimonial?.sort_order ?? 0,
      is_published: testimonial?.is_published ?? true,
    },
  });

  function onSubmit(values: TestimonialInput) {
    startTransition(async () => {
      const result = testimonial
        ? await updateTestimonial(testimonial.id, values)
        : await createTestimonial(values);
      if (result.success) {
        toast.success(testimonial ? "Testimonial updated" : "Testimonial created");
        router.push("/dashboard/testimonials");
        router.refresh();
      } else {
        toast.error(result.error ?? "Something went wrong");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} noValidate className="flex flex-col gap-8">
        <div className="glass flex flex-col gap-5 rounded-2xl p-6">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="author_name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="author_role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="author_company"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Company</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="avatar_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Avatar</FormLabel>
                <FormControl>
                  <FileUploadField bucket="testimonials" value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="quote"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quote</FormLabel>
                <FormControl>
                  <Textarea rows={4} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="sort_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort order</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} value={(field.value as number | string | undefined) ?? 0} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_published"
              render={({ field }) => (
                <FormItem className="flex flex-col justify-end gap-2">
                  <FormLabel>Published</FormLabel>
                  <FormControl>
                    <Switch checked={field.value ?? true} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" className="glow-cerulean-hover" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            {testimonial ? "Save changes" : "Create testimonial"}
          </Button>
          <Button type="button" variant="ghost" onClick={() => router.push("/dashboard/testimonials")}>
            Cancel
          </Button>
        </div>
      </form>
    </Form>
  );
}
