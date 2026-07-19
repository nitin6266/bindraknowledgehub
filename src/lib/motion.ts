import type { Variants, Transition } from "framer-motion";

/**
 * Framer Motion presets — subtle, brand-aligned motion.
 * All durations/easings reference the design tokens defined in tokens.css.
 * Components must honor `prefers-reduced-motion`; the `reduced` preset does.
 */

export const EASE_SOFT_OUT = [0, 0, 0.2, 1] as const;
export const EASE_STANDARD = [0.4, 0, 0.2, 1] as const;

export const transitions: Record<"fast" | "normal" | "slow", Transition> = {
  fast: { duration: 0.15, ease: EASE_STANDARD },
  normal: { duration: 0.3, ease: EASE_SOFT_OUT },
  slow: { duration: 0.6, ease: EASE_SOFT_OUT },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: transitions.normal },
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: transitions.normal },
};

export const fadeUpScale: Variants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: transitions.normal },
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export const viewOnce = {
  initial: "hidden",
  whileInView: "visible",
  viewport: { once: true, amount: 0.25 },
} as const;

/** Slide in from a direction (subtle, 16px travel). */
export const slideIn: Variants = {
  hidden: (dir: "left" | "right" | "up" | "down" = "up") => ({
    opacity: 0,
    x: dir === "left" ? -16 : dir === "right" ? 16 : 0,
    y: dir === "up" ? 16 : dir === "down" ? -16 : 0,
  }),
  visible: { opacity: 1, x: 0, y: 0, transition: transitions.normal },
};

/** Hover affordance — gentle lift used by buttons. */
export const buttonHover = {
  whileHover: { y: -1 },
  whileTap: { y: 0, scale: 0.98 },
  transition: transitions.fast,
};

/** Hover affordance — subtle lift for icon/feature containers. */
export const hoverLift = {
  whileHover: { y: -2 },
  transition: transitions.normal,
};

