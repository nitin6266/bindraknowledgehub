"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Users, ClipboardList, CheckSquare, ClipboardCheck, BookOpen, ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import {
  listMyStudents,
  listAssignments,
  listTests,
} from "@/features/teacher/actions/teacher.actions";

type TabKey = "students" | "attendance" | "assignments" | "tests" | "marks";

const TABS: { key: TabKey; label: string; icon: React.ReactNode }[] = [
  { key: "students", label: "Students", icon: <Users className="h-4 w-4" /> },
  { key: "attendance", label: "Attendance", icon: <ClipboardCheck className="h-4 w-4" /> },
  { key: "assignments", label: "Assignments", icon: <ClipboardList className="h-4 w-4" /> },
  { key: "tests", label: "Tests", icon: <CheckSquare className="h-4 w-4" /> },
  { key: "marks", label: "Marks", icon: <BookOpen className="h-4 w-4" /> },
];

interface ClassWorkspaceProps {
  batchId: string;
  batchName: string;
}

export function ClassWorkspace({ batchId, batchName }: ClassWorkspaceProps) {
  const [tab, setTab] = useState<TabKey>("students");
  const [students, setStudents] = useState<{ id: string; admissionNumber: string; fullName: string; attendancePercent: number | string; latestTestScore: string; status: string }[]>([]);
  const [assignments, setAssignments] = useState<{ id: string; title: string; subjectName: string; dueDate: string; status: string }[]>([]);
  const [tests, setTests] = useState<{ id: string; title: string; subjectName: string; testDate: string; status: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      try {
        const [s, a, t] = await Promise.all([
          listMyStudents({ batchId }),
          listAssignments({ batchId }),
          listTests({ batchId }),
        ]);
        if (!active) return;
        setStudents((s.success ? s.data : []) as never);
        setAssignments((a.success ? a.data : []) as never);
        setTests((t.success ? t.data : []) as never);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [batchId]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-1 border-b border-border" role="tablist" aria-label="Class workspace">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              "inline-flex items-center gap-2 rounded-t-lg px-4 py-2.5 text-body-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              tab === t.key
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-xl border border-border bg-muted/50" />
          ))}
        </div>
      ) : (
        <div role="tabpanel">
          {tab === "students" && (
            <Card className="shadow-sm">
              <CardContent className="p-0">
                {students.length === 0 ? (
                  <EmptyState icon={<Users className="h-8 w-8" />} title="No students" description="This batch has no students assigned yet." />
                ) : (
                  <ul role="list" className="divide-y divide-border">
                    {students.map((s) => (
                      <li key={s.id} className="flex items-center justify-between gap-3 px-5 py-3">
                        <div className="min-w-0">
                          <p className="text-body-sm font-medium text-foreground">{s.fullName}</p>
                          <p className="text-body-xs text-muted-foreground">{s.admissionNumber}</p>
                        </div>
                        <div className="flex items-center gap-4 text-body-sm text-muted-foreground">
                          <span>{typeof s.attendancePercent === "number" ? `${s.attendancePercent}%` : s.attendancePercent} att.</span>
                          <span>{s.latestTestScore}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}

          {tab === "attendance" && (
            <div className="space-y-3">
              <p className="text-body text-muted-foreground">Mark or review attendance for {batchName}.</p>
              <Button asChild>
                <Link href={`/dashboard/teacher/attendance?batch=${batchId}`}>
                  <ClipboardCheck className="h-4 w-4" /> Take Attendance
                </Link>
              </Button>
            </div>
          )}

          {tab === "assignments" && (
            <Card className="shadow-sm">
              <CardContent className="p-0">
                {assignments.length === 0 ? (
                  <EmptyState icon={<ClipboardList className="h-8 w-8" />} title="No assignments" description="Create an assignment for this batch." />
                ) : (
                  <ul role="list" className="divide-y divide-border">
                    {assignments.map((a) => (
                      <li key={a.id} className="flex items-center justify-between gap-3 px-5 py-3">
                        <div className="min-w-0">
                          <p className="text-body-sm font-medium text-foreground">{a.title}</p>
                          <p className="text-body-xs text-muted-foreground">{a.subjectName} · Due {a.dueDate}</p>
                        </div>
                        <Badge variant={a.status === "PUBLISHED" ? "success" : "outline"}>{a.status}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}

          {tab === "tests" && (
            <Card className="shadow-sm">
              <CardContent className="p-0">
                {tests.length === 0 ? (
                  <EmptyState icon={<CheckSquare className="h-8 w-8" />} title="No tests" description="Schedule a test for this batch." />
                ) : (
                  <ul role="list" className="divide-y divide-border">
                    {tests.map((t) => (
                      <li key={t.id} className="flex items-center justify-between gap-3 px-5 py-3">
                        <div className="min-w-0">
                          <p className="text-body-sm font-medium text-foreground">{t.title}</p>
                          <p className="text-body-xs text-muted-foreground">{t.subjectName} · {t.testDate}</p>
                        </div>
                        <Badge variant={t.status === "PUBLISHED" ? "success" : "outline"}>{t.status}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          )}

          {tab === "marks" && (
            <div className="space-y-3">
              <p className="text-body text-muted-foreground">Enter marks for conducted tests in {batchName}.</p>
              {tests.filter((t) => t.status === "CONDUCTED" || t.status === "GRADED").length === 0 ? (
                <EmptyState icon={<BookOpen className="h-8 w-8" />} title="Nothing to grade" description="Conducted tests will appear here for marks entry." />
              ) : (
                <ul role="list" className="space-y-2">
                  {tests
                    .filter((t) => t.status === "CONDUCTED" || t.status === "GRADED")
                    .map((t) => (
                      <li key={t.id}>
                        <Link
                          href={`/dashboard/teacher/marks?test=${t.id}`}
                          className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-3 shadow-sm transition-colors hover:border-primary/40 hover:bg-primary/5"
                        >
                          <div>
                            <p className="text-body-sm font-medium text-foreground">{t.title}</p>
                            <p className="text-body-xs text-muted-foreground">{t.subjectName}</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        </Link>
                      </li>
                    ))}
                </ul>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
