"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Menu as MenuIcon, Search } from "lucide-react";

import { IconButton } from "@/components/ui/icon-button";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Breadcrumb } from "@/features/dashboard/components/breadcrumb";
import { UserMenu } from "@/features/dashboard/components/user-menu";
import { NotificationsDropdown } from "@/features/dashboard/components/notifications-dropdown";
import type { Role } from "@/constants/roles";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface HeaderProps {
  role: Role | null;
  onMenuClick: () => void;
}

export function Header({ role, onMenuClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={false}
      animate={{ y: 0 }}
      className={cn(
        "sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80",
        scrolled && "shadow-sm",
      )}
      style={{ transition: reducedMotion ? "none" : "box-shadow 200ms ease" }}
      role="banner"
    >
      <div className="flex min-w-0 flex-1 items-center gap-4">
        <button
          type="button"
          onClick={onMenuClick}
          className="md:hidden rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Open navigation menu"
          aria-expanded="false"
        >
          <MenuIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        <Breadcrumb className="flex-1 min-w-0 hidden sm:block" />
      </div>

      <div className="flex items-center gap-1">
        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1 }}
          className="hidden sm:flex items-center gap-2"
        >
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Search"
            className="relative"
          >
            <Search className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
          </IconButton>

          <NotificationsDropdown role={role} />
        </motion.div>

        <ThemeToggle className="hidden sm:flex" />

        <UserMenu role={role} onMenuClick={onMenuClick} />
      </div>
    </motion.header>
  );
}