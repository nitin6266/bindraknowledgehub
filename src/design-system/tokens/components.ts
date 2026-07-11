/**
 * Component Dimension Tokens — Bindra Knowledge Hub
 * -------------------------------------------------
 * Size scales for interactive and structural components. Centralized so that
 * buttons, inputs, icons and sections share a consistent rhythm and satisfy
 * large touch-target requirements (>= 44px). No component hardcodes a height,
 * padding or icon size.
 */

/** Icon render sizes (matches IconWrapper variants). */
export const iconSizes = {
  sm: "1rem",
  md: "1.25rem",
  lg: "1.75rem",
  xl: "2rem",
} as const;

/** Button geometry by size. Heights meet >=44px touch-target guidance. */
export const buttonSizes = {
  sm: { height: "2.5rem", paddingX: "1rem", fontSize: "0.875rem", icon: iconSizes.sm },
  md: { height: "2.75rem", paddingX: "1.5rem", fontSize: "1rem", icon: iconSizes.md },
  lg: { height: "3.25rem", paddingX: "2rem", fontSize: "1.125rem", icon: iconSizes.md },
  icon: { height: "2.75rem", width: "2.75rem", icon: iconSizes.md },
} as const;

/** Form control heights (>=44px for md/lg). */
export const inputHeights = {
  sm: "2.5rem",
  md: "2.75rem",
  lg: "3.25rem",
} as const;

/** Vertical breathing room for page/section blocks. */
export const sectionSpacing = {
  sm: "3.5rem",
  lg: "5.5rem",
} as const;

/** Max content widths for different layout intentions. */
export const containerWidths = {
  narrow: "48rem",
  default: "80rem",
  wide: "90rem",
} as const;

export const components = {
  iconSizes,
  buttonSizes,
  inputHeights,
  sectionSpacing,
  containerWidths,
} as const;

export type IconSizeToken = keyof typeof iconSizes;
export type ButtonSizeToken = keyof typeof buttonSizes;
export type InputHeightToken = keyof typeof inputHeights;
