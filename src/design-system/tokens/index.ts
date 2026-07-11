/**
 * Design Tokens — Barrel Export
 * -----------------------------
 * Single import surface for the entire token system:
 *
 *   import { tokens } from "@/design-system/tokens";
 *   // or named: import { colors, spacing, radius } from "@/design-system/tokens";
 *
 * Every design value in Bindra Knowledge Hub originates here (or in the
 * mirrored CSS variables in `src/styles/tokens.css`). No magic numbers,
 * no hardcoded colors, no hardcoded spacing anywhere in the app.
 */

import { colors } from "./colors";
import { typography } from "./typography";
import { spacing, spacingScale } from "./spacing";
import { radius } from "./radius";
import { shadow } from "./shadow";
import { motion, duration, easing, hover, focus, reducedMotion } from "./motion";
import { breakpoints, screens } from "./breakpoints";
import { zIndex } from "./zIndex";
import { opacity } from "./opacity";
import { transitions } from "./transitions";
import { components } from "./components";

export const tokens = {
  colors,
  typography,
  spacing,
  spacingScale,
  radius,
  shadow,
  motion: { ...motion, duration, easing, hover, focus, reducedMotion },
  breakpoints,
  screens,
  zIndex,
  opacity,
  transitions,
  components,
} as const;

export { colors } from "./colors";
export { typography } from "./typography";
export { spacing, spacingScale } from "./spacing";
export { radius } from "./radius";
export { shadow } from "./shadow";
export { motion, duration, easing, hover, focus, reducedMotion } from "./motion";
export { breakpoints, screens } from "./breakpoints";
export { zIndex } from "./zIndex";
export { opacity } from "./opacity";
export { transitions } from "./transitions";
export {
  components,
  iconSizes,
  buttonSizes,
  inputHeights,
  sectionSpacing,
  containerWidths,
} from "./components";
