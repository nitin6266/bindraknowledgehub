import { listMyStudents, listMyBatches } from "@/features/teacher/actions/teacher.actions";
import { masterDataRepository } from "@/repositories/master-data.repository";
import { StudentsTable } from "@/features/teacher/components/students-table";
import { PageHeader } from "@/features/dashboard/components/page-header";

export const dynamic = "force-dynamic";

export default async function TeacherStudentsPage() {
  const [sessions, classes, batchesResult] = await Promise.all([
    masterDataRepository.list("academic-session"),
    masterDataRepository.list("class"),
    listMyBatches({}),
  ]);

  const batches = batchesResult.success ? (batchesResult.data as { id: string; name: string }[]) : [];

  const options = {
    sessions: sessions.map((s) => ({ value: String(s.id), label: String(s.name) })),
    classes: classes.map((c) => ({ value: String(c.id), label: String(c.name) })),
    batches: batches.map((b) => ({ value: b.id, label: b.name })),
  };

  const result = await listMyStudents({});
  const students = result.success ? (result.data as never[]) : [];

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Teacher" title="My Students" description="View students across your assigned batches" />
      <StudentsTable students={students} options={options} />
    </div>
  );
}
