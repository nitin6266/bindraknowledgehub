"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { hoverLift } from "@/lib/motion";
import { cn } from "@/lib/utils";

export interface AnimatedIconContainerProps {
  children: React.ReactNode;
  className?: string;
}

/** Icon container that gently lifts on hover; honors reduced-motion. */
export function AnimatedIconContainer({ children, className }: AnimatedIconContainerProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <span className={cn("inline-flex", className)}>{children}</span>;
  }
  return (
    <motion.span whileHover={hoverLift.whileHover} transition={hoverLift.transition} className={cn("inline-flex", className)}>
      {children}
    </motion.span>
  );
}
