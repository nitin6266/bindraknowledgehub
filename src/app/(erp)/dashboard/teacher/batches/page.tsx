import Link from "next/link";
import { Users, Clock, ArrowRight, Layers } from "lucide-react";

import { listMyBatches } from "@/features/teacher/actions/teacher.actions";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { AppWorkspaceTabs } from "@/features/dashboard/shell/app-workspace-tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { BatchRow } from "@/features/teacher/teacher.types";

export const dynamic = "force-dynamic";

export default async function TeacherBatchesPage() {
  const result = await listMyBatches({});
  const batches = result.success ? (result.data as BatchRow[]) : [];

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Teacher"
        title="My Classes"
        description="Every batch you teach, in one place."
      />
      <AppWorkspaceTabs workspace="my-classes" />

      {batches.length === 0 ? (
        <EmptyState
          icon={<Layers className="h-8 w-8" />}
          title="No classes assigned yet"
          description="Once batches are allocated to you, they will appear here."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {batches.map((batch) => (
            <Card key={batch.id} className="flex h-full flex-col shadow-sm transition-colors hover:border-primary/40">
              <CardContent className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-heading text-body-lg font-semibold text-foreground">{batch.name}</p>
                    <p className="text-body-sm text-muted-foreground">
                      {batch.className}
                      {batch.sectionName ? ` / ${batch.sectionName}` : ""}
                    </p>
                  </div>
                  <Badge variant={batch.teacherRole === "PRIMARY" ? "default" : "outline"}>
                    {batch.teacherRole === "PRIMARY" ? "Primary" : "Subject"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3 text-body-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="h-4 w-4 text-primary" />
                    <span>{batch.strength} students</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary" />
                    <span className="truncate">{batch.todaysSchedule}</span>
                  </div>
                </div>

                <Link
                  href={`/dashboard/teacher/batches/${batch.id}`}
                  className="mt-auto inline-flex items-center justify-center gap-1 rounded-full bg-primary px-4 py-2.5 text-body-sm font-medium text-primary-foreground shadow-sm transition-all hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Open Class Workspace
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
