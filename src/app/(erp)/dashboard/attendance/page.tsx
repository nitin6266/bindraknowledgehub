import { assertRole } from "@/lib/auth/authorize";
import { ROLES } from "@/constants/roles";
import { prisma } from "@/database/prisma";
import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar } from "lucide-react";

export const dynamic = "force-dynamic";

interface AttendancePageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function AttendancePage({ searchParams }: AttendancePageProps) {
  await assertRole([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER]);

  const sp = await searchParams;
  const dateFilter = sp.date ? new Date(sp.date) : undefined;

  const records = await prisma.attendance.findMany({
    where: dateFilter ? { date: dateFilter } : {},
    orderBy: { date: "desc" },
    take: 100,
    select: { id: true, batchId: true, date: true, status: true, _count: { select: { details: true } } },
  });

  const batchIds = Array.from(new Set(records.map((r) => r.batchId)));
  const batches = await prisma.batch.findMany({
    where: { id: { in: batchIds }, deletedAt: null },
    select: { id: true, name: true },
  });
  const batchMap = new Map(batches.map((b) => [b.id, b.name]));

  const rows = records.map((r) => ({
    id: r.id,
    batchName: batchMap.get(r.batchId) ?? "—",
    date: r.date.toISOString().split("T")[0]!,
    status: r.status,
    students: r._count.details,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Management"
        title="Attendance"
        description="Recent attendance records across all batches."
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={<Calendar className="h-8 w-8" />}
          title="No attendance records"
          description="Attendance taken by teachers will appear here."
        />
      ) : (
        <div className="rounded-xl border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-foreground">{r.batchName}</TableCell>
                  <TableCell className="text-muted-foreground">{r.date}</TableCell>
                  <TableCell className="text-muted-foreground">{r.students}</TableCell>
                  <TableCell className="text-muted-foreground">{r.status}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
