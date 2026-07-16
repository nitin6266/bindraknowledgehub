import {
  LayoutDashboard,
  GraduationCap,
  IndianRupee,
  FileText,
  Shield,
  Settings,
  User,
  Calendar,
  UserCheck,
  Users2,
  ClipboardList,
} from "lucide-react";

import type { Role } from "@/constants/roles";

export interface NavRoot {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
  workspaceId: WorkspaceId;
}

export type WorkspaceId =
  | "dashboard"
  | "students"
  | "teachers"
  | "academics"
  | "finance"
  | "reports"
  | "administration"
  | "settings"
  | "my-classes"
  | "attendance"
  | "assignments"
  | "tests"
  | "marks"
  | "my-children"
  | "results"
  | "fees"
  | "leave-requests"
  | "profile";

const ROOT_NAV: NavRoot[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT"], workspaceId: "dashboard" },
  { label: "Students", href: "/dashboard/students", icon: GraduationCap, roles: ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT"], workspaceId: "students" },
  { label: "Teachers", href: "/dashboard/teachers", icon: UserCheck, roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"], workspaceId: "teachers" },
  { label: "Academics", href: "/dashboard/academics", icon: FileText, roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"], workspaceId: "academics" },
  { label: "Finance", href: "/dashboard/finance", icon: IndianRupee, roles: ["SUPER_ADMIN", "ADMIN", "PARENT"], workspaceId: "finance" },
  { label: "Reports", href: "/dashboard/reports", icon: FileText, roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"], workspaceId: "reports" },
  { label: "Administration", href: "/dashboard/administration", icon: Shield, roles: ["SUPER_ADMIN", "ADMIN"], workspaceId: "administration" },
  { label: "Settings", href: "/dashboard/settings", icon: Settings, roles: ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT"], workspaceId: "settings" },
];

const TEACHER_ROOT_NAV: NavRoot[] = [
  { label: "Dashboard", href: "/dashboard/teacher", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"], workspaceId: "dashboard" },
  { label: "My Classes", href: "/dashboard/teacher/batches", icon: Users2, roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"], workspaceId: "my-classes" },
  { label: "Attendance", href: "/dashboard/teacher/attendance", icon: Calendar, roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"], workspaceId: "attendance" },
  { label: "Assignments", href: "/dashboard/teacher/assignments", icon: ClipboardList, roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"], workspaceId: "assignments" },
  { label: "Tests", href: "/dashboard/teacher/tests", icon: FileText, roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"], workspaceId: "tests" },
  { label: "Marks", href: "/dashboard/teacher/marks", icon: FileText, roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"], workspaceId: "marks" },
  { label: "Students", href: "/dashboard/students", icon: GraduationCap, roles: ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT"], workspaceId: "students" },
  { label: "Profile", href: "/dashboard/profile", icon: User, roles: ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT"], workspaceId: "profile" },
];

const PARENT_ROOT_NAV: NavRoot[] = [
  { label: "Dashboard", href: "/dashboard/parent", icon: LayoutDashboard, roles: ["SUPER_ADMIN", "ADMIN", "PARENT"], workspaceId: "dashboard" },
  { label: "My Children", href: "/dashboard/parent/children", icon: Users2, roles: ["SUPER_ADMIN", "ADMIN", "PARENT"], workspaceId: "my-children" },
  { label: "Attendance", href: "/dashboard/parent/attendance", icon: Calendar, roles: ["SUPER_ADMIN", "ADMIN", "PARENT"], workspaceId: "attendance" },
  { label: "Assignments", href: "/dashboard/parent/assignments", icon: ClipboardList, roles: ["SUPER_ADMIN", "ADMIN", "PARENT"], workspaceId: "assignments" },
  { label: "Results", href: "/dashboard/parent/results", icon: FileText, roles: ["SUPER_ADMIN", "ADMIN", "PARENT"], workspaceId: "results" },
  { label: "Fees", href: "/dashboard/parent/fees", icon: IndianRupee, roles: ["SUPER_ADMIN", "ADMIN", "PARENT"], workspaceId: "fees" },
  { label: "Leave Requests", href: "/dashboard/parent/leave", icon: ClipboardList, roles: ["SUPER_ADMIN", "ADMIN", "PARENT"], workspaceId: "leave-requests" },
  { label: "Profile", href: "/dashboard/profile", icon: User, roles: ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT"], workspaceId: "profile" },
];

export function getRootsForRole(role: Role | null): NavRoot[] {
  if (!role) return [];
  if (role === "TEACHER") return TEACHER_ROOT_NAV.filter((r) => r.roles.includes(role));
  if (role === "PARENT") return PARENT_ROOT_NAV.filter((r) => r.roles.includes(role));
  return ROOT_NAV.filter((r) => r.roles.includes(role));
}

export function getWorkspaceLabel(role: Role | null, pathname: string): string {
  if (!role) return "";
  const roots = getRootsForRole(role);
  const active = roots.find((r) => pathname === r.href || pathname.startsWith(r.href + "/"));
  return active?.label ?? "";
}

export interface WorkspaceTab {
  id: string;
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export const WORKSPACE_TABS: Record<string, WorkspaceTab[]> = {
  students: [
    { id: "list", label: "Student List", href: "/dashboard/students" },
  ],
  teachers: [
    { id: "list", label: "Teacher List", href: "/dashboard/teachers" },
  ],
  academics: [
    { id: "overview", label: "Overview", href: "/dashboard/academics" },
    { id: "sessions", label: "Academic Sessions", href: "/dashboard/academic/academic-session" },
    { id: "classes", label: "Classes", href: "/dashboard/academic/class" },
    { id: "sections", label: "Sections", href: "/dashboard/academic/section" },
    { id: "subjects", label: "Subjects", href: "/dashboard/academic/subject" },
    { id: "time-slots", label: "Time Slots", href: "/dashboard/academic/time-slot" },
    { id: "batch-timings", label: "Batch Timings", href: "/dashboard/academic/batch-timing" },
    { id: "batch-types", label: "Batch Types", href: "/dashboard/academic/batch-type" },
    { id: "calendar", label: "Academic Calendar", href: "/dashboard/academic/academic-calendar" },
    { id: "batches", label: "Batches", href: "/dashboard/academic/batch" },
  ],
  finance: [
    { id: "overview", label: "Overview", href: "/dashboard/finance" },
    { id: "categories", label: "Fee Categories", href: "/dashboard/finance/categories" },
    { id: "structures", label: "Fee Structures", href: "/dashboard/finance/structures" },
    { id: "collections", label: "Collections", href: "/dashboard/finance/collection" },
    { id: "receipts", label: "Receipts", href: "/dashboard/finance/receipts" },
    { id: "outstanding", label: "Outstanding", href: "/dashboard/finance/outstanding" },
    { id: "reports", label: "Reports", href: "/dashboard/finance/reports" },
    { id: "student-fees", label: "Student Fees", href: "/dashboard/finance/student-fees" },
  ],
  reports: [],
  administration: [
    { id: "overview", label: "Overview", href: "/dashboard/administration" },
    { id: "users", label: "Users", href: "/dashboard/admin/users" },
  ],
  settings: [
    { id: "general", label: "General", href: "/dashboard/settings" },
    { id: "appearance", label: "Appearance", href: "/dashboard/settings/appearance" },
    { id: "profile", label: "Profile", href: "/dashboard/profile" },
  ],
};

export function getWorkspaceTabs(route: WorkspaceId): WorkspaceTab[] {
  return WORKSPACE_TABS[route] ?? [];
}
