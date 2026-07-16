"use client";

import { useState } from "react";
import Link from "next/link";
import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Search, ChevronLeft, ChevronRight, MoreHorizontal, ArrowUpDown } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

import type { BatchRow, Option } from "@/features/teacher/teacher.types";

interface BatchesTableProps {
  batches: BatchRow[];
  options: {
    sessions: Option[];
    classes: Option[];
    sections: Option[];
  };
}

function statusBadge(status: string) {
  return <Badge variant="outline">{status.charAt(0) + status.slice(1).toLowerCase()}</Badge>;
}

export function BatchesTable({ batches, options }: BatchesTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const columns: ColumnDef<BatchRow>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <SortHeader label="Batch" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
      cell: ({ row }) => (
        <div>
          <p className="font-medium text-foreground">{row.original.name}</p>
          <p className="text-caption text-muted-foreground font-mono">{row.original.code}</p>
        </div>
      ),
    },
    {
      id: "class",
      accessorFn: (r) => `${r.className}${r.sectionName ? ` / ${r.sectionName}` : ""}`,
      header: "Class / Section",
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.className}{row.original.sectionName ? ` / ${row.original.sectionName}` : ""}</span>
      ),
    },
    {
      id: "session",
      accessorFn: (r) => r.sessionName,
      header: "Session",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.sessionName}</span>,
    },
    {
      accessorKey: "strength",
      header: "Strength",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.strength}</span>,
    },
    {
      id: "schedule",
      accessorFn: (r) => r.todaysSchedule,
      header: "Today's Schedule",
      cell: ({ row }) => <span className="text-caption text-muted-foreground">{row.original.todaysSchedule || "No classes today"}</span>,
    },
    {
      accessorKey: "teacherRole",
      header: "Role",
      cell: ({ row }) => statusBadge(row.original.teacherRole),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="text-right">
          <Button variant="ghost" size="icon" asChild aria-label={`View batch ${row.original.name}`}>
            <Link href={`/dashboard/teacher/batches/${row.original.id}`}>
              <MoreHorizontal className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      ),
      enableHiding: false,
    },
  ];

  const table = useReactTable({
    data: batches,
    columns,
    state: { sorting, columnFilters, globalFilter, columnVisibility },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-body-md">My Batches</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search batch name, code..."
                value={globalFilter}
                onChange={(e) => setGlobalFilter(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Select
                aria-label="Filter by session"
                value={(table.getColumn("session")?.getFilterValue() as string) ?? ""}
                onChange={(e) => table.getColumn("session")?.setFilterValue(e.target.value || undefined)}
                className="h-11 w-auto"
              >
                <option value="">All Sessions</option>
                {options.sessions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
              <Select
                aria-label="Filter by class"
                value={(table.getColumn("class")?.getFilterValue() as string) ?? ""}
                onChange={(e) => table.getColumn("class")?.setFilterValue(e.target.value || undefined)}
                className="h-11 w-auto"
              >
                <option value="">All Classes</option>
                {options.classes.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                      No batches assigned.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between text-body-sm text-muted-foreground">
            <span>
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
            </span>
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SortHeader({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="inline-flex items-center gap-1 text-left uppercase tracking-wide text-muted-foreground hover:text-foreground">
      {label}
      <ArrowUpDown className="h-3.5 w-3.5" />
    </button>
  );
}
