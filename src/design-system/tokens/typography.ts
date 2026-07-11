/**
 * Typography Tokens — Bindra Knowledge Hub
 * ----------------------------------------
 * Fluid, responsive type scale built on `clamp()`. Every step scales with
 * the viewport (no fixed px jumps), keeping mobile-first readability while
 * staying premium on large screens. Pair with `--font-heading` (Plus Jakarta
 * Sans) for display/headings and `--font-sans` (Inter) for body/UI.
 */

export interface TypeStep {
  /** Font size, expressed as a fluid `clamp(min, preferred, max)`. */
  fontSize: string;
  lineHeight: string;
  letterSpacing: string;
  /** Optional weight guidance for the role. */
  weight?: "normal" | "medium" | "semibold" | "bold";
}

export const typography = {
  /** Oversized hero headline (landing hero). */
  hero: {
    fontSize: "clamp(2.75rem, 6vw, 4.75rem)",
    lineHeight: "1.04",
    letterSpacing: "-0.02em",
    weight: "bold",
  },
  h1: {
    fontSize: "clamp(2.25rem, 5vw, 3.5rem)",
    lineHeight: "1.1",
    letterSpacing: "-0.02em",
    weight: "bold",
  },
  h2: {
    fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
    lineHeight: "1.15",
    letterSpacing: "-0.015em",
    weight: "semibold",
  },
  h3: {
    fontSize: "clamp(1.5rem, 3vw, 2rem)",
    lineHeight: "1.25",
    letterSpacing: "-0.01em",
    weight: "semibold",
  },
  h4: {
    fontSize: "clamp(1.25rem, 2.4vw, 1.5rem)",
    lineHeight: "1.35",
    letterSpacing: "-0.005em",
    weight: "semibold",
  },
  /** Default running text. */
  body: {
    fontSize: "1rem",
    lineHeight: "1.7",
    letterSpacing: "0",
    weight: "normal",
  },
  /** Small supporting text, labels. */
  caption: {
    fontSize: "0.8125rem",
    lineHeight: "1.5",
    letterSpacing: "0.01em",
    weight: "normal",
  },
  /** Button / CTA label size. */
  button: {
    fontSize: "1rem",
    lineHeight: "1",
    letterSpacing: "0",
    weight: "medium",
  },
  /** Pull quotes / testimonials. */
  quote: {
    fontSize: "clamp(1.25rem, 2.6vw, 1.75rem)",
    lineHeight: "1.45",
    letterSpacing: "-0.01em",
    weight: "medium",
  },
} as const satisfies Record<string, TypeStep>;

export type TypeRole = keyof typeof typography;
