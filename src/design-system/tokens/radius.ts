/**
 * Radius Tokens — Bindra Knowledge Hub
 * ------------------------------------
 * Centralized corner radii. The brand is warm and soft, so radii lean
 * generous (pill buttons, rounded cards) without feeling childish.
 * Values mirror the `--radius-*` CSS variables in `src/styles/tokens.css`.
 */

export const radius = {
  none: "0",
  sm: "0.5rem",
  /** Default control radius — buttons, inputs (10px). */
  md: "0.625rem",
  /** Cards (16px). */
  lg: "1rem",
  /** Dialogs (20px). */
  xl: "1.25rem",
  "2xl": "1.5rem",
  /** Fully rounded (pills, avatars). */
  full: "9999px",
} as const;

export type RadiusToken = keyof typeof radius;
