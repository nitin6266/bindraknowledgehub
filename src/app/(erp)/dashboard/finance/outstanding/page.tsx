import { PageHeader } from "@/components/page-header";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import {
  getOutstandingDashboard,
  getStudentFees,
  getFinanceOptions,
} from "@/features/finance/actions/finance.actions";
import { StatCard } from "@/features/finance/components/stat-card";
import { FeeStatusBadge } from "@/features/finance/components/fee-status-badge";
import { FeeFiltersBar } from "@/features/finance/components/fee-filters";
import { FEE_STATUS_OPTIONS } from "@/features/finance/finance.constants";
import type { FeeFilters } from "@/features/finance/finance.types";

export const dynamic = "force-dynamic";

interface OutstandingPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function OutstandingPage({ searchParams }: OutstandingPageProps) {
  const sp = await searchParams;
  const filters: FeeFilters = {
    sessionId: sp.sessionId,
    classId: sp.classId,
    batchId: sp.batchId,
    categoryId: sp.categoryId,
    status: sp.status,
    search: sp.search,
  };

  const [dashRes, feesRes, optRes] = await Promise.all([
    getOutstandingDashboard(),
    getStudentFees({ ...filters, status: filters.status ?? "PENDING" }),
    getFinanceOptions(),
  ]);

  const dash = dashRes.success ? dashRes.data : null;
  const fees = feesRes.success ? feesRes.data.filter((f) => f.dueAmount > 0) : [];
  const options = optRes.success ? optRes.data : { sessions: [], classes: [], batches: [], categories: [], structures: [] };

  return (
    <div className="space-y-6">
      <PageHeader title="Outstanding Fees" description="Students with pending or overdue balances" />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Outstanding" value={dash ? formatINR(dash.totalOutstanding) : "₹0"} icon={<span />} tone="danger" />
        <StatCard label="Collected This Month" value={dash ? formatINR(dash.collectedThisMonth) : "₹0"} icon={<span />} tone="success" />
        <StatCard label="Overdue Students" value={dash?.overdueStudents ?? 0} icon={<span />} tone="warning" />
        <StatCard label="Upcoming Dues (30d)" value={dash ? formatINR(dash.upcomingDue) : "₹0"} icon={<span />} tone="primary" />
      </div>

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
              <TableHead className="text-right">Due</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">No outstanding fees.</TableCell>
              </TableRow>
            ) : (
              fees.map((f) => (
                <TableRow key={f.id}>
                  <TableCell className="font-medium">{f.studentName}</TableCell>
                  <TableCell>{f.admissionNumber}</TableCell>
                  <TableCell>{f.className}</TableCell>
                  <TableCell>{f.categoryName}</TableCell>
                  <TableCell className="text-right text-destructive">{formatINR(f.dueAmount)}</TableCell>
                  <TableCell><FeeStatusBadge status={f.status} /></TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
