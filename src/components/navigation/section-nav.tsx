"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export interface SectionNavItem {
  label: string;
  href: string;
}

export interface SectionNavProps {
  items: SectionNavItem[];
  className?: string;
  orientation?: "horizontal" | "vertical";
}

/**
 * In-page section navigation (anchor links). Highlights the active section.
 * Used for long pages (Courses, Admissions) with multiple regions.
 */
export function SectionNav({ items, className, orientation = "horizontal" }: SectionNavProps) {
  const pathname = usePathname();
  return (
    <nav
      aria-label="Section"
      className={cn(
        "flex gap-1",
        orientation === "horizontal" ? "flex-wrap" : "flex-col items-start",
        className,
      )}
    >
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "true" : undefined}
            className={cn(
              "rounded-full px-4 py-2 text-body-sm font-medium transition-colors",
              active ? "bg-primary/10 text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
