"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { promoteStudentAction } from "@/features/student/actions/student.actions";
import { WizardShell } from "@/features/student/components/wizard-shell";
import { SelectField, Field } from "@/features/student/components/form-fields";
import type { Option } from "@/features/student/student.types";

interface PromoteStudentFormProps {
  studentId: string;
  currentClassName: string;
  sessions: Option[];
  classes: Option[];
}

export function PromoteStudentForm({ studentId, currentClassName, sessions, classes }: PromoteStudentFormProps) {
  const router = useRouter();
  const [toSessionId, setToSessionId] = useState("");
  const [toClassId, setToClassId] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const goBack = useCallback(() => router.push(`/dashboard/students/${studentId}`), [router, studentId]);

  const handleSubmit = useCallback(async () => {
    if (!toSessionId || !toClassId) return;
    setSubmitting(true);
    try {
      const res = await promoteStudentAction(studentId, { toSessionId, toClassId, note: note || undefined });
      if (res.success) router.push(`/dashboard/students/${studentId}`);
      else alert(res.error);
    } catch {
      alert("Promotion failed");
    } finally {
      setSubmitting(false);
    }
  }, [studentId, toSessionId, toClassId, note, router]);

  return (
    <WizardShell
      step={0}
      totalSteps={1}
      title="Promote Class"
      subtitle={`Current class: ${currentClassName}`}
      onPrev={goBack}
      onSubmit={handleSubmit}
      canSubmit={Boolean(toSessionId) && Boolean(toClassId)}
      submitting={submitting}
      submitLabel="Promote"
    >
      <SelectField label="Target session" required options={sessions} value={toSessionId} onChange={setToSessionId} />
      <SelectField label="Target class" required options={classes} value={toClassId} onChange={setToClassId} />
      <Field label="Note (optional)" value={note} onChange={setNote} placeholder="Any notes about this promotion" />
    </WizardShell>
  );
}
