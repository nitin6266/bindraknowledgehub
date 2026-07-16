"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  assignStudentFees,
  searchStudents,
} from "@/features/finance/actions/finance.actions";
import type { Option } from "@/features/teacher/teacher.types";

interface StudentFeeAssignmentProps {
  options: {
    sessions: Option[];
    classes: Option[];
    batches: Option[];
    structures: Option[];
  };
}

interface StudentHit {
  id: string;
  name: string;
  admissionNumber: string;
}

export function StudentFeeAssignment({ options }: StudentFeeAssignmentProps) {
  const router = useRouter();
  const [assignmentType, setAssignmentType] = useState("SINGLE");
  const [sessionId, setSessionId] = useState(options.sessions[0]?.value ?? "");
  const [classId, setClassId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [structureId, setStructureId] = useState("");
  const [installmentCount, setInstallmentCount] = useState("1");

  const [query, setQuery] = useState("");
  const [hits, setHits] = useState<StudentHit[]>([]);
  const [studentId, setStudentId] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function runSearch(value: string) {
    setQuery(value);
    if (value.length < 2) {
      setHits([]);
      return;
    }
    const res = await searchStudents(value);
    if (res.success) setHits(res.data);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await assignStudentFees({
        assignmentType: assignmentType as "SINGLE" | "BATCH" | "CLASS" | "SESSION",
        studentId,
        batchId,
        classId,
        sessionId,
        structureId,
        installmentCount: Number(installmentCount),
      });
      if (res.success) {
        router.push("/dashboard/finance/student-fees");
        router.refresh();
      } else {
        setError(res.error);
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Fee</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="type">Assignment Type</Label>
            <Select id="type" value={assignmentType} onChange={(e) => setAssignmentType(e.target.value)}>
              <option value="SINGLE">Single Student</option>
              <option value="BATCH">Entire Batch</option>
              <option value="CLASS">Entire Class</option>
              <option value="SESSION">Entire Session</option>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="structure">Fee Structure</Label>
            <Select id="structure" value={structureId} onChange={(e) => setStructureId(e.target.value)} required>
              <option value="">Select fee structure</option>
              {options.structures.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </div>

          {assignmentType === "SINGLE" && (
            <div className="space-y-1.5">
              <Label htmlFor="student">Student</Label>
              <Input
                id="student"
                placeholder="Search by name or admission number"
                value={query}
                onChange={(e) => runSearch(e.target.value)}
                required
              />
              {hits.length > 0 && (
                <ul className="rounded-lg border border-border">
                  {hits.map((h) => (
                    <li key={h.id}>
                      <button
                        type="button"
                        className="w-full px-3 py-2 text-left text-body-sm hover:bg-muted"
                        onClick={() => {
                          setStudentId(h.id);
                          setQuery(`${h.name} (${h.admissionNumber})`);
                          setHits([]);
                        }}
                      >
                        {h.name} · {h.admissionNumber}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {assignmentType === "BATCH" && (
            <div className="space-y-1.5">
              <Label htmlFor="batch">Batch</Label>
              <Select id="batch" value={batchId} onChange={(e) => setBatchId(e.target.value)} required>
                <option value="">Select batch</option>
                {options.batches.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </div>
          )}

          {assignmentType === "CLASS" && (
            <div className="space-y-1.5">
              <Label htmlFor="class">Class</Label>
              <Select id="class" value={classId} onChange={(e) => setClassId(e.target.value)} required>
                <option value="">Select class</option>
                {options.classes.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="session">Academic Session</Label>
            <Select id="session" value={sessionId} onChange={(e) => setSessionId(e.target.value)} required>
              <option value="">Select session</option>
              {options.sessions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="installments">Number of Installments</Label>
            <Input
              id="installments"
              type="number"
              min={1}
              max={12}
              value={installmentCount}
              onChange={(e) => setInstallmentCount(e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" disabled={saving}>
            {saving ? "Assigning…" : "Assign Fee"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
