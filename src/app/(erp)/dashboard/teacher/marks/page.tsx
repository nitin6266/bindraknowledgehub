import { listTests } from "@/features/teacher/actions/teacher.actions";
import { MarksEntryClient } from "@/features/teacher/components/marks-entry-client";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { AppWorkspaceTabs } from "@/features/dashboard/shell/app-workspace-tabs";

export const dynamic = "force-dynamic";

export default async function TeacherMarksPage() {
  const result = await listTests({});
  const tests = result.success ? (result.data as { id: string; title: string }[]) : [];

  const options = {
    tests: tests.map((t) => ({ value: t.id, label: t.title })),
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Teacher" title="Marks Entry" description="Enter and publish marks for conducted tests" />
      <AppWorkspaceTabs workspace="marks" />
      <MarksEntryClient options={options} />
    </div>
  );
}
