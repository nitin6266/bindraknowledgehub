"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface ChildSwitcherProps {
  childOptions: { id: string; name: string }[];
  selectedId: string;
  label?: string;
}

export function ChildSwitcher({ childOptions, selectedId, label = "Child" }: ChildSwitcherProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onChange = useCallback(
    (childId: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("child", childId);
      router.push(`?${params.toString()}`, { scroll: false });
      router.refresh();
    },
    [router, searchParams],
  );

  if (childOptions.length <= 1) return null;

  return (
    <div className="space-y-1.5 w-full sm:w-64">
      <Label htmlFor="child-switch">{label}</Label>
      <Select id="child-switch" value={selectedId} onChange={(e) => onChange(e.target.value)}>
        {childOptions.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
