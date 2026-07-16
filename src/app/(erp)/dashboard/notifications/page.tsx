import { assertRole } from "@/lib/auth/authorize";
import { ROLES } from "@/constants/roles";
import { prisma } from "@/database/prisma";
import { parentRepository } from "@/repositories/parent.repository";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  await assertRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.PARENT]);

  const batchIds = (
    await prisma.batch.findMany({ where: { deletedAt: null }, select: { id: true } })
  ).map((b) => b.id);

  const announcements = await parentRepository.listAnnouncements(batchIds);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Account"
        title="Notifications"
        description="School-wide announcements and updates."
      />

      {announcements.length === 0 ? (
        <EmptyState
          icon={<Bell className="h-8 w-8" />}
          title="No notifications"
          description="Announcements published by the school will appear here."
        />
      ) : (
        <div className="space-y-4">
          {announcements.map((a) => (
            <Card key={a.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <CardTitle className="text-body font-semibold">{a.title}</CardTitle>
                  {a.batchName ? (
                    <span className="shrink-0 rounded-full bg-primary/10 px-2 py-0.5 text-caption text-primary">
                      {a.batchName}
                    </span>
                  ) : null}
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-body-sm text-muted-foreground">{a.body}</p>
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
