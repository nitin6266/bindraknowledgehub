"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { createAssignment } from "@/features/teacher/actions/teacher.actions";
import { ASSIGNMENT_STATUS_OPTIONS } from "@/features/teacher/teacher.constants";
import type { Option } from "@/features/teacher/teacher.types";

interface AssignmentFormProps {
  options: {
    batches: Option[];
    subjects: Option[];
  };
}

export function AssignmentForm({ options }: AssignmentFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [status, setStatus] = useState<string>(ASSIGNMENT_STATUS_OPTIONS[0]?.value ?? "DRAFT");
  const [files, setFiles] = useState<FileList | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await createAssignment({
        title,
        description: description || undefined,
        subjectId,
        batchId,
        dueDate,
        maxMarks: maxMarks ? Number(maxMarks) : null,
        status,
        attachments: files ? Array.from(files) : [],
      });
      if (res.success) {
        router.push("/dashboard/teacher/assignments");
        router.refresh();
      } else {
        setError(res.error);
      }
    } catch {
      setError("Failed to create assignment");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Assignment</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="batch">Batch</Label>
              <Select id="batch" value={batchId} onChange={(e) => setBatchId(e.target.value)} required>
                <option value="">Select batch</option>
                {options.batches.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="subject">Subject</Label>
              <Select id="subject" value={subjectId} onChange={(e) => setSubjectId(e.target.value)} required>
                <option value="">Select subject</option>
                {options.subjects.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="maxMarks">Max Marks</Label>
              <Input id="maxMarks" type="number" value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
              {ASSIGNMENT_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="attachments">Attachments</Label>
            <Input id="attachments" type="file" multiple onChange={(e) => setFiles(e.target.files)} />
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">{error}</p>
          )}
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Create Assignment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
