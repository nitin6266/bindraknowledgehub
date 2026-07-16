"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { createDiscount } from "@/features/finance/actions/finance.actions";
import { DISCOUNT_TYPE_OPTIONS, DISCOUNT_MODE_OPTIONS } from "@/features/finance/finance.constants";

export function DiscountForm({ studentFeeId }: { studentFeeId: string }) {
  const router = useRouter();
  const [type, setType] = useState("SIBLING");
  const [mode, setMode] = useState("FIXED");
  const [value, setValue] = useState("");
  const [reason, setReason] = useState("");
  const [approvalRequired, setApprovalRequired] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await createDiscount({
        studentFeeId,
        type,
        mode,
        value: Number(value),
        reason,
        approvalRequired,
      });
      if (res.success) {
        router.refresh();
        setValue("");
        setReason("");
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
        <CardTitle>Add Discount / Scholarship</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="dtype">Type</Label>
              <Select id="dtype" value={type} onChange={(e) => setType(e.target.value)}>
                {DISCOUNT_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dmode">Mode</Label>
              <Select id="dmode" value={mode} onChange={(e) => setMode(e.target.value)}>
                {DISCOUNT_MODE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dvalue">
                {mode === "PERCENTAGE" ? "Percentage (%)" : "Amount (₹)"}
              </Label>
              <Input id="dvalue" type="number" value={value} onChange={(e) => setValue(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="dreason">Reason</Label>
            <Textarea id="dreason" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <label className="flex items-center gap-2 text-body-sm">
            <input
              type="checkbox"
              checked={approvalRequired}
              onChange={(e) => setApprovalRequired(e.target.checked)}
            />
            Requires approval
          </label>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={saving}>
            {saving ? "Adding…" : "Add Discount"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
