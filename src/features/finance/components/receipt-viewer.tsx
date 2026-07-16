import { ACADEMY_INFO } from "@/features/finance/finance.constants";
import type { ReceiptData } from "@/features/finance/finance.types";

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function ReceiptViewer({ receipt }: { receipt: ReceiptData }) {
  return (
    <div className="rounded-xl border border-border bg-white p-6 print:border-0">
      <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
        <div>
          <p className="text-h4 font-semibold text-foreground">{ACADEMY_INFO.name}</p>
          <p className="text-body-xs text-muted-foreground">{ACADEMY_INFO.address}</p>
          <p className="text-body-xs text-muted-foreground">{ACADEMY_INFO.contact}</p>
        </div>
        <div className="text-right">
          <p className="text-body-xs uppercase tracking-wide text-muted-foreground">Receipt</p>
          <p className="text-body-base font-semibold">{receipt.receiptNumber}</p>
          <p className="text-body-xs text-muted-foreground">{receipt.generatedAt}</p>
        </div>
      </div>

      <div className="grid gap-2 py-4 text-body-sm sm:grid-cols-2">
        <div>
          <p className="text-muted-foreground">Student</p>
          <p className="font-medium">{receipt.studentName}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Admission No.</p>
          <p className="font-medium">{receipt.admissionNumber}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Class</p>
          <p className="font-medium">{receipt.className}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Fee Category</p>
          <p className="font-medium">{receipt.categoryName}</p>
        </div>
        {receipt.parentName && (
          <div>
            <p className="text-muted-foreground">Parent</p>
            <p className="font-medium">{receipt.parentName}</p>
          </div>
        )}
      </div>

      <table className="w-full text-body-sm">
        <thead>
          <tr className="border-b border-border text-left text-muted-foreground">
            <th className="py-2">Particulars</th>
            <th className="py-2 text-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {receipt.lines.map((line, i) => (
            <tr key={i} className="border-b border-border/60">
              <td className="py-2">{line.label}</td>
              <td className="py-2 text-right">{formatINR(line.amount)}</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="font-semibold">
            <td className="py-2">Balance Due</td>
            <td className="py-2 text-right">{formatINR(receipt.balance)}</td>
          </tr>
        </tfoot>
      </table>

      <p className="mt-4 text-center text-caption text-muted-foreground">
        This is a computer-generated receipt. Thank you for your payment.
      </p>
    </div>
  );
}
