"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createStudentAction } from "@/features/student/actions/student.actions";
import { GENDER_OPTIONS, PARENT_RELATIONSHIP_OPTIONS } from "@/features/student/student.constants";
import { WizardShell } from "@/features/student/components/wizard-shell";
import { Field, SelectField, FieldGrid, ReviewGroup, ReviewRow } from "@/features/student/components/form-fields";
import type { Option, AdmissionValues } from "@/features/student/student.types";

interface AdmissionWizardProps {
  options: { sessions: Option[]; classes: Option[]; sections: Option[]; batches: Option[] };
}

const DRAFT_KEY = "admission-draft";

const INITIAL: AdmissionValues = {
  firstName: "", lastName: "", gender: "MALE", dateOfBirth: "", bloodGroup: "", rollNumber: "",
  sessionId: "", classId: "", sectionId: "", batchId: "",
  parentFirstName: "", parentLastName: "", parentEmail: "", parentMobile: "", relationship: "FATHER", parentAddress: "",
  address: "", city: "", state: "", country: "India", pincode: "",
  emergencyName: "", emergencyRelationship: "", emergencyPhone: "",
  medicalConditions: "", medicalAllergies: "", medicalNotes: "",
};

const STEPS = [
  { title: "Student Information", subtitle: "Basic details about the student" },
  { title: "Academic Details", subtitle: "Session, class and batch for admission" },
  { title: "Parent Details", subtitle: "Primary parent or guardian" },
  { title: "Medical & Emergency", subtitle: "Emergency contact and medical information" },
  { title: "Review & Submit", subtitle: "Please review before submitting" },
] as const;

function clear(v: string | undefined | null) { return v ?? ""; }

function useAutosave(form: AdmissionValues) {
  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    }, 1000);
    return () => clearTimeout(timer);
  }, [form]);
}

function useDraftRestore(setForm: (v: AdmissionValues) => void) {
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as AdmissionValues;
        if (parsed.firstName || parsed.parentEmail) {
          if (window.confirm("You have a saved draft. Would you like to restore it?")) {
            setForm(parsed);
          } else {
            localStorage.removeItem(DRAFT_KEY);
          }
        }
      } catch { /* ignore */ }
    }
  }, [setForm]);
}

export function AdmissionWizard({ options }: AdmissionWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [f, setF] = useState<AdmissionValues>(INITIAL);

  useDraftRestore(setF);
  useAutosave(f);

  function upd<K extends keyof AdmissionValues>(key: K, value: AdmissionValues[K]) {
    setF((prev) => ({ ...prev, [key]: value }));
  }

  function isValid(idx: number): boolean {
    switch (idx) {
      case 0: return Boolean(f.firstName && f.lastName && f.dateOfBirth);
      case 1: return Boolean(f.sessionId && f.classId && f.batchId);
      case 2: return Boolean(f.parentFirstName && f.parentLastName && f.parentEmail && f.parentMobile);
      case 3: return Boolean(f.emergencyName && f.emergencyPhone);
      default: return true;
    }
  }

  const canNext = isValid(step);

  const goPrev = useCallback(() => {
    if (step === 0) router.push("/dashboard/students");
    else setStep((s) => s - 1);
  }, [step, router]);

  const goNext = useCallback(() => setStep((s) => s + 1), []);

  const handleSaveDraft = useCallback(() => {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(f));
  }, [f]);

  const handleSubmit = useCallback(async () => {
    setSubmitting(true);
    try {
      const res = await createStudentAction(f);
      if (res.success) {
        localStorage.removeItem(DRAFT_KEY);
        router.push("/dashboard/students");
      } else {
        alert(res.error);
      }
    } catch {
      alert("Submission failed");
    } finally {
      setSubmitting(false);
    }
  }, [f, router]);

  return (
    <WizardShell
      step={step}
      totalSteps={STEPS.length}
      title={STEPS[step]!.title}
      subtitle={STEPS[step]!.subtitle}
      onPrev={goPrev}
      onNext={goNext}
      onSubmit={handleSubmit}
      canNext={canNext}
      canSubmit
      submitting={submitting}
      submitLabel="Admit Student"
      wide
      onSaveDraft={handleSaveDraft}
    >
      {step === 0 && (
        <div className="space-y-5">
          <p className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-[0.06em]">Identity</p>
          <FieldGrid cols={2}>
            <Field label="First name" required value={f.firstName} onChange={(v) => upd("firstName", v)} placeholder="e.g. Alex" autoFocus />
            <Field label="Last name" required value={f.lastName} onChange={(v) => upd("lastName", v)} placeholder="e.g. Johnson" />
          </FieldGrid>
          <FieldGrid cols={2}>
            <Field label="Date of birth" required type="date" value={f.dateOfBirth} onChange={(v) => upd("dateOfBirth", v)} />
            <SelectField label="Gender" options={GENDER_OPTIONS.map((g) => ({ value: g.value, label: g.label }))} value={f.gender} onChange={(v) => upd("gender", v as "MALE" | "FEMALE" | "OTHER")} />
          </FieldGrid>
          <div className="mt-8 space-y-5">
            <p className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-[0.06em]">Optional</p>
            <FieldGrid cols={2}>
              <Field label="Blood group" value={clear(f.bloodGroup)} onChange={(v) => upd("bloodGroup", v)} placeholder="e.g. O+" />
              <Field label="Roll number" value={clear(f.rollNumber)} onChange={(v) => upd("rollNumber", v)} placeholder="Optional" />
            </FieldGrid>
          </div>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-5">
          <p className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-[0.06em]">Session & Class</p>
          <FieldGrid cols={2}>
            <SelectField label="Academic Session" required options={options.sessions} value={f.sessionId} onChange={(v) => upd("sessionId", v)} />
            <SelectField label="Class" required options={options.classes} value={f.classId} onChange={(v) => upd("classId", v)} />
          </FieldGrid>
          <FieldGrid cols={2}>
            <SelectField label="Section" options={options.sections} value={clear(f.sectionId)} onChange={(v) => upd("sectionId", v)} placeholder="Optional" />
            <SelectField label="Batch" required options={options.batches} value={f.batchId} onChange={(v) => upd("batchId", v)} />
          </FieldGrid>
          <div className="mt-8 space-y-5">
            <p className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-[0.06em]">Identifier</p>
            <div className="max-w-sm">
              <Field label="Roll number" value={clear(f.rollNumber)} onChange={(v) => upd("rollNumber", v)} placeholder="Optional" />
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-5">
          <p className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-[0.06em]">Identity</p>
          <FieldGrid cols={2}>
            <Field label="Parent first name" required value={f.parentFirstName} onChange={(v) => upd("parentFirstName", v)} placeholder="e.g. John" autoFocus />
            <Field label="Parent last name" required value={f.parentLastName} onChange={(v) => upd("parentLastName", v)} placeholder="e.g. Johnson" />
          </FieldGrid>
          <div className="max-w-sm">
            <SelectField label="Relationship" required options={PARENT_RELATIONSHIP_OPTIONS.map((r) => ({ value: r.value, label: r.label }))} value={f.relationship} onChange={(v) => upd("relationship", v as "FATHER" | "MOTHER" | "GUARDIAN")} />
          </div>
          <div className="mt-8 space-y-5">
            <p className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-[0.06em]">Contact</p>
            <FieldGrid cols={2}>
              <Field label="Email" required type="email" value={f.parentEmail} onChange={(v) => upd("parentEmail", v)} placeholder="john@email.com" />
              <Field label="Mobile" required value={f.parentMobile} onChange={(v) => upd("parentMobile", v)} placeholder="+91 98765 43210" />
            </FieldGrid>
            <Field label="Parent address" value={clear(f.parentAddress)} onChange={(v) => upd("parentAddress", v)} placeholder="Optional" />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-5">
          <p className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-[0.06em]">Emergency Contact</p>
          <FieldGrid cols={2}>
            <Field label="Contact name" required value={f.emergencyName} onChange={(v) => upd("emergencyName", v)} placeholder="e.g. Mary Johnson" autoFocus />
            <Field label="Phone" required value={f.emergencyPhone} onChange={(v) => upd("emergencyPhone", v)} placeholder="+91 98765 43211" />
          </FieldGrid>
          <div className="max-w-sm">
            <Field label="Relationship" value={clear(f.emergencyRelationship)} onChange={(v) => upd("emergencyRelationship", v)} placeholder="e.g. Mother" />
          </div>
          <div className="mt-8 space-y-5">
            <p className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-[0.06em]">Medical</p>
            <FieldGrid cols={2}>
              <Field label="Conditions" value={clear(f.medicalConditions)} onChange={(v) => upd("medicalConditions", v)} placeholder="e.g. Asthma" />
              <Field label="Allergies" value={clear(f.medicalAllergies)} onChange={(v) => upd("medicalAllergies", v)} placeholder="e.g. Peanuts" />
            </FieldGrid>
            <div className="max-w-sm">
              <Field label="Notes" value={clear(f.medicalNotes)} onChange={(v) => upd("medicalNotes", v)} placeholder="Optional notes" />
            </div>
          </div>
          <div className="mt-8 space-y-5">
            <p className="text-[11px] font-semibold text-muted-foreground/40 uppercase tracking-[0.06em]">Address</p>
            <Field label="Street address" value={clear(f.address)} onChange={(v) => upd("address", v)} placeholder="Street address" />
            <FieldGrid cols={2}>
              <Field label="City" value={clear(f.city)} onChange={(v) => upd("city", v)} placeholder="City" />
              <Field label="State" value={clear(f.state)} onChange={(v) => upd("state", v)} placeholder="State" />
              <Field label="Country" value={clear(f.country)} onChange={(v) => upd("country", v)} placeholder="India" />
              <Field label="Pincode" value={clear(f.pincode)} onChange={(v) => upd("pincode", v)} placeholder="Pincode" />
            </FieldGrid>
          </div>
        </div>
      )}

      {step === 4 && (
        <>
          <p className="text-[15px] text-muted-foreground/60 text-center mb-6">
            Tap Submit to complete the admission. You can also save as draft.
          </p>

          <ReviewGroup title="Student">
            <ReviewRow label="Name" value={`${f.firstName} ${f.lastName}`} />
            <ReviewRow label="Date of birth" value={f.dateOfBirth} />
            <ReviewRow label="Gender" value={GENDER_OPTIONS.find((g) => g.value === f.gender)?.label ?? f.gender} />
            <ReviewRow label="Blood group" value={f.bloodGroup || "—"} />
            <ReviewRow label="Roll number" value={f.rollNumber || "—"} />
          </ReviewGroup>

          <div className="mt-4">
            <ReviewGroup title="Academic">
              <ReviewRow label="Session" value={options.sessions.find((s) => s.value === f.sessionId)?.label ?? "—"} />
              <ReviewRow label="Class" value={options.classes.find((c) => c.value === f.classId)?.label ?? "—"} />
              <ReviewRow label="Section" value={options.sections.find((s) => s.value === f.sectionId)?.label ?? "—"} />
              <ReviewRow label="Batch" value={options.batches.find((b) => b.value === f.batchId)?.label ?? "—"} />
            </ReviewGroup>
          </div>

          <div className="mt-4">
            <ReviewGroup title="Parent">
              <ReviewRow label="Name" value={`${f.parentFirstName} ${f.parentLastName}`} />
              <ReviewRow label="Relationship" value={PARENT_RELATIONSHIP_OPTIONS.find((r) => r.value === f.relationship)?.label ?? f.relationship} />
              <ReviewRow label="Email" value={f.parentEmail} />
              <ReviewRow label="Mobile" value={f.parentMobile} />
            </ReviewGroup>
          </div>

          <div className="mt-4">
            <ReviewGroup title="Emergency & Medical">
              <ReviewRow label="Contact" value={f.emergencyName} />
              <ReviewRow label="Phone" value={f.emergencyPhone} />
              <ReviewRow label="Conditions" value={f.medicalConditions || "None"} />
              <ReviewRow label="Allergies" value={f.medicalAllergies || "None"} />
            </ReviewGroup>
          </div>


        </>
      )}
    </WizardShell>
  );
}
