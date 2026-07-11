"use client";

import * as React from "react";
import { Controller, ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { Select } from "@/components/ui/select";
import { FormMessage, FormLabel, FormDescription } from "./FormField";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ControllerProps<TFieldValues, TName>, "name" | "control" | "render"> {
  name: TName;
  label?: string;
  description?: string;
  placeholder?: string;
  options: SelectOption[];
  disabled?: boolean;
  required?: boolean;
  className?: string;
  containerClassName?: string;
}

export function SelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  placeholder,
  options,
  disabled,
  required,
  className,
  containerClassName,
  ...props
}: SelectFieldProps<TFieldValues, TName>) {
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
            <Select
              {...field}
              value={field.value as string}
              onChange={field.onChange}
              disabled={disabled}
              required={required}
              id={field.name}
              aria-invalid={hasError}
              aria-describedby={hasError ? `${field.name}-error` : description ? `${field.name}-description` : undefined}
              className={cn(className)}
            >
              {placeholder && <option value="" disabled>{placeholder}</option>}
              {options.map((option) => (
                <option key={option.value} value={option.value} disabled={option.disabled}>
                  {option.label}
                </option>
              ))}
            </Select>
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