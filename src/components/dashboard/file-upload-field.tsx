"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, X, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { uploadToBucket, type StorageBucket } from "@/lib/supabase/storage";

export function FileUploadField({
  bucket,
  value,
  onChange,
  kind = "image",
}: {
  bucket: StorageBucket;
  value?: string;
  onChange: (url: string) => void;
  kind?: "image" | "pdf";
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File) {
    setUploading(true);
    const result = await uploadToBucket(bucket, file);
    setUploading(false);
    if ("error" in result) {
      toast.error(result.error);
      return;
    }
    onChange(result.url);
  }

  return (
    <div className="flex flex-col gap-3">
      {value && kind === "image" ? (
        <div className="relative aspect-video w-full max-w-xs overflow-hidden rounded-lg border border-border/60 bg-muted">
          <Image src={value} alt="Uploaded preview" fill className="object-cover" />
          <Button
            type="button"
            size="icon-sm"
            variant="destructive"
            className="absolute top-2 right-2"
            onClick={() => onChange("")}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      ) : null}

      {value && kind === "pdf" ? (
        <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted px-3 py-2 text-sm">
          <FileText className="size-4 text-cerulean" />
          <a href={value} target="_blank" rel="noreferrer noopener" className="truncate hover:underline">
            {value}
          </a>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            className="ml-auto"
            onClick={() => onChange("")}
          >
            <X className="size-3.5" />
          </Button>
        </div>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept={kind === "pdf" ? "application/pdf" : "image/*"}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
      >
        {uploading ? <Loader2 className="size-3.5 animate-spin" /> : <Upload className="size-3.5" />}
        {value ? "Replace" : "Upload"} {kind === "pdf" ? "PDF" : "image"}
      </Button>
    </div>
  );
}
