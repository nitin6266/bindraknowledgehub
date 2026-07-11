"use client";

import * as React from "react";
import { Controller, ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { Radio } from "@/components/ui/radio";
import { FormLabel, FormMessage, FormDescription } from "./FormField";
import { cn } from "@/lib/utils";

export interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface RadioGroupProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ControllerProps<TFieldValues, TName>, "name" | "control" | "render"> {
  name: TName;
  label?: React.ReactNode;
  description?: React.ReactNode;
  options: RadioOption[];
  disabled?: boolean;
  required?: boolean;
  orientation?: "horizontal" | "vertical";
  className?: string;
  containerClassName?: string;
}

export function RadioGroup<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  options,
  disabled,
  required,
  orientation = "vertical",
  className,
  containerClassName,
  ...props
}: RadioGroupProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      {...props}
      render={({ field, fieldState }) => {
        const error = fieldState.error;
        const hasError = !!error;
        const message = hasError ? error.message : undefined;

        return (
          <fieldset
            className={cn("w-full", containerClassName)}
            aria-invalid={hasError}
            aria-describedby={hasError ? `${field.name}-error` : description ? `${field.name}-description` : undefined}
            disabled={disabled}
          >
            {label && <FormLabel required={required} className="block mb-3">{label}</FormLabel>}
            {description && !hasError && (
              <FormDescription id={`${field.name}-description`} className="mb-3">{description}</FormDescription>
            )}
            <div
              role="radiogroup"
              aria-required={required}
              className={cn(
                "flex gap-4",
                orientation === "horizontal" ? "flex-wrap" : "flex-col",
                className,
              )}
            >
              {options.map((option) => (
                <Radio
                  key={option.value}
                  {...field}
                  value={option.value}
                  checked={field.value === option.value}
                  onChange={() => field.onChange(option.value)}
                  disabled={disabled || option.disabled}
                  // required not supported on Radio
                  id={`${field.name}-${option.value}`}
                  aria-invalid={hasError}
                  label={option.label}
                  className={cn("flex items-center gap-2")}
                />
              ))}
            </div>
            <FormMessage id={`${field.name}-error`} message={message} type="error" />
          </fieldset>
        );
      }}
    />
  );
}