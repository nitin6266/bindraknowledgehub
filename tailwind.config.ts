import type { Config } from "tailwindcss";
import {
  radius,
  shadow,
  duration,
  easing,
  breakpoints,
  containerWidths,
  inputHeights,
} from "./src/design-system/tokens";

/**
 * Design tokens are defined as the single source of truth in
 * `src/design-system/tokens/*` (and mirrored as CSS variables in
 * `src/styles/tokens.css`). This config consumes them so no value is
 * hardcoded here. Color roles resolve via CSS variables to keep dark mode
 * working (`.dark` overrides the variables).
 */
const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/layout/**/*.{ts,tsx}",
    "./src/sections/**/*.{ts,tsx}",
    "./src/cards/**/*.{ts,tsx}",
    "./src/forms/**/*.{ts,tsx}",
    "./src/ui/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1rem",
        sm: "1.5rem",
        lg: "2rem",
        xl: "2.5rem",
      },
      screens: {
        "2xl": breakpoints.desktop,
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input) / <alpha-value>)",
        ring: "hsl(var(--ring) / <alpha-value>)",
        background: "hsl(var(--background) / <alpha-value>)",
        foreground: "hsl(var(--foreground) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        primary: {
          DEFAULT: "hsl(var(--primary) / <alpha-value>)",
          foreground: "hsl(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary) / <alpha-value>)",
          foreground: "hsl(var(--secondary-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "hsl(var(--accent) / <alpha-value>)",
          foreground: "hsl(var(--accent-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted) / <alpha-value>)",
          foreground: "hsl(var(--muted-foreground) / <alpha-value>)",
        },
        card: {
          DEFAULT: "hsl(var(--card) / <alpha-value>)",
          foreground: "hsl(var(--card-foreground) / <alpha-value>)",
        },
        popover: {
          DEFAULT: "hsl(var(--popover) / <alpha-value>)",
          foreground: "hsl(var(--popover-foreground) / <alpha-value>)",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        success: {
          DEFAULT: "hsl(var(--success) / <alpha-value>)",
          foreground: "hsl(var(--success-foreground) / <alpha-value>)",
        },
        warning: {
          DEFAULT: "hsl(var(--warning) / <alpha-value>)",
          foreground: "hsl(var(--warning-foreground) / <alpha-value>)",
        },
        danger: {
          DEFAULT: "hsl(var(--danger) / <alpha-value>)",
          foreground: "hsl(var(--danger-foreground) / <alpha-value>)",
        },
        info: {
          DEFAULT: "hsl(var(--info) / <alpha-value>)",
          foreground: "hsl(var(--info-foreground) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-heading)", "var(--font-sans)", "sans-serif"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
      },
      fontSize: {
        "display-xl": ["clamp(2.75rem, 6vw, 4.5rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
        "display-lg": ["clamp(2.25rem, 5vw, 3.5rem)", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(1.875rem, 4vw, 2.75rem)", { lineHeight: "1.15", letterSpacing: "-0.015em" }],
        "heading-lg": ["clamp(1.5rem, 3vw, 2rem)", { lineHeight: "1.25", letterSpacing: "-0.01em" }],
        "heading-md": ["1.25rem", { lineHeight: "1.4", letterSpacing: "-0.005em" }],
        "heading-sm": ["1.125rem", { lineHeight: "1.5" }],
        "body-lg": ["1.125rem", { lineHeight: "1.7" }],
        body: ["1rem", { lineHeight: "1.7" }],
        "body-sm": ["0.875rem", { lineHeight: "1.6" }],
        "body-xs": ["0.75rem", { lineHeight: "1.5" }],
      },
      spacing: {
        "section-y": "var(--spacing-section-y)",
        "section-y-sm": "var(--spacing-section-y-sm)",
        "content-x": "var(--spacing-content-x)",
      },
      borderRadius: {
        sm: radius.sm,
        DEFAULT: radius.md,
        md: radius.md,
        lg: radius.lg,
        xl: radius.xl,
        "2xl": radius["2xl"],
        full: radius.full,
      },
      boxShadow: {
        xs: shadow.xs,
        sm: shadow.sm,
        md: shadow.md,
        lg: shadow.lg,
        xl: shadow.xl,
        glow: shadow.glow,
        glass: shadow.glass,
      },
      transitionTimingFunction: {
        "soft-in": easing.softIn,
        "soft-out": easing.softOut,
        standard: easing.standard,
      },
      transitionDuration: {
        fast: duration.fast,
        normal: duration.normal,
        slow: duration.slow,
      },
      maxWidth: {
        container: breakpoints.desktop,
        prose: "72ch",
        narrow: containerWidths.narrow,
        wide: containerWidths.wide,
      },
      height: {
        "input-sm": inputHeights.sm,
        "input-md": inputHeights.md,
        "input-lg": inputHeights.lg,
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in": `fade-in ${duration.normal} ${easing.softOut}`,
        "fade-up": `fade-up ${duration.normal} ${easing.softOut}`,
        "scale-in": `scale-in ${duration.normal} ${easing.softOut}`,
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
