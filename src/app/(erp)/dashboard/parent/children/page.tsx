import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import { getParentChildren } from "@/features/parent/actions/parent.actions";

export const dynamic = "force-dynamic";

export default async function ParentChildrenPage() {
  const res = await getParentChildren();
  const children = res.success ? res.data : [];

  return (
    <div className="space-y-6">
      <PageHeader title="My Children" description="Profiles and quick links for each child" />

      {children.length === 0 ? (
        <Card>
          <CardContent className="p-6 text-body text-muted-foreground">
            No children are linked to your account yet.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {children.map((child) => (
            <Card key={child.id}>
              <CardHeader>
                <CardTitle>{child.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-body-sm">
                <p className="text-muted-foreground">Admission No: {child.admissionNo}</p>
                <p className="text-muted-foreground">Class: {child.className} · {child.sectionName}</p>
                <p className="text-muted-foreground">Batch: {child.batchName}</p>
                <div className="flex items-center justify-between pt-2">
                  <Badge variant={child.attendance.percentage >= 90 ? "success" : "outline"}>
                    {child.attendance.percentage}% attendance
                  </Badge>
                  <span className="text-caption text-muted-foreground">
                    {child.attendance.present}P / {child.attendance.absent}A / {child.attendance.late}L
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  <a href={`/dashboard/parent/attendance?child=${child.id}`} className="text-body-xs font-medium text-primary hover:underline">Attendance</a>
                  <a href={`/dashboard/parent/assignments?child=${child.id}`} className="text-body-xs font-medium text-primary hover:underline">Assignments</a>
                  <a href={`/dashboard/parent/results?child=${child.id}`} className="text-body-xs font-medium text-primary hover:underline">Results</a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
