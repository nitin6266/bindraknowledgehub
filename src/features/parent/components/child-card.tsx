import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ChildSummary } from "@/features/parent/parent.types";

interface ChildCardProps {
  child: ChildSummary;
}

export function ChildCard({ child }: ChildCardProps) {
  const pct = child.attendance.percentage;
  const attendanceTone = pct >= 90 ? "success" : pct >= 75 ? "accent" : "outline";
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-body-base font-semibold">{child.name}</p>
            <p className="text-body-xs text-muted-foreground">
              {child.className} · {child.sectionName}
            </p>
            <p className="text-body-xs text-muted-foreground">#{child.admissionNo}</p>
          </div>
          <Badge variant={attendanceTone}>{pct}% attendance</Badge>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Link
            href={`/dashboard/parent/attendance?child=${child.id}`}
            className="text-body-xs font-medium text-primary hover:underline"
          >
            Attendance
          </Link>
          <Link
            href={`/dashboard/parent/assignments?child=${child.id}`}
            className="text-body-xs font-medium text-primary hover:underline"
          >
            Assignments
          </Link>
          <Link
            href={`/dashboard/parent/results?child=${child.id}`}
            className="text-body-xs font-medium text-primary hover:underline"
          >
            Results
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
