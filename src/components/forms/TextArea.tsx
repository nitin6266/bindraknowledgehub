"use client";

import * as React from "react";
import { Controller, ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { FormMessage, FormLabel, FormDescription } from "./FormField";
import { cn } from "@/lib/utils";

export interface TextAreaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ControllerProps<TFieldValues, TName>, "name" | "control" | "render"> {
  name: TName;
  label?: string;
  description?: string;
  placeholder?: string;
  rows?: number;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  containerClassName?: string;
}

export function TextArea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  placeholder,
  rows = 4,
  disabled,
  readOnly,
  required,
  autoComplete,
  className,
  containerClassName,
  ...props
}: TextAreaProps<TFieldValues, TName>) {
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
            {label && <FormLabel required={required} htmlFor={field.name}>{label}</FormLabel>}
            <Textarea
              {...field}
              placeholder={placeholder}
              rows={rows}
              disabled={disabled}
              readOnly={readOnly}
              required={required}
              autoComplete={autoComplete}
              id={field.name}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${field.name}-error` : description ? `${field.name}-description` : undefined}
              className={cn(className)}
            />
            {description && !hasError && (
              <FormDescription id={`${field.name}-description`}>{description}</FormDescription>
            )}
            <FormMessage id={`${field.name}-error`} message={message} type="error" />
          </div>
        );
      }}
    />
  );
}