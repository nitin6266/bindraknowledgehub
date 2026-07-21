"use client";

import { useMemo, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StudentTable } from "@/features/student/components/student-table";
import { archiveStudentAction } from "@/features/student/actions/student.actions";
import type { StudentRow, Option } from "@/features/student/student.types";

interface StudentsWorkspaceProps {
  students: StudentRow[];
  options: { sessions: Option[]; classes: Option[]; sections: Option[]; batches: Option[] };
  canManage: boolean;
}

const FILTER_DEFS = [
  { id: "sessionId", label: "Session", key: "sessionId" as const },
  { id: "classId", label: "Class", key: "classId" as const },
  { id: "batchId", label: "Batch", key: "batchId" as const },
  { id: "status", label: "Status", key: "status" as const },
];

export function StudentsWorkspace({ students, options, canManage }: StudentsWorkspaceProps) {
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);
  const [q, setQ] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Set<string>>(new Set());

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && !e.metaKey && !e.ctrlKey && document.activeElement !== searchRef.current) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const kpis = useMemo(() => {
    const total = students.length;
    const active = students.filter((s) => s.status === "ACTIVE").length;
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);
    const newAdm = students.filter((s) => s.status === "ACTIVE" && new Date(s.createdAt) >= monthStart).length;
    return { total, active, newAdm, inactive: total - active };
  }, [students]);

  const filtered = useMemo(() => {
    let r = students;
    if (q) {
      const t = q.toLowerCase();
      r = r.filter((s) =>
        [s.fullName, s.admissionNumber, s.primaryParentName, s.primaryParentPhone].some((v) => v?.toLowerCase().includes(t)),
      );
    }
    if (filters.sessionId) r = r.filter((s) => s.sessionId === filters.sessionId);
    if (filters.classId) r = r.filter((s) => s.classId === filters.classId);
    if (filters.batchId) r = r.filter((s) => s.batchId === filters.batchId);
    if (filters.status) r = r.filter((s) => s.status === filters.status);
    return r;
  }, [students, q, filters]);

  function clearFilters() { setQ(""); setFilters({}); searchRef.current?.focus(); }
  const hasFilters = q.length > 0 || Object.values(filters).some(Boolean);

  return (
    <div className="space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[32px] font-semibold tracking-tight text-foreground">Students</h1>
          <p className="text-[13px] text-muted-foreground/60 tabular-nums mt-0.5">
            <span className="font-medium text-foreground">{kpis.total}</span> total
            <span className="mx-1.5 text-border">·</span>
            <span className="font-medium text-success">{kpis.active}</span> active
            <span className="mx-1.5 text-border">·</span>
            <span className="font-medium text-primary">{kpis.newAdm}</span> new this month
            <span className="mx-1.5 text-border">·</span>
            <span className="font-medium text-muted-foreground">{kpis.inactive}</span> inactive
          </p>
        </div>
        {canManage && (
          <Button size="md" className="h-10 gap-1.5 rounded-[10px] text-[13px]" onClick={() => router.push("/dashboard/students/new")}>
            <Plus className="size-4" />
            Add Student
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground/40" />
          <input
            ref={searchRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, admission no, parent, phone..."
            className="h-10 w-full rounded-[10px] border border-border/60 bg-card pl-9 pr-9 text-[14px] text-foreground placeholder:text-muted-foreground/30 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/[0.06] transition-all"
          />
          {q && (
            <button onClick={() => { setQ(""); searchRef.current?.focus(); }} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground/40 hover:text-foreground transition-colors">
              <X className="size-3.5" />
            </button>
          )}
          {!q && <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 inline-flex items-center rounded-md border border-border/50 bg-background px-1.5 h-5 text-[10px] text-muted-foreground/30">/</kbd>}
        </div>
        {FILTER_DEFS.map((fd) => (
          <select
            key={fd.id}
            value={filters[fd.id] ?? ""}
            onChange={(e) => setFilters((p) => ({ ...p, [fd.id]: e.target.value }))}
            className="h-9 rounded-[10px] border border-border/60 bg-card px-2.5 text-[12px] text-muted-foreground appearance-none cursor-pointer hover:border-muted-foreground/30 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/[0.06] transition-all"
            aria-label={fd.label}
          >
            <option value="">{fd.label}</option>
            {(options[fd.key === "sessionId" ? "sessions" : fd.key === "classId" ? "classes" : fd.key === "batchId" ? "batches" : "sessions"] as Option[]).map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        ))}
        {hasFilters && (
          <button onClick={clearFilters} className="h-9 px-2.5 rounded-[10px] text-[12px] text-muted-foreground/50 hover:text-foreground hover:bg-secondary transition-colors shrink-0">
            <X className="size-3 inline mr-0.5" />Clear
          </button>
        )}
      </div>

      <StudentTable
        students={filtered}
        canManage={canManage}
        onView={(s) => router.push(`/dashboard/students/${s.id}`)}
        onEdit={(s) => router.push(`/dashboard/students/${s.id}/edit`)}
        onTransfer={(s) => router.push(`/dashboard/students/${s.id}/transfer`)}
        onPromote={(s) => router.push(`/dashboard/students/${s.id}/promote`)}
        onArchive={async (s) => { await archiveStudentAction(s.id); router.refresh(); }}
        selection={canManage}
        selectedIds={selected}
        onSelectionChange={setSelected}
      />

      {selected.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background/95 backdrop-blur px-6 py-2.5 flex items-center justify-between shadow-sm">
          <span className="text-[13px] font-medium tabular-nums text-foreground">{selected.size} selected</span>
          <div className="flex items-center gap-1">
            <BulkBtn label="Promote" />
            <BulkBtn label="Transfer" />
            <BulkBtn label="Archive" />
            <BulkBtn label="Export" />
            <span className="mx-1 h-5 w-px bg-border/40" />
            <button onClick={() => setSelected(new Set())} className="h-8 px-3 rounded-[8px] text-[12px] text-muted-foreground/50 hover:text-foreground hover:bg-secondary transition-colors">Clear</button>
          </div>
        </div>
      )}
    </div>
  );
}

function BulkBtn({ label }: { label: string }) {
  return (
    <button className="h-8 px-3 rounded-[8px] text-[12px] font-medium text-muted-foreground/60 hover:text-foreground hover:bg-secondary transition-colors">
      {label}
    </button>
  );
}
