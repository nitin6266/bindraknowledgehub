/**
 * Shadow Tokens — Bindra Knowledge Hub
 * ------------------------------------
 * Elevation scale. Soft, low-contrast shadows (warm-tinted) keep the UI
 * premium and calm. Values mirror the `--shadow-*` CSS variables.
 */

export const shadow = {
  /** Single soft shadow used across the entire system. No heavy shadows. */
  xs: "0 1px 3px rgba(0,0,0,.08)",
  sm: "0 1px 3px rgba(0,0,0,.08)",
  md: "0 1px 3px rgba(0,0,0,.08)",
  lg: "0 1px 3px rgba(0,0,0,.08)",
  xl: "0 1px 3px rgba(0,0,0,.08)",
  glow: "0 1px 3px rgba(0,0,0,.08)",
  glass: "0 1px 3px rgba(0,0,0,.08)",
} as const;

export type ShadowToken = keyof typeof shadow;
