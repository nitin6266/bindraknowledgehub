"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { transferStudentAction } from "@/features/student/actions/student.actions";
import { WizardShell } from "@/features/student/components/wizard-shell";
import { SelectField, Field } from "@/features/student/components/form-fields";
import type { Option } from "@/features/student/student.types";

interface TransferStudentFormProps {
  studentId: string;
  currentBatchName: string | null;
  batches: Option[];
}

export function TransferStudentForm({ studentId, currentBatchName, batches }: TransferStudentFormProps) {
  const router = useRouter();
  const [toBatchId, setToBatchId] = useState("");
  const [reason, setReason] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const goBack = useCallback(() => router.push(`/dashboard/students/${studentId}`), [router, studentId]);

  const handleSubmit = useCallback(async () => {
    if (!toBatchId) return;
    setSubmitting(true);
    try {
      const res = await transferStudentAction(studentId, { toBatchId, reason: reason || undefined });
      if (res.success) router.push(`/dashboard/students/${studentId}`);
      else alert(res.error);
    } catch {
      alert("Transfer failed");
    } finally {
      setSubmitting(false);
    }
  }, [studentId, toBatchId, reason, router]);

  return (
    <WizardShell
      step={0}
      totalSteps={1}
      title="Transfer Batch"
      subtitle={`Current batch: ${currentBatchName ?? "None"}`}
      onPrev={goBack}
      onSubmit={handleSubmit}
      canSubmit={Boolean(toBatchId)}
      submitting={submitting}
      submitLabel="Transfer"
    >
      <SelectField label="Target batch" required options={batches} value={toBatchId} onChange={setToBatchId} />
      <Field label="Reason (optional)" value={reason} onChange={setReason} placeholder="Why is this transfer happening?" />
    </WizardShell>
  );
}
