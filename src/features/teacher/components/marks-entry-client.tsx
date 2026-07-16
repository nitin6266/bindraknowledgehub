"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { getMarksEntryData, upsertMarksEntry } from "@/features/teacher/actions/teacher.actions";
import type { Option } from "@/features/teacher/teacher.types";

interface MarksEntryData {
  test: { id: string; title: string; maxScore: number; batchId: string; subjectId: string };
  students: {
    studentId: string;
    admissionNumber: string;
    rollNumber: string | null;
    fullName: string;
    marksObtained: number | null;
    isAbsent: boolean;
    remarks: string;
  }[];
}

interface MarksEntryClientProps {
  options: {
    tests: Option[];
  };
}

export function MarksEntryClient({ options }: MarksEntryClientProps) {
  const [testId, setTestId] = useState("");
  const [data, setData] = useState<MarksEntryData | null>(null);
  const [marks, setMarks] = useState<Record<string, string>>({});
  const [absent, setAbsent] = useState<Record<string, boolean>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function loadTest(id: string) {
    if (!id) return;
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const res = await getMarksEntryData(id);
      if (res.success) {
        const d = res.data as MarksEntryData;
        setData(d);
        const m: Record<string, string> = {};
        const a: Record<string, boolean> = {};
        const r: Record<string, string> = {};
        for (const s of d.students) {
          m[s.studentId] = s.marksObtained != null ? String(s.marksObtained) : "";
          a[s.studentId] = s.isAbsent;
          r[s.studentId] = s.remarks;
        }
        setMarks(m);
        setAbsent(a);
        setRemarks(r);
      } else {
        setError(res.error);
      }
    } catch {
      setError("Failed to load marks entry data");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!data) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const results = data.students.map((s) => ({
        studentId: s.studentId,
        marksObtained: absent[s.studentId] ? null : marks[s.studentId] ? Number(marks[s.studentId]) : null,
        isAbsent: absent[s.studentId] ?? false,
        remarks: remarks[s.studentId] || "",
      }));
      const res = await upsertMarksEntry({
        testId: data.test.id,
        batchId: data.test.batchId,
        subjectId: data.test.subjectId,
        results,
      });
      if (res.success) setSaved(true);
      else setError(res.error);
    } catch {
      setError("Failed to save marks");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Enter Marks</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-1.5 max-w-sm">
          <Label htmlFor="test">Test</Label>
          <Select id="test" value={testId} onChange={(e) => { setTestId(e.target.value); loadTest(e.target.value); }}>
            <option value="">Select test</option>
            {options.tests.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </div>

        {loading && <p className="text-muted-foreground">Loading students…</p>}

        {data && !loading && (
          <>
            <p className="text-sm text-muted-foreground">
              {data.test.title} — Max Marks: {data.test.maxScore}
            </p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Adm. No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.students.map((s) => (
                  <TableRow key={s.studentId}>
                    <TableCell>{s.admissionNumber}</TableCell>
                    <TableCell>{s.fullName}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        value={marks[s.studentId] ?? ""}
                        disabled={absent[s.studentId]}
                        onChange={(e) => setMarks((prev) => ({ ...prev, [s.studentId]: e.target.value }))}
                        className="w-24"
                      />
                    </TableCell>
                    <TableCell>
                      <input
                        type="checkbox"
                        checked={absent[s.studentId] ?? false}
                        onChange={(e) => setAbsent((prev) => ({ ...prev, [s.studentId]: e.target.checked }))}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={remarks[s.studentId] ?? ""}
                        onChange={(e) => setRemarks((prev) => ({ ...prev, [s.studentId]: e.target.value }))}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {error && <p className="text-sm text-destructive" role="alert">{error}</p>}
            {saved && <p className="text-sm text-success">Marks saved successfully.</p>}
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save Marks"}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
