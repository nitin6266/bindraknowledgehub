import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

import { getParentContext, listLeaveRequests } from "@/features/parent/actions/parent.actions";
import { LeaveWizard } from "@/features/parent/components/leave-wizard";
import { LeaveStatusBadge } from "@/features/parent/components/leave-status-badge";

export const dynamic = "force-dynamic";

interface LeavePageProps {
  searchParams: Promise<{ mode?: string; edit?: string }>;
}

export default async function ParentLeavePage({ searchParams }: LeavePageProps) {
  const sp = await searchParams;
  const showWizard = sp.mode === "new" || Boolean(sp.edit);

  const [ctxRes, listRes] = await Promise.all([getParentContext(), listLeaveRequests()]);
  const children = ctxRes.success ? ctxRes.data.children : [];
  const leaves = listRes.success ? listRes.data : [];

  const editing = sp.edit ? leaves.find((l) => l.id === sp.edit) : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Leave Requests"
        description="Apply for leave and track the status of your requests"
        action={
          !showWizard ? (
            <Link href="/dashboard/parent/leave?mode=new">
              <Button>Apply for Leave</Button>
            </Link>
          ) : undefined
        }
      />

      {showWizard ? (
        <LeaveWizard
          childOptions={children.map((c) => ({ id: c.id, name: c.name }))}
          initial={
            editing
              ? {
                  id: editing.id,
                  studentId: editing.studentId,
                  fromDate: editing.fromDate,
                  toDate: editing.toDate,
                  reason: editing.reason,
                  attachmentUrl: editing.attachmentUrl,
                }
              : undefined
          }
        />
      ) : leaves.length === 0 ? (
        <EmptyState title="No leave requests" description="Apply for leave when your child needs time off." />
      ) : (
        <div className="grid gap-3">
          {leaves.map((l) => (
            <Card key={l.id}>
              <CardContent className="space-y-2 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-body-base font-semibold">{l.studentName}</p>
                  <LeaveStatusBadge status={l.status} />
                </div>
                <p className="text-body-sm text-muted-foreground">
                  {l.fromDate} to {l.toDate}
                </p>
                <p className="text-body-sm">{l.reason}</p>
                {l.reviewNote && (
                  <p className="text-body-xs text-muted-foreground">Review note: {l.reviewNote}</p>
                )}
                <div className="flex flex-wrap gap-2 pt-1">
                  {l.attachmentUrl && (
                    <a
                      href={l.attachmentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-body-xs font-medium text-primary hover:underline"
                    >
                      View attachment
                    </a>
                  )}
                  {l.status === "PENDING" && (
                    <Link
                      href={`/dashboard/parent/leave?edit=${l.id}`}
                      className="text-body-xs font-medium text-primary hover:underline"
                    >
                      Edit
                    </Link>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
