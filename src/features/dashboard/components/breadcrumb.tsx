"use client";

import { Fragment } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

const LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  admin: "Admin",
  teacher: "Teacher",
  parent: "Parent",
  students: "Students",
  teachers: "Teachers",
  classes: "Classes",
  attendance: "Attendance",
  reports: "Reports",
  notifications: "Notifications",
  settings: "Settings",
  academic: "Academic",
  "academic-sessions": "Academic Sessions",
  "batch-types": "Batch Types",
  "batch-timings": "Batch Timings",
  "time-slots": "Time Slots",
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
  parents: "Parents",
  profile: "Profile",
  roles: "Roles & Permissions",
  "api-keys": "API Keys",
  database: "Database",
  integrations: "Integrations",
  "email-templates": "Email Templates",
  system: "System Settings",
  general: "General",
  appearance: "Appearance",
  backup: "Backup & Archive",
};

export function Breadcrumb({ className }: { className?: string }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) {
    return null;
  }

  const crumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join("/")}`;
    const label = LABELS[segment] ?? segment.replace(/-/g, " ");
    return { href, label };
  });

  return (
    <nav aria-label="Breadcrumb" className={cn("min-w-0", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-body-sm text-muted-foreground">
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
              {!isLast ? (
                <li aria-hidden="true">
                  <ChevronRight className="h-4 w-4" />
                </li>
              ) : null}
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}