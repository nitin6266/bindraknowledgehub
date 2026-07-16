import { listTests } from "@/features/teacher/actions/teacher.actions";
import { MarksEntryClient } from "@/features/teacher/components/marks-entry-client";
import { PageHeader } from "@/components/page-header";

export const dynamic = "force-dynamic";

export default async function TeacherMarksPage() {
  const result = await listTests({});
  const tests = result.success ? (result.data as { id: string; title: string }[]) : [];

  const options = {
    tests: tests.map((t) => ({ value: t.id, label: t.title })),
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Marks Entry" description="Enter and publish marks for conducted tests" />
      <MarksEntryClient options={options} />
    </div>
  );
}
