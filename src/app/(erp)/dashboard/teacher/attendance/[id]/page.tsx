import Link from "next/link";

import { getAttendanceDetail } from "@/features/teacher/actions/teacher.actions";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const dynamic = "force-dynamic";

export default async function AttendanceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getAttendanceDetail(id);
  const details = result.success ? (result.data as never[]) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Attendance Detail" description="Students marked for this record" />
        <Button variant="outline" asChild>
          <Link href="/dashboard/teacher/attendance">Back to Attendance</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Adm. No.</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Remarks</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {details.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                    No records found.
                  </TableCell>
                </TableRow>
              ) : (
                details.map((d: never) => (
                  <TableRow key={(d as { studentId: string }).studentId}>
                    <TableCell>{(d as { admissionNumber: string }).admissionNumber}</TableCell>
                    <TableCell className="font-medium">{(d as { fullName: string }).fullName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{(d as { status: string }).status}</Badge>
                    </TableCell>
                    <TableCell>{(d as { remarks: string | null }).remarks ?? "—"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
