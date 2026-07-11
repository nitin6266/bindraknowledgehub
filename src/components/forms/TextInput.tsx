"use client";

import * as React from "react";
import { Controller, ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { FormMessage, FormLabel, FormDescription } from "./FormField";
import { cn } from "@/lib/utils";

export interface TextInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<ControllerProps<TFieldValues, TName>, "name" | "control" | "render"> {
  name: TName;
  label?: string;
  description?: string;
  placeholder?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>["type"];
  inputSize?: "sm" | "md" | "lg";
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  containerClassName?: string;
}

export function TextInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  placeholder,
  type = "text",
  inputSize = "md",
  disabled,
  readOnly,
  required,
  autoComplete,
  className,
  containerClassName,
  ...props
}: TextInputProps<TFieldValues, TName>) {
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
            <Input
              {...field}
              type={type}
              placeholder={placeholder}
              inputSize={inputSize}
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

export interface PasswordInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<TextInputProps<TFieldValues, TName>, "type"> {
  showToggle?: boolean;
}

export function PasswordInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  placeholder,
  inputSize = "md",
  disabled,
  readOnly,
  required,
  autoComplete = "current-password",
  showToggle = true,
  className,
  containerClassName,
  ...props
}: PasswordInputProps<TFieldValues, TName>) {
  const [showPassword, setShowPassword] = React.useState(false);

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
              <Input
                {...field}
                type={showPassword ? "text" : "password"}
                placeholder={placeholder}
                inputSize={inputSize}
                disabled={disabled}
                readOnly={readOnly}
                required={required}
                autoComplete={autoComplete}
                id={field.name}
                aria-invalid={hasError}
                aria-describedby={hasError ? `${field.name}-error` : description ? `${field.name}-description` : undefined}
                className={cn(showToggle && "pr-12", className)}
              />
              {showToggle && (
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg className="size-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
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

export interface SearchInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<TextInputProps<TFieldValues, TName>, "type"> {
  onClear?: () => void;
}

export function SearchInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  placeholder = "Search…",
  inputSize = "md",
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
        const value = field.value as string;

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
                inputSize={inputSize}
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

export interface PhoneInputProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> extends Omit<TextInputProps<TFieldValues, TName>, "type"> {
  countryCode?: string;
}

export function PhoneInput<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  name,
  label,
  description,
  placeholder = "Phone number",
  inputSize = "md",
  disabled,
  readOnly,
  required,
  autoComplete = "tel",
  countryCode = "+91",
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
                inputSize={inputSize}
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