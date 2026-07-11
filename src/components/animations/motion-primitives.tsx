"use client";

import * as React from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import {
  fadeIn,
  fadeUp,
  fadeUpScale,
  slideIn,
  staggerContainer,
  viewOnce,
  buttonHover,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

type MotionDivProps = HTMLMotionProps<"div"> & { children?: React.ReactNode };

function Plain({ className, children }: { className?: string; children?: React.ReactNode }) {
  return <div className={className}>{children}</div>;
}

/** Fades content in once it scrolls into view. */
export function FadeIn({ className, children, ...props }: MotionDivProps) {
  const reduce = useReducedMotion();
  if (reduce) return <Plain className={className}>{children}</Plain>;
  return (
    <motion.div className={className} variants={fadeIn} {...viewOnce} {...props}>
      {children}
    </motion.div>
  );
}

/** Fades + lifts content in on scroll (primary entrance). */
export function FadeUp({ className, children, ...props }: MotionDivProps) {
  const reduce = useReducedMotion();
  if (reduce) return <Plain className={className}>{children}</Plain>;
  return (
    <motion.div className={className} variants={fadeUp} {...viewOnce} {...props}>
      {children}
    </motion.div>
  );
}

/** Fades + scales content in on scroll. */
export function ScaleIn({ className, children, ...props }: MotionDivProps) {
  const reduce = useReducedMotion();
  if (reduce) return <Plain className={className}>{children}</Plain>;
  return (
    <motion.div className={className} variants={fadeUpScale} {...viewOnce} {...props}>
      {children}
    </motion.div>
  );
}

/** Slides content in from a direction on scroll. */
export function SlideIn({
  direction = "up",
  className,
  children,
  ...props
}: MotionDivProps & { direction?: "left" | "right" | "up" | "down" }) {
  const reduce = useReducedMotion();
  if (reduce) return <Plain className={className}>{children}</Plain>;
  return (
    <motion.div className={className} custom={direction} variants={slideIn} {...viewOnce} {...props}>
      {children}
    </motion.div>
  );
}

/** Container that staggers the entrance of its <StaggerItem> children. */
export function Stagger({ className, children, ...props }: MotionDivProps) {
  const reduce = useReducedMotion();
  if (reduce) return <Plain className={className}>{children}</Plain>;
  return (
    <motion.div className={className} variants={staggerContainer} {...viewOnce} {...props}>
      {children}
    </motion.div>
  );
}

/** Single staggered child (use inside <Stagger>). */
export function StaggerItem({ className, children, ...props }: MotionDivProps) {
  return (
    <motion.div className={className} variants={fadeUp} {...props}>
      {children}
    </motion.div>
  );
}

/** Wraps content with a subtle hover lift (cards, icons). */
export function HoverLift({ className, children, ...props }: MotionDivProps) {
  const reduce = useReducedMotion();
  if (reduce) return <Plain className={cn(className)}>{children}</Plain>;
  return (
    <motion.div className={className} whileHover={{ y: -4 }} transition={buttonHover.transition} {...props}>
      {children}
    </motion.div>
  );
}
