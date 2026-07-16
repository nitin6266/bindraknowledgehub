"use client";

import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { getWorkspaceTabs, type WorkspaceId } from "@/features/dashboard/shell/nav";
import { AppLink } from "@/components/ui/app-link";

interface AppWorkspaceTabsProps {
  workspace: WorkspaceId;
  className?: string;
}

export function AppWorkspaceTabs({ workspace, className }: AppWorkspaceTabsProps) {
  const pathname = usePathname();
  const tabs = getWorkspaceTabs(workspace);

  if (tabs.length === 0) return null;

  return (
    <nav
      className={cn("flex flex-wrap gap-1 border-b border-border", className)}
      aria-label="Workspace sections"
    >
      {tabs.map((tab) => {
        const active = pathname === tab.href || pathname.startsWith(tab.href + "/");
        return (
          <AppLink
            key={tab.id}
            href={tab.href}
            showPendingSpinner={false}
            aria-current={active ? "page" : undefined}
            className={cn(
              "relative -mb-px rounded-t-lg px-3 py-2 text-body-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              active
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </AppLink>
        );
      })}
    </nav>
  );
}
