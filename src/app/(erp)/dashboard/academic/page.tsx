import Link from "next/link";

import { assertRole } from "@/lib/auth/authorize";
import { MASTER_MODULES, MODULE_ICON } from "@/features/academic/master-data/constants";
import { getModuleConfig } from "@/features/academic/master-data/config";
import { ACADEMIC_VIEW_ROLES } from "@/features/academic/master-data/constants";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Academic Management | Bindra Knowledge Hub ERP",
};

export default async function AcademicManagementPage() {
  await assertRole(ACADEMIC_VIEW_ROLES);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h3 font-semibold text-foreground">Academic Management</h1>
        <p className="text-body text-muted-foreground">
          Configure the academic foundation: sessions, classes, sections, subjects, schedules and the calendar.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MASTER_MODULES.map((module) => {
          const config = getModuleConfig(module);
          if (!config) {
            return null;
          }
          const Icon = MODULE_ICON[module];
          return (
            <Link key={module} href={`/dashboard/academic/${module}`} className="group">
              <Card className="h-full transition-colors group-hover:border-primary">
                <CardHeader className="flex flex-row items-center gap-3 space-y-0">
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
      </div>
    </div>
  );
}
