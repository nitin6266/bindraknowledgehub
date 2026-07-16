import { listMyBatches } from "@/features/teacher/actions/teacher.actions";
import { AttendancePageClient } from "@/features/teacher/components/attendance-page-client";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { AppWorkspaceTabs } from "@/features/dashboard/shell/app-workspace-tabs";

export const dynamic = "force-dynamic";

interface TeacherAttendancePageProps {
  searchParams: Promise<{ batch?: string }>;
}

export default async function TeacherAttendancePage({ searchParams }: TeacherAttendancePageProps) {
  const sp = await searchParams;
  const [batchesResult] = await Promise.all([listMyBatches({})]);

  const batchesData = batchesResult.success ? (batchesResult.data as { id: string; name: string }[]) : [];
  const options = {
    batches: batchesData.map((b) => ({ value: b.id, label: b.name })),
  };
  const defaultBatch = sp.batch ?? batchesData[0]?.id ?? "";

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Teacher"
        title="Attendance"
        description="Mark and manage attendance for your batches."
      />
      <AppWorkspaceTabs workspace="attendance" />
      <AttendancePageClient options={options} defaultBatchId={defaultBatch} />
    </div>
  );
}
