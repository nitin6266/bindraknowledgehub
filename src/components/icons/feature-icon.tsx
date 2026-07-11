import * as React from "react";
import { IconWrapper, type IconWrapperProps } from "@/components/ui/icon-wrapper";
import { cn } from "@/lib/utils";

export interface FeatureIconProps extends Omit<IconWrapperProps, "children"> {
  /** Lucide (or any) icon component to render. */
  icon?: React.ComponentType<{ className?: string }>;
  /** Soft ring around the icon for feature emphasis. */
  ring?: boolean;
}

/** Standardized icon for feature lists/cards (brand-aligned, optional ring). */
export function FeatureIcon({ icon: Icon, ring = false, variant = "accent", className, ...props }: FeatureIconProps) {
  return (
    <IconWrapper variant={variant} className={cn(ring && "ring-1 ring-accent/30", className)} {...props}>
      {Icon ? <Icon className="size-5" /> : null}
    </IconWrapper>
  );
}
