"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AttendanceDayView } from "@/features/parent/parent.types";

interface AttendanceCalendarProps {
  days: AttendanceDayView[];
  year: number;
  month: number;
  studentName: string;
}

const STATUS_STYLES: Record<string, string> = {
  PRESENT: "bg-success/15 text-success border-success/30",
  LATE: "bg-warning/15 text-warning border-warning/30",
  ABSENT: "bg-destructive/10 text-destructive border-destructive/30",
};

const WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function buildGrid(year: number, month: number) {
  const first = new Date(Date.UTC(year, month - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7;
  const cells: (number | null)[] = [];
  for (let i = 0; i < lead; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

function shiftMonth(year: number, month: number, delta: number) {
  const date = new Date(Date.UTC(year, month - 1 + delta, 1));
  return { y: date.getUTCFullYear(), m: date.getUTCMonth() + 1 };
}

export function AttendanceCalendar({ days, year, month, studentName }: AttendanceCalendarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const statusByDate = new Map(days.map((d) => [d.date, d.status]));

  const changeMonth = useCallback(
    (delta: number) => {
      const { y, m } = shiftMonth(year, month, delta);
      const params = new URLSearchParams(searchParams.toString());
      params.set("year", String(y));
      params.set("month", String(m));
      router.push(`?${params.toString()}`, { scroll: false });
      router.refresh();
    },
    [router, searchParams, year, month],
  );

  const cells = buildGrid(year, month);
  const monthLabel = new Date(Date.UTC(year, month - 1, 1)).toLocaleString("en-IN", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between gap-2">
        <CardTitle className="text-h4">{monthLabel}</CardTitle>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={() => changeMonth(-1)} aria-label="Previous month">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => changeMonth(1)} aria-label="Next month">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-3 text-body-sm text-muted-foreground">Attendance for {studentName}</p>
        <div className="grid grid-cols-7 gap-1.5">
          {WEEKDAYS.map((w) => (
            <div key={w} className="text-center text-caption font-medium text-muted-foreground">
              {w}
            </div>
          ))}
          {cells.map((day, idx) => {
            if (!day) return <div key={`e-${idx}`} />;
            const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const status = statusByDate.get(iso);
            const style = status ? STATUS_STYLES[status] : "bg-muted/40 text-muted-foreground border-transparent";
            const label = status ? status.charAt(0) : "";
            return (
              <div
                key={iso}
                title={status ?? "No record"}
                className={`flex aspect-square items-center justify-center rounded-lg border text-body-xs font-semibold ${style}`}
              >
                {day}
                {label && <span className="sr-only">{status}</span>}
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-3 text-body-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-success/40" /> Present
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-warning/40" /> Late
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-destructive/30" /> Absent
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
