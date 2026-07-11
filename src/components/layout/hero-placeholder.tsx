"use client";

import * as React from "react";
import { Sparkles, GraduationCap, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { IconWrapper } from "@/components/ui/icon-wrapper";

interface HeroPlaceholderProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

/**
 * Reusable hero placeholder component.
 * Shows a subtle branded illustration that can later be replaced
 * with academy photography or custom illustration.
 */
export function HeroPlaceholder({
  className,
  size = "lg",
}: HeroPlaceholderProps) {
  const sizeClasses = {
    sm: "h-64",
    md: "h-80",
    lg: "h-[500px]",
    xl: "h-[600px]",
  };

  const gridPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C9C9C' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div
      className={cn(
        "relative w-full flex items-center justify-center rounded-2xl overflow-hidden",
        "bg-gradient-to-br from-primary/5 via-background to-accent/5",
        "border border-border/50",
        sizeClasses[size],
        className,
      )}
      aria-hidden="true"
      role="img"
      aria-label="Hero illustration placeholder"
    >
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0" style={{ backgroundImage: gridPattern }} />

      {/* Center illustration */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-6 p-8">
        <IconWrapper size="lg" variant="accent" className="opacity-60">
          <Sparkles />
        </IconWrapper>

        <div className="flex items-center justify-center gap-4 text-center">
          <div className="flex flex-col items-center gap-2 opacity-50">
            <GraduationCap className="size-10" />
            <span className="text-body-sm text-muted-foreground">Academic Excellence</span>
          </div>
          <div className="flex flex-col items-center gap-2 opacity-50">
            <Users className="size-10" />
            <span className="text-body-sm text-muted-foreground">Family Values</span>
          </div>
          <div className="flex flex-col items-center gap-2 opacity-50">
            <Sparkles className="size-10" />
            <span className="text-body-sm text-muted-foreground">Personal Growth</span>
          </div>
        </div>

        {/* Placeholder text */}
        <p className="text-body-sm text-muted-foreground max-w-xs text-center opacity-70">
          Hero illustration placeholder — replace with academy photography or custom illustration
        </p>
      </div>

      {/* Decorative corner accents */}
      <div className="absolute top-6 left-6 size-24 rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute bottom-6 right-6 size-24 rounded-full bg-accent/10 blur-2xl" />
    </div>
  );
}

/**
 * Simpler inline hero placeholder for mobile-first layout
 * where image appears above content.
 */
export function HeroPlaceholderInline({
  className,
}: {
  className?: string;
}) {
  const gridPattern = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C9C9C' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

  return (
    <div
      className={cn(
        "relative w-full aspect-[4/3] max-w-md mx-auto rounded-2xl overflow-hidden",
        "bg-gradient-to-br from-primary/5 via-background to-accent/5",
        "border border-border/50",
        className,
      )}
      aria-hidden="true"
      role="img"
      aria-label="Hero illustration placeholder"
    >
      <div className="absolute inset-0" style={{ backgroundImage: gridPattern }} />

      <div className="relative z-10 flex h-full items-center justify-center p-8">
        <IconWrapper size="lg" variant="accent" className="opacity-50">
          <Sparkles />
        </IconWrapper>
      </div>

      <div className="absolute top-4 left-4 size-20 rounded-full bg-primary/10 blur-2xl" />
      <div className="absolute bottom-4 right-4 size-20 rounded-full bg-accent/10 blur-2xl" />
    </div>
  );
}