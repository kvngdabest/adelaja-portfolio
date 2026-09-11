"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";
import { siteSettingsSchema, type SiteSettingsInput } from "@/lib/validations";

export type ActionState = { success: boolean; error?: string };

function revalidatePublic() {
  revalidatePath("/", "layout");
}

export async function updateSiteSettings(input: SiteSettingsInput): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { success: false, error: "Unauthorized" };

  const parsed = siteSettingsSchema.safeParse(input);
  if (!parsed.success) return { success: false, error: parsed.error.issues[0]?.message };

  const {
    social_github,
    social_linkedin,
    social_twitter,
    social_upwork,
    hero_tagline,
    hero_subheading,
    about_bio,
    location,
    avatar_url,
    contact_email,
    maintenance_mode,
  } = parsed.data;

  const social_links = Object.fromEntries(
    Object.entries({
      github: social_github,
      linkedin: social_linkedin,
      twitter: social_twitter,
      upwork: social_upwork,
    }).filter((entry): entry is [string, string] => Boolean(entry[1]))
  );

  const payload = {
    hero_tagline: hero_tagline || null,
    hero_subheading: hero_subheading || null,
    about_bio: about_bio || null,
    location: location || null,
    avatar_url: avatar_url || null,
    contact_email: contact_email || null,
    maintenance_mode,
    social_links,
  };

  const { data: existing } = await supabase.from("admin_settings").select("id").limit(1).maybeSingle();

  const { error } = existing
    ? await supabase.from("admin_settings").update(payload).eq("id", existing.id)
    : await supabase.from("admin_settings").insert(payload);

  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/settings");
  revalidatePublic();
  return { success: true };
}
