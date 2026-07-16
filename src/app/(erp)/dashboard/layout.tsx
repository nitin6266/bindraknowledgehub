import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getUserRole } from "@/lib/auth/role";
import { ROLE_ROUTES } from "@/constants/routes";
import { ROLE_DEFAULT_DASHBOARD, type Role } from "@/constants/roles";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const role = await getUserRole();
  const headerStore = await headers();
  const pathname = headerStore.get("x-pathname") ?? "";

  // Role-specific route segments must match the user's role.
  // ROLE_ROUTES maps each role to its exclusive prefix (admin/teacher/parent).
  // Any path starting with one of those prefixes is gated by role.
  const rolePrefixes = Object.values(ROLE_ROUTES);
  const matchedPrefix = rolePrefixes.find((prefix) => pathname.startsWith(prefix));

  if (matchedPrefix) {
    if (!role || ROLE_ROUTES[role] !== matchedPrefix) {
      redirect(role ? ROLE_DEFAULT_DASHBOARD[role as Role] ?? "/dashboard" : "/login");
    }
  }

  return <DashboardShell role={role}>{children}</DashboardShell>;
}
