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
  FormDescription,
} from "@/components/ui/form";
import { FileUploadField } from "@/components/dashboard/file-upload-field";
import { siteSettingsSchema, type SiteSettingsInput } from "@/lib/validations";
import type { AdminSettings } from "@/types/database.types";
import { updateSiteSettings } from "@/app/dashboard/settings/actions";

export function SettingsForm({ settings }: { settings: AdminSettings | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const form = useForm<SiteSettingsInput>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      hero_tagline: settings?.hero_tagline ?? "",
      hero_subheading: settings?.hero_subheading ?? "",
      about_bio: settings?.about_bio ?? "",
      resume_summary: settings?.resume_summary ?? "",
      location: settings?.location ?? "",
      avatar_url: settings?.avatar_url ?? "",
      contact_email: settings?.contact_email ?? "",
      maintenance_mode: settings?.maintenance_mode ?? false,
      social_github: settings?.social_links?.github ?? "",
      social_linkedin: settings?.social_links?.linkedin ?? "",
      social_twitter: settings?.social_links?.twitter ?? "",
      social_upwork: settings?.social_links?.upwork ?? "",
    },
  });

  function onSubmit(values: SiteSettingsInput) {
    startTransition(async () => {
      const result = await updateSiteSettings(values);
      if (result.success) {
        toast.success("Settings saved");
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
          <h2 className="font-heading text-sm font-semibold text-cerulean">Hero & About</h2>
          <FormField
            control={form.control}
            name="hero_tagline"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero tagline</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="hero_subheading"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hero subheading</FormLabel>
                <FormControl>
                  <Textarea rows={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="about_bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>About bio</FormLabel>
                <FormControl>
                  <Textarea rows={6} placeholder="One paragraph per line" {...field} />
                </FormControl>
                <FormDescription>Shown on the /about page.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="avatar_url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Photo</FormLabel>
                <FormControl>
                  <FileUploadField bucket="site" value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="glass flex flex-col gap-5 rounded-2xl p-6">
          <h2 className="font-heading text-sm font-semibold text-cerulean">Resume / CV</h2>
          <FormField
            control={form.control}
            name="resume_summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Professional summary</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="A tight, achievement-oriented headline for the top of your CV — different from the About page story."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Shown at the top of the /resume page, above your experience timeline.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="glass flex flex-col gap-5 rounded-2xl p-6">
          <h2 className="font-heading text-sm font-semibold text-cerulean">Contact</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="contact_email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact email</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="glass flex flex-col gap-5 rounded-2xl p-6">
          <h2 className="font-heading text-sm font-semibold text-cerulean">Social links</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="social_github"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub</FormLabel>
                  <FormControl>
                    <Input placeholder="https://github.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="social_linkedin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>LinkedIn</FormLabel>
                  <FormControl>
                    <Input placeholder="https://linkedin.com/in/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="social_twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter / X</FormLabel>
                  <FormControl>
                    <Input placeholder="https://x.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="social_upwork"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upwork</FormLabel>
                  <FormControl>
                    <Input placeholder="https://upwork.com/..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="glass flex items-center justify-between rounded-2xl p-6">
          <div className="flex flex-col gap-1">
            <h2 className="font-heading text-sm font-semibold text-cerulean">Maintenance mode</h2>
            <p className="text-sm text-muted-foreground">
              Temporarily show a maintenance page to visitors.
            </p>
          </div>
          <FormField
            control={form.control}
            name="maintenance_mode"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Switch checked={field.value ?? false} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div>
          <Button type="submit" className="glow-cerulean-hover" disabled={pending}>
            {pending ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            Save settings
          </Button>
        </div>
      </form>
    </Form>
  );
}
