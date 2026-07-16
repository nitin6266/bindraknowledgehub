"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";

import { admissionSchema, type AdmissionValues } from "@/features/student/student.schemas";
import { GENDER_OPTIONS, PARENT_RELATIONSHIP_OPTIONS } from "@/features/student/student.constants";
import type { Option } from "@/features/student/student.types";

interface AdmissionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  options: {
    sessions: Option[];
    classes: Option[];
    sections: Option[];
    batches: Option[];
  };
  onSubmit: (values: AdmissionValues) => Promise<{ success: true } | { success: false; error: string }>;
}

const STEPS = ["Student", "Parent", "Academic & Care"];

const STEP_FIELDS: Array<Array<keyof AdmissionValues>> = [
  ["firstName", "lastName", "gender", "dateOfBirth", "bloodGroup", "rollNumber", "address", "city", "state", "country", "pincode"],
  ["parentFirstName", "parentLastName", "relationship", "parentEmail", "parentMobile", "parentAddress"],
  ["sessionId", "classId", "sectionId", "batchId", "emergencyName", "emergencyRelationship", "emergencyPhone", "medicalConditions", "medicalAllergies", "medicalNotes"],
];

export function AdmissionDialog({ open, onOpenChange, options, onSubmit }: AdmissionDialogProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = useForm<AdmissionValues>({
    resolver: zodResolver(admissionSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      gender: "MALE",
      dateOfBirth: "",
      bloodGroup: "",
      rollNumber: "",
      address: "",
      city: "",
      state: "",
      country: "India",
      pincode: "",
      sessionId: "",
      classId: "",
      sectionId: "",
      batchId: "",
      parentEmail: "",
      parentFirstName: "",
      parentLastName: "",
      parentMobile: "",
      relationship: "FATHER",
      parentAddress: "",
      emergencyName: "",
      emergencyRelationship: "",
      emergencyPhone: "",
      medicalConditions: "",
      medicalAllergies: "",
      medicalNotes: "",
    },
  });

  const submit: SubmitHandler<AdmissionValues> = async (values) => {
    setServerError(null);
    setPending(true);
    try {
      const result = await onSubmit(values);
      if (result.success) {
        reset();
        setStep(0);
        onOpenChange(false);
        router.refresh();
      } else {
        setServerError(result.error);
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  async function next() {
    const valid = await trigger(STEP_FIELDS[step]);
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[88vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Student Admission</DialogTitle>
          <DialogDescription>
            Step {step + 1} of {STEPS.length}: {STEPS[step]}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          {step === 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First Name" error={errors.firstName?.message}>
                <Input {...register("firstName")} />
              </Field>
              <Field label="Last Name" error={errors.lastName?.message}>
                <Input {...register("lastName")} />
              </Field>
              <Field label="Gender" error={errors.gender?.message}>
                <Select {...register("gender")}>
                  {GENDER_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Date of Birth" error={errors.dateOfBirth?.message}>
                <Input type="date" {...register("dateOfBirth")} />
              </Field>
              <Field label="Blood Group" error={errors.bloodGroup?.message}>
                <Input {...register("bloodGroup")} placeholder="O+" />
              </Field>
              <Field label="Roll Number" error={errors.rollNumber?.message}>
                <Input {...register("rollNumber")} />
              </Field>
              <Field label="Address" error={errors.address?.message}>
                <Input {...register("address")} />
              </Field>
              <Field label="City" error={errors.city?.message}>
                <Input {...register("city")} />
              </Field>
              <Field label="State" error={errors.state?.message}>
                <Input {...register("state")} />
              </Field>
              <Field label="Country" error={errors.country?.message}>
                <Input {...register("country")} />
              </Field>
              <Field label="Pincode" error={errors.pincode?.message}>
                <Input {...register("pincode")} />
              </Field>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Parent First Name" error={errors.parentFirstName?.message}>
                <Input {...register("parentFirstName")} />
              </Field>
              <Field label="Parent Last Name" error={errors.parentLastName?.message}>
                <Input {...register("parentLastName")} />
              </Field>
              <Field label="Relationship" error={errors.relationship?.message}>
                <Select {...register("relationship")}>
                  {PARENT_RELATIONSHIP_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Parent Email" error={errors.parentEmail?.message}>
                <Input type="email" {...register("parentEmail")} />
              </Field>
              <Field label="Parent Mobile" error={errors.parentMobile?.message}>
                <Input {...register("parentMobile")} />
              </Field>
              <Field label="Parent Address" error={errors.parentAddress?.message}>
                <Input {...register("parentAddress")} />
              </Field>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Academic Session" error={errors.sessionId?.message}>
                <Select {...register("sessionId")}>
                  <option value="">Select session</option>
                  {options.sessions.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Class" error={errors.classId?.message}>
                <Select {...register("classId")}>
                  <option value="">Select class</option>
                  {options.classes.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Section" error={errors.sectionId?.message}>
                <Select {...register("sectionId")}>
                  <option value="">Select section</option>
                  {options.sections.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Batch" error={errors.batchId?.message}>
                <Select {...register("batchId")}>
                  <option value="">Select batch</option>
                  {options.batches.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Emergency Contact Name" error={errors.emergencyName?.message}>
                <Input {...register("emergencyName")} />
              </Field>
              <Field label="Emergency Relationship" error={errors.emergencyRelationship?.message}>
                <Input {...register("emergencyRelationship")} />
              </Field>
              <Field label="Emergency Phone" error={errors.emergencyPhone?.message}>
                <Input {...register("emergencyPhone")} />
              </Field>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="medicalConditions">Medical Conditions</Label>
                <Textarea {...register("medicalConditions")} />
              </div>
              <Field label="Allergies" error={errors.medicalAllergies?.message}>
                <Input {...register("medicalAllergies")} />
              </Field>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="medicalNotes">Special Notes</Label>
                <Textarea {...register("medicalNotes")} />
              </div>
            </div>
          ) : null}

          {serverError ? (
            <p className="rounded-md bg-destructive/10 p-3 text-body-sm text-destructive" role="alert">{serverError}</p>
          ) : null}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={pending}>Cancel</Button>
            </DialogClose>
            {step > 0 ? (
              <Button type="button" variant="outline" onClick={() => setStep((s) => s - 1)} disabled={pending}>Back</Button>
            ) : null}
            {step < STEPS.length - 1 ? (
              <Button type="button" onClick={next} disabled={pending}>Next</Button>
            ) : (
              <Button type="submit" loading={pending} disabled={pending}>Admit Student</Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {error ? <p className="text-body-sm text-destructive">{error}</p> : null}
    </div>
  );
}
