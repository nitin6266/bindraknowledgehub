"use client";

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps page content in a subtle, reduced-motion-aware entrance.
 * Respects user preference via Framer Motion's useReducedMotion.
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={cn(className)}>{children}</div>;
  }

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      animate="visible"
      variants={fadeUp}
    >
      {children}
    </motion.div>
  );
}
