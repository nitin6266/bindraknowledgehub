"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, User, Settings, Key, Bell } from "lucide-react";

import { cn } from "@/lib/utils";
import { IconButton } from "@/components/ui/icon-button";
import { useAuth } from "@/providers/auth-provider";
import { logout } from "@/features/auth/actions/logout";
import { ROLES, type Role } from "@/constants/roles";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

const ROLE_LABELS: Record<Role, string> = {
  [ROLES.SUPER_ADMIN]: "Super Admin",
  [ROLES.ADMIN]: "Admin",
  [ROLES.TEACHER]: "Teacher",
  [ROLES.PARENT]: "Parent",
};

function getInitials(email: string): string {
  if (!email) return "U";
  return email.slice(0, 2).toUpperCase();
}

interface UserMenuProps {
  role: Role | null;
  onMenuClick: () => void;
}

export function UserMenu({ role, onMenuClick }: UserMenuProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const initials = getInitials(user?.email ?? "");

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div className="flex items-center gap-2">
      <IconButton
        variant="ghost"
        size="sm"
        className="md:hidden"
        aria-label="Open navigation"
        onClick={onMenuClick}
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </IconButton>

      <div className="relative" ref={ref}>
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-full p-1 pr-2 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors"
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label="User menu"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-body-sm font-semibold text-primary">
            {initials}
          </span>
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: reducedMotion ? 0 : 0.15 }}
              className="absolute right-0 mt-2 w-56 origin-top-right rounded-lg border border-border bg-card shadow-lg"
              role="menu"
              aria-label="User menu"
            >
              <div className="border-b border-border p-4">
                <p className="truncate text-body font-medium text-card-foreground">
                  {user?.email ?? "User"}
                </p>
                <p className="text-body-sm text-muted-foreground">
                  {role ? ROLE_LABELS[role] : "No role assigned"}
                </p>
              </div>

              <div className="p-1">
                <a
                  href="/dashboard/profile"
                  role="menuitem"
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-body text-card-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                >
                  <User className="h-4 w-4" aria-hidden="true" />
                  Profile
                </a>

                <a
                  href="/dashboard/profile?tab=account"
                  role="menuitem"
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-body text-card-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                >
                  <Settings className="h-4 w-4" aria-hidden="true" />
                  My Account
                </a>

                <a
                  href="/dashboard/profile?tab=password"
                  role="menuitem"
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-body text-card-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                >
                  <Key className="h-4 w-4" aria-hidden="true" />
                  Change Password
                </a>

                <a
                  href="/dashboard/profile?tab=preferences"
                  role="menuitem"
                  className={cn(
                    "flex items-center gap-2 rounded-md px-3 py-2 text-body text-card-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                  )}
                >
                  <Bell className="h-4 w-4" aria-hidden="true" />
                  Preferences
                </a>

                <div className="border-t border-border my-1" />

                <form action={logout}>
                  <button
                    type="submit"
                    role="menuitem"
                    className={cn(
                      "flex w-full items-center gap-2 rounded-md px-3 py-2 text-body text-destructive hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-destructive/20",
                    )}
                  >
                    <LogOut className="h-4 w-4" aria-hidden="true" />
                    Sign out
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}