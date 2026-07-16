"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  type ColumnDef,
  type SortingState,
  type ColumnFiltersState,
  type VisibilityState,
  type RowSelectionState,
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
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  Trash2,
  UserPlus,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { ConfirmDialog } from "@/features/users/components/confirm-dialog";

import { AdmissionDialog } from "@/features/student/components/admission-dialog";
import {
  createStudentAction,
  archiveStudentAction,
  deleteStudentAction,
  promoteBulkAction,
} from "@/features/student/actions/student.actions";
import { STUDENT_STATUS_OPTIONS } from "@/features/student/student.constants";
import type { StudentRow, Option, PromoteValues } from "@/features/student/student.types";

interface StudentListClientProps {
  students: StudentRow[];
  options: {
    sessions: Option[];
    classes: Option[];
    sections: Option[];
    batches: Option[];
  };
  canManage: boolean;
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

export function StudentListClient({ students, options, canManage }: StudentListClientProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [createOpen, setCreateOpen] = useState(false);
  const [archiveTarget, setArchiveTarget] = useState<StudentRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<StudentRow | null>(null);

  const [bulkOpen, setBulkOpen] = useState(false);
  const [bulkSession, setBulkSession] = useState("");
  const [bulkClass, setBulkClass] = useState("");
  const [bulkError, setBulkError] = useState<string | null>(null);
  const [bulkPending, setBulkPending] = useState(false);

  const columns: ColumnDef<StudentRow>[] = [
    ...(canManage
      ? [
          {
            id: "select",
            header: ({ table }) => (
              <input
                type="checkbox"
                aria-label="Select all"
                checked={table.getIsAllRowsSelected()}
                onChange={table.getToggleAllRowsSelectedHandler()}
                className="size-4"
              />
            ),
            cell: ({ row }) => (
              <input
                type="checkbox"
                aria-label="Select row"
                checked={row.getIsSelected()}
                onChange={row.getToggleSelectedHandler()}
                className="size-4"
              />
            ),
            enableHiding: false,
          } as ColumnDef<StudentRow>,
        ]
      : []),
    {
      accessorKey: "admissionNumber",
      header: ({ column }) => <SortHeader label="Adm. No." onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
      cell: ({ row }) => <span className="font-mono text-muted-foreground">{row.original.admissionNumber}</span>,
    },
    {
      accessorKey: "fullName",
      header: ({ column }) => <SortHeader label="Student" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />,
      cell: ({ row }) => <span className="font-medium text-foreground">{row.original.fullName}</span>,
    },
    {
      id: "class",
      accessorFn: (r) => r.className,
      header: "Class",
      filterFn: "includesString",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.className}{row.original.sectionName ? ` / ${row.original.sectionName}` : null}</span>,
    },
    {
      id: "batch",
      accessorFn: (r) => r.batchName ?? "—",
      header: "Batch",
      filterFn: "includesString",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.batchName ?? "—"}</span>,
    },
    {
      id: "session",
      accessorFn: (r) => r.sessionName,
      header: "Session",
      filterFn: "includesString",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.sessionName}</span>,
    },
    {
      id: "parent",
      accessorFn: (r) => r.primaryParentName ?? "—",
      header: "Parent",
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.primaryParentName ?? "—"}</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => statusBadge(row.original.status),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="text-right">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label={`Actions for ${row.original.fullName}`}>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => router.push(`/dashboard/students/${row.original.id}`)}>
                <Pencil className="h-4 w-4" /> View
              </DropdownMenuItem>
              {canManage ? (
                <>
                  <DropdownMenuItem onSelect={() => setArchiveTarget(row.original)}>
                    <Archive className="h-4 w-4" /> Archive
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onSelect={() => setDeleteTarget(row.original)}
                    className="text-destructive focus:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </>
              ) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      enableHiding: false,
    },
  ];

  const table = useReactTable({
    data: students,
    columns,
    state: { sorting, columnFilters, globalFilter, columnVisibility, rowSelection },
    enableRowSelection: canManage,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  const selectedIds = table.getSelectedRowModel().rows.map((r) => r.original.id);
  const counts = {
    total: students.length,
    newAdmissions: students.filter((s) => Date.now() - new Date(s.createdAt).getTime() < 30 * 864e5).length,
    active: students.filter((s) => s.status === "ACTIVE").length,
    inactive: students.filter((s) => s.status === "INACTIVE").length,
  };

  async function handleBulkPromote() {
    setBulkError(null);
    if (!bulkSession || !bulkClass) {
      setBulkError("Select target session and class.");
      return;
    }
    setBulkPending(true);
    try {
      const result = await promoteBulkAction(selectedIds, { toSessionId: bulkSession, toClassId: bulkClass, note: "" } as PromoteValues);
      if (result.success) {
        setBulkOpen(false);
        setRowSelection({});
        router.refresh();
      } else {
        setBulkError(result.error);
      }
    } catch {
      setBulkError("Something went wrong.");
    } finally {
      setBulkPending(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Students" value={counts.total} />
        <StatCard title="New Admissions" value={counts.newAdmissions} />
        <StatCard title="Active Students" value={counts.active} />
        <StatCard title="Inactive Students" value={counts.inactive} />
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name, admission no., parent"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
            aria-label="Search students"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <FilterSelect label="Session" column={table.getColumn("session")} options={options.sessions.map((o) => ({ value: o.label, label: o.label }))} />
          <FilterSelect label="Class" column={table.getColumn("class")} options={options.classes.map((o) => ({ value: o.label, label: o.label }))} />
          <FilterSelect label="Batch" column={table.getColumn("batch")} options={options.batches.map((o) => ({ value: o.label, label: o.label }))} />
          <FilterSelect label="Status" column={table.getColumn("status")} options={STUDENT_STATUS_OPTIONS.map((o) => ({ value: o.value, label: o.label }))} />

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
            <>
              <Button variant="outline" onClick={() => setBulkOpen(true)} disabled={selectedIds.length === 0}>
                <UserPlus className="h-4 w-4" /> Promote ({selectedIds.length})
              </Button>
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="h-4 w-4" /> Admit Student
              </Button>
            </>
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
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No students found.
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
        <AdmissionDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          options={options}
          onSubmit={(values) => createStudentAction(values)}
        />
      ) : null}

      <Dialog open={bulkOpen} onOpenChange={setBulkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Promote {selectedIds.length} student(s)</DialogTitle>
            <DialogDescription>Move the selected students to the next academic session and class.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="bulkSession">Target Session</Label>
              <Select id="bulkSession" value={bulkSession} onChange={(e) => setBulkSession(e.target.value)}>
                <option value="">Select session</option>
                {options.sessions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="bulkClass">Target Class</Label>
              <Select id="bulkClass" value={bulkClass} onChange={(e) => setBulkClass(e.target.value)}>
                <option value="">Select class</option>
                {options.classes.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </Select>
            </div>
          </div>
          {bulkError ? <p className="text-body-sm text-destructive">{bulkError}</p> : null}
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={bulkPending}>Cancel</Button>
            </DialogClose>
            <Button onClick={handleBulkPromote} loading={bulkPending} disabled={bulkPending}>Promote</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!archiveTarget}
        onOpenChange={(o) => !o && setArchiveTarget(null)}
        title="Archive student"
        description={archiveTarget ? `Archive "${archiveTarget.fullName}"? They will be marked as left but retained.` : ""}
        confirmLabel="Archive"
        onConfirm={async () => {
          if (archiveTarget) {
            await archiveStudentAction(archiveTarget.id);
            setArchiveTarget(null);
            router.refresh();
          }
        }}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
        title="Delete student"
        description={deleteTarget ? `Permanently delete "${deleteTarget.fullName}"? This can be reversed by an administrator.` : ""}
        confirmLabel="Delete"
        destructive
        onConfirm={async () => {
          if (deleteTarget) {
            await deleteStudentAction(deleteTarget.id);
            setDeleteTarget(null);
            router.refresh();
          }
        }}
      />
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-body-sm font-medium text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-h3 font-semibold text-foreground">{value}</div>
      </CardContent>
    </Card>
  );
}

function FilterSelect({ label, column, options }: { label: string; column: import("@tanstack/react-table").Column<StudentRow, unknown> | undefined; options: { value: string; label: string }[] }) {
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
