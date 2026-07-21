"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface BulkAction {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
}

interface BulkActionBarProps {
  count: number;
  actions: BulkAction[];
  onClear: () => void;
  className?: string;
}

export function BulkActionBar({ count, actions, onClear, className }: BulkActionBarProps) {
  if (count === 0) return null;

  return (
    <div
      className={cn(
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-scale-in",
        className,
      )}
    >
      <div className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-lg shadow-black/5">
        <span className="text-sm font-medium text-foreground whitespace-nowrap tabular-nums">
          {count} selected
        </span>
        <div className="flex items-center gap-1.5">
          {actions.map((action) => (
            <Button
              key={action.label}
              variant={action.variant ?? "outline"}
              size="sm"
              onClick={action.onClick}
              className="gap-1.5"
            >
              {action.icon}
              {action.label}
            </Button>
          ))}
          <Button variant="ghost" size="sm" onClick={onClear} className="gap-1">
            <X className="size-3.5" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
