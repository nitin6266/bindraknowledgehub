/**
 * zIndex Tokens — Bindra Knowledge Hub
 * ------------------------------------
 * Centralized stacking order. Prevents ad-hoc z-index wars. Every overlay,
 * sticky bar, popover and tooltip references these named layers.
 */

export const zIndex = {
  base: "0",
  dropdown: "1000",
  sticky: "1100",
  header: "1200",
  overlay: "1300",
  modal: "1400",
  popover: "1500",
  tooltip: "1600",
  toast: "1700",
} as const;

export type ZIndexToken = keyof typeof zIndex;
