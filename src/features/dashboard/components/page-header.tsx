"use client";

import { ReactNode } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

interface ActionConfig {
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "accent" | "cta" | "link";
  size?: "sm" | "md" | "lg";
}

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  primaryAction?: ActionConfig;
  secondaryAction?: ActionConfig;
  className?: string;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  primaryAction,
  secondaryAction,
  className,
}: PageHeaderProps) {
  const primary: ActionConfig = primaryAction ?? {
    label: "Add",
    variant: "primary",
    size: "sm",
    icon: <Plus className="h-4 w-4" aria-hidden="true" />,
  };

  const secondary: ActionConfig = secondaryAction ?? {
    label: "Export",
    variant: "outline",
    size: "sm",
    icon: <Download className="h-4 w-4" aria-hidden="true" />,
  };

  return (
    <div className={cn("space-y-4 sm:space-y-0 sm:flex sm:items-end sm:justify-between", className)}>
      <div className="space-y-1">
        {eyebrow && (
          <span className="text-caption uppercase tracking-wider text-muted-foreground">
            {eyebrow}
          </span>
        )}
        <h1 className="text-heading-lg font-semibold text-card-foreground tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-body text-muted-foreground">{description}</p>
        )}
      </div>

      <div className="mt-4 flex flex-col gap-2 sm:mt-0 sm:flex-row">
        {secondary && (
          <Button
            variant={secondary.variant ?? "outline"}
            size={secondary.size ?? "sm"}
            asChild={!!secondary.href}
            onClick={secondary.onClick}
          >
            {secondary.href ? (
              <Link href={secondary.href}>
                {secondary.icon && (
                  <span className="mr-2" aria-hidden="true">{secondary.icon}</span>
                )}
                {secondary.label}
              </Link>
            ) : (
              <>
                {secondary.icon && (
                  <span className="mr-2" aria-hidden="true">{secondary.icon}</span>
                )}
                {secondary.label}
              </>
            )}
          </Button>
        )}

        {primary && (
          <Button
            variant={primary.variant ?? "primary"}
            size={primary.size ?? "sm"}
            asChild={!!primary.href}
            onClick={primary.onClick}
          >
            {primary.href ? (
              <Link href={primary.href}>
                {primary.icon && (
                  <span className="mr-2" aria-hidden="true">{primary.icon}</span>
                )}
                {primary.label}
              </Link>
            ) : (
              <>
                {primary.icon && (
                  <span className="mr-2" aria-hidden="true">{primary.icon}</span>
                )}
                {primary.label}
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}