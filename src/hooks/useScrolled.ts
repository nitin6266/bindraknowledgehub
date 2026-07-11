"use client";

import { useEffect, useState } from "react";

/**
 * Returns true once the page is scrolled past `threshold` px.
 * Drives the navigation's transparent-on-hero → solid-after-scroll state.
 * SSR-safe: defaults to false until mounted.
 */
export function useScrolled(threshold = 24): boolean {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
