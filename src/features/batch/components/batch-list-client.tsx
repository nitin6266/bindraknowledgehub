"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type Column,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Archive,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Columns3,
  Copy,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
} from "lucide-react";

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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ConfirmDialog } from "@/features/users/components/confirm-dialog";

import { BatchDialog } from "@/features/batch/components/batch-dialog";
import {
  createBatchAction,
  updateBatchAction,
  archiveBatchAction,
  deleteBatchAction,
  cloneBatchAction,
} from "@/features/batch/actions/batch.actions";
import { BATCH_STATUS_OPTIONS } from "@/features/batch/batch.constants";
import type { BatchRow, Option } from "@/features/batch/batch.types";

interface BatchListClientProps {
  batches: BatchRow[];
  options: {
    sessions: Option[];
    classes: Option[];
    sections: Option[];
    batchTypes: Option[];
    teachers: Option[];
  };
  canManage: boolean;
}

function statusBadge(status: string) {
  if (status === "ACTIVE") {
    return <Badge variant="success">{status.charAt(0) + status.slice(1).toLowerCase()}</Badge>;
  }
  return <Badge variant="outline">{status.charAt(0) + status.slice(1).toLowerCase()}</Badge>;
}

export function BatchListClient({ batches, options, canManage }: BatchListClientProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [createOpen, setCreateOpen] = useState(false);
  const [editBatch, setEditBatch] = useState<BatchRow | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<BatchRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BatchRow | null>(null);
  const [cloneTarget, setCloneTarget] = useState<BatchRow | null>(null);

  const sessionFilter = options.sessions.map((o) => ({ value: o.label, label: o.label }));
  const classFilter = options.classes.map((o) => ({ value: o.label, label: o.label }));
  const batchTypeFilter = options.batchTypes.map((o) => ({ value: o.label, label: o.label }));
  const teacherFilter = Array.from(new Set([...options.teachers.map((o) => o.label), "—"])).map((label) => ({ value: label, label }));

  const columns: ColumnDef<BatchRow>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => <SortHeader label="Batch" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
      cell: ({ row }) => <div className="font-medium text-foreground">{row.original.name}</div>,
    },
    { accessorKey: "code", header: "Code", cell: ({ row }) => <span className="text-muted-foreground">{row.original.code}</span> },
    {
      id: "session",
      accessorFn: (r) => r.sessionName,
      header: "Session",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.sessionName}</span>,
    },
    {
      id: "class",
      accessorFn: (r) => `${r.className}${r.sectionName ? ` / ${r.sectionName}` : ""}`,
      header: "Class",
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.className}
          {row.original.sectionName ? ` / ${row.original.sectionName}` : null}
        </span>
      ),
    },
    {
      id: "batchType",
      accessorFn: (r) => r.batchTypeName,
      header: "Type",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.batchTypeName}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => statusBadge(row.original.status),
    },
    {
      id: "teacher",
      accessorFn: (r) => r.primaryTeacherName ?? "—",
      header: "Primary Teacher",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.primaryTeacherName ?? "—"}</span>,
    },
    {
      id: "strength",
      accessorFn: (r) => `${r.currentStrength}/${r.capacity}`,
      header: ({ column }) => <SortHeader label="Strength" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.currentStrength}/{row.original.capacity}</span>,
    },
    ...(canManage
      ? [
          {
            id: "actions",
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }: { row: { original: BatchRow } }) => (
              <div className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label={`Actions for ${row.original.name}`}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setEditBatch(row.original)}>
                      <Pencil className="h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setArchiveTarget(row.original)}>
                      <Archive className="h-4 w-4" /> Archive
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => setCloneTarget(row.original)}>
                      <Copy className="h-4 w-4" /> Clone
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() => setDeleteTarget(row.original)}
                      className="text-destructive focus:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ),
            enableHiding: false,
          } as ColumnDef<BatchRow>,
        ]
      : []),
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

  const counts = computeCounts(batches);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard title="Total Batches" value={counts.total} />
        <StatCard title="Active Batches" value={counts.active} />
        <StatCard title="Offline Batches" value={counts.offline} />
        <StatCard title="Online Batches" value={counts.online} />
        <StatCard title="Total Students" value={counts.students} hint="Placeholder" />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search batch, teacher, class"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
            aria-label="Search batches"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect label="Session" column={table.getColumn("session")} options={sessionFilter} />
          <FilterSelect label="Class" column={table.getColumn("class")} options={classFilter} />
          <FilterSelect label="Type" column={table.getColumn("batchType")} options={batchTypeFilter} />
          <FilterSelect label="Teacher" column={table.getColumn("teacher")} options={teacherFilter} />
          <FilterSelect
            label="Status"
            column={table.getColumn("status")}
            options={BATCH_STATUS_OPTIONS.map((o) => ({ value: o.label, label: o.label }))}
          />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Toggle columns">
                <Columns3 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table.getAllColumns().filter((c) => c.getCanHide()).map((column) => (
                <DropdownMenuItem
                  key={column.id}
                  onSelect={(e) => e.preventDefault()}
                  onClick={() => column.toggleVisibility(!column.getIsVisible())}
                >
                  <input type="checkbox" checked={column.getIsVisible()} readOnly className="mr-2" />
                  {column.id.charAt(0).toUpperCase() + column.id.slice(1)}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {canManage ? (
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" /> New Batch
            </Button>
          ) : null}
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
                <TableRow key={row.id} className="cursor-pointer" onClick={() => router.push(`/dashboard/academic/batch/${row.original.id}`)}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No batches found.
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
          <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} aria-label="Previous page">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} aria-label="Next page">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {canManage ? (
        <BatchDialog
          key={editBatch ? `edit-${editBatch.id}` : "create"}
          open={createOpen || !!editBatch}
          onOpenChange={(o) => {
            if (!o) {
              setCreateOpen(false);
              setEditBatch(null);
            }
          }}
          initial={editBatch}
          options={options}
          onSubmit={async (values) => {
            if (editBatch) {
              return updateBatchAction(editBatch.id, values);
            }
            return createBatchAction(values);
          }}
        />
      ) : null}

      <ConfirmDialog
        open={!!archiveTarget}
        onOpenChange={(o) => !o && setArchiveTarget(null)}
        title="Archive batch"
        description={archiveTarget ? `Archive "${archiveTarget.name}"? It will be hidden from active operations but retained.` : ""}
        confirmLabel="Archive"
        onConfirm={async () => {
          if (archiveTarget) {
            await archiveBatchAction(archiveTarget.id);
            setArchiveTarget(null);
            router.refresh();
          }
        }}
      />

      <ConfirmDialog
        open={!!cloneTarget}
        onOpenChange={(o) => !o && setCloneTarget(null)}
        title="Clone batch"
        description={cloneTarget ? `Create a copy of "${cloneTarget.name}" with its schedules and subjects?` : ""}
        confirmLabel="Clone"
        onConfirm={async () => {
          if (cloneTarget) {
            await cloneBatchAction(cloneTarget.id);
            setCloneTarget(null);
            router.refresh();
          }
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete batch"
        description={deleteTarget ? `Permanently delete "${deleteTarget.name}"? This can be reversed by an administrator.` : ""}
        confirmLabel="Delete"
        destructive
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteBatchAction(deleteTarget.id);
            setDeleteTarget(null);
            router.refresh();
          }
        }}
      />
    </div>
  );
}

function computeCounts(batches: BatchRow[]) {
  return {
    total: batches.length,
    active: batches.filter((b) => b.status === "ACTIVE").length,
    offline: batches.filter((b) => (b.batchTypeName ?? "").toLowerCase() === "offline").length,
    online: batches.filter((b) => (b.batchTypeName ?? "").toLowerCase() === "online").length,
    students: batches.reduce((sum, b) => sum + b.currentStrength, 0),
  };
}

function StatCard({ title, value, hint }: { title: string; value: number; hint?: string }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-body-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-h3 font-semibold text-foreground">{value}</div>
        {hint ? <p className="text-body-sm text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Card>
  );
}

function FilterSelect({
  label,
  column,
  options,
}: {
  label: string;
  column: Column<BatchRow, unknown> | undefined;
  options: { value: string; label: string }[];
}) {
  return (
    <Select
      aria-label={`Filter by ${label}`}
      value={(column?.getFilterValue() as string) ?? ""}
      onChange={(e) => column?.setFilterValue(e.target.value || undefined)}
      className="h-11 w-auto"
    >
      <option value="">All {label.toLowerCase()}s</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </Select>
  );
}

function SortHeader({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1 text-left uppercase tracking-wide text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      {label}
      <ArrowUpDown className="h-3.5 w-3.5" />
    </button>
  );
}
