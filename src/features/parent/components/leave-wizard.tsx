"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { createLeaveRequest, updateLeaveRequest } from "@/features/parent/actions/parent.actions";

interface ChildOption {
  id: string;
  name: string;
}

interface LeaveWizardProps {
  childOptions: ChildOption[];
  initial?: {
    id: string;
    studentId: string;
    fromDate: string;
    toDate: string;
    reason: string;
    attachmentUrl?: string | null;
  };
}

export function LeaveWizard({ childOptions, initial }: LeaveWizardProps) {
  const router = useRouter();
  const isEdit = Boolean(initial?.id);

  const [studentId, setStudentId] = useState(initial?.studentId ?? childOptions[0]?.id ?? "");
  const [fromDate, setFromDate] = useState(initial?.fromDate ?? "");
  const [toDate, setToDate] = useState(initial?.toDate ?? "");
  const [reason, setReason] = useState(initial?.reason ?? "");
  const [attachmentUrl, setAttachmentUrl] = useState(initial?.attachmentUrl ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { studentId, fromDate, toDate, reason, attachmentUrl };
      const res = isEdit
        ? await updateLeaveRequest(initial!.id, payload)
        : await createLeaveRequest(payload);
      if (res.success) {
        router.push("/dashboard/parent/leave");
        router.refresh();
      } else {
        setError(res.error);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit Leave Request" : "Apply for Leave"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="student">Child</Label>
            <Select
              id="student"
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              disabled={isEdit}
              required
            >
              {childOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="fromDate">From Date</Label>
              <Input
                id="fromDate"
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="toDate">To Date</Label>
              <Input
                id="toDate"
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Tell us why leave is needed"
              rows={3}
              required
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="attachmentUrl">Attachment link (optional)</Label>
            <Input
              id="attachmentUrl"
              type="url"
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              placeholder="https://…"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={saving}>
              {saving ? "Submitting…" : isEdit ? "Update Request" : "Submit Request"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
