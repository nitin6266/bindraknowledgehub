"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { Option } from "@/features/teacher/teacher.types";

interface FeeFiltersBarProps {
  options: {
    sessions: Option[];
    classes: Option[];
    batches: Option[];
    categories: Option[];
  };
  showStatus?: boolean;
  statusOptions?: Option[];
}

export function FeeFiltersBar({ options, showStatus, statusOptions }: FeeFiltersBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function update(next: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [k, v] of Object.entries(next)) {
      if (v) params.set(k, v);
      else params.delete(k);
    }
    router.push(`?${params.toString()}`, { scroll: false });
    router.refresh();
  }

  return (
    <div className="flex flex-wrap items-end gap-3 rounded-xl border border-border bg-card p-3">
      <div className="space-y-1.5 w-full sm:w-44">
        <Label htmlFor="f-session">Session</Label>
        <Select
          id="f-session"
          value={searchParams.get("sessionId") ?? ""}
          onChange={(e) => update({ sessionId: e.target.value })}
        >
          <option value="">All</option>
          {options.sessions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </div>
      <div className="space-y-1.5 w-full sm:w-40">
        <Label htmlFor="f-class">Class</Label>
        <Select
          id="f-class"
          value={searchParams.get("classId") ?? ""}
          onChange={(e) => update({ classId: e.target.value })}
        >
          <option value="">All</option>
          {options.classes.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </div>
      <div className="space-y-1.5 w-full sm:w-40">
        <Label htmlFor="f-batch">Batch</Label>
        <Select
          id="f-batch"
          value={searchParams.get("batchId") ?? ""}
          onChange={(e) => update({ batchId: e.target.value })}
        >
          <option value="">All</option>
          {options.batches.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </div>
      <div className="space-y-1.5 w-full sm:w-40">
        <Label htmlFor="f-category">Category</Label>
        <Select
          id="f-category"
          value={searchParams.get("categoryId") ?? ""}
          onChange={(e) => update({ categoryId: e.target.value })}
        >
          <option value="">All</option>
          {options.categories.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </Select>
      </div>
      {showStatus && statusOptions && (
        <div className="space-y-1.5 w-full sm:w-36">
          <Label htmlFor="f-status">Status</Label>
          <Select
            id="f-status"
            value={searchParams.get("status") ?? ""}
            onChange={(e) => update({ status: e.target.value })}
          >
            <option value="">All</option>
            {statusOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </Select>
        </div>
      )}
      <div className="space-y-1.5 w-full sm:w-44">
        <Label htmlFor="f-search">Search Student</Label>
        <Input
          id="f-search"
          placeholder="Name / admission no."
          defaultValue={searchParams.get("search") ?? ""}
          onChange={(e) => update({ search: e.target.value })}
        />
      </div>
      <Button variant="outline" onClick={() => router.push("?", { scroll: false })}>
        Reset
      </Button>
    </div>
  );
}
