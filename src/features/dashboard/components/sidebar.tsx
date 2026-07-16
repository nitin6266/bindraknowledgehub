"use client";

import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  ChevronDown,
  ChevronRight,
  ChevronLeft,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { getNavForRole, type NavSection } from "@/features/dashboard/nav-config";
import type { Role } from "@/constants/roles";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

interface NavItemComponentProps {
  item: NavSection["items"][0];
  pathname: string;
  collapsed: boolean;
  onNavigate: () => void;
}

function NavItemComponent({ item, pathname, collapsed, onNavigate }: NavItemComponentProps) {
  const isActive =
    pathname === item.href ||
    (item.href !== "/dashboard" && pathname.startsWith(item.href));
  const Icon = item.icon;

  const handleClick = useCallback(() => {
    onNavigate();
  }, [onNavigate]);

  if (collapsed) {
    return (
      <Link
        href={item.href}
        onClick={handleClick}
        aria-current={isActive ? "page" : undefined}
        aria-label={item.title}
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-md text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isActive
            ? "bg-primary/10 text-primary"
            : "hover:bg-muted",
        )}
        title={item.title}
      >
        <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.15 }}
          className="absolute left-full ml-3 whitespace-nowrap rounded-md bg-muted px-2 py-1 text-body-xs text-muted-foreground shadow-lg"
        >
          {item.title}
        </motion.span>
      </Link>
    );
  }

  return (
    <Link
      href={item.href}
      onClick={handleClick}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-body text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        isActive
          ? "bg-primary/10 font-medium text-primary"
          : "hover:bg-muted",
      )}
    >
      <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
      <span className="truncate">{item.title}</span>
    </Link>
  );
}

function NavSectionComponent({
  section,
  pathname,
  collapsed,
  onNavigate,
}: {
  section: NavSection;
  pathname: string;
  collapsed: boolean;
  onNavigate: () => void;
}) {
  const [isOpen, setIsOpen] = useState(section.defaultOpen ?? true);
  const reducedMotion = useReducedMotion();

  const isSectionActive =
    section.href && (pathname === section.href || pathname.startsWith(section.href + "/"));

  if (!section.collapsible) {
    return (
      <div key={section.label} className="space-y-1">
        {section.items.map((item) => (
          <NavItemComponent
            key={item.href}
            item={item}
            pathname={pathname}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    );
  }

  if (collapsed) {
    return (
      <div key={section.label} className="space-y-1">
        {section.items.map((item) => (
          <NavItemComponent
            key={item.href}
            item={item}
            pathname={pathname}
            collapsed={true}
            onNavigate={onNavigate}
          />
        ))}
      </div>
    );
  }

  return (
    <div key={section.label} className="space-y-1">
      {section.href ? (
        <Link
          href={section.href}
          className={cn(
            "flex w-full items-center gap-2 px-3 py-2 text-body-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
            isSectionActive && "text-primary font-medium",
          )}
        >
          <span className="truncate">{section.label}</span>
          <motion.span
            className="ml-auto flex h-5 w-5 items-center justify-center"
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
          >
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </motion.span>
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={cn(
            "flex w-full items-center gap-2 px-3 py-2 text-body-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-md",
          )}
          aria-expanded={isOpen}
          aria-controls={`section-${section.label.toLowerCase().replace(/\s+/g, "-")}`}
        >
          <span className="truncate">{section.label}</span>
          <motion.span
            className="ml-auto flex h-5 w-5 items-center justify-center"
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
          >
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </motion.span>
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`section-${section.label.toLowerCase().replace(/\s+/g, "-")}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.2 }}
            className="overflow-hidden pt-1"
          >
            <nav className="space-y-1 pl-2" aria-label={`${section.label} navigation`}>
              {section.items.map((item) => (
                <NavItemComponent
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  collapsed={false}
                  onNavigate={onNavigate}
                />
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface SidebarProps {
  role: Role | null;
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ role, open, onClose, collapsed, onToggleCollapse }: SidebarProps) {
  const pathname = usePathname();
  const nav = useMemo(() => getNavForRole(role), [role]);
  const reducedMotion = useReducedMotion();

  const handleNavigate = useCallback(() => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  }, [onClose]);

  return (
    <motion.aside
      initial={false}
      animate={{ x: open ? 0 : -280 }}
      transition={{ type: "spring", damping: 25, stiffness: 200 }}
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex h-screen w-64 flex-col border-r border-border bg-card transition-transform duration-200 ease-soft-out md:static md:translate-x-0",
        collapsed && "md:w-16",
      )}
      aria-label="Dashboard navigation"
      role="navigation"
    >
      <div className={cn("flex h-16 items-center justify-between border-b border-border px-4", collapsed && "md:justify-center")}>
        <motion.div
          initial={false}
          animate={{ opacity: collapsed ? 0 : 1, width: collapsed ? 0 : "auto" }}
          transition={{ duration: reducedMotion ? 0 : 0.15 }}
          className="overflow-hidden"
        >
          <Link href="/dashboard" className="flex items-center gap-2 font-heading text-heading-sm font-semibold text-card-foreground">
            <LayoutDashboard className="h-6 w-6 text-primary" aria-hidden="true" />
            <span className="truncate">BKH ERP</span>
          </Link>
        </motion.div>

        <button
          type="button"
          onClick={onToggleCollapse}
          className={cn(
            "rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            "md:hidden absolute right-4",
            collapsed && "md:block",
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-expanded={!collapsed}
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      <nav className="erp-scroll flex-1 overflow-y-auto p-4" aria-label="Main navigation">
        {nav.map((section) => (
          <NavSectionComponent
            key={section.label}
            section={section}
            pathname={pathname}
            collapsed={collapsed}
            onNavigate={handleNavigate}
          />
        ))}
      </nav>

      <div className={cn("border-t border-border p-4", collapsed && "hidden md:block")}>
        <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
          <LayoutDashboard className="h-5 w-5 text-primary" aria-hidden="true" />
          <div className="flex-1 min-w-0">
            <p className="text-body-sm font-medium text-card-foreground truncate">BKH ERP</p>
            <p className="text-body-xs text-muted-foreground truncate">Bindra Knowledge Hub</p>
          </div>
        </div>
      </div>
    </motion.aside>
  );
}