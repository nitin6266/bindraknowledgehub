"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LogOut, Settings, User, Bell, Key, Palette } from "lucide-react";

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

interface AppUserMenuProps {
  role: Role | null;
}

function getInitials(email: string): string {
  if (!email) return "U";
  return email.slice(0, 2).toUpperCase();
}

export function AppUserMenu({ role }: AppUserMenuProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const initials = getInitials(user?.email ?? "");
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    if (open) {
      document.addEventListener("mousedown", handleClick);
      document.addEventListener("keydown", handleKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="User menu"
        className="flex h-10 items-center gap-2 rounded-full border border-border bg-background pl-1 pr-2 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-body-sm font-semibold text-primary">
          {initials}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: reducedMotion ? 0 : 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-56 origin-top-right rounded-2xl border border-border bg-card p-1.5 shadow-lg"
            style={{ right: triggerRef.current?.getBoundingClientRect().right ?? 0, transform: "translateX(0)" }}
            role="menu"
            aria-label="User menu"
          >
            <div className="border-b border-border p-3">
              <p className="truncate text-body font-medium text-card-foreground">{user?.email ?? "User"}</p>
              <p className="text-body-sm text-muted-foreground">{role ? ROLE_LABELS[role] : "No role"}</p>
            </div>

            <div className="p-1">
              <MenuItem href="/dashboard/profile" icon={User} label="Profile" />
              <MenuItem href="/dashboard/profile?tab=account" icon={Settings} label="My Account" />
              <MenuItem href="/dashboard/profile?tab=password" icon={Key} label="Change Password" />
              <MenuItem href="/dashboard/settings/appearance" icon={Palette} label="Theme" />
              <MenuItem href="/dashboard/notifications" icon={Bell} label="Notifications" />
            </div>

            <div className="border-t border-border p-1">
              <form action={logout}>
                <button
                  type="submit"
                  role="menuitem"
                  className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-body text-destructive transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <LogOut className="h-4 w-4 shrink-0" />
                  Sign out
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MenuItem({ href, icon: Icon, label }: { href: string; icon: React.ComponentType<{ className?: string }>; label: string }) {
  return (
    <Link
      href={href}
      role="menuitem"
      className="flex items-center gap-2 rounded-lg px-3 py-2 text-body text-card-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
      {label}
    </Link>
  );
}
