import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  IndianRupee,
  User,
  Building2,
  Clock,
  UserCheck,
  Users2,
  Wallet,
  Receipt,
  AlertTriangle,
  BarChart3,
  Boxes,
  UserCog,
  Bell,
  UserPlus,
  Calendar as CalendarIcon,
  ClipboardList as ClipboardListIcon,
  FileText as FileTextIcon,
  Award as AwardIcon,
} from "lucide-react";

import type { Role } from "@/constants/roles";

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
  badge?: string;
  badgeVariant?: "default" | "secondary" | "destructive" | "outline";
}

export interface NavSection {
  label: string;
  items: NavItem[];
  collapsible?: boolean;
  defaultOpen?: boolean;
  description?: string;
  roles?: Role[];
  isWorkspace?: boolean;
  href?: string;
}

const MASTER_MODULES = [
  { key: "academic-session", label: "Academic Sessions", icon: CalendarIcon, href: "/dashboard/academic/academic-session" },
  { key: "class", label: "Classes", icon: Building2, href: "/dashboard/academic/class" },
  { key: "section", label: "Sections", icon: BookOpen, href: "/dashboard/academic/section" },
  { key: "subject", label: "Subjects", icon: BookOpen, href: "/dashboard/academic/subject" },
  { key: "time-slot", label: "Time Slots", icon: Clock, href: "/dashboard/academic/time-slot" },
  { key: "batch-timing", label: "Batch Timings", icon: Clock, href: "/dashboard/academic/batch-timing" },
  { key: "batch-type", label: "Batch Types", icon: Boxes, href: "/dashboard/academic/batch-type" },
  { key: "academic-calendar", label: "Academic Calendar", icon: CalendarIcon, href: "/dashboard/academic/academic-calendar" },
] as const;

// Admin/Super Admin Navigation (8 root items)
export const ADMIN_NAV: NavSection[] = [
  {
    label: "Dashboard",
    collapsible: false,
    items: [
      {
        title: "Overview",
        href: "/dashboard",
        icon: LayoutDashboard,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
  {
    label: "Academics",
    isWorkspace: true,
    collapsible: true,
    defaultOpen: true,
    description: "Academic structure and curriculum",
    roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
    href: "/dashboard/academics",
    items: [
      {
        title: "Overview",
        href: "/dashboard/academics",
        icon: LayoutDashboard,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      },
      ...MASTER_MODULES.map((module) => ({
        title: module.label,
        href: module.href,
        icon: module.icon,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"] as Role[],
      })),
      {
        title: "Batches",
        href: "/dashboard/academic/batch",
        icon: Boxes,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      },
    ],
  },
  {
    label: "Students",
    isWorkspace: true,
    collapsible: true,
    defaultOpen: true,
    description: "Student admissions and records",
    roles: ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT"],
    href: "/dashboard/students",
    items: [
      {
        title: "Student List",
        href: "/dashboard/students",
        icon: GraduationCap,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT"],
      },
      {
        title: "Admissions",
        href: "/dashboard/students/admissions",
        icon: UserPlus,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
  {
    label: "Teachers",
    isWorkspace: true,
    collapsible: true,
    defaultOpen: true,
    description: "Teacher management and allocation",
    roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
    href: "/dashboard/teachers",
    items: [
      {
        title: "Teacher List",
        href: "/dashboard/teachers",
        icon: UserCheck,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "My Batches",
        href: "/dashboard/teacher/batches",
        icon: Boxes,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      },
      {
        title: "My Students",
        href: "/dashboard/teacher/students",
        icon: Users2,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      },
    ],
  },
  {
    label: "Finance",
    isWorkspace: true,
    collapsible: true,
    defaultOpen: true,
    description: "Fee management and collections",
    roles: ["SUPER_ADMIN", "ADMIN", "PARENT"],
    href: "/dashboard/finance",
    items: [
      {
        title: "Overview",
        href: "/dashboard/finance",
        icon: LayoutDashboard,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Fee Categories",
        href: "/dashboard/finance/categories",
        icon: Boxes,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Fee Structures",
        href: "/dashboard/finance/structures",
        icon: Wallet,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Collections",
        href: "/dashboard/finance/collection",
        icon: IndianRupee,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Receipts",
        href: "/dashboard/finance/receipts",
        icon: Receipt,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Outstanding",
        href: "/dashboard/finance/outstanding",
        icon: AlertTriangle,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "Reports",
        href: "/dashboard/finance/reports",
        icon: BarChart3,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
      {
        title: "My Fees",
        href: "/dashboard/parent/fees",
        icon: IndianRupee,
        roles: ["PARENT"],
      },
    ],
  },
  {
    label: "Operations",
    isWorkspace: true,
    collapsible: true,
    defaultOpen: true,
    description: "Daily academic operations",
    roles: ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT"],
    href: "/dashboard/operations",
    items: [
      {
        title: "Attendance",
        href: "/dashboard/attendance",
        icon: CalendarIcon,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      },
    ],
  },
  {
    label: "Reports",
    isWorkspace: true,
    collapsible: true,
    defaultOpen: false,
    description: "Analytics and insights",
    roles: ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT"],
    href: "/dashboard/reports",
    items: [
      {
        title: "Academic Reports",
        href: "/dashboard/reports",
        icon: FileTextIcon,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      },
    ],
  },
  {
    label: "Administration",
    isWorkspace: true,
    collapsible: true,
    defaultOpen: false,
    description: "User and system management",
    roles: ["SUPER_ADMIN", "ADMIN"],
    href: "/dashboard/administration",
    items: [
      {
        title: "Users",
        href: "/dashboard/admin/users",
        icon: Users,
        roles: ["SUPER_ADMIN", "ADMIN"],
      },
    ],
  },
  {
    label: "Settings",
    isWorkspace: true,
    collapsible: true,
    defaultOpen: false,
    description: "Personal and system preferences",
    href: "/dashboard/settings",
    items: [
      {
        title: "Profile",
        href: "/dashboard/profile",
        icon: User,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT"],
      },
      {
        title: "Appearance",
        href: "/dashboard/settings/appearance",
        icon: UserCog,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT"],
      },
      {
        title: "Notifications",
        href: "/dashboard/notifications",
        icon: Bell,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER", "PARENT"],
      },
    ],
  },
];

// Teacher Navigation - flat list per spec
export const TEACHER_NAV: NavSection[] = [
  {
    label: "Dashboard",
    collapsible: false,
    items: [
      {
        title: "Dashboard",
        href: "/dashboard/teacher",
        icon: LayoutDashboard,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      },
    ],
  },
  {
    label: "My Classes",
    collapsible: false,
    items: [
      {
        title: "My Batches",
        href: "/dashboard/teacher/batches",
        icon: Boxes,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      },
      {
        title: "My Students",
        href: "/dashboard/teacher/students",
        icon: Users2,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      },
    ],
  },
  {
    label: "Attendance",
    collapsible: false,
    items: [
      {
        title: "Attendance",
        href: "/dashboard/teacher/attendance",
        icon: CalendarIcon,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      },
    ],
  },
  {
    label: "Assignments",
    collapsible: false,
    items: [
      {
        title: "Assignments",
        href: "/dashboard/teacher/assignments",
        icon: ClipboardListIcon,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      },
      {
        title: "Create Assignment",
        href: "/dashboard/teacher/assignments/new",
        icon: UserPlus,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      },
    ],
  },
  {
    label: "Tests",
    collapsible: false,
    items: [
      {
        title: "Tests",
        href: "/dashboard/teacher/tests",
        icon: FileTextIcon,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      },
      {
        title: "Create Test",
        href: "/dashboard/teacher/tests/new",
        icon: UserPlus,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      },
    ],
  },
  {
    label: "Marks",
    collapsible: false,
    items: [
      {
        title: "Marks",
        href: "/dashboard/teacher/marks",
        icon: AwardIcon,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      },
    ],
  },
  {
    label: "Students",
    collapsible: false,
    items: [
      {
        title: "Student List",
        href: "/dashboard/students",
        icon: GraduationCap,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      },
    ],
  },
  {
    label: "Profile",
    collapsible: false,
    items: [
      {
        title: "My Profile",
        href: "/dashboard/profile",
        icon: User,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      },
      {
        title: "Appearance",
        href: "/dashboard/settings/appearance",
        icon: UserCog,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      },
      {
        title: "Notifications",
        href: "/dashboard/notifications",
        icon: Bell,
        roles: ["SUPER_ADMIN", "ADMIN", "TEACHER"],
      },
    ],
  },
];

// Parent Navigation - flat list per spec
export const PARENT_NAV: NavSection[] = [
  {
    label: "Dashboard",
    collapsible: false,
    items: [
      {
        title: "Dashboard",
        href: "/dashboard/parent",
        icon: LayoutDashboard,
        roles: ["SUPER_ADMIN", "ADMIN", "PARENT"],
      },
    ],
  },
  {
    label: "My Children",
    collapsible: false,
    items: [
      {
        title: "My Children",
        href: "/dashboard/parent/children",
        icon: Users2,
        roles: ["SUPER_ADMIN", "ADMIN", "PARENT"],
      },
    ],
  },
  {
    label: "Attendance",
    collapsible: false,
    items: [
      {
        title: "Attendance",
        href: "/dashboard/parent/attendance",
        icon: CalendarIcon,
        roles: ["SUPER_ADMIN", "ADMIN", "PARENT"],
      },
    ],
  },
  {
    label: "Assignments",
    collapsible: false,
    items: [
      {
        title: "Assignments",
        href: "/dashboard/parent/assignments",
        icon: ClipboardListIcon,
        roles: ["SUPER_ADMIN", "ADMIN", "PARENT"],
      },
    ],
  },
  {
    label: "Results",
    collapsible: false,
    items: [
      {
        title: "Test Results",
        href: "/dashboard/parent/results",
        icon: FileTextIcon,
        roles: ["SUPER_ADMIN", "ADMIN", "PARENT"],
      },
    ],
  },
  {
    label: "Fees",
    collapsible: false,
    items: [
      {
        title: "Fee Summary",
        href: "/dashboard/parent/fees",
        icon: IndianRupee,
        roles: ["SUPER_ADMIN", "ADMIN", "PARENT"],
      },
    ],
  },
  {
    label: "Leave Requests",
    collapsible: false,
    items: [
      {
        title: "Leave Requests",
        href: "/dashboard/parent/leave",
        icon: ClipboardListIcon,
        roles: ["SUPER_ADMIN", "ADMIN", "PARENT"],
      },
    ],
  },
  {
    label: "Profile",
    collapsible: false,
    items: [
      {
        title: "My Profile",
        href: "/dashboard/profile",
        icon: User,
        roles: ["SUPER_ADMIN", "ADMIN", "PARENT"],
      },
      {
        title: "Appearance",
        href: "/dashboard/settings/appearance",
        icon: UserCog,
        roles: ["SUPER_ADMIN", "ADMIN", "PARENT"],
      },
      {
        title: "Notifications",
        href: "/dashboard/notifications",
        icon: Bell,
        roles: ["SUPER_ADMIN", "ADMIN", "PARENT"],
      },
    ],
  },
];

// Parent also has Documents and Announcements - add as additional sections
const PARENT_ADDITIONAL: NavSection[] = [
  {
    label: "Documents",
    collapsible: false,
    items: [
      {
        title: "Documents",
        href: "/dashboard/parent/documents",
        icon: FileTextIcon,
        roles: ["SUPER_ADMIN", "ADMIN", "PARENT"],
      },
    ],
  },
  {
    label: "Announcements",
    collapsible: false,
    items: [
      {
        title: "Announcements",
        href: "/dashboard/parent/announcements",
        icon: Bell,
        roles: ["SUPER_ADMIN", "ADMIN", "PARENT"],
      },
    ],
  },
];

export function getNavForRole(role: Role | null): NavSection[] {
  if (!role) {
    return [];
  }

  // Teacher and Parent get flat navigation per spec
  if (role === "TEACHER") {
    return TEACHER_NAV.map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(role)),
    })).filter((section) => section.items.length > 0);
  }

  if (role === "PARENT") {
    const parentNav = [...PARENT_NAV, ...PARENT_ADDITIONAL];
    return parentNav.map((section) => ({
      ...section,
      items: section.items.filter((item) => item.roles.includes(role)),
    })).filter((section) => section.items.length > 0);
  }

  // SUPER_ADMIN and ADMIN get workspace navigation
  return ADMIN_NAV.map((section) => {
    if (section.roles && !section.roles.includes(role)) {
      return { ...section, items: [] };
    }
    return {
      ...section,
      items: section.items.filter((item) => item.roles.includes(role)),
    };
  }).filter((section) => section.items.length > 0);
}