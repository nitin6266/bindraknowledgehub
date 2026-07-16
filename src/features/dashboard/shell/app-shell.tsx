"use client";

import { useState, useEffect, useCallback } from "react";

import { cn } from "@/lib/utils";
import { AppHeader } from "@/features/dashboard/shell/app-header";
import { AppSidebar } from "@/features/dashboard/shell/app-sidebar";
import type { Role } from "@/constants/roles";

interface AppShellProps {
  children: React.ReactNode;
  role: Role | null;
}

export function AppShell({ children, role }: AppShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  useEffect(() => {
    function handleResize() {
      if (window.innerWidth >= 1024) setMobileOpen(false);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AppHeader role={role} onMenuClick={() => setMobileOpen(true)} />

      <AppSidebar
        role={role}
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
      />

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      <div
        className={cn(
          "min-h-screen transition-[margin] duration-200",
          collapsed ? "lg:ml-[72px]" : "lg:ml-[240px]",
        )}
        style={{ marginTop: "64px" }}
      >
        <main className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
