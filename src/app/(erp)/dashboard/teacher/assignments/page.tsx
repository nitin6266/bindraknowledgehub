import Link from "next/link";

import { listAssignments } from "@/features/teacher/actions/teacher.actions";
import { PageHeader } from "@/features/dashboard/components/page-header";
import { AppWorkspaceTabs } from "@/features/dashboard/shell/app-workspace-tabs";
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

export default async function TeacherAssignmentsPage() {
  const result = await listAssignments({});
  const assignments = result.success ? (result.data as never[]) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader eyebrow="Teacher" title="Assignments" description="Create and manage assignments for your batches" />
        <Button asChild>
          <Link href="/dashboard/teacher/assignments/new">New Assignment</Link>
        </Button>
      </div>

      <AppWorkspaceTabs workspace="assignments" />

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Attachments</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No assignments yet.
                  </TableCell>
                </TableRow>
              ) : (
                assignments.map((a: never) => (
                  <TableRow key={(a as { id: string }).id}>
                    <TableCell className="font-medium">{(a as { title: string }).title}</TableCell>
                    <TableCell>{(a as { subjectName: string }).subjectName}</TableCell>
                    <TableCell>{(a as { batchName: string }).batchName}</TableCell>
                    <TableCell>{(a as { dueDate: string }).dueDate}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{(a as { status: string }).status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {(a as { attachmentsCount: number }).attachmentsCount}
                    </TableCell>
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
