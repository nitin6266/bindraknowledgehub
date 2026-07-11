/**
 * Transition Tokens — Bindra Knowledge Hub
 * ----------------------------------------
 * Named transition presets that compose `duration` + `easing` from motion.ts.
 * Components reference these (or Tailwind's `transition-*`) rather than
 * inventing timing. Keeps motion consistent and calm across the product.
 */

import { duration, easing } from "./motion";

export const transitions = {
  /** All properties, standard timing — default UI motion. */
  base: `all ${duration.normal} ${easing.standard}`,
  /** Color/background only — links, badges, chips. */
  colors: `color ${duration.fast} ${easing.standard}, background-color ${duration.fast} ${easing.standard}, border-color ${duration.fast} ${easing.standard}`,
  /** Transform/opacity — hover lift, scales. */
  transform: `transform ${duration.normal} ${easing.softOut}, opacity ${duration.normal} ${easing.softOut}`,
  /** Fast feedback — buttons, toggles. */
  fast: `all ${duration.fast} ${easing.standard}`,
  /** Emphasized entrance — modals, panels. */
  emphasis: `all ${duration.slow} ${easing.softOut}`,
} as const;

export type TransitionToken = keyof typeof transitions;
