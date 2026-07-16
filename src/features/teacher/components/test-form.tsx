"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { createTest } from "@/features/teacher/actions/teacher.actions";
import { TEST_STATUS_OPTIONS } from "@/features/teacher/teacher.constants";
import type { Option } from "@/features/teacher/teacher.types";

interface TestFormProps {
  options: {
    batches: Option[];
    subjects: Option[];
  };
}

export function TestForm({ options }: TestFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [testDate, setTestDate] = useState("");
  const [maxMarks, setMaxMarks] = useState("");
  const [instructions, setInstructions] = useState("");
  const [status, setStatus] = useState<string>(TEST_STATUS_OPTIONS[0]?.value ?? "DRAFT");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await createTest({
        title,
        subjectId,
        batchId,
        testDate,
        maxMarks: maxMarks ? Number(maxMarks) : 0,
        instructions: instructions || undefined,
        status,
      });
      if (res.success) {
        router.push("/dashboard/teacher/tests");
        router.refresh();
      } else {
        setError(res.error);
      }
    } catch {
      setError("Failed to create test");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>New Test</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
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
              <Label htmlFor="testDate">Test Date</Label>
              <Input id="testDate" type="date" value={testDate} onChange={(e) => setTestDate(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="maxMarks">Max Marks</Label>
              <Input id="maxMarks" type="number" value={maxMarks} onChange={(e) => setMaxMarks(e.target.value)} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea id="instructions" value={instructions} onChange={(e) => setInstructions(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="status">Status</Label>
            <Select id="status" value={status} onChange={(e) => setStatus(e.target.value)}>
              {TEST_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </div>
          {error && (
            <p className="text-sm text-destructive" role="alert">{error}</p>
          )}
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Create Test"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
