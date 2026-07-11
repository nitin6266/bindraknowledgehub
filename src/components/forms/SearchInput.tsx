"use client";

import * as React from "react";
import { Controller, ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormMessage, FormLabel, FormDescription } from "./FormField";
import { cn } from "@/lib/utils";

export interface SearchInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ControllerProps<TFieldValues, TName>, "name" | "control" | "render"> {
  name: TName;
  label?: string;
  description?: string;
  placeholder?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoComplete?: string;
  onClear?: () => void;
  className?: string;
  containerClassName?: string;
}

export function SearchInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  placeholder = "Search…",
  disabled,
  readOnly,
  required,
  autoComplete = "search",
  onClear,
  className,
  containerClassName,
  ...props
}: SearchInputProps<TFieldValues, TName>) {
  return (
    <Controller
      name={name}
      {...props}
      render={({ field, fieldState }) => {
        const error = fieldState.error;
        const hasError = !!error;
        const message = hasError ? error.message : undefined;
        const value = (field.value as string) ?? "";

        return (
          <div className={cn("w-full", containerClassName)}>
            {label && <FormLabel required={required} htmlFor={field.name}>{label}</FormLabel>}
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-muted-foreground pointer-events-none"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              <Input
                {...field}
                type="search"
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                autoComplete={autoComplete}
                id={field.name}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${field.name}-error` : description ? `${field.name}-description` : undefined}
                className={cn("pl-10 pr-10", className)}
              />
              {value && onClear && (
                <button
                  type="button"
                  onClick={onClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Clear search"
                >
                  <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              )}
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