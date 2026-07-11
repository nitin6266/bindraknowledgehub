/**
 * Motion Tokens — Bindra Knowledge Hub
 * ------------------------------------
 * Calm, purposeful motion. Durations are short; easings are standard
 * material-style curves. Hover/focus are discrete, accessible transitions.
 * A `reducedMotion` flag lets code disable animation for users who request it
 * (also enforced globally via `prefers-reduced-motion` in tokens.css).
 */

export const duration = {
  instant: "0ms",
  fast: "150ms",
  normal: "300ms",
  slow: "600ms",
} as const;

export const easing = {
  /** Decelerate — entrances. */
  softOut: "cubic-bezier(0, 0, 0.2, 1)",
  /** Accelerate — exits. */
  softIn: "cubic-bezier(0.4, 0, 1, 1)",
  /** Standard in/out. */
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
} as const;

/** Composed transition strings for common interactions. */
export const hover = `transform ${duration.normal} ${easing.softOut}, box-shadow ${duration.normal} ${easing.softOut}, background-color ${duration.fast} ${easing.standard}, color ${duration.fast} ${easing.standard}`;

export const focus = `outline-color ${duration.fast} ${easing.standard}, box-shadow ${duration.fast} ${easing.standard}`;

/** When true, callers should skip non-essential animation. */
export const reducedMotion = {
  enabled: true,
  respectPrefersReducedMotion: true,
} as const;

export const motion = {
  duration,
  easing,
  hover,
  focus,
  reducedMotion,
} as const;

export type DurationToken = keyof typeof duration;
export type EasingToken = keyof typeof easing;
