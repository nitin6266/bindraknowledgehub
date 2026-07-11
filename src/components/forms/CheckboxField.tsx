"use client";

import * as React from "react";
import { Controller, ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { FormMessage, FormLabel, FormDescription } from "./FormField";
import { cn } from "@/lib/utils";

export interface CheckboxFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ControllerProps<TFieldValues, TName>, "name" | "control" | "render"> {
  name: TName;
  label?: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  containerClassName?: string;
}

export function CheckboxField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  disabled,
  required,
  className,
  containerClassName,
  ...props
}: CheckboxFieldProps<TFieldValues, TName>) {
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
            <Checkbox
              {...field}
              checked={field.value ?? false}
              onChange={(e) => field.onChange(e.target.checked)}
              disabled={disabled}
              // required not supported on Checkbox
              id={field.name}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${field.name}-error` : description ? `${field.name}-description` : undefined}
              className={cn(className)}
            />
            <FormMessage id={`${field.name}-error`} message={message} type="error" />
          </div>
        );
      }}
    />
  );
}