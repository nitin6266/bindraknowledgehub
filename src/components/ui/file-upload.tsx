"use client";

import * as React from "react";
import { Upload } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileUploadProps {
  id?: string;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  onChange?: (files: FileList | null) => void;
  className?: string;
  hint?: string;
}

/** Accessible file upload (hidden input + labeled dropzone button). */
export function FileUpload({
  id,
  accept,
  multiple,
  disabled,
  onChange,
  className,
  hint,
}: FileUploadProps) {
  const autoId = React.useId();
  const inputId = id ?? autoId;
  const [fileName, setFileName] = React.useState<string | null>(null);

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={inputId}
        className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/40 px-4 py-6 text-body-sm text-muted-foreground transition-colors hover:bg-muted focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-within:ring-offset-background"
      >
        <Upload aria-hidden="true" className="size-5" />
        <span>Choose file{multiple ? "s" : ""}</span>
      </label>
      <input
        id={inputId}
        type="file"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        className="sr-only"
        onChange={(e) => {
          const files = e.target.files;
          setFileName(files && files.length ? Array.from(files).map((f) => f.name).join(", ") : null);
          onChange?.(files);
        }}
      />
      {fileName ? (
        <p className="text-body-xs text-foreground" aria-live="polite">
          {fileName}
        </p>
      ) : hint ? (
        <p className="text-body-xs text-muted-foreground">{hint}</p>
      ) : null}
    </div>
  );
}
