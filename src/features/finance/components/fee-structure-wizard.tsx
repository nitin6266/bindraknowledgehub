"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { createFeeStructure } from "@/features/finance/actions/finance.actions";
import type { Option } from "@/features/teacher/teacher.types";

interface FeeStructureWizardProps {
  options: {
    sessions: Option[];
    classes: Option[];
    batches: Option[];
    categories: Option[];
  };
}

export function FeeStructureWizard({ options }: FeeStructureWizardProps) {
  const router = useRouter();
  const [sessionId, setSessionId] = useState(options.sessions[0]?.value ?? "");
  const [classId, setClassId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [lateFeeAmount, setLateFeeAmount] = useState("");
  const [lateFeeAfterDays, setLateFeeAfterDays] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await createFeeStructure({
        sessionId,
        classId,
        batchId,
        categoryId,
        amount: Number(amount),
        dueDate,
        lateFeeAmount: Number(lateFeeAmount || 0),
        lateFeeAfterDays: Number(lateFeeAfterDays || 0),
      });
      if (res.success) {
        router.push("/dashboard/finance/structures");
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Fee Structure</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="session">Academic Session</Label>
              <Select id="session" value={sessionId} onChange={(e) => setSessionId(e.target.value)} required>
                <option value="">Select session</option>
                {options.sessions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="class">Class</Label>
              <Select id="class" value={classId} onChange={(e) => setClassId(e.target.value)} required>
                <option value="">Select class</option>
                {options.classes.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="batch">Batch (optional)</Label>
              <Select id="batch" value={batchId} onChange={(e) => setBatchId(e.target.value)}>
                <option value="">All batches</option>
                {options.batches.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category">Fee Category</Label>
              <Select id="category" value={categoryId} onChange={(e) => setCategoryId(e.target.value)} required>
                <option value="">Select category</option>
                {options.categories.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input id="amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lateFee">Late Fee (₹)</Label>
              <Input id="lateFee" type="number" value={lateFeeAmount} onChange={(e) => setLateFeeAmount(e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="lateDays">Late Fee After (days)</Label>
              <Input id="lateDays" type="number" value={lateFeeAfterDays} onChange={(e) => setLateFeeAfterDays(e.target.value)} />
            </div>
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={saving}>
            {saving ? "Saving…" : "Create Structure"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
