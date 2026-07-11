"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export function FormLabel({ className, required, children, ...props }: FormLabelProps) {
  return (
    <label
      className={cn(
        "block text-body-sm font-medium text-foreground mb-1.5",
        required && "after:content-['*'] after:ml-0.5 after:text-destructive",
        className,
      )}
      {...props}
    >
      {children}
    </label>
  );
}

export interface FormMessageProps {
  message?: string;
  type?: "error" | "success" | "warning" | "info";
  className?: string;
  id?: string;
}

export function FormMessage({ message, type = "error", className, id }: FormMessageProps) {
  if (!message) return null;

  const colors = {
    error: "text-destructive",
    success: "text-success",
    warning: "text-warning",
    info: "text-info",
  };

  const icons = {
    error: (
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
    success: (
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    warning: (
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <line x1="12" y1="9" x2="12" y2="13" />
        <line x1="12" y1="17" x2="12.01" y2="17" />
      </svg>
    ),
    info: (
      <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <line x1="12" y1="8" x2="12.01" y2="8" />
      </svg>
    ),
  };

  return (
    <p
      id={id}
      role="alert"
      aria-live="polite"
      className={cn(
        "flex items-start gap-2 text-body-sm mt-1.5",
        colors[type],
        className,
      )}
    >
      {icons[type]}
      <span>{message}</span>
    </p>
  );
}

export type FormDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

export function FormDescription({ className, children, ...props }: FormDescriptionProps) {
  return (
    <p
      className={cn("text-body-sm text-muted-foreground mt-1.5", className)}
      {...props}
    >
      {children}
    </p>
  );
}