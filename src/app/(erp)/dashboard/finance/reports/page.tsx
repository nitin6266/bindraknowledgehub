import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import {
  getFinanceReports,
  getFinanceOptions,
} from "@/features/finance/actions/finance.actions";
import { FeeFiltersBar } from "@/features/finance/components/fee-filters";
import { FeeStatusBadge } from "@/features/finance/components/fee-status-badge";
import type { FeeFilters } from "@/features/finance/finance.types";

export const dynamic = "force-dynamic";

interface ReportsPageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function FinanceReportsPage({ searchParams }: ReportsPageProps) {
  const sp = await searchParams;
  const filters: FeeFilters = {
    sessionId: sp.sessionId,
    classId: sp.classId,
    batchId: sp.batchId,
    categoryId: sp.categoryId,
    search: sp.search,
  };

  const [repRes, optRes] = await Promise.all([getFinanceReports(filters), getFinanceOptions()]);
  const report = repRes.success ? repRes.data : null;
  const options = optRes.success ? optRes.data : { sessions: [], classes: [], batches: [], categories: [], structures: [] };

  return (
    <div className="space-y-6">
      <PageHeader title="Fee Reports" description="Collection, outstanding, discounts and payment history" />

      <FeeFiltersBar
        options={{
          sessions: options.sessions,
          classes: options.classes,
          batches: options.batches,
          categories: options.categories,
        }}
      />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-caption text-muted-foreground">Total Collected</p>
            <p className="mt-1 text-h4 font-semibold text-success">{report ? formatINR(report.collectionTotal) : "₹0"}</p>
          </CardContent>
        </Card>
        <Card className="sm:col-span-2">
          <CardHeader><CardTitle>Collection by Mode</CardTitle></CardHeader>
          <CardContent>
            {!report || report.collectionByMode.length === 0 ? (
              <p className="text-body-sm text-muted-foreground">No collections yet.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {report.collectionByMode.map((m) => (
                  <span key={m.mode} className="rounded-lg border border-border px-3 py-1.5 text-body-sm">
                    {m.mode}: <span className="font-semibold">{formatINR(m.amount)}</span>
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
        <CardContent>
          {!report || report.paymentHistory.length === 0 ? (
            <p className="text-body-sm text-muted-foreground">No payments recorded.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.paymentHistory.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.paymentDate}</TableCell>
                    <TableCell className="font-medium">{p.studentName}</TableCell>
                    <TableCell>{p.mode}</TableCell>
                    <TableCell className="text-right font-semibold text-success">{formatINR(p.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Discounts & Scholarships</CardTitle></CardHeader>
        <CardContent>
          {!report || report.discounts.length === 0 ? (
            <p className="text-body-sm text-muted-foreground">No discounts approved.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.discounts.map((d) => (
                  <TableRow key={d.id}>
                    <TableCell className="font-medium">{d.studentName}</TableCell>
                    <TableCell>{d.type}</TableCell>
                    <TableCell className="text-right text-success">-{formatINR(d.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Outstanding</CardTitle></CardHeader>
        <CardContent>
          {!report || report.outstanding.filter((o) => o.dueAmount > 0).length === 0 ? (
            <p className="text-body-sm text-muted-foreground">No outstanding fees.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Due</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {report.outstanding.filter((o) => o.dueAmount > 0).map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.studentName}</TableCell>
                    <TableCell>{o.className}</TableCell>
                    <TableCell>{o.categoryName}</TableCell>
                    <TableCell className="text-right text-destructive">{formatINR(o.dueAmount)}</TableCell>
                    <TableCell><FeeStatusBadge status={o.status} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
