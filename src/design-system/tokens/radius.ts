/**
 * Radius Tokens — Bindra Knowledge Hub
 * ------------------------------------
 * Centralized corner radii. The brand is warm and soft, so radii lean
 * generous (pill buttons, rounded cards) without feeling childish.
 * Values mirror the `--radius-*` CSS variables in `src/styles/tokens.css`.
 */

export const radius = {
  none: "0",
  sm: "0.375rem",
  /** Default control radius. */
  md: "0.625rem",
  lg: "1rem",
  xl: "1.5rem",
  "2xl": "2rem",
  /** Fully rounded (pills, avatars). */
  full: "9999px",
} as const;

export type RadiusToken = keyof typeof radius;
