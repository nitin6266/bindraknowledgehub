/**
 * Spacing Tokens — Bindra Knowledge Hub
 * -------------------------------------
 * 8pt grid system. The base unit is 8px (0.5rem); every value is a multiple
 * of 4px (half-step) or 8px (full step) so layouts stay rhythmic and
 * predictable. No component may use an arbitrary margin/padding number.
 *
 * Values are rem strings (consumable directly by Tailwind's `spacing` scale
 * and by inline styles where unavoidable).
 */

export const spacing = {
  /** 0 */
  none: "0",
  /** 2px */
  px: "0.125rem",
  /** 4px (half step) */
  xs: "0.25rem",
  /** 8px (1 step) */
  sm: "0.5rem",
  /** 12px (1.5 steps) */
  md: "0.75rem",
  /** 16px (2 steps) */
  lg: "1rem",
  /** 24px (3 steps) */
  xl: "1.5rem",
  /** 32px (4 steps) */
  "2xl": "2rem",
  /** 40px (5 steps) */
  "3xl": "2.5rem",
  /** 48px (6 steps) */
  "4xl": "3rem",
  /** 64px (8 steps) */
  "5xl": "4rem",
  /** 80px (10 steps) */
  "6xl": "5rem",
  /** 96px (12 steps) */
  "7xl": "6rem",
  /** 128px (16 steps) */
  "8xl": "8rem",
} as const;

/** Numeric 8pt scale (in rem) for programmatic use / charts. */
export const spacingScale = [0, 0.25, 0.5, 0.75, 1, 1.5, 2, 2.5, 3, 4, 5, 6, 8] as const;

export type SpacingToken = keyof typeof spacing;
