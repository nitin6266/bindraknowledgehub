import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";

import { getParentContext, getChildAttendance } from "@/features/parent/actions/parent.actions";
import { ChildSwitcher } from "@/features/parent/components/child-switcher";
import { AttendanceCalendar } from "@/features/parent/components/attendance-calendar";

export const dynamic = "force-dynamic";

interface AttendancePageProps {
  searchParams: Promise<{ child?: string; year?: string; month?: string }>;
}

export default async function ParentAttendancePage({ searchParams }: AttendancePageProps) {
  const sp = await searchParams;
  const now = new Date();
  const year = Number(sp.year) || now.getUTCFullYear();
  const month = Number(sp.month) || now.getUTCMonth() + 1;

  const ctxRes = await getParentContext();
  const children = ctxRes.success ? ctxRes.data.children : [];
  const selectedChildId =
    (sp.child && children.some((c) => c.id === sp.child) ? sp.child : null) ??
    (ctxRes.success ? ctxRes.data.selectedChildId : null) ??
    children[0]?.id ??
    "";

  const attRes = selectedChildId
    ? await getChildAttendance(selectedChildId, year, month)
    : { success: true as const, data: [] };
  const days = attRes.success ? attRes.data : [];

  const present = days.filter((d) => d.status === "PRESENT").length;
  const absent = days.filter((d) => d.status === "ABSENT").length;
  const late = days.filter((d) => d.status === "LATE").length;

  const selectedChild = children.find((c) => c.id === selectedChildId);

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" description="Monthly attendance for your child" />
      {children.length > 0 && (
        <ChildSwitcher childOptions={children} selectedId={selectedChildId} />
      )}

      {!selectedChildId ? (
        <Card>
          <CardContent className="p-6 text-body text-muted-foreground">
            No child linked to your account.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <AttendanceCalendar
              days={days}
              year={year}
              month={month}
              studentName={selectedChild?.name ?? "your child"}
            />
          </div>
          <Card>
            <CardContent className="space-y-3 p-4">
              <p className="text-body-base font-semibold">This Month</p>
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-muted-foreground">Present</span>
                <span className="font-medium text-success">{present}</span>
              </div>
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-muted-foreground">Late</span>
                <span className="font-medium text-warning">{late}</span>
              </div>
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-muted-foreground">Absent</span>
                <span className="font-medium text-destructive">{absent}</span>
              </div>
              <div className="flex items-center justify-between border-t border-border pt-3 text-body-sm">
                <span className="text-muted-foreground">Total Marked</span>
                <span className="font-medium">{present + absent + late}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
