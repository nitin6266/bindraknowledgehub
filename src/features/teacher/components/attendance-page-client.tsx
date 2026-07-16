"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Calendar, Check, Loader2, Download, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { upsertAttendance, listAttendanceRecords, listMyStudents } from "@/features/teacher/actions/teacher.actions";
import { ATTENDANCE_STATUS_OPTIONS, type AttendanceStatusValue } from "@/features/teacher/teacher.constants";
import type { Option } from "@/features/teacher/teacher.types";

interface AttendancePageClientProps {
  options: {
    batches: Option[];
  };
  defaultBatchId?: string;
}

interface AttendanceStudent {
  id: string;
  admissionNumber: string;
  fullName: string;
}

export function AttendancePageClient({ options, defaultBatchId = "" }: AttendancePageClientProps) {
  const router = useRouter();
  const [batchId, setBatchId] = useState(defaultBatchId);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]!);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [students, setStudents] = useState<AttendanceStudent[]>([]);
  const [records, setRecords] = useState<Record<string, AttendanceStatusValue>>({});
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<{ id: string; date: string; batchName: string; status: string }[]>([]);

  useEffect(() => {
    if (defaultBatchId) {
      setBatchId(defaultBatchId);
      (async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await listMyStudents({ batchId: defaultBatchId });
          const list = res.success ? (res.data as AttendanceStudent[]) : [];
          setStudents(list);
          setRecords((prev) => {
            const next: Record<string, AttendanceStatusValue> = {};
            for (const s of list) next[s.id] = prev[s.id] ?? "PRESENT";
            return next;
          });
          const histRes = await listAttendanceRecords({ batchId: defaultBatchId });
          if (histRes.success) setHistory(histRes.data as { id: string; date: string; batchName: string; status: string }[]);
        } catch {
          setError("Failed to load students");
        } finally {
          setLoading(false);
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultBatchId]);

  async function loadStudents() {
    if (!batchId) {
      setError("Select a batch to load students");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await listMyStudents({ batchId });
      const list = res.success ? (res.data as AttendanceStudent[]) : [];
      setStudents(list);
      setRecords((prev) => {
        const next: Record<string, AttendanceStatusValue> = {};
        for (const s of list) next[s.id] = prev[s.id] ?? "PRESENT";
        return next;
      });
    } catch {
      setError("Failed to load students");
    } finally {
      setLoading(false);
    }
  }

  async function loadHistory() {
    if (!batchId) return;
    try {
      const res = await listAttendanceRecords({ batchId });
      if (res.success) setHistory(res.data as { id: string; date: string; batchName: string; status: string }[]);
    } catch {
      console.error("Failed to load history");
    }
  }

  async function handleMarkAll(status: AttendanceStatusValue) {
    setRecords((prev) => {
      const next = { ...prev };
      for (const s of students) next[s.id] = status;
      return next;
    });
  }

  async function handleSave() {
    if (!batchId) {
      setError("Select a batch");
      return;
    }
    if (students.length === 0) {
      setError("Load students before saving");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const attendanceRecords = students.map((s) => ({
        studentId: s.id,
        status: records[s.id] ?? "PRESENT",
        remarks: remarks[s.id] || "",
      }));

      const res = await upsertAttendance({
        batchId,
        date,
        records: attendanceRecords,
      });

      if (res.success) {
        await loadHistory();
        alert("Attendance saved successfully");
      } else {
        setError(res.error);
      }
    } catch {
      setError("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>Select batch and date to mark attendance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label htmlFor="batch">Batch</Label>
              <Select
                value={batchId}
                onChange={(e) => {
                  const value = e.target.value;
                  setBatchId(value);
                  if (value) {
                    setLoading(true);
                    setError(null);
                    listMyStudents({ batchId: value }).then((res) => {
                      const list = res.success ? (res.data as AttendanceStudent[]) : [];
                      setStudents(list);
                      setRecords((prev) => {
                        const next: Record<string, AttendanceStatusValue> = {};
                        for (const s of list) next[s.id] = prev[s.id] ?? "PRESENT";
                        return next;
                      });
                      setLoading(false);
                    });
                    listAttendanceRecords({ batchId: value }).then((res) => {
                      if (res.success) setHistory(res.data as { id: string; date: string; batchName: string; status: string }[]);
                    });
                  } else {
                    setStudents([]);
                    setHistory([]);
                  }
                }}
              >
                <option value="">Select batch</option>
                {options.batches.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
            <div className="space-y-1.5 flex items-end">
              <Button onClick={loadStudents} disabled={loading} className="w-full">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />} Load Students
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle>Students ({students.length})</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => handleMarkAll("PRESENT")} disabled={!students.length}>
              <Check className="h-4 w-4 mr-1" /> Mark All Present
            </Button>
            <Button onClick={handleSave} disabled={saving || !students.length} className="ml-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Download className="h-4 w-4 mr-1" />} Save Attendance
            </Button>
          </div>
        </CardHeader>
        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-body-sm text-destructive" role="alert">
            {error}
          </div>
        )}
        <CardContent>
          {students.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Select a batch and load students to mark attendance.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Adm. No.</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.admissionNumber}</TableCell>
                    <TableCell>{s.fullName}</TableCell>
                    <TableCell>
                      <Select
                        value={records[s.id] ?? "PRESENT"}
                        onChange={(e) => setRecords((prev) => ({ ...prev, [s.id]: e.target.value as AttendanceStatusValue }))}
                      >
                        {ATTENDANCE_STATUS_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={remarks[s.id] ?? ""}
                        onChange={(e) => setRemarks((prev) => ({ ...prev, [s.id]: e.target.value }))}
                        placeholder="Optional"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance History</CardTitle>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No attendance records yet.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((h) => (
                  <TableRow key={h.id}>
                    <TableCell>{new Date(h.date).toLocaleDateString("en-IN")}</TableCell>
                    <TableCell>{h.batchName}</TableCell>
                    <TableCell>
                      <Badge variant={h.status === "SUBMITTED" ? "success" : "outline"}>
                        {h.status === "SUBMITTED" ? "Submitted" : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onSelect={() => router.push(`/dashboard/teacher/attendance/${h.id}`)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>Edit (same day only)</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
