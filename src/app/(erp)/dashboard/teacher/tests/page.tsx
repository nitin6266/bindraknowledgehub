import Link from "next/link";

import { listTests } from "@/features/teacher/actions/teacher.actions";
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

export default async function TeacherTestsPage() {
  const result = await listTests({});
  const tests = result.success ? (result.data as never[]) : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader title="Tests" description="Schedule and manage tests for your batches" />
        <Button asChild>
          <Link href="/dashboard/teacher/tests/new">New Test</Link>
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Test Date</TableHead>
                <TableHead>Max Marks</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                    No tests yet.
                  </TableCell>
                </TableRow>
              ) : (
                tests.map((t: never) => (
                  <TableRow key={(t as { id: string }).id}>
                    <TableCell className="font-medium">{(t as { title: string }).title}</TableCell>
                    <TableCell>{(t as { subjectName: string }).subjectName}</TableCell>
                    <TableCell>{(t as { batchName: string }).batchName}</TableCell>
                    <TableCell>{(t as { testDate: string }).testDate}</TableCell>
                    <TableCell>{(t as { maxMarks: number }).maxMarks}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{(t as { status: string }).status}</Badge>
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
