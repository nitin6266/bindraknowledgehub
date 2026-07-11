/**
 * Shadow Tokens — Bindra Knowledge Hub
 * ------------------------------------
 * Elevation scale. Soft, low-contrast shadows (warm-tinted) keep the UI
 * premium and calm. Values mirror the `--shadow-*` CSS variables.
 */

export const shadow = {
  /** Hairline separation. */
  xs: "0 1px 2px 0 hsl(24 12% 12% / 0.04)",
  sm: "0 1px 3px 0 hsl(24 12% 12% / 0.06), 0 1px 2px -1px hsl(24 12% 12% / 0.06)",
  md: "0 4px 12px -2px hsl(24 12% 12% / 0.08), 0 2px 6px -2px hsl(24 12% 12% / 0.06)",
  lg: "0 12px 28px -6px hsl(24 12% 12% / 0.12), 0 4px 10px -4px hsl(24 12% 12% / 0.08)",
  xl: "0 24px 48px -12px hsl(24 12% 12% / 0.18), 0 8px 16px -8px hsl(24 12% 12% / 0.1)",
  /** Accent-tinted glow for primary highlights. */
  glow: "0 0 0 1px hsl(var(--accent) / 0.35), 0 8px 30px -8px hsl(var(--accent) / 0.45)",
  /** Frosted-glass surface (translucent overlays, sticky bars). */
  glass:
    "inset 0 1px 0 0 hsl(0 0% 100% / 0.5), 0 8px 32px -8px hsl(24 12% 12% / 0.12)",
} as const;

export type ShadowToken = keyof typeof shadow;
