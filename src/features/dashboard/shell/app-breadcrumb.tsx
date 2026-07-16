"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight, Home } from "lucide-react";

import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  admin: "Administration",
  teacher: "Teacher",
  parent: "Parent",
  students: "Students",
  teachers: "Teachers",
  classes: "Classes",
  attendance: "Attendance",
  reports: "Reports",
  notifications: "Notifications",
  settings: "Settings",
  academics: "Academics",
  academic: "Academic",
  "academic-session": "Academic Sessions",
  "batch-type": "Batch Types",
  "batch-timing": "Batch Timings",
  "time-slot": "Time Slots",
  "academic-calendar": "Academic Calendar",
  batches: "Batches",
  sections: "Sections",
  subjects: "Subjects",
  assignments: "Assignments",
  tests: "Tests",
  marks: "Marks",
  finance: "Finance",
  categories: "Fee Categories",
  structures: "Fee Structures",
  collection: "Collections",
  receipts: "Receipts",
  outstanding: "Outstanding",
  users: "Users",
  profile: "Profile",
  appearance: "Appearance",
  children: "My Children",
  results: "Results",
  fees: "Fees",
  leave: "Leave Requests",
  documents: "Documents",
  announcements: "Announcements",
  batch: "Batches",
};

interface AppBreadcrumbProps {
  className?: string;
}

export function AppBreadcrumb({ className }: AppBreadcrumbProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label = LABELS[segment] ?? segment.replace(/-/g, " ");
    return { href, label };
  });

  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="flex flex-wrap items-center gap-1.5 text-body-sm text-muted-foreground">
        <li>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 rounded-md p-1 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Dashboard</span>
          </Link>
        </li>

        {crumbs.length > 0 && (
          <li aria-hidden="true">
            <ChevronRight className="h-4 w-4" />
          </li>
        )}

        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <Fragment key={crumb.href}>
              <li className="min-w-0">
                {isLast ? (
                  <span className="font-medium text-foreground" aria-current="page">
                    {crumb.label}
                  </span>
                ) : (
                  <Link
                    href={crumb.href}
                    className="hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
              {!isLast && (
                <li aria-hidden="true">
                  <ChevronRight className="h-4 w-4" />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
