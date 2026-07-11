import * as React from "react";
import { cn } from "@/lib/utils";

export interface CtaBannerProps {
  title: string;
  description?: string;
  /** Typically a <Button asChild> element. */
  action?: React.ReactNode;
  className?: string;
}

/** Prominent, reusable call-to-action band (admissions, enquiries). */
export function CtaBanner({ title, description, action, className }: CtaBannerProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-start gap-6 rounded-2xl bg-primary px-8 py-10 text-primary-foreground shadow-md sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div>
        <h2 className="font-heading text-heading-lg font-semibold">{title}</h2>
        {description ? <p className="mt-2 max-w-xl text-body text-primary-foreground/85">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
