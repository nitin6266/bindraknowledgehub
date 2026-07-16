"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SubmitButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingText?: string;
  className?: string;
  disabled?: boolean;
  children: React.ReactNode;
  type?: "submit" | "button" | "reset";
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "cta" | "outline" | "ghost";
}

export function SubmitButton({
  loading = false,
  loadingText = "Submitting…",
  className,
  disabled,
  children,
  type = "submit",
  fullWidth = false,
  size = "md",
  variant = "cta",
  ...props
}: SubmitButtonProps) {
  // Reflect server-action pending state automatically so forms wired to
  // server actions show a spinner without manual prop passing.
  const { pending } = useFormStatus();
  const isLoading = loading || pending;

  return (
    <Button
      type={type}
      disabled={disabled || isLoading}
      loading={isLoading}
      size={size}
      variant={variant}
      className={cn(fullWidth ? "w-full sm:w-auto" : "", className)}
      {...props}
    >
      {isLoading ? loadingText : children}
    </Button>
  );
}

export interface FormActionsProps {
  children: React.ReactNode;
  className?: string;
  submitText?: string;
  submitLoadingText?: string;
  isSubmitting?: boolean;
  onSubmit: () => Promise<void> | void;
  secondaryAction?: React.ReactNode;
  secondaryActionDisabled?: boolean;
}

export function FormActions({
  children,
  className,
  submitText = "Submit",
  submitLoadingText = "Submitting…",
  isSubmitting,
  onSubmit,
  secondaryAction,
  secondaryActionDisabled,
}: FormActionsProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className={cn("flex flex-col sm:flex-row items-start gap-4 w-full", className)}>
      <div className="flex flex-col sm:flex-row gap-3 w-full">{children}</div>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        {secondaryAction && (
          <Button
            type="button"
            variant="outline"
            disabled={secondaryActionDisabled || isSubmitting}
            className="w-full sm:w-auto"
          >
            {secondaryAction}
          </Button>
        )}
        <SubmitButton loading={isSubmitting} loadingText={submitLoadingText} type="submit">
          {submitText}
        </SubmitButton>
      </div>
    </form>
  );
}