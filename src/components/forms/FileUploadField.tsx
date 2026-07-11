"use client";

import * as React from "react";
import { Controller, ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { FileUpload } from "@/components/ui/file-upload";
import { FormLabel, FormMessage, FormDescription } from "./FormField";
import { cn } from "@/lib/utils";

export interface FileUploadFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ControllerProps<TFieldValues, TName>, "name" | "control" | "render"> {
  name: TName;
  label?: React.ReactNode;
  description?: React.ReactNode;
  accept?: string;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  _maxSize?: number; // in bytes (reserved for future use)
  className?: string;
  containerClassName?: string;
}

export function FileUploadField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  accept,
  multiple,
  disabled,
  required,
  _maxSize,
  className,
  containerClassName,
  ...props
}: FileUploadFieldProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      {...props}
      render={({ field, fieldState }) => {
        const error = fieldState.error;
        const hasError = !!error;
        const message = hasError ? error.message : undefined;

        return (
          <div className={cn("w-full", containerClassName)}>
            {label && <FormLabel required={required}>{label}</FormLabel>}
            {description && !hasError && (
              <FormDescription id={`${field.name}-description`}>{description}</FormDescription>
            )}
            <FileUpload
              accept={accept}
              multiple={multiple}
              disabled={disabled}
              id={field.name}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${field.name}-error` : description ? `${field.name}-description` : undefined}
              className={cn(className)}
              onChange={(files) => {
                field.onChange(files);
                field.onBlur();
              }}
            />
            <FormMessage id={`${field.name}-error`} message={message} type="error" />
          </div>
        );
      }}
    />
  );
}