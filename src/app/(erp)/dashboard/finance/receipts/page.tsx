import { PageHeader } from "@/components/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { getReceipts, getReceipt } from "@/features/finance/actions/finance.actions";
import { ReceiptViewer } from "@/features/finance/components/receipt-viewer";

export const dynamic = "force-dynamic";

interface ReceiptsPageProps {
  searchParams: Promise<{ id?: string }>;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function ReceiptsPage({ searchParams }: ReceiptsPageProps) {
  const sp = await searchParams;
  const [listRes, detailRes] = await Promise.all([getReceipts(), sp.id ? getReceipt(sp.id) : Promise.resolve({ success: true as const, data: null })]);

  const receipts = listRes.success ? listRes.data : [];
  const receipt = detailRes.success ? detailRes.data : null;

  return (
    <div className="space-y-6">
      <PageHeader title="Receipts" description="View and print collected payment receipts" />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card>
          <CardContent className="space-y-2 p-4">
            <p className="text-body-xs font-medium uppercase tracking-wide text-muted-foreground">All Receipts</p>
            {receipts.length === 0 ? (
              <p className="text-body-sm text-muted-foreground">No receipts yet.</p>
            ) : (
              receipts.map((r) => (
                <a
                  key={r.id}
                  href={`/dashboard/finance/receipts?id=${r.id}`}
                  className="flex items-center justify-between gap-2 rounded-lg px-2 py-2 hover:bg-muted"
                >
                  <div>
                    <p className="text-body-sm font-medium">{r.receiptNumber}</p>
                    <p className="text-caption text-muted-foreground">{r.studentName}</p>
                  </div>
                  <span className="text-body-xs font-semibold text-success">{formatINR(r.paidAmount)}</span>
                </a>
              ))
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          {receipt ? (
            <div className="space-y-3">
              <ReceiptViewer receipt={receipt} />
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => window.print()}>Print</Button>
              </div>
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-body text-muted-foreground">
                Select a receipt to view its details.
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
