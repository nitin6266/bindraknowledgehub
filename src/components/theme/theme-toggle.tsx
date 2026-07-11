"use client";

import { Moon, Sun } from "lucide-react";
import { IconButton } from "@/components/ui/icon-button";
import { useTheme } from "./theme-provider";

/**
 * Accessible theme switcher. Cycles between the active light/dark state
 * (system mode resolves to whichever is currently applied). Announces its
 * intent via an aria-label that reflects the next state.
 */
export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const isDark = resolvedTheme === "dark";

  return (
    <IconButton
      variant="ghost"
      size="sm"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      onClick={toggleTheme}
    >
      {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </IconButton>
  );
}
