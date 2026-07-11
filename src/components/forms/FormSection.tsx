"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormSectionProps extends React.HTMLAttributes<HTMLFieldSetElement> {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

export function FormSection({
  title,
  description,
  children,
  className,
  collapsible = false,
  defaultOpen = true,
  ...props
}: FormSectionProps) {
  const [isOpen] = React.useState(defaultOpen);

  if (collapsible) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <details className={cn("group border border-border rounded-lg overflow-hidden", className)} {...(props as any)}>
        <summary className="flex items-center justify-between p-4 bg-muted/30 cursor-pointer list-none">
          <div className="flex items-center gap-3">
            <svg
              className={cn(
                "size-5 text-muted-foreground transition-transform duration-200",
                isOpen && "rotate-90",
              )}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
            <div>
              {title && <h3 className="text-heading-sm font-semibold">{title}</h3>}
              {description && <p className="text-body-sm text-muted-foreground">{description}</p>}
            </div>
          </div>
        </summary>
        <div className={cn("p-4", !isOpen && "hidden")}>{children}</div>
      </details>
    );
  }

  return (
    <fieldset className={cn("w-full", className)} {...props}>
      {(title || description) && (
        <legend className="mb-4">
          {title && <h3 className="text-heading-sm font-semibold">{title}</h3>}
          {description && <p className="text-body-sm text-muted-foreground mt-1">{description}</p>}
        </legend>
      )}
      {children}
    </fieldset>
  );
}