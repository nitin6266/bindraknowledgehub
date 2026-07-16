import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";

import { listAnnouncements } from "@/features/parent/actions/parent.actions";

export const dynamic = "force-dynamic";

export default async function ParentAnnouncementsPage() {
  const res = await listAnnouncements();
  const announcements = res.success ? res.data : [];

  return (
    <div className="space-y-6">
      <PageHeader title="Announcements" description="Important updates from the school" />

      {announcements.length === 0 ? (
        <EmptyState title="No announcements" description="School announcements will appear here." />
      ) : (
        <div className="grid gap-3">
          {announcements.map((a) => (
            <Card key={a.id}>
              <CardContent className="space-y-2 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-body-base font-semibold">{a.title}</p>
                  <Badge variant="outline">
                    {a.audience === "ALL" ? "Everyone" : a.batchName ?? "Batch"}
                  </Badge>
                </div>
                <p className="whitespace-pre-line text-body-sm text-muted-foreground">{a.body}</p>
                <p className="text-caption text-muted-foreground">
                  {a.publishedByName} · {a.publishedAt}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
