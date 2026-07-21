"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";

interface FilterOption {
  value: string;
  label: string;
}

interface FilterDef {
  id: string;
  label: string;
  options: FilterOption[];
  value: string;
}

interface FilterBarProps {
  filters: FilterDef[];
  onFilterChange: (id: string, value: string) => void;
  onClear: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  searchShortcut?: string;
  className?: string;
}

export function FilterBar({
  filters,
  onFilterChange,
  onClear,
  searchValue,
  onSearchChange,
  searchPlaceholder = "Search...",
  searchShortcut,
  className,
}: FilterBarProps) {
  const hasActiveFilters = searchValue.length > 0 || filters.some((f) => f.value.length > 0);

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <SearchBar
        value={searchValue}
        onChange={onSearchChange}
        placeholder={searchPlaceholder}
        shortcut={searchShortcut}
        className="flex-1 min-w-[200px]"
      />
      {filters.map((filter) => (
        <select
          key={filter.id}
          value={filter.value}
          onChange={(e) => onFilterChange(filter.id, e.target.value)}
          className="h-9 rounded-lg border border-border bg-surface px-3 text-xs text-foreground appearance-none cursor-pointer hover:border-muted-foreground/30 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-colors"
          aria-label={filter.label}
        >
          <option value="">{filter.label}</option>
          {filter.options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ))}
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClear} className="h-9 px-2.5 gap-1 text-xs shrink-0">
          <X className="size-3.5" />
          Clear
        </Button>
      )}
    </div>
  );
}
