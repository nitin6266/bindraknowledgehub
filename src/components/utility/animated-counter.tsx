"use client";

import * as React from "react";
import { useReducedMotion } from "framer-motion";

export interface AnimatedCounterProps {
  value: number;
  /** Decimal places to display. */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  durationMs?: number;
  className?: string;
}

/** Count-up number. Snaps to final value when reduced-motion is requested. */
export function AnimatedCounter({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  durationMs = 1400,
  className,
}: AnimatedCounterProps) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = React.useState(reduce ? value : 0);
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (reduce) {
      setDisplay(value);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min((now - start) / durationMs, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs, reduce]);

  const formatted = display.toLocaleString("en-IN", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
