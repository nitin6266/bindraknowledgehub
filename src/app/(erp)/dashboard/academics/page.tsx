import { assertRole } from "@/lib/auth/authorize";
import { ACADEMIC_VIEW_ROLES, MASTER_MODULES, MODULE_ICON } from "@/features/academic/master-data/constants";
import { getModuleConfig } from "@/features/academic/master-data/config";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { Plus, Boxes } from "lucide-react";

export const metadata = {
  title: "Academics | Bindra Knowledge Hub ERP",
};

export default async function AcademicsWorkspacePage() {
  await assertRole(ACADEMIC_VIEW_ROLES);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Academics"
        description="Manage academic structure, curriculum, and scheduling."
        primaryAction={{ label: "New Session", href: "/dashboard/academic/academic-session/new", icon: <Plus className="h-4 w-4" /> }}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MASTER_MODULES.map((module) => {
          const config = getModuleConfig(module);
          if (!config) return null;
          const Icon = MODULE_ICON[module];
          return (
            <Link key={module} href={`/dashboard/academic/${module}`} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/40 group-hover:bg-primary/5">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
                  <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Icon className="size-5" />
                  </span>
                  <div>
                    <CardTitle className="text-base">{config.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>{config.description}</CardDescription>
                </CardContent>
              </Card>
            </Link>
          );
        })}
        <Link href="/dashboard/academic/batch" className="group">
          <Card className="h-full transition-colors group-hover:border-primary/40 group-hover:bg-primary/5">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
              <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Boxes className="size-5" />
              </span>
              <div>
                <CardTitle className="text-base">Batches</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>Manage batch assignments and scheduling</CardDescription>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}