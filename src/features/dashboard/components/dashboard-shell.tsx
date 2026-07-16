"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

import { Sidebar } from "@/features/dashboard/components/sidebar";
import { TopHeader } from "@/features/dashboard/components/top-header";
import type { Role } from "@/constants/roles";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface DashboardShellProps {
  children: React.ReactNode;
  role: Role | null;
}

export function DashboardShell({ children, role }: DashboardShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const stored = localStorage.getItem("sidebar-collapsed");
    if (stored !== null) {
      setCollapsed(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  const handleToggleCollapse = () => {
    setCollapsed((prev) => !prev);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar
        role={role}
        open={sidebarOpen}
        onClose={handleCloseSidebar}
        collapsed={collapsed}
        onToggleCollapse={handleToggleCollapse}
      />

      {sidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.15 }}
          className="fixed inset-0 z-40 bg-black/40 md:hidden"
          onClick={handleCloseSidebar}
          aria-hidden="true"
        />
      )}

      <div className="flex min-w-0 flex-1 flex-col md:ml-64">
        <TopHeader role={role} onMenuClick={() => setSidebarOpen(true)} />

        <main
          className="erp-scroll flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
          style={{
            marginLeft: collapsed ? "4rem" : "16rem",
            transition: reducedMotion ? "none" : "margin-left 200ms ease",
          }}
          role="main"
          id="main-content"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: reducedMotion ? 0 : 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}