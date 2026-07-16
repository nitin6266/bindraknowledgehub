import Link from "next/link";

import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

import { getStudentFeeDetail } from "@/features/finance/actions/finance.actions";
import { FeeStatusBadge } from "@/features/finance/components/fee-status-badge";
import { DiscountForm } from "@/features/finance/components/discount-form";
import { ApproveDiscountButton } from "@/features/finance/components/approve-discount-button";

export const dynamic = "force-dynamic";

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export default async function StudentFeeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const res = await getStudentFeeDetail(id);
  const fee = res.success ? res.data : null;

  if (!fee) {
    return (
      <div className="space-y-6">
        <PageHeader title="Student Fee" />
        <Card>
          <CardContent className="p-6 text-body text-muted-foreground">Fee record not found.</CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={`${fee.studentName}`}
        description={`${fee.categoryName} · ${fee.className} · ${fee.admissionNumber}`}
        eyebrow="Student Fee"
        action={
          <Link href={`/dashboard/finance/collection?studentFee=${fee.id}`}>
            <Button>Record Payment</Button>
          </Link>
        }
      />

      <div className="grid gap-3 sm:grid-cols-4">
        <Card><CardContent className="p-4"><p className="text-caption text-muted-foreground">Total</p><p className="mt-1 text-h4 font-semibold">{formatINR(fee.totalAmount)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-caption text-muted-foreground">Discount</p><p className="mt-1 text-h4 font-semibold text-success">-{formatINR(fee.discountAmount)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-caption text-muted-foreground">Paid</p><p className="mt-1 text-h4 font-semibold text-success">{formatINR(fee.paidAmount)}</p></CardContent></Card>
        <Card><CardContent className="p-4"><p className="text-caption text-muted-foreground">Due</p><p className="mt-1 text-h4 font-semibold text-destructive">{formatINR(fee.dueAmount)}</p></CardContent></Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Installments</CardTitle></CardHeader>
          <CardContent>
            {fee.installments.length === 0 ? (
              <p className="text-body-sm text-muted-foreground">Single payment (no installments).</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Due Date</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fee.installments.map((i) => (
                    <TableRow key={i.id}>
                      <TableCell>{i.dueDate ?? "—"}</TableCell>
                      <TableCell className="text-right">{formatINR(i.amount)}</TableCell>
                      <TableCell><FeeStatusBadge status={i.status} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Discounts & Scholarships</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {fee.discounts.length === 0 ? (
              <p className="text-body-sm text-muted-foreground">No discounts applied.</p>
            ) : (
              fee.discounts.map((d) => (
                <div key={d.id} className="flex items-center justify-between gap-2 border-b border-border pb-2 last:border-0 last:pb-0">
                  <div>
                    <p className="text-body-sm font-medium">{d.type} ({d.mode} {d.value}{d.mode === "PERCENTAGE" ? "%" : ""})</p>
                    <p className="text-caption text-muted-foreground">-{formatINR(d.amount)}{d.reason ? ` · ${d.reason}` : ""}</p>
                  </div>
                  {d.status === "PENDING" ? <ApproveDiscountButton id={d.id} /> : <Badge variant="success">{d.status}</Badge>}
                </div>
              ))
            )}
            <DiscountForm studentFeeId={fee.id} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
        <CardContent>
          {fee.payments.length === 0 ? (
            <p className="text-body-sm text-muted-foreground">No payments recorded.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Collected By</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fee.payments.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.paymentDate}</TableCell>
                    <TableCell>{p.mode}</TableCell>
                    <TableCell>{p.collectedByName}</TableCell>
                    <TableCell className="text-right font-medium text-success">{formatINR(p.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Ledger</CardTitle></CardHeader>
        <CardContent>
          {fee.ledger.length === 0 ? (
            <p className="text-body-sm text-muted-foreground">No ledger entries.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                  <TableHead>Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fee.ledger.map((l) => (
                  <TableRow key={l.id}>
                    <TableCell>{l.createdAt}</TableCell>
                    <TableCell>{l.type}</TableCell>
                    <TableCell className="text-right">{formatINR(l.amount)}</TableCell>
                    <TableCell className="text-right">{formatINR(l.balanceAfter)}</TableCell>
                    <TableCell className="text-muted-foreground">{l.description}</TableCell>
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
