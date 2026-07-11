"use client";

import * as React from "react";
import { useForm, UseFormProps, UseFormReturn, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { cn } from "@/lib/utils";

// Create a separate context for form methods
const FormMethodsContext = React.createContext<UseFormReturn<z.infer<z.ZodTypeAny>> | null>(null);

export interface FormProps<T extends z.ZodTypeAny>
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit" | "onError"> {
  schema: T;
  defaultValues?: UseFormProps<z.infer<T>>["defaultValues"];
  onSubmit: (values: z.infer<T>) => Promise<void> | void;
  onError?: (errors: z.ZodFormattedError<z.infer<T>>) => void;
  className?: string;
  children: React.ReactNode;
  noValidate?: boolean;
  disabled?: boolean;
}

export function Form<T extends z.ZodTypeAny>({
  schema,
  defaultValues,
  onSubmit,
  onError,
  className,
  children,
  noValidate = true,
  ...props
}: FormProps<T>) {
  const methods = useForm<z.infer<T>>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const handleSubmit = methods.handleSubmit(async (values) => {
    try {
      await onSubmit(values);
    } catch (error) {
      if (error instanceof z.ZodError) {
        methods.setError("root.serverError", { message: error.message });
      }
      onError?.(error as z.ZodFormattedError<z.infer<T>>);
    }
  });

  return (
    <FormMethodsContext.Provider value={methods}>
      <FormProvider {...methods}>
        <form
          noValidate={noValidate}
          className={cn("flex flex-col gap-6", className)}
          onSubmit={handleSubmit}
          {...props}
        >
          {children}
          {methods.formState.errors.root?.serverError && (
            <div
              role="alert"
              className="text-body-sm text-destructive flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20"
            >
              <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <path d="M12 8v4M12 16h.01" />
              </svg>
              <span>{methods.formState.errors.root.serverError.message}</span>
            </div>
          )}
        </form>
      </FormProvider>
    </FormMethodsContext.Provider>
  );
}

export function useFormContext<T extends z.ZodTypeAny = z.ZodTypeAny>(): UseFormReturn<z.infer<T>> {
  const ctx = React.useContext(FormMethodsContext);
  if (!ctx) {
    throw new Error("useFormContext must be used within a Form component");
  }
  return ctx as UseFormReturn<z.infer<T>>;
}

export { useForm, FormProvider };
export type { UseFormProps, UseFormReturn };