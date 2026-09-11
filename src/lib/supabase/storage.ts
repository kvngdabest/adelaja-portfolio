import { createClient } from "@/lib/supabase/client";

export type StorageBucket =
  | "project-images"
  | "blog-images"
  | "testimonials"
  | "resume"
  | "site";

const MAX_FILE_SIZE_MB = 8;

export async function uploadToBucket(
  bucket: StorageBucket,
  file: File
): Promise<{ url: string } | { error: string }> {
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return { error: `File must be under ${MAX_FILE_SIZE_MB}MB` };
  }

  const allowedTypes =
    bucket === "resume"
      ? ["application/pdf"]
      : ["image/png", "image/jpeg", "image/webp", "image/gif", "image/svg+xml"];

  if (!allowedTypes.includes(file.type)) {
    return { error: `Unsupported file type: ${file.type}` };
  }

  const supabase = createClient();
  const ext = file.name.split(".").pop();
  const path = `${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) {
    return { error: error.message };
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return { url: data.publicUrl };
}
