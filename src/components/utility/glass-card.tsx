import * as React from "react";
import { Surface } from "@/components/layout/surface";
import { cn } from "@/lib/utils";

export type GlassCardProps = React.HTMLAttributes<HTMLDivElement>;

/** Frosted-glass surface for overlays, sticky bars and hero accents. */
export function GlassCard({ className, ...props }: GlassCardProps) {
  return <Surface tone="card" border shadow="glass" radius="xl" className={cn("backdrop-blur", className)} {...props} />;
}
