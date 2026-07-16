import { listMyBatches } from "@/features/teacher/actions/teacher.actions";
import { masterDataRepository } from "@/repositories/master-data.repository";
import { TestForm } from "@/features/teacher/components/test-form";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function NewTestPage() {
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
      <PageHeader title="New Test" description="Schedule a test for your batch" />
      <TestForm options={options} />
    </div>
  );
}
