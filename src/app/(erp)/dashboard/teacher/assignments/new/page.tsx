import { listMyBatches } from "@/features/teacher/actions/teacher.actions";
import { masterDataRepository } from "@/repositories/master-data.repository";
import { AssignmentForm } from "@/features/teacher/components/assignment-form";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function NewAssignmentPage() {
  const [batchesResult, subjects] = await Promise.all([
    listMyBatches({}),
    masterDataRepository.list("subject"),
  ]);

  const batches = batchesResult.success ? (batchesResult.data as { id: string; name: string }[]) : [];

  const options = {
    batches: batches.map((b) => ({ value: b.id, label: b.name })),
    subjects: subjects.map((s) => ({ value: String(s.id), label: String(s.name) })),
  };

  return (
    <div className="space-y-6">
      <PageHeader title="New Assignment" description="Publish an assignment to your batch" />
      <AssignmentForm options={options} />
    </div>
  );
}
