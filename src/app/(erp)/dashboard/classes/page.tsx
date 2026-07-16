import { assertRole } from "@/lib/auth/authorize";
import { ROLES } from "@/constants/roles";
import { masterDataRepository } from "@/repositories/master-data.repository";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BookOpen } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ClassesPage() {
  await assertRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER]);

  const [classes, sections, sessions] = await Promise.all([
    masterDataRepository.list("class"),
    masterDataRepository.list("section"),
    masterDataRepository.list("academic-session"),
  ]);

  const sessionMap = new Map(sessions.map((s) => [String(s.id), String(s.name)]));
  const sectionCountByClass = new Map<string, number>();
  for (const sec of sections) {
    const classId = String((sec as Record<string, unknown>).classId ?? "");
    sectionCountByClass.set(classId, (sectionCountByClass.get(classId) ?? 0) + 1);
  }

  const rows = classes.map((c) => {
    const row = c as Record<string, unknown>;
    return {
      id: String(row.id),
      name: String(row.name ?? "—"),
      sessionName: row.sessionId ? (sessionMap.get(String(row.sessionId)) ?? "—") : "—",
      sections: sectionCountByClass.get(String(row.id)) ?? 0,
      status: String(row.status ?? "ACTIVE"),
    };
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Academic"
        title="Classes"
        description="Academic classes grouped by session with their sections."
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={<BookOpen className="h-8 w-8" />}
          title="No classes found"
          description="Create classes from Academic Management to see them here."
        />
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Session</TableHead>
                <TableHead>Sections</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-foreground">{r.name}</TableCell>
                  <TableCell className="text-muted-foreground">{r.sessionName}</TableCell>
                  <TableCell className="text-muted-foreground">{r.sections}</TableCell>
                  <TableCell className="text-muted-foreground">{r.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
