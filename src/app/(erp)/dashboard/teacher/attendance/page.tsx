import { listMyBatches } from "@/features/teacher/actions/teacher.actions";
import { AttendancePageClient } from "@/features/teacher/components/attendance-page-client";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function TeacherAttendancePage() {
  const [batchesResult] = await Promise.all([listMyBatches({})]);

  const batchesData = batchesResult.success ? (batchesResult.data as { id: string; name: string }[]) : [];

  const options = {
    batches: batchesData.map((b) => ({ value: b.id, label: b.name })),
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Daily Attendance" description="Mark and manage attendance for your batches" />
      <AttendancePageClient options={options} />
    </div>
  );
}
