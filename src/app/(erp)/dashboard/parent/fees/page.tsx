import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { getFeeSummary } from "@/features/parent/actions/parent.actions";

export const dynamic = "force-dynamic";

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function ParentFeesPage() {
  const res = await getFeeSummary();
  const fee = res.success ? res.data : null;

  return (
    <div className="space-y-6">
      <PageHeader title="Fee Summary" description="Outstanding fees and payment history for your child" />

      <div className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <p className="text-caption text-muted-foreground">Total Fees</p>
            <p className="mt-1 text-h4 font-semibold">{fee ? formatINR(fee.total) : "₹0"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-caption text-muted-foreground">Paid</p>
            <p className="mt-1 text-h4 font-semibold text-success">{fee ? formatINR(fee.paid) : "₹0"}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-caption text-muted-foreground">Pending</p>
            <p className="mt-1 text-h4 font-semibold text-destructive">{fee ? formatINR(fee.pending) : "₹0"}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          {!fee || fee.history.length === 0 ? (
            <p className="text-body-sm text-muted-foreground">No payments recorded yet.</p>
          ) : (
            <div className="space-y-2">
              {fee.history.map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between gap-2 border-b border-border pb-2 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="text-body-sm font-medium">{h.studentName}</p>
                    <p className="text-caption text-muted-foreground">
                      {h.receiptNumber} · {h.date}
                    </p>
                  </div>
                  <p className="font-semibold text-success">{formatINR(h.amount)}</p>
                </div>
              ))}
            </div>
          )}
          {fee?.dueDate && (
            <p className="mt-3 text-body-xs text-muted-foreground">Next due date: {fee.dueDate}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
