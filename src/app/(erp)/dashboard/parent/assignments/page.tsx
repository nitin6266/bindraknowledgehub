import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

import { getParentContext, getChildAssignments } from "@/features/parent/actions/parent.actions";
import { ChildSwitcher } from "@/features/parent/components/child-switcher";
import { DocumentDownloadButton } from "@/features/parent/components/document-download-button";

export const dynamic = "force-dynamic";

interface AssignmentsPageProps {
  searchParams: Promise<{ child?: string }>;
}

export default async function ParentAssignmentsPage({ searchParams }: AssignmentsPageProps) {
  const sp = await searchParams;
  const ctxRes = await getParentContext();
  const children = ctxRes.success ? ctxRes.data.children : [];
  const selectedChildId =
    (sp.child && children.some((c) => c.id === sp.child) ? sp.child : null) ??
    (ctxRes.success ? ctxRes.data.selectedChildId : null) ??
    children[0]?.id ??
    "";

  const assRes = selectedChildId ? await getChildAssignments(selectedChildId) : null;
  const assignments = assRes?.success ? assRes.data : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Assignments" description="Homework and tasks assigned to your child" />
      {children.length > 0 && <ChildSwitcher childOptions={children} selectedId={selectedChildId} />}

      {!selectedChildId ? (
        <Card>
          <CardContent className="p-6 text-body text-muted-foreground">No child linked to your account.</CardContent>
        </Card>
      ) : assignments.length === 0 ? (
        <EmptyState title="No assignments yet" description="Assignments for this child will appear here." />
      ) : (
        <div className="grid gap-3">
          {assignments.map((a) => {
            const overdue = a.dueDate ? new Date(a.dueDate).getTime() < Date.now() : false;
            return (
              <Card key={a.id}>
                <CardContent className="space-y-2 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-body-base font-semibold">{a.title}</p>
                    <Badge variant="outline">{a.subjectName}</Badge>
                  </div>
                  {a.description && <p className="text-body-sm text-muted-foreground">{a.description}</p>}
                  <div className="flex flex-wrap items-center gap-3 text-body-xs text-muted-foreground">
                    <span className={overdue ? "font-medium text-destructive" : ""}>
                      Due: {a.dueDate ?? "—"}
                    </span>
                  </div>
                  {a.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {a.attachments.map((at) => (
                        <DocumentDownloadButton
                          key={at.id}
                          url={at.fileUrl}
                          studentId={selectedChildId}
                          documentType="Assignment"
                          label={`Download ${at.fileName}`}
                        />
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
