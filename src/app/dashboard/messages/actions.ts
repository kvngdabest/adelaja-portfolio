"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/supabase/require-admin";

export type ActionState = { success: boolean; error?: string };

export async function markMessageRead(id: string, isRead: boolean): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from("messages").update({ is_read: isRead }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/messages");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function archiveMessage(id: string, isArchived: boolean): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from("messages").update({ is_archived: isArchived }).eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/messages");
  revalidatePath("/dashboard");
  return { success: true };
}

export async function deleteMessage(id: string): Promise<ActionState> {
  const supabase = await requireAdmin();
  if (!supabase) return { success: false, error: "Unauthorized" };

  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) return { success: false, error: error.message };
  revalidatePath("/dashboard/messages");
  revalidatePath("/dashboard");
  return { success: true };
}
