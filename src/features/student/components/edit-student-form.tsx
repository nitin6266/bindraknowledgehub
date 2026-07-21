"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { updateStudentAction } from "@/features/student/actions/student.actions";
import { STUDENT_STATUS_OPTIONS } from "@/features/student/student.constants";
import { WizardShell } from "@/features/student/components/wizard-shell";
import { Field, SelectField, FieldGrid } from "@/features/student/components/form-fields";
import type { StudentDetail } from "@/features/student/student.types";

interface EditStudentFormProps {
  detail: StudentDetail;
}

const STEPS = [
  { title: "Basic Information", subtitle: "Update status and basic details" },
  { title: "Medical & Emergency", subtitle: "Update medical and emergency information" },
];

export function EditStudentForm({ detail }: EditStudentFormProps) {
  const router = useRouter();
  const { student, medicalInformation, emergencyContacts } = detail;
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(student.status);
  const [address, setAddress] = useState(student.address ?? "");
  const [bloodGroup, setBloodGroup] = useState(student.bloodGroup ?? "");
  const [conditions, setConditions] = useState(medicalInformation?.medicalConditions ?? "");
  const [allergies, setAllergies] = useState(medicalInformation?.allergies ?? "");
  const [notes, setNotes] = useState(medicalInformation?.notes ?? "");
  const ec = emergencyContacts[0];
  const [ecName, setEcName] = useState(ec?.contactName ?? "");
  const [ecRelationship, setEcRelationship] = useState(ec?.relationship ?? "");
  const [ecPhone, setEcPhone] = useState(ec?.phoneNumber ?? "");

  const goPrev = useCallback(() => {
    if (step === 0) router.push(`/dashboard/students/${student.id}`);
    else setStep((s) => s - 1);
  }, [step, router, student.id]);

  const goNext = useCallback(() => setStep((s) => s + 1), []);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      const res = await updateStudentAction(student.id, {
        status: status as typeof student.status,
        address: address || null,
        bloodGroup: bloodGroup || null,
        emergencyContacts: ecName ? [{ contactName: ecName, relationship: ecRelationship, phoneNumber: ecPhone }] : [],
        medical: { conditions: conditions || null, allergies: allergies || null, notes: notes || null },
      });
      if (res.success) router.push(`/dashboard/students/${student.id}`);
      else alert(res.error);
    } catch {
      alert("Update failed");
    } finally {
      setSubmitting(false);
    }
  }, [student.id, status, address, bloodGroup, conditions, allergies, notes, ecName, ecRelationship, ecPhone, router]);

  return (
    <WizardShell
      step={step}
      totalSteps={2}
      title={STEPS[step]!.title}
      subtitle={STEPS[step]!.subtitle}
      onPrev={goPrev}
      onNext={goNext}
      onSubmit={handleSubmit}
      canNext
      canSubmit
      submitting={submitting}
      submitLabel="Save Changes"
    >
      {step === 0 && (
        <div className="space-y-5">
          <p className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-[0.06em]">Status</p>
          <div className="max-w-sm">
            <SelectField label="Enrollment" required options={STUDENT_STATUS_OPTIONS.map((s) => ({ value: s.value, label: s.label }))} value={status} onChange={(v) => setStatus(v as typeof status)} />
          </div>
          <div className="mt-8 space-y-5">
            <p className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-[0.06em]">Personal</p>
            <Field label="Address" value={address} onChange={setAddress} placeholder="Street address" />
            <div className="max-w-sm">
              <Field label="Blood group" value={bloodGroup} onChange={setBloodGroup} placeholder="e.g. O+" />
            </div>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <p className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-[0.06em]">Medical</p>
          <div className="max-w-sm">
            <Field label="Conditions" value={conditions} onChange={setConditions} placeholder="e.g. Asthma" />
          </div>
          <FieldGrid cols={2}>
            <Field label="Allergies" value={allergies} onChange={setAllergies} placeholder="e.g. Peanuts" />
            <Field label="Notes" value={notes} onChange={setNotes} placeholder="Optional" />
          </FieldGrid>
          <div className="mt-8 space-y-5">
            <p className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-[0.06em]">Emergency Contact</p>
            <div className="max-w-sm">
              <Field label="Contact name" value={ecName} onChange={setEcName} placeholder="e.g. Mary Johnson" />
            </div>
            <FieldGrid cols={2}>
              <Field label="Relationship" value={ecRelationship} onChange={setEcRelationship} placeholder="e.g. Mother" />
              <Field label="Phone" value={ecPhone} onChange={setEcPhone} placeholder="+91 98765 43211" />
            </FieldGrid>
          </div>
        </div>
      )}
    </WizardShell>
  );
}
