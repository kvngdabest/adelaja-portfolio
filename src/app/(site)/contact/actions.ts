"use server";

import { createPublicClient } from "@/lib/supabase/public";
import { contactFormSchema, type ContactFormInput } from "@/lib/validations";

export type ContactFormState = {
  success: boolean;
  error?: string;
};

export async function submitContactForm(
  input: ContactFormInput
): Promise<ContactFormState> {
  const parsed = contactFormSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: "Please check the form and try again." };
  }

  const { name, email, subject, message, company } = parsed.data;

  // Honeypot — bots fill every field, humans never see this one.
  if (company) {
    return { success: true };
  }

  const supabase = createPublicClient();
  if (!supabase) {
    return {
      success: false,
      error: "The site isn't connected to a database yet. Please try again later.",
    };
  }

  const { error } = await supabase.from("messages").insert({
    name,
    email,
    subject: subject || null,
    message,
  });

  if (error) {
    console.error("[contact] failed to save message:", error);
    return { success: false, error: "Something went wrong. Please try again." };
  }

  await notifyByEmail({ name, email, subject, message }).catch((error) => {
    console.error("[contact] email notification failed:", error);
  });

  return { success: true };
}

async function notifyByEmail({
  name,
  email,
  subject,
  message,
}: {
  name: string;
  email: string;
  subject?: string;
  message: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_NOTIFY_EMAIL;
  if (!apiKey || !to) return;

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);

  await resend.emails.send({
    from: "Portfolio Contact Form <onboarding@resend.dev>",
    to,
    replyTo: email,
    subject: subject ? `New message: ${subject}` : `New portfolio message from ${name}`,
    text: `From: ${name} <${email}>\n\n${message}`,
  });
}
