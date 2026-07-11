"use client";

import * as React from "react";
import { Controller, ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormMessage, FormLabel, FormDescription } from "./FormField";
import { cn } from "@/lib/utils";

export interface PhoneInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ControllerProps<TFieldValues, TName>, "name" | "control" | "render"> {
  name: TName;
  label?: string;
  description?: string;
  placeholder?: string;
  countryCode?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  containerClassName?: string;
}

export function PhoneInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  placeholder = "Phone number",
  countryCode = "+91",
  disabled,
  readOnly,
  required,
  autoComplete = "tel",
  className,
  containerClassName,
  ...props
}: PhoneInputProps<TFieldValues, TName>) {
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
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-body font-medium text-foreground">
                {countryCode}
              </span>
              <Input
                {...field}
                type="tel"
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                autoComplete={autoComplete}
                id={field.name}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${field.name}-error` : description ? `${field.name}-description` : undefined}
                className={cn("pl-14", className)}
              />
            </div>
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