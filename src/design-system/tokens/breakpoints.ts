/**
 * Breakpoint Tokens — Bindra Knowledge Hub
 * ----------------------------------------
 * Mobile-first breakpoints. Each value is the minimum viewport width at
 * which the named tier applies (matches Tailwind's `screens`). No component
 * may hardcode a media query width.
 */

export const breakpoints = {
  /** Small phones and up (base, no media query). */
  mobile: "0px",
  /** Tablets / large phones. */
  tablet: "640px",
  /** Laptops. */
  laptop: "1024px",
  /** Desktops. */
  desktop: "1280px",
  /** Ultra-wide monitors. */
  ultraWide: "1536px",
} as const;

/** Tailwind-compatible `min-width` media query helpers. */
export const screens = {
  mobile: breakpoints.mobile,
  tablet: `(min-width: ${breakpoints.tablet})`,
  laptop: `(min-width: ${breakpoints.laptop})`,
  desktop: `(min-width: ${breakpoints.desktop})`,
  ultraWide: `(min-width: ${breakpoints.ultraWide})`,
} as const;

export type Breakpoint = keyof typeof breakpoints;
