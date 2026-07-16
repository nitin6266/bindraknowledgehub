import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import {
  getStudentFees,
  getFinanceOptions,
} from "@/features/finance/actions/finance.actions";
import { FeeFiltersBar } from "@/features/finance/components/fee-filters";
import { FeeStatusBadge } from "@/features/finance/components/fee-status-badge";
import { StudentFeeAssignment } from "@/features/finance/components/student-fee-assignment";
import { FEE_STATUS_OPTIONS } from "@/features/finance/finance.constants";
import type { FeeFilters } from "@/features/finance/finance.types";

export const dynamic = "force-dynamic";

interface StudentFeesPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function StudentFeesPage({ searchParams }: StudentFeesPageProps) {
  const sp = await searchParams;
  const filters: FeeFilters = {
    sessionId: sp.sessionId,
    classId: sp.classId,
    batchId: sp.batchId,
    categoryId: sp.categoryId,
    status: sp.status,
    search: sp.search,
  };

  const [feesRes, optRes] = await Promise.all([getStudentFees(filters), getFinanceOptions()]);
  const fees = feesRes.success ? feesRes.data : [];
  const options = optRes.success ? optRes.data : { sessions: [], classes: [], batches: [], categories: [], structures: [] };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Student Fees"
        description="Assigned fees, payments and outstanding balances"
        action={
          sp.mode !== "new" ? (
            <Link href="/dashboard/finance/student-fees?mode=new">
              <Button>Assign Fee</Button>
            </Link>
          ) : undefined
        }
      />

      {sp.mode === "new" && (
        <StudentFeeAssignment
          options={{
            sessions: options.sessions,
            classes: options.classes,
            batches: options.batches,
            structures: options.structures,
          }}
        />
      )}

      <FeeFiltersBar
        options={{
          sessions: options.sessions,
          classes: options.classes,
          batches: options.batches,
          categories: options.categories,
        }}
        showStatus
        statusOptions={FEE_STATUS_OPTIONS as unknown as { value: string; label: string }[]}
      />

      <div className="rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Admission</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Total</TableHead>
              <TableHead className="text-right">Paid</TableHead>
              <TableHead className="text-right">Due</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center text-muted-foreground">
                  No student fees found.
                </TableCell>
              </TableRow>
            ) : (
              fees.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.studentName}</TableCell>
                  <TableCell>{f.admissionNumber}</TableCell>
                  <TableCell>{f.className}</TableCell>
                  <TableCell>{f.categoryName}</TableCell>
                  <TableCell className="text-right">{formatINR(f.totalAmount)}</TableCell>
                  <TableCell className="text-right">{formatINR(f.paidAmount)}</TableCell>
                  <TableCell className="text-right text-destructive">{formatINR(f.dueAmount)}</TableCell>
                  <TableCell><FeeStatusBadge status={f.status} /></TableCell>
                  <TableCell>
                    <Link href={`/dashboard/finance/student-fees/${f.id}`} className="text-body-xs font-medium text-primary hover:underline">
                      View
                    </Link>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
