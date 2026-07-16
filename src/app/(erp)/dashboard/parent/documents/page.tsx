import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";

import { getDocuments } from "@/features/parent/actions/parent.actions";
import { DocumentDownloadButton } from "@/features/parent/components/document-download-button";

export const dynamic = "force-dynamic";

export default async function ParentDocumentsPage() {
  const res = await getDocuments();
  const documents = res.success ? res.data : [];

  const byChild = documents.reduce<Record<string, typeof documents>>((acc, doc) => {
    (acc[doc.studentId] ??= []).push(doc);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <PageHeader title="Documents" description="Download assignments, circulars and study material" />

      <Card>
        <CardHeader>
          <CardTitle>Assignments</CardTitle>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <EmptyState title="No documents yet" description="Shared documents for your child will appear here." />
          ) : (
            <div className="space-y-4">
              {Object.entries(byChild).map(([studentId, docs]) => (
                <div key={studentId} className="space-y-2">
                  <p className="text-body-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {docs[0]?.studentName}
                  </p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {docs.map((d) => (
                      <div
                        key={d.id}
                        className="flex items-center justify-between gap-2 rounded-lg border border-border p-3"
                      >
                        <span className="truncate text-body-sm">{d.title}</span>
                        <DocumentDownloadButton url={d.url} studentId={studentId} documentType={d.type} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4 text-body-sm text-muted-foreground">
            Report Cards — available after exams are graded.
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-body-sm text-muted-foreground">
            Study Material — shared by teachers per subject.
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-body-sm text-muted-foreground">
            Circulars — school-wide notices and forms.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
