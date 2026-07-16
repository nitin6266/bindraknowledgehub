"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  UserPlus,
  ArrowUpDown,
  UserCog,
  FileText,
  Search,
  Users,
  CircleCheck,
  Clock,
  Archive,
  Plus,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { StatCard } from "@/components/ui/stat-card";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { StudentListClient } from "@/features/student/components/student-list-client";
import { AdmissionDialog } from "@/features/student/components/admission-dialog";
import {
  createStudentAction,
  promoteBulkAction,
  transferStudentAction,
} from "@/features/student/actions/student.actions";
import type { StudentRow, Option, PromoteValues, TransferValues } from "@/features/student/student.types";

interface StudentsWorkspaceProps {
  students: StudentRow[];
  options: {
    sessions: Option[];
    classes: Option[];
    sections: Option[];
    batches: Option[];
  };
  canManage: boolean;
}

const TABS = [
  { id: "list", label: "Student List", icon: Users },
  { id: "admissions", label: "Admissions", icon: UserPlus },
  { id: "promotions", label: "Promotions", icon: ArrowUpDown },
  { id: "transfers", label: "Transfers", icon: UserCog },
  { id: "documents", label: "Documents", icon: FileText },
] as const;

type TabId = (typeof TABS)[number]["id"];

export function StudentsWorkspace({ students, options, canManage }: StudentsWorkspaceProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get("tab") as TabId) ?? "list";

  const [admitOpen, setAdmitOpen] = useState(false);

  const stats = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.status === "ACTIVE").length;
    const pending = students.filter((s) => s.status === "INACTIVE" || s.status === "LEFT").length;
    const archived = students.filter((s) => s.status === "GRADUATED").length;
    return { total, active, pending, archived };
  }, [students]);

  function setTab(tab: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    router.push(`/dashboard/students?${params.toString()}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-body-sm font-medium text-primary">Student Management</p>
          <h1 className="mt-1 font-heading text-h2 font-semibold text-foreground sm:text-h1">
            Students Workspace
          </h1>
          <p className="mt-1 max-w-xl text-body-sm text-muted-foreground">
            Admit, track and manage every student across batches and sessions from one place.
          </p>
        </div>
        {canManage ? (
          <div className="flex shrink-0 flex-wrap gap-2">
            <Button variant="outline" onClick={() => setAdmitOpen(true)}>
              <UserPlus className="h-4 w-4" /> Admit Student
            </Button>
          </div>
        ) : null}
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Students" value={stats.total} icon={<Users className="h-5 w-5" />} tone="primary" />
        <StatCard label="Active" value={stats.active} icon={<CircleCheck className="h-5 w-5" />} tone="success" />
        <StatCard label="Pending / Left" value={stats.pending} icon={<Clock className="h-5 w-5" />} tone="warning" />
        <StatCard label="Graduated" value={stats.archived} icon={<Archive className="h-5 w-5" />} tone="accent" />
      </div>

      <nav className="flex flex-wrap gap-1 border-b border-border" aria-label="Student workspace sections">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setTab(tab.id)}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative -mb-px inline-flex items-center gap-2 rounded-t-lg px-3 py-2 text-body-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active ? "border-b-2 border-primary text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      <div>
        {activeTab === "list" ? (
          <StudentListClient students={students} options={options} canManage={canManage} />
        ) : null}
        {activeTab === "admissions" ? (
          <AdmissionsPanel students={students} canManage={canManage} onAdmit={() => setAdmitOpen(true)} />
        ) : null}
        {activeTab === "promotions" ? <PromotionsPanel students={students} options={options} canManage={canManage} /> : null}
        {activeTab === "transfers" ? <TransfersPanel students={students} options={options} canManage={canManage} /> : null}
        {activeTab === "documents" ? <DocumentsPanel students={students} /> : null}
      </div>

      {canManage ? (
        <AdmissionDialog
          open={admitOpen}
          onOpenChange={setAdmitOpen}
          options={options}
          onSubmit={(values) => createStudentAction(values)}
        />
      ) : null}
    </div>
  );
}

function statusBadge(status: string) {
  const map: Record<string, "success" | "outline"> = {
    ACTIVE: "success",
    INACTIVE: "outline",
    LEFT: "outline",
    GRADUATED: "outline",
  };
  return <Badge variant={map[status] ?? "outline"}>{status.charAt(0) + status.slice(1).toLowerCase()}</Badge>;
}

function initials(name: string) {
  const parts = name.split(" ").filter((p) => p.length > 0);
  if (!parts.length) return "?";
  return parts.slice(0, 2).map((p) => p.charAt(0).toUpperCase()).join("");
}

function AdmissionsPanel({
  students,
  canManage,
  onAdmit,
}: {
  students: StudentRow[];
  canManage: boolean;
  onAdmit: () => void;
}) {
  const recent = useMemo(
    () => [...students].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 12),
    [students],
  );

  if (!recent.length) {
    return (
      <EmptyState
        icon={<UserPlus className="h-8 w-8" />}
        title="No admissions yet"
        description="Admit your first student to start building the roster."
        action={canManage ? <Button onClick={onAdmit}><Plus className="h-4 w-4" /> Admit Student</Button> : undefined}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-h3 font-semibold text-foreground">Recent Admissions</h2>
        {canManage ? (
          <Button onClick={onAdmit}>
            <Plus className="h-4 w-4" /> New Admission
          </Button>
        ) : null}
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Adm. No.</TableHead>
              <TableHead>Class</TableHead>
              <TableHead>Admitted</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recent.map((s) => (
              <TableRow key={s.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-caption font-semibold text-primary">
                      {initials(s.fullName)}
                    </div>
                    <span className="font-medium text-foreground">{s.fullName}</span>
                  </div>
                </TableCell>
                <TableCell className="font-mono text-muted-foreground">{s.admissionNumber}</TableCell>
                <TableCell className="text-muted-foreground">
                  {s.className}
                  {s.sectionName ? ` / ${s.sectionName}` : null}
                </TableCell>
                <TableCell className="text-muted-foreground">{formatDate(s.createdAt)}</TableCell>
                <TableCell>{statusBadge(s.status)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function PromotionsPanel({
  students,
  options,
  canManage,
}: {
  students: StudentRow[];
  options: StudentsWorkspaceProps["options"];
  canManage: boolean;
}) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [session, setSession] = useState("");
  const [klass, setKlass] = useState("");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!canManage) {
    return <EmptyState icon={<ArrowUpDown className="h-8 w-8" />} title="Restricted" description="Only administrators can promote students." />;
  }

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  async function handlePromote() {
    setError(null);
    if (!session || !klass) {
      setError("Select target session and class.");
      return;
    }
    if (selected.size === 0) {
      setError("Select at least one student.");
      return;
    }
    setPending(true);
    try {
      const result = await promoteBulkAction(Array.from(selected), { toSessionId: session, toClassId: klass, note } as PromoteValues);
      if (result.success) {
        setSelected(new Set());
        setNote("");
        setSession("");
        setKlass("");
      } else {
        setError(result.error);
      }
    } catch {
      setError("Promotion failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-h3 font-semibold text-foreground">Bulk Promotion</h2>
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="promSession">Target Session</Label>
            <Select id="promSession" value={session} onChange={(e) => setSession(e.target.value)} className="h-11">
              <option value="">Select session</option>
              {options.sessions.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="promClass">Target Class</Label>
            <Select id="promClass" value={klass} onChange={(e) => setKlass(e.target.value)} className="h-11">
              <option value="">Select class</option>
              {options.classes.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </Select>
          </div>
          <Button onClick={handlePromote} loading={pending} disabled={pending || selected.size === 0}>
            Promote ({selected.size})
          </Button>
        </div>
      </div>

      {error ? <p className="text-body-sm text-destructive">{error}</p> : null}

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10">Select</TableHead>
              <TableHead>Student</TableHead>
              <TableHead>Current Class</TableHead>
              <TableHead>Batch</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length ? (
              students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell>
                    <input type="checkbox" aria-label={`Select ${s.fullName}`} checked={selected.has(s.id)} onChange={() => toggle(s.id)} className="size-4" />
                  </TableCell>
                  <TableCell className="font-medium text-foreground">{s.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.className}
                    {s.sectionName ? ` / ${s.sectionName}` : null}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{s.batchName ?? "—"}</TableCell>
                  <TableCell>{statusBadge(s.status)}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">No students found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function TransfersPanel({
  students,
  options,
  canManage,
}: {
  students: StudentRow[];
  options: StudentsWorkspaceProps["options"];
  canManage: boolean;
}) {
  const [target, setTarget] = useState<StudentRow | null>(null);
  const [batch, setBatch] = useState("");
  const [reason, setReason] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!canManage) {
    return <EmptyState icon={<UserCog className="h-8 w-8" />} title="Restricted" description="Only administrators can transfer students between batches." />;
  }

  async function handleTransfer() {
    if (!target) return;
    setError(null);
    if (!batch) {
      setError("Select a target batch.");
      return;
    }
    setPending(true);
    try {
      const result = await transferStudentAction(target.id, { toBatchId: batch, reason } as TransferValues);
      if (result.success) {
        setTarget(null);
        setBatch("");
        setReason("");
      } else {
        setError(result.error);
      }
    } catch {
      setError("Transfer failed.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-h3 font-semibold text-foreground">Batch Transfers</h2>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Current Batch</TableHead>
              <TableHead>Class</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {students.length ? (
              students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-medium text-foreground">{s.fullName}</TableCell>
                  <TableCell className="text-muted-foreground">{s.batchName ?? "—"}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {s.className}
                    {s.sectionName ? ` / ${s.sectionName}` : null}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => { setTarget(s); setBatch(""); setReason(""); setError(null); }}>
                      <UserCog className="h-4 w-4" /> Transfer
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">No students found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!target} onOpenChange={(o) => !o && setTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Transfer {target ? target.fullName : ""}</DialogTitle>
            <DialogDescription>
              {target?.batchName ? `Current batch: ${target.batchName}. ` : ""}Move the student to a different batch.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="trBatch">Target batch</Label>
              <Select id="trBatch" value={batch} onChange={(e) => setBatch(e.target.value)}>
                <option value="">Select batch</option>
                {options.batches.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="trReason">Reason</Label>
              <Input id="trReason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Optional" />
            </div>
            {error ? <p className="text-body-sm text-destructive">{error}</p> : null}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={pending}>Cancel</Button>
            </DialogClose>
            <Button onClick={handleTransfer} loading={pending} disabled={pending}>Transfer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DocumentsPanel({ students }: { students: StudentRow[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(
    () => students.filter((s) => `${s.fullName} ${s.admissionNumber}`.toLowerCase().includes(query.toLowerCase())),
    [students, query],
  );

  if (!students.length) {
    return <EmptyState icon={<FileText className="h-8 w-8" />} title="No students" description="Add students to manage their documents." />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-h3 font-semibold text-foreground">Student Documents</h2>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search student"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-9"
            aria-label="Search students"
          />
        </div>
      </div>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student</TableHead>
              <TableHead>Adm. No.</TableHead>
              <TableHead>Class</TableHead>
              <TableHead className="text-right">Manage</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium text-foreground">{s.fullName}</TableCell>
                <TableCell className="font-mono text-muted-foreground">{s.admissionNumber}</TableCell>
                <TableCell className="text-muted-foreground">
                  {s.className}
                  {s.sectionName ? ` / ${s.sectionName}` : null}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm" asChild>
                    <a href={`/dashboard/students/${s.id}`}>
                      <FileText className="h-4 w-4" /> Documents
                    </a>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}

function formatDate(value: string | Date) {
  const d = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
