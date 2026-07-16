import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

import { getParentContext, getChildResults } from "@/features/parent/actions/parent.actions";
import { ChildSwitcher } from "@/features/parent/components/child-switcher";

export const dynamic = "force-dynamic";

interface ResultsPageProps {
  searchParams: Promise<{ child?: string }>;
}

export default async function ParentResultsPage({ searchParams }: ResultsPageProps) {
  const sp = await searchParams;
  const ctxRes = await getParentContext();
  const children = ctxRes.success ? ctxRes.data.children : [];
  const selectedChildId =
    (sp.child && children.some((c) => c.id === sp.child) ? sp.child : null) ??
    (ctxRes.success ? ctxRes.data.selectedChildId : null) ??
    children[0]?.id ??
    "";

  const resRes = selectedChildId ? await getChildResults(selectedChildId) : null;
  const results = resRes?.success ? resRes.data : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Test Results" description="Marks and performance for your child" />
      {children.length > 0 && <ChildSwitcher childOptions={children} selectedId={selectedChildId} />}

      {!selectedChildId ? (
        <Card>
          <CardContent className="p-6 text-body text-muted-foreground">No child linked to your account.</CardContent>
        </Card>
      ) : results.length === 0 ? (
        <EmptyState title="No results yet" description="Published test results will appear here." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {results.map((r) => {
            const pctTone =
              r.percentage == null ? "outline" : r.percentage >= 75 ? "success" : r.percentage >= 40 ? "accent" : "outline";
            return (
              <Card key={r.id}>
                <CardContent className="space-y-2 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-body-base font-semibold">{r.testName}</p>
                    <Badge variant="outline">{r.subjectName}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-body-sm">
                    <div>
                      <p className="text-caption text-muted-foreground">Score</p>
                      <p className="font-medium">
                        {r.isAbsent ? "Absent" : r.score != null ? `${r.score} / ${r.maxScore}` : "—"}
                      </p>
                    </div>
                    <div>
                      <p className="text-caption text-muted-foreground">Percentage</p>
                      <p className="font-medium">{r.percentage != null ? `${r.percentage}%` : "—"}</p>
                    </div>
                    <div>
                      <p className="text-caption text-muted-foreground">Test Date</p>
                      <p className="font-medium">{r.testDate ?? "—"}</p>
                    </div>
                    <div>
                      <p className="text-caption text-muted-foreground">Status</p>
                      <p className="font-medium">{r.isAbsent ? "Absent" : "Graded"}</p>
                    </div>
                  </div>
                  {r.note && <p className="text-body-xs text-muted-foreground">Remarks: {r.note}</p>}
                  {pctTone !== "outline" && (
                    <Badge variant={pctTone as "success" | "accent"}>
                      {r.percentage != null ? `${r.percentage}%` : ""}
                    </Badge>
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
