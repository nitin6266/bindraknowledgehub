"use client";

import { useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu as MenuIcon, Search } from "lucide-react";

import { cn } from "@/lib/utils";
import { AppBreadcrumb } from "@/features/dashboard/shell/app-breadcrumb";
import { AppNotifications } from "@/features/dashboard/shell/app-notifications";
import { AppUserMenu } from "@/features/dashboard/shell/app-user-menu";
import { getWorkspaceLabel } from "@/features/dashboard/shell/nav";
import type { Role } from "@/constants/roles";

interface AppHeaderProps {
  role: Role | null;
  onMenuClick: () => void;
}

export function AppHeader({ role, onMenuClick }: AppHeaderProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border bg-card",
        "px-4 supports-[backdrop-filter]:bg-card/95 supports-[backdrop-filter]:backdrop-blur",
      )}
      role="banner"
    >
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          aria-label="Open navigation"
          aria-expanded="false"
        >
          <MenuIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        <WorkspaceLabel role={role} />
      </div>

      <div className="hidden min-w-0 flex-1 justify-center px-6 md:flex">
        <AppBreadcrumb className="max-w-xl" />
      </div>

      <div className="flex min-w-0 items-center gap-1">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Search"
        >
          <Search className="h-5 w-5" aria-hidden="true" />
        </button>

        <AppNotifications />

        <div className="pl-2">
          <AppUserMenu role={role} />
        </div>
      </div>
    </header>
  );
}

function WorkspaceLabel({ role }: { role: Role | null }) {
  const pathname = usePathname();
  const label = useMemo(() => getWorkspaceLabel(role, pathname), [role, pathname]);

  return (
    <Link href="/dashboard" className="flex items-center gap-2 font-heading text-heading-sm font-semibold text-card-foreground">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
        BKH
      </span>
      <span className="hidden sm:inline">{label}</span>
    </Link>
  );
}
