import { assertRole } from "@/lib/auth/authorize";
import { getUserRole } from "@/lib/auth/role";
import { createClient } from "@/lib/supabase/server";
import { userService } from "@/services/user.service";
import { roleRepository } from "@/repositories/role.repository";
import { UsersTable } from "@/features/users/components/users-table";
import type { UserTableRow, RoleOption } from "@/features/users/types";
import { ROLES, type Role } from "@/constants/roles";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { Plus } from "lucide-react";

export const metadata = {
  title: "User Management | Bindra Knowledge Hub ERP",
};

function toRow(
  user: Awaited<ReturnType<typeof userService.list>>[number],
  currentAuthId: string | null,
): UserTableRow {
  return {
    id: user.id,
    email: user.email,
    firstName: user.profile?.firstName ?? "",
    lastName: user.profile?.lastName ?? "",
    fullName: `${user.profile?.firstName ?? ""} ${user.profile?.lastName ?? ""}`.trim() || user.email,
    role: user.role.name as Role,
    roleLabel: user.role.label,
    status: user.status,
    createdAt: user.createdAt.toISOString(),
    updatedAt: user.updatedAt.toISOString(),
    deletedAt: user.deletedAt ? user.deletedAt.toISOString() : null,
    phone: user.profile?.phone ?? null,
    gender: user.profile?.gender ?? null,
    photoUrl: user.profile?.photoUrl ?? null,
    isSelf: user.authId === currentAuthId,
  };
}

export default async function UserManagementPage() {
  await assertRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]);

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const [users, roles] = await Promise.all([
    userService.list(),
    roleRepository.ensureSeed().then(() => roleRepository.list()),
  ]);

  const rows = users.map((u) => toRow(u, authUser?.id ?? null));
  const roleOptions: RoleOption[] = roles.map((r) => ({ name: r.name as Role, label: r.label }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Administration"
        title="User Management"
        description="Create, edit and manage staff and parent accounts."
        primaryAction={{
          label: "Add User",
          href: "/dashboard/admin/users/new",
          icon: <Plus className="h-4 w-4" aria-hidden="true" />,
        }}
      />
      <UsersTable users={rows} roles={roleOptions} currentRole={await getUserRole()} />
    </div>
  );
}
