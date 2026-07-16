"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";

import { IconButton } from "@/components/ui/icon-button";
import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

import type { Role } from "@/constants/roles";

export function NotificationsDropdown({ role: _role }: { role: Role | null }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const notifications: Array<{ id: string; title: string; message: string; time: string; read: boolean }> = [];

  return (
    <div className="relative" ref={ref}>
      <IconButton
        variant="ghost"
        size="sm"
        aria-label={open ? "Close notifications" : "Open notifications"}
        onClick={() => setOpen((prev) => !prev)}
        className="relative"
      >
        <Bell className="h-5 w-5" />
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
      </IconButton>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: reducedMotion ? 0 : 0.15 }}
            className="absolute right-0 mt-2 w-72 max-w-[90vw] origin-top-right rounded-lg border border-border bg-card shadow-lg"
            role="menu"
            aria-label="Notifications"
          >
            <div className="flex items-center justify-between border-b border-border p-4">
              <h3 className="text-body font-semibold text-card-foreground">Notifications</h3>
              <IconButton
                variant="ghost"
                size="sm"
                aria-label="Clear all notifications"
                className="text-muted-foreground hover:text-foreground"
                disabled={notifications.length === 0}
              >
                <X className="h-4 w-4" />
              </IconButton>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 py-8 px-4 text-center">
                  <Bell className="h-10 w-10 text-muted-foreground/50" aria-hidden="true" />
                  <p className="text-body text-muted-foreground">No notifications yet</p>
                  <p className="text-body-sm text-muted-foreground">
                    You&apos;ll see updates here when they arrive.
                  </p>
                </div>
              ) : (
                <ul role="list" className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <li key={notification.id} className="p-4">
                      <div className="flex gap-3">
                        <div
                          className={cn(
                            "mt-0.5 flex h-2 w-2 shrink-0 rounded-full",
                            notification.read
                              ? "bg-transparent"
                              : "bg-primary",
                          )}
                          aria-hidden="true"
                        />
                        <div className="flex-1 min-w-0">
                          <p className={cn("text-body font-medium text-card-foreground", !notification.read && "font-semibold")}>
                            {notification.title}
                          </p>
                          <p className="text-body-sm text-muted-foreground mt-0.5 line-clamp-2">
                            {notification.message}
                          </p>
                          <p className="text-body-xs text-muted-foreground mt-1">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="border-t border-border p-3">
                <a
                  href="/dashboard/notifications"
                  className="block text-center text-body text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md"
                >
                  View all notifications
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}