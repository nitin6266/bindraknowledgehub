"use client";

import { useState, useEffect, useCallback } from "react";

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
    <div className="flex min-h-screen bg-background text-foreground">
      <AppSidebar
        role={role}
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
        mobileOpen={mobileOpen}
        onMobileClose={closeMobile}
      />

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <AppHeader role={role} onMenuClick={() => setMobileOpen(true)} />

        <main className="flex-1">
          <div className="mx-auto w-full max-w-[1440px] p-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
