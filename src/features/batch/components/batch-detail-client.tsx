"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ConfirmDialog } from "@/features/users/components/confirm-dialog";

import {
  addScheduleAction,
  removeScheduleAction,
  addTeacherAction,
  removeTeacherAction,
  addSubjectAction,
  removeSubjectAction,
} from "@/features/batch/actions/batch.actions";
import {
  scheduleSchema,
  teacherSchema,
  subjectSchema,
  type ScheduleValues,
  type TeacherValues,
  type SubjectValues,
} from "@/features/batch/batch.schemas";
import { DAY_OF_WEEK_OPTIONS } from "@/features/batch/batch.constants";
import type { BatchDetail, Option } from "@/features/batch/batch.types";

interface BatchDetailClientProps {
  batch: BatchDetail;
  options: {
    teachers: Option[];
    subjects: Option[];
    timeSlots: Option[];
  };
  canManage: boolean;
}

type RemoveTarget = { kind: "schedule" | "teacher" | "subject"; id: string; label: string } | null;

export function BatchDetailClient({ batch, options, canManage }: BatchDetailClientProps) {
  const router = useRouter();
  const [removeTarget, setRemoveTarget] = useState<RemoveTarget>(null);

  async function handleRemove() {
    if (!removeTarget) return;
    if (removeTarget.kind === "schedule") await removeScheduleAction(batch.id, removeTarget.id);
    if (removeTarget.kind === "teacher") await removeTeacherAction(batch.id, removeTarget.id);
    if (removeTarget.kind === "subject") await removeSubjectAction(batch.id, removeTarget.id);
    setRemoveTarget(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Batch Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Meta label="Session" value={batch.sessionName ?? "—"} />
          <Meta label="Class" value={batch.sectionName ? `${batch.className} / ${batch.sectionName}` : batch.className} />
          <Meta label="Type" value={batch.batchTypeName ?? "—"} />
          <Meta label="Status" value={batch.status} />
          <Meta label="Capacity" value={`${batch.currentStrength} / ${batch.capacity}`} />
          <Meta label="Primary Teacher" value={batch.primaryTeacherName ?? "—"} />
          <Meta label="Subjects" value={String(batch.subjectCount)} />
          <Meta label="Schedules" value={String(batch.schedules.length)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Weekly Schedule</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {batch.schedules.length ? (
            <ul className="divide-y divide-border rounded-md border border-border">
              {batch.schedules.map((s) => (
                <li key={s.id} className="flex items-center justify-between p-3">
                  <div>
                    <div className="font-medium text-foreground">{s.day.charAt(0) + s.day.slice(1).toLowerCase()}</div>
                    <div className="text-body-sm text-muted-foreground">
                      {s.timeSlotName ? `${s.timeSlotName} · ` : ""}
                      {s.startTime} – {s.endTime}
                      {s.room ? ` · Room ${s.room}` : ""}
                    </div>
                  </div>
                  {canManage ? (
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setRemoveTarget({ kind: "schedule", id: s.id, label: s.day })}>
                      Remove
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body-sm text-muted-foreground">No schedules yet.</p>
          )}

          {canManage ? <ScheduleForm batchId={batch.id} timeSlots={options.timeSlots} /> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Teacher Assignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {batch.teachers.length ? (
            <ul className="divide-y divide-border rounded-md border border-border">
              {batch.teachers.map((t) => (
                <li key={t.id} className="flex items-center justify-between p-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{t.teacherName}</span>
                      {t.isPrimary && t.active ? <Badge variant="success">Primary</Badge> : null}
                      {!t.active ? <Badge variant="outline">Unassigned</Badge> : null}
                    </div>
                    <div className="text-body-sm text-muted-foreground">
                      {t.subjectName ? `Subject: ${t.subjectName}` : "General"}
                    </div>
                  </div>
                  {canManage && t.active ? (
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setRemoveTarget({ kind: "teacher", id: t.teacherId, label: t.teacherName })}>
                      Remove
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body-sm text-muted-foreground">No teachers assigned yet.</p>
          )}

          {canManage ? <TeacherForm batchId={batch.id} teachers={options.teachers} subjects={options.subjects} /> : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Subject Assignment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {batch.subjects.length ? (
            <ul className="divide-y divide-border rounded-md border border-border">
              {batch.subjects.map((s) => (
                <li key={s.id} className="flex items-center justify-between p-3">
                  <div>
                    <div className="font-medium text-foreground">{s.subjectName}</div>
                    <div className="text-body-sm text-muted-foreground">
                      {s.teacherName ? `Teacher: ${s.teacherName} · ` : ""}
                      {s.weeklyHours}h/week · Order {s.displayOrder}
                    </div>
                  </div>
                  {canManage ? (
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setRemoveTarget({ kind: "subject", id: s.subjectId, label: s.subjectName })}>
                      Remove
                    </Button>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body-sm text-muted-foreground">No subjects assigned yet.</p>
          )}

          {canManage ? <SubjectForm batchId={batch.id} subjects={options.subjects} teachers={options.teachers} /> : null}
        </CardContent>
      </Card>

      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(o) => !o && setRemoveTarget(null)}
        title={`Remove ${removeTarget?.kind ?? ""}`}
        description={removeTarget ? `Remove "${removeTarget.label}" from this batch?` : ""}
        confirmLabel="Remove"
        destructive
        onConfirm={handleRemove}
      />
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-body-sm text-muted-foreground">{label}</div>
      <div className="font-medium text-foreground">{value}</div>
    </div>
  );
}

function ScheduleForm({ batchId, timeSlots }: { batchId: string; timeSlots: Option[] }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ScheduleValues>({
    resolver: zodResolver(scheduleSchema),
    defaultValues: { day: "MONDAY", timeSlotId: "", startTime: "", endTime: "", room: "" },
  });

  const submit: SubmitHandler<ScheduleValues> = async (values) => {
    setServerError(null);
    setPending(true);
    try {
      const result = await addScheduleAction(batchId, values);
      if (result.success) {
        reset();
        router.refresh();
      } else {
        setServerError(result.error);
      }
    } catch {
      setServerError("Something went wrong.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-3 rounded-md border border-border p-3 sm:grid-cols-5">
      <div className="space-y-1.5 sm:col-span-1">
        <Label htmlFor="day">Day</Label>
        <Select id="day" {...register("day")}>
          {DAY_OF_WEEK_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="timeSlotId">Time Slot</Label>
        <Select id="timeSlotId" {...register("timeSlotId")}>
          <option value="">Custom</option>
          {timeSlots.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="startTime">Start</Label>
        <Input id="startTime" type="time" {...register("startTime")} aria-invalid={!!errors.startTime} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="endTime">End</Label>
        <Input id="endTime" type="time" {...register("endTime")} aria-invalid={!!errors.endTime} />
      </div>
      <div className="flex items-end gap-2">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="room">Room</Label>
          <Input id="room" {...register("room")} placeholder="Optional" />
        </div>
        <Button type="submit" loading={pending} disabled={pending}>Add</Button>
      </div>
      {errors.startTime ? <p className="text-body-sm text-destructive sm:col-span-5">{errors.startTime.message}</p> : null}
      {errors.endTime ? <p className="text-body-sm text-destructive sm:col-span-5">{errors.endTime.message}</p> : null}
      {serverError ? <p className="text-body-sm text-destructive sm:col-span-5">{serverError}</p> : null}
    </form>
  );
}

function TeacherForm({ batchId, teachers, subjects }: { batchId: string; teachers: Option[]; subjects: Option[] }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TeacherValues>({
    resolver: zodResolver(teacherSchema),
    defaultValues: { teacherId: "", isPrimary: false, subjectId: "" },
  });

  const submit: SubmitHandler<TeacherValues> = async (values) => {
    setServerError(null);
    setPending(true);
    try {
      const result = await addTeacherAction(batchId, values);
      if (result.success) {
        reset();
        router.refresh();
      } else {
        setServerError(result.error);
      }
    } catch {
      setServerError("Something went wrong.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-3 rounded-md border border-border p-3 sm:grid-cols-4">
      <div className="space-y-1.5">
        <Label htmlFor="teacherId">Teacher</Label>
        <Select id="teacherId" {...register("teacherId")} defaultValue="">
          <option value="">Select teacher</option>
          {teachers.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
        {errors.teacherId ? <p className="text-body-sm text-destructive">{errors.teacherId.message}</p> : null}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="subjectId">Subject (optional)</Label>
        <Select id="subjectId" {...register("subjectId")} defaultValue="">
          <option value="">General</option>
          {subjects.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </div>
      <div className="flex items-end">
        <label className="flex items-center gap-2 text-body-sm text-foreground">
          <input type="checkbox" {...register("isPrimary")} className="size-4" />
          Primary teacher
        </label>
      </div>
      <div className="flex items-end">
        <Button type="submit" loading={pending} disabled={pending}>Assign</Button>
      </div>
      {serverError ? <p className="text-body-sm text-destructive sm:col-span-4">{serverError}</p> : null}
    </form>
  );
}

function SubjectForm({ batchId, subjects, teachers }: { batchId: string; subjects: Option[]; teachers: Option[] }) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SubjectValues>({
    resolver: zodResolver(subjectSchema),
    defaultValues: { subjectId: "", teacherId: "", weeklyHours: 0, displayOrder: 0 },
  });

  const submit: SubmitHandler<SubjectValues> = async (values) => {
    setServerError(null);
    setPending(true);
    try {
      const result = await addSubjectAction(batchId, values);
      if (result.success) {
        reset();
        router.refresh();
      } else {
        setServerError(result.error);
      }
    } catch {
      setServerError("Something went wrong.");
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(submit)} className="grid gap-3 rounded-md border border-border p-3 sm:grid-cols-5">
      <div className="space-y-1.5">
        <Label htmlFor="subjectId">Subject</Label>
        <Select id="subjectId" {...register("subjectId")} defaultValue="">
          <option value="">Select subject</option>
          {subjects.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
        {errors.subjectId ? <p className="text-body-sm text-destructive">{errors.subjectId.message}</p> : null}
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="teacherId">Teacher</Label>
        <Select id="teacherId" {...register("teacherId")} defaultValue="">
          <option value="">None</option>
          {teachers.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="weeklyHours">Weekly Hours</Label>
        <Input id="weeklyHours" type="number" min={0} {...register("weeklyHours")} />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="displayOrder">Display Order</Label>
        <Input id="displayOrder" type="number" min={0} {...register("displayOrder")} />
      </div>
      <div className="flex items-end">
        <Button type="submit" loading={pending} disabled={pending}>Assign</Button>
      </div>
      {serverError ? <p className="text-body-sm text-destructive sm:col-span-5">{serverError}</p> : null}
    </form>
  );
}
