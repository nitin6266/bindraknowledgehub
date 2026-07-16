"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeftClose, PanelLeft } from "lucide-react";

import { cn } from "@/lib/utils";
import { type NavRoot, type WorkspaceId, getRootsForRole } from "@/features/dashboard/shell/nav";
import type { Role } from "@/constants/roles";

interface AppSidebarProps {
  role: Role | null;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function AppSidebar({ role, collapsed, onToggle, mobileOpen, onMobileClose }: AppSidebarProps) {
  const roots = getRootsForRole(role).slice(0, 8);
  const pathname = usePathname();

  const isRootActive = (root: NavRoot) =>
    pathname === root.href || pathname.startsWith(root.href + "/");

  useEffect(() => {
    if (mobileOpen) onMobileClose();
  }, [pathname, mobileOpen, onMobileClose]);

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-40 flex shrink-0 flex-col border-r border-border bg-card transition-[width,transform] duration-200 ease-standard",
        "lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
        collapsed ? "w-[72px]" : "w-[240px]",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
      )}
      aria-label="Primary navigation"
    >
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        <ul role="list" className="space-y-1">
          {roots.map((root) => (
            <SidebarRoot
              key={root.workspaceId}
              root={root}
              collapsed={collapsed}
              isActive={isRootActive(root)}
            />
          ))}
        </ul>
      </nav>

      <div className="border-t border-border p-2">
        <button
          type="button"
          onClick={onToggle}
          className="hidden w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-body-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:flex"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}

interface SidebarRootProps {
  root: NavRoot;
  collapsed: boolean;
  isActive: boolean;
}

function SidebarRoot({ root, collapsed, isActive }: SidebarRootProps) {
  const Icon = root.icon;

  if (collapsed) {
    return (
      <li>
        <Link
          href={root.href}
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            isActive && "bg-primary/10 text-primary",
          )}
          aria-label={root.label}
          title={root.label}
          aria-current={isActive ? "page" : undefined}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </Link>
      </li>
    );
  }

  return (
    <li>
      <Link
        href={root.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 text-body font-medium transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isActive ? "bg-primary/10 text-primary" : "text-card-foreground",
        )}
        aria-current={isActive ? "page" : undefined}
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        <span className="truncate">{root.label}</span>
      </Link>
    </li>
  );
}

export type { WorkspaceId };
