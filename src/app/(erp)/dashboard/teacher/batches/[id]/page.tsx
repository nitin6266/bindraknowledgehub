import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";

import { listMyBatches } from "@/features/teacher/actions/teacher.actions";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { AppWorkspaceTabs } from "@/features/dashboard/shell/app-workspace-tabs";
import { ClassWorkspace } from "@/features/teacher/components/class-workspace";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export const dynamic = "force-dynamic";

interface ClassWorkspacePageProps {
  params: Promise<{ id: string }>;
}

export default async function ClassWorkspacePage({ params }: ClassWorkspacePageProps) {
  const { id } = await params;
  const result = await listMyBatches({});
  const batches = result.success ? (result.data as { id: string; name: string }[]) : [];
  const batch = batches.find((b) => b.id === id);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between gap-3">
        <PageHeader
          eyebrow="Teacher"
          title={batch ? batch.name : "Class Workspace"}
          description="Students, attendance, assignments, tests and marks — together."
        />
        <Button variant="outline" asChild>
          <Link href="/dashboard/teacher/batches">
            <ArrowLeft className="h-4 w-4" /> My Classes
          </Link>
        </Button>
      </div>

      <AppWorkspaceTabs workspace="my-classes" />

      {!batch ? (
        <EmptyState
          icon={<Layers className="h-8 w-8" />}
          title="Batch not found"
          description="This batch may no longer be assigned to you."
          action={
            <Button asChild>
              <Link href="/dashboard/teacher/batches">Back to My Classes</Link>
            </Button>
          }
        />
      ) : (
        <ClassWorkspace batchId={batch.id} batchName={batch.name} />
      )}
    </div>
  );
}
