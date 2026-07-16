import { listMyBatches } from "@/features/teacher/actions/teacher.actions";
import { masterDataRepository } from "@/repositories/master-data.repository";
import { BatchesTable } from "@/features/teacher/components/batches-table";
import { PageHeader } from "@/components/page-header";
import type { BatchRow } from "@/features/teacher/teacher.types";

export const dynamic = "force-dynamic";

export default async function TeacherBatchesPage() {
  const [sessions, classes] = await Promise.all([
    masterDataRepository.list("academic-session"),
    masterDataRepository.list("class"),
  ]);

  const options = {
    sessions: sessions.map((s) => ({ value: String(s.id), label: String(s.name) })),
    classes: classes.map((c) => ({ value: String(c.id), label: String(c.name) })),
    sections: [],
  };

  const result = await listMyBatches({});
  const batches = result.success ? (result.data as BatchRow[]) : [];

  return (
    <div className="space-y-6">
      <PageHeader title="My Batches" description="Manage your assigned batches and view schedules" />
      <BatchesTable batches={batches} options={options} />
    </div>
  );
}