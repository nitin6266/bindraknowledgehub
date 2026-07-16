"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { collectPayment } from "@/features/finance/actions/finance.actions";
import { PAYMENT_MODE_OPTIONS } from "@/features/finance/finance.constants";

interface FeeOption {
  id: string;
  label: string;
  dueAmount: number;
}

interface FeeCollectionScreenProps {
  studentFees: FeeOption[];
  defaultId?: string;
}

function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function FeeCollectionScreen({ studentFees, defaultId }: FeeCollectionScreenProps) {
  const router = useRouter();
  const initialId = defaultId && studentFees.some((s) => s.id === defaultId) ? defaultId : studentFees[0]?.id ?? "";
  const [studentFeeId, setStudentFeeId] = useState(initialId);
  const selected = studentFees.find((s) => s.id === studentFeeId);
  const [amount, setAmount] = useState(selected ? String(selected.dueAmount) : "");
  const [mode, setMode] = useState("CASH");
  const [transactionRef, setTransactionRef] = useState("");
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]!);
  const [remarks, setRemarks] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onSelectFee(id: string) {
    setStudentFeeId(id);
    const opt = studentFees.find((s) => s.id === id);
    setAmount(opt ? String(opt.dueAmount) : "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await collectPayment({
        studentFeeId,
        amount: Number(amount),
        mode,
        transactionRef,
        paymentDate,
        remarks,
      });
      if (res.success) {
        router.push("/dashboard/finance/receipts");
        router.refresh();
      } else {
        setError(res.error);
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (!studentFees.length) {
    return (
      <Card>
        <CardContent className="p-6 text-body text-muted-foreground">
          No student fees found. Assign fees first.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Record Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="fee">Student Fee</Label>
            <Select id="fee" value={studentFeeId} onChange={(e) => onSelectFee(e.target.value)} required>
              {studentFees.map((s) => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </Select>
          </div>
          {selected && (
            <p className="text-body-sm text-muted-foreground">Outstanding: {formatINR(selected.dueAmount)}</p>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mode">Payment Mode</Label>
              <Select id="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
                {PAYMENT_MODE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">Payment Date</Label>
              <Input id="date" type="date" value={paymentDate} onChange={(e) => setPaymentDate(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ref">Transaction Reference</Label>
              <Input id="ref" value={transactionRef} onChange={(e) => setTransactionRef(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="remarks">Remarks</Label>
            <Textarea id="remarks" value={remarks} onChange={(e) => setRemarks(e.target.value)} />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={saving}>
            {saving ? "Recording…" : "Collect Payment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
