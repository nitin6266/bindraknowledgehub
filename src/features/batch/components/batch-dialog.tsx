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

import { batchSchema, type BatchValues } from "@/features/batch/batch.schemas";
import { BATCH_STATUS_OPTIONS } from "@/features/batch/batch.constants";
import type { BatchRow, Option } from "@/features/batch/batch.types";

interface BatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: BatchRow | null;
  options: {
    sessions: Option[];
    classes: Option[];
    sections: Option[];
    batchTypes: Option[];
  };
  onSubmit: (values: BatchValues) => Promise<{ success: true } | { success: false; error: string }>;
}

export function BatchDialog({ open, onOpenChange, initial, options, onSubmit }: BatchDialogProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const isEdit = initial != null;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<BatchValues>({
    resolver: zodResolver(batchSchema),
    defaultValues: isEdit
      ? {
          name: initial.name,
          code: initial.code,
          sessionId: initial.sessionId,
          classId: initial.classId,
          sectionId: initial.sectionId ?? "",
          batchTypeId: initial.batchTypeId,
          capacity: initial.capacity,
          currentStrength: initial.currentStrength,
          status: initial.status,
          description: initial.description ?? "",
        }
      : {
          name: "",
          code: "",
          sessionId: "",
          classId: "",
          sectionId: "",
          batchTypeId: "",
          capacity: 0,
          currentStrength: 0,
          status: "ACTIVE",
          description: "",
        },
  });

  const submit: SubmitHandler<BatchValues> = async (values) => {
    setServerError(null);
    setPending(true);
    try {
      const result = await onSubmit(values);
      if (result.success) {
        reset();
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Batch" : "Create Batch"}</DialogTitle>
          <DialogDescription>
            {isEdit ? "Update the batch configuration." : "Create a new academic batch."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="name">Batch Name</Label>
              <Input id="name" {...register("name")} placeholder="Class 10 A Morning" aria-invalid={!!errors.name} />
              {errors.name ? <p className="text-body-sm text-destructive">{errors.name.message}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="code">Batch Code</Label>
              <Input id="code" {...register("code")} placeholder="C10A-MOR" aria-invalid={!!errors.code} />
              {errors.code ? <p className="text-body-sm text-destructive">{errors.code.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="sessionId">Academic Session</Label>
              <Select id="sessionId" {...register("sessionId")} defaultValue={initial?.sessionId ?? ""} aria-invalid={!!errors.sessionId}>
                <option value="">Select session</option>
                {options.sessions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
              {errors.sessionId ? <p className="text-body-sm text-destructive">{errors.sessionId.message}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="classId">Class</Label>
              <Select id="classId" {...register("classId")} defaultValue={initial?.classId ?? ""} aria-invalid={!!errors.classId}>
                <option value="">Select class</option>
                {options.classes.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
              {errors.classId ? <p className="text-body-sm text-destructive">{errors.classId.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="sectionId">Section (optional)</Label>
              <Select id="sectionId" {...register("sectionId")} defaultValue={initial?.sectionId ?? ""}>
                <option value="">Select section</option>
                {options.sections.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="batchTypeId">Batch Type</Label>
              <Select id="batchTypeId" {...register("batchTypeId")} defaultValue={initial?.batchTypeId ?? ""} aria-invalid={!!errors.batchTypeId}>
                <option value="">Select type</option>
                {options.batchTypes.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
              {errors.batchTypeId ? <p className="text-body-sm text-destructive">{errors.batchTypeId.message}</p> : null}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="capacity">Capacity</Label>
              <Input id="capacity" type="number" min={0} {...register("capacity")} aria-invalid={!!errors.capacity} />
              {errors.capacity ? <p className="text-body-sm text-destructive">{errors.capacity.message}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="currentStrength">Current Strength</Label>
              <Input id="currentStrength" type="number" min={0} {...register("currentStrength")} aria-invalid={!!errors.currentStrength} />
              {errors.currentStrength ? <p className="text-body-sm text-destructive">{errors.currentStrength.message}</p> : null}
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="status">Status</Label>
              <Select id="status" {...register("status")} defaultValue={initial?.status ?? "ACTIVE"}>
                {BATCH_STATUS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" {...register("description")} placeholder="Optional notes" />
          </div>

          {serverError ? (
            <p className="rounded-md bg-destructive/10 p-3 text-body-sm text-destructive" role="alert">{serverError}</p>
          ) : null}

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={pending}>Cancel</Button>
            </DialogClose>
            <Button type="submit" loading={pending} disabled={pending}>{isEdit ? "Save changes" : "Create batch"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
