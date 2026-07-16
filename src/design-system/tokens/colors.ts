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
 * Design system: modern SaaS. Primary #A65A1E · Hover #8B4513.
 */

/** Core brand scale (bronze) used to derive semantic roles. */
export const brand = {
  50: "30 55% 96%",
  100: "29 52% 90%",
  200: "28 50% 80%",
  300: "27 52% 66%",
  400: "26 58% 52%",
  500: "26 70% 38%", // #A65A1E
  600: "25 65% 31%", // #8B4513
  700: "24 62% 26%",
  800: "22 58% 21%",
  900: "20 55% 16%",
} as const;

/**
 * Semantic color roles. These names (not raw hues) are what the rest of the
 * codebase references. Each maps 1:1 to a `--<name>` CSS variable so the
 * same token drives both Tailwind and runtime (charts, SVG, Framer Motion).
 */
export const semanticColors = {
  background: "220 20% 98%", // #F8F9FB
  foreground: "221 39% 11%", // #111827
  surface: "0 0% 100%", // #FFFFFF
  surfaceSecondary: "220 14% 96%", // #F3F4F6
  card: "0 0% 100%",
  cardForeground: "221 39% 11%",
  popover: "0 0% 100%",
  popoverForeground: "221 39% 11%",
  primary: brand[500],
  primaryForeground: "0 0% 100%",
  primaryHover: brand[600],
  secondary: "220 14% 96%",
  secondaryForeground: "221 39% 11%",
  accent: "220 14% 96%",
  accentForeground: "221 39% 11%",
  muted: "220 14% 96%",
  mutedForeground: "220 9% 46%", // #6B7280
  border: "220 13% 91%", // #E5E7EB
  input: "220 13% 91%",
  ring: brand[500],
  success: "142 76% 36%", // #16A34A
  successForeground: "0 0% 100%",
  info: "221 83% 53%", // #2563EB
  infoForeground: "0 0% 100%",
  warning: "38 92% 50%", // #F59E0B
  warningForeground: "221 39% 11%",
  danger: "0 74% 51%", // #DC2626
  dangerForeground: "0 0% 100%",
  destructive: "0 74% 51%",
  destructiveForeground: "0 0% 100%",
} as const;

export type SemanticColor = keyof typeof semanticColors;

/** Dark-mode overrides — only the values that shift; rest inherit light. */
export const darkSemanticColors: Partial<Record<SemanticColor, string>> = {
  background: "222 18% 10%",
  foreground: "220 20% 96%",
  surface: "222 16% 14%",
  surfaceSecondary: "222 14% 18%",
  card: "222 16% 14%",
  cardForeground: "220 20% 96%",
  popover: "222 16% 14%",
  popoverForeground: "220 20% 96%",
  primary: brand[400],
  primaryForeground: "0 0% 100%",
  primaryHover: brand[500],
  secondary: "222 14% 18%",
  secondaryForeground: "220 18% 92%",
  accent: "222 14% 18%",
  accentForeground: "220 18% 92%",
  muted: "222 14% 18%",
  mutedForeground: "220 10% 64%",
  border: "222 12% 24%",
  input: "222 12% 24%",
  ring: brand[400],
  success: "142 60% 45%",
  successForeground: "0 0% 100%",
  info: "221 83% 60%",
  infoForeground: "0 0% 100%",
  warning: "38 90% 55%",
  warningForeground: "222 18% 10%",
  danger: "0 70% 58%",
  dangerForeground: "0 0% 100%",
  destructive: "0 70% 58%",
  destructiveForeground: "0 0% 100%",
};

/** Returns a usable CSS color string. `token` is an HSL channel triplet. */
export function hsl(token: string, alpha?: number): string {
  return alpha === undefined ? `hsl(${token})` : `hsl(${token} / ${alpha})`;
}

export const colors = {
  brand,
  semantic: semanticColors,
  dark: darkSemanticColors,
  hsl,
} as const;
