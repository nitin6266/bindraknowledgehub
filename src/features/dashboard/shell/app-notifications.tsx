"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

export function AppNotifications() {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
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

  const notifications: Array<{ id: string; title: string; message: string; time: string; read: boolean }> = [];

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? "Close notifications" : "Open notifications"}
        aria-expanded={open}
        aria-haspopup="menu"
        className="relative flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Bell className="h-5 w-5" aria-hidden="true" />
        <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: reducedMotion ? 0 : 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 w-80 max-w-[90vw] origin-top-right rounded-2xl border border-border bg-card p-1 shadow-lg"
            role="menu"
            aria-label="Notifications"
          >
            <div className="flex items-center justify-between border-b border-border p-3">
              <h3 className="text-body font-semibold text-card-foreground">Notifications</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close notifications"
                className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Bell className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-body font-medium text-card-foreground">No notifications</p>
                  <p className="text-body-sm text-muted-foreground">You&apos;ll see updates here when they arrive.</p>
                </div>
              ) : (
                <ul role="list" className="divide-y divide-border">
                  {notifications.map((n) => (
                    <li key={n.id} className="p-3">
                      <div className="flex gap-3">
                        <div className={cn("mt-1.5 h-2 w-2 shrink-0 rounded-full", n.read ? "bg-transparent" : "bg-primary")} />
                        <div className="min-w-0 flex-1">
                          <p className={cn("text-body font-medium text-card-foreground", !n.read && "font-semibold")}>{n.title}</p>
                          <p className="text-body-sm text-muted-foreground line-clamp-2">{n.message}</p>
                          <p className="mt-1 text-body-xs text-muted-foreground">{n.time}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {notifications.length > 0 && (
              <div className="border-t border-border p-2">
                <Link href="/dashboard/notifications" className="block rounded-lg py-2 text-center text-body text-primary hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  View all
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
