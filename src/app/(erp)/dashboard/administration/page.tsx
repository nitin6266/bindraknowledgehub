import { assertRole } from "@/lib/auth/authorize";
import { ROLES } from "@/constants/roles";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { AppWorkspaceTabs } from "@/features/dashboard/shell/app-workspace-tabs";
import { Users } from "lucide-react";

export const metadata = {
  title: "Administration | Bindra Knowledge Hub ERP",
};

export default async function AdministrationWorkspacePage() {
  await assertRole([ROLES.SUPER_ADMIN, ROLES.ADMIN]);

  const adminItems = [
    {
      title: "Users",
      description: "Manage staff and parent accounts",
      href: "/dashboard/admin/users",
      icon: Users,
      roles: [ROLES.SUPER_ADMIN, ROLES.ADMIN],
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Administration"
        description="User and system management."
      />

      <AppWorkspaceTabs workspace="administration" />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {adminItems.map((item) => (
          <Link key={item.title} href={item.href} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/40 group-hover:bg-primary/5">
              <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </span>
                <div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{item.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}