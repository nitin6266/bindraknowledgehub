"use client";

import * as React from "react";
import { Controller, ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { Switch } from "@/components/ui/switch";
import { FormLabel, FormMessage, FormDescription } from "./FormField";
import { cn } from "@/lib/utils";

export interface SwitchFieldProps<
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

export function SwitchField<
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
}: SwitchFieldProps<TFieldValues, TName>) {
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
            {label && <FormLabel required={required} className="flex items-center gap-3 mb-2">{label}</FormLabel>}
            {description && !hasError && (
              <FormDescription id={`${field.name}-description`} className="mb-2">{description}</FormDescription>
            )}
            <Switch
              {...field}
              checked={field.value ?? false}
              onCheckedChange={field.onChange as (checked: boolean) => void}
              disabled={disabled}
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