import { assertRole } from "@/lib/auth/authorize";
import { ROLES, type Role } from "@/constants/roles";
import { createClient } from "@/lib/supabase/server";
import { userRepository } from "@/repositories/user.repository";
import { roleRepository } from "@/repositories/role.repository";
import { PageHeader } from "@/components/page-header";
import { AppWorkspaceTabs } from "@/features/dashboard/shell/app-workspace-tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const role = await assertRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.PARENT]);

  const profileHref = profileHrefFor(role);

  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const [erpUser, teacherRole] = await Promise.all([
    authUser ? userRepository.getByAuthId(authUser.id) : Promise.resolve(null),
    roleRepository.getByName(ROLES.TEACHER),
  ]);

  const roleLabel =
    erpUser && teacherRole && erpUser.roleId !== teacherRole.id
      ? erpUser.role.label
      : erpUser?.role.label ?? role;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Account"
        title="Settings"
        description="Manage your account and preferences."
      />

      <AppWorkspaceTabs workspace="settings" />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-body font-semibold">Account</CardTitle>
            <CardDescription className="text-body-sm text-muted-foreground">
              Your signed-in identity and role.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-body-sm">
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Email</span>
              <span className="font-medium text-foreground">{erpUser?.email ?? authUser?.email ?? "—"}</span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Role</span>
              <span className="font-medium text-foreground">{roleLabel}</span>
            </div>
            <Button asChild variant="outline" className="mt-2 w-full sm:w-auto">
              <Link href={profileHref}>Edit Profile</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-body font-semibold">Preferences</CardTitle>
            <CardDescription className="text-body-sm text-muted-foreground">
              Theme and notification preferences.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-body-sm text-muted-foreground">
            <p>Use the theme toggle in the header to switch between light and dark mode.</p>
            <p>Notifications are delivered through the Notifications section.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function profileHrefFor(role: Role): string {
  switch (role) {
    case ROLES.TEACHER:
      return "/dashboard/teacher/profile";
    case ROLES.PARENT:
      return "/dashboard/parent/profile";
    default:
      return "/dashboard/profile";
  }
}
