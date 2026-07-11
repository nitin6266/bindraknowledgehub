/**
 * Color Tokens — Bindra Knowledge Hub
 * ------------------------------------
 * Single source of truth for every color decision in the product.
 *
 * Values are HSL channels ("H S% L%") so they compose with the CSS custom
 * properties defined in `src/styles/tokens.css` and support alpha via
 * `hsl(var(--token) / <alpha>)`. Components must NEVER hardcode colors —
 * use Tailwind utilities (which read these variables) or the `hsl()` helper.
 *
 * Brand personality: Warm · Professional · Trustworthy · Premium · Hopeful.
 */

/** Core brand scale (grounded bronze) used to derive semantic roles. */
export const brand = {
  50: "42 60% 96%",
  100: "40 55% 90%",
  200: "38 50% 82%",
  300: "36 48% 70%",
  400: "32 50% 58%",
  500: "28 60% 46%",
  600: "24 65% 38%",
  700: "22 62% 32%",
  800: "20 58% 26%",
  900: "18 55% 20%",
} as const;

/** Hopeful gold accent scale. */
export const gold = {
  400: "45 92% 62%",
  500: "43 90% 52%",
  600: "40 88% 44%",
} as const;

/**
 * Semantic color roles. These names (not raw hues) are what the rest of the
 * codebase references. Each maps 1:1 to a `--<name>` CSS variable so the
 * same token drives both Tailwind and runtime (charts, SVG, Framer Motion).
 */
export const semanticColors = {
  background: "40 33% 98%",
  foreground: "24 12% 12%",
  surface: "40 30% 95%",
  card: "0 0% 100%",
  cardForeground: "24 12% 12%",
  popover: "0 0% 100%",
  popoverForeground: "24 12% 12%",
  primary: brand[600],
  primaryForeground: "40 33% 98%",
  secondary: "30 35% 92%",
  secondaryForeground: "24 20% 22%",
  accent: gold[500],
  accentForeground: "24 40% 14%",
  muted: "30 25% 94%",
  mutedForeground: "24 8% 42%",
  border: "30 20% 86%",
  input: "30 20% 86%",
  ring: brand[500],
  success: "142 55% 38%",
  successForeground: "0 0% 100%",
  info: "212 72% 52%",
  infoForeground: "0 0% 100%",
  warning: "38 92% 50%",
  warningForeground: "24 40% 14%",
  danger: "0 72% 48%",
  dangerForeground: "0 0% 100%",
  destructive: "0 72% 48%",
  destructiveForeground: "0 0% 100%",
} as const;

export type SemanticColor = keyof typeof semanticColors;

/** Dark-mode overrides — only the values that shift; rest inherit light. */
export const darkSemanticColors: Partial<Record<SemanticColor, string>> = {
  background: "24 16% 9%",
  foreground: "40 20% 95%",
  surface: "24 14% 16%",
  card: "24 14% 13%",
  cardForeground: "40 20% 95%",
  popover: "24 14% 13%",
  popoverForeground: "40 20% 95%",
  primary: brand[400],
  primaryForeground: "24 18% 10%",
  secondary: "24 12% 18%",
  secondaryForeground: "40 18% 92%",
  accent: gold[400],
  accentForeground: "24 18% 10%",
  muted: "24 12% 16%",
  mutedForeground: "40 10% 64%",
  border: "24 12% 22%",
  input: "24 12% 22%",
  ring: brand[400],
  success: "142 45% 50%",
  successForeground: "24 18% 10%",
  info: "212 70% 60%",
  infoForeground: "24 18% 10%",
  warning: "38 90% 55%",
  warningForeground: "24 18% 10%",
  danger: "0 62% 55%",
  dangerForeground: "0 0% 100%",
  destructive: "0 62% 55%",
  destructiveForeground: "0 0% 100%",
};

/** Returns a usable CSS color string. `token` is an HSL channel triplet. */
export function hsl(token: string, alpha?: number): string {
  return alpha === undefined ? `hsl(${token})` : `hsl(${token} / ${alpha})`;
}

export const colors = {
  brand,
  gold,
  semantic: semanticColors,
  dark: darkSemanticColors,
  hsl,
} as const;
