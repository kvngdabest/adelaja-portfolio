"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { loginSchema, type LoginInput } from "@/lib/validations";

export type LoginState = {
  error?: string;
};

export async function login(input: LoginInput): Promise<LoginState> {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Enter a valid email and password." };
  }

  const supabase = await createClient();
  if (!supabase) {
    return { error: "The site isn't connected to a database yet. Please try again later." };
  }

  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    return { error: "Invalid email or password." };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  if (!supabase) {
    redirect("/login");
  }
  await supabase.auth.signOut();
  redirect("/login");
}
