import Link from "next/link";
import { Wallet, TrendingUp, AlertTriangle, CalendarClock } from "lucide-react";

import { PageHeader } from "@/features/dashboard/components/page-header";
import { AppWorkspaceTabs } from "@/features/dashboard/shell/app-workspace-tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  getOutstandingDashboard,
  getFinanceReports,
} from "@/features/finance/actions/finance.actions";
import { StatCard } from "@/features/finance/components/stat-card";
import { FeeStatusBadge } from "@/features/finance/components/fee-status-badge";

export const dynamic = "force-dynamic";

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function FinanceDashboardPage() {
  const [dash, reports] = await Promise.all([getOutstandingDashboard(), getFinanceReports({})]);
  const dashData = dash.success ? dash.data : null;
  const reportData = reports.success ? reports.data : null;

  return (
    <div className="space-y-6">
      <PageHeader title="Finance Dashboard" description="Fee collection overview and outstanding balances" />

      <AppWorkspaceTabs workspace="finance" />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Outstanding"
          value={dashData ? formatINR(dashData.totalOutstanding) : "₹0"}
          icon={<Wallet className="size-5" />}
          tone="danger"
        />
        <StatCard
          label="Collected This Month"
          value={dashData ? formatINR(dashData.collectedThisMonth) : "₹0"}
          icon={<TrendingUp className="size-5" />}
          tone="success"
        />
        <StatCard
          label="Overdue Students"
          value={dashData?.overdueStudents ?? 0}
          icon={<AlertTriangle className="size-5" />}
          tone="warning"
        />
        <StatCard
          label="Upcoming Dues (30d)"
          value={dashData ? formatINR(dashData.upcomingDue) : "₹0"}
          icon={<CalendarClock className="size-5" />}
          tone="primary"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/dashboard/finance/categories"><Button variant="outline" className="w-full justify-start">Fee Categories</Button></Link>
            <Link href="/dashboard/finance/structures"><Button variant="outline" className="w-full justify-start">Fee Structures</Button></Link>
            <Link href="/dashboard/finance/student-fees"><Button variant="outline" className="w-full justify-start">Student Fees</Button></Link>
            <Link href="/dashboard/finance/collection"><Button variant="outline" className="w-full justify-start">Collect Payment</Button></Link>
            <Link href="/dashboard/finance/receipts"><Button variant="outline" className="w-full justify-start">Receipts</Button></Link>
            <Link href="/dashboard/finance/reports"><Button variant="outline" className="w-full justify-start">Reports</Button></Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Payments</CardTitle>
          </CardHeader>
          <CardContent>
            {!reportData || reportData.paymentHistory.length === 0 ? (
              <p className="text-body-sm text-muted-foreground">No payments recorded yet.</p>
            ) : (
              <div className="space-y-2">
                {reportData.paymentHistory.slice(0, 6).map((p) => (
                  <div key={p.id} className="flex items-center justify-between gap-2 border-b border-border pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="text-body-sm font-medium">{p.studentName}</p>
                      <p className="text-caption text-muted-foreground">{p.mode} · {p.paymentDate}</p>
                    </div>
                    <p className="font-semibold text-success">{formatINR(p.amount)}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Outstanding Summary</CardTitle>
        </CardHeader>
        <CardContent>
          {!reportData || reportData.outstanding.filter((o) => o.dueAmount > 0).length === 0 ? (
            <p className="text-body-sm text-muted-foreground">No outstanding fees.</p>
          ) : (
            <div className="space-y-2">
              {reportData.outstanding
                .filter((o) => o.dueAmount > 0)
                .slice(0, 8)
                .map((o) => (
                  <div key={o.id} className="flex items-center justify-between gap-2 border-b border-border pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className="text-body-sm font-medium">{o.studentName}</p>
                      <p className="text-caption text-muted-foreground">{o.categoryName} · {o.className}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-destructive">{formatINR(o.dueAmount)}</span>
                      <FeeStatusBadge status={o.status} />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
