"use client";

import { useMemo, useState } from "react";
import {
  type ColumnDef,
  type SortingState,
  type RowSelectionState,
  type OnChangeFn,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Eye, Edit, ArrowUpDown, ArrowRightLeft, FileText, Archive, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { StudentRow } from "@/features/student/student.types";

interface StudentTableProps {
  students: StudentRow[];
  canManage: boolean;
  onView: (s: StudentRow) => void;
  onEdit: (s: StudentRow) => void;
  onTransfer: (s: StudentRow) => void;
  onPromote: (s: StudentRow) => void;
  onArchive: (s: StudentRow) => void;
  selection?: boolean;
  selectedIds?: Set<string>;
  onSelectionChange?: (ids: Set<string>) => void;
}

const STATUS: Record<string, { dot: string; label: string }> = {
  ACTIVE: { dot: "bg-success", label: "Active" },
  INACTIVE: { dot: "bg-muted-foreground", label: "Inactive" },
  LEFT: { dot: "bg-danger", label: "Left" },
  GRADUATED: { dot: "bg-info", label: "Graduated" },
};

function initials(name: string) {
  const p = name.split(" ").filter(Boolean);
  return p.length ? p.slice(0, 2).map((s) => s[0]!.toUpperCase()).join("") : "?";
}

export function StudentTable({
  students, canManage, onView, onEdit, onTransfer, onPromote, onArchive,
  selection, selectedIds: _selectedIds, onSelectionChange,
}: StudentTableProps) {
  const [sorting, setSorting] = useState<SortingState>([{ id: "admissionNumber", desc: false }]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const handleSelection: OnChangeFn<RowSelectionState> = (updater) => {
    const next = typeof updater === "function" ? updater(rowSelection) : updater;
    setRowSelection(next);
    if (onSelectionChange) {
      onSelectionChange(new Set(students.filter((s) => next[s.id]).map((s) => s.id)));
    }
  };

  const cols = useMemo<ColumnDef<StudentRow>[]>(() => {
    const c: ColumnDef<StudentRow>[] = [];

    if (selection) {
      c.push({
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onChange={(e) => table.getToggleAllRowsSelectedHandler()(e)}
            className="size-4"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onChange={(e) => row.getToggleSelectedHandler()(e)}
            className="size-4"
          />
        ),
        enableSorting: false,
        size: 36,
      } as ColumnDef<StudentRow>);
    }

    c.push(
      {
        id: "photo",
        header: "",
        enableSorting: false,
        size: 44,
        cell: ({ row }) => (
          <Avatar className="size-8 rounded-[8px]">
            <AvatarImage src={row.original.photoUrl ?? undefined} />
            <AvatarFallback className="rounded-[8px] text-[11px] font-semibold bg-primary/[0.06] text-primary">{initials(row.original.fullName)}</AvatarFallback>
          </Avatar>
        ),
      },
      {
        id: "student",
        header: "Student",
        accessorFn: (r) => r.fullName,
        size: 200,
        cell: ({ row }) => (
          <div>
                    <p className="text-[14px] font-semibold text-foreground truncate">{row.original.fullName}</p>
                    <p className="text-[11px] text-muted-foreground/50 font-mono">{row.original.admissionNumber}</p>
          </div>
        ),
      },
      {
        id: "class",
        header: "Class",
        accessorFn: (r) => r.className,
        size: 100,
        cell: ({ row }) => (
            <span className="text-[13px] text-muted-foreground">
            {row.original.className}{row.original.sectionName ? ` / ${row.original.sectionName}` : ""}
          </span>
        ),
      },
      {
        id: "batch",
        header: "Batch",
        accessorFn: (r) => r.batchName ?? "",
        size: 110,
        cell: ({ row }) => <span className="text-[13px] text-muted-foreground">{row.original.batchName ?? "—"}</span>,
      },
      {
        id: "parent",
        header: "Parent",
        accessorFn: (r) => r.primaryParentName ?? "",
        size: 160,
        cell: ({ row }) => (
          <div>
            <p className="text-[13px] text-foreground truncate">{row.original.primaryParentName ?? "—"}</p>
            {row.original.primaryParentPhone && (
              <p className="text-[11px] text-muted-foreground/50 font-mono">{row.original.primaryParentPhone}</p>
            )}
          </div>
        ),
      },
      {
        id: "phone",
        header: "Phone",
        accessorFn: (r) => r.primaryParentPhone ?? "",
        size: 120,
        cell: ({ row }) => <span className="text-[13px] font-mono text-muted-foreground">{row.original.primaryParentPhone ?? "—"}</span>,
      },
      {
        id: "status",
        header: "Status",
        accessorFn: (r) => r.status,
        size: 80,
        cell: ({ row }) => {
          const s = STATUS[row.original.status];
          return (
            <span className="inline-flex items-center gap-1.5 text-[13px] text-muted-foreground">
              <span className={cn("size-2 rounded-full", s?.dot ?? "bg-muted-foreground")} />
              {s?.label ?? row.original.status}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: "",
        enableSorting: false,
        size: 100,
        cell: ({ row }) => {
          const s = row.original;
          return (
            <div className="flex items-center justify-end gap-px">
              <IconBtn icon={<Eye className="size-3.5" />} label={`View ${s.fullName}`} onClick={() => onView(s)} />
              {canManage && (
                <>
                  <IconBtn icon={<Edit className="size-3.5" />} label={`Edit ${s.fullName}`} onClick={() => onEdit(s)} />
                  <IconBtn icon={<ArrowRightLeft className="size-3.5" />} label={`Transfer ${s.fullName}`} onClick={() => onTransfer(s)} />
                  <IconBtn icon={<ArrowUpDown className="size-3.5" />} label={`Promote ${s.fullName}`} onClick={() => onPromote(s)} />
                  <div className="mx-0.5 h-5 w-px bg-border/50" />
                  <IconBtn icon={<Archive className="size-3.5" />} label={`Archive ${s.fullName}`} onClick={() => onArchive(s)} />
                </>
              )}
            </div>
          );
        },
      },
    );

    return c;
  }, [selection, canManage, onView, onEdit, onTransfer, onPromote, onArchive]);

  const table = useReactTable({
    data: students,
    columns: cols,
    state: { sorting, rowSelection },
    onSortingChange: setSorting,
    onRowSelectionChange: handleSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 25 } },
    getRowId: (r) => r.id,
  });

  return (
    <div className="rounded-[10px] border border-border bg-card">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((h) => (
                  <TableHead key={h.id} style={{ width: h.getSize() }} className="h-9 px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                    {h.isPlaceholder ? null : h.column.getCanSort() ? (
                      <button type="button" onClick={h.column.getToggleSortingHandler()} className="flex items-center gap-1 hover:text-foreground transition-colors">
                        {flexRender(h.column.columnDef.header, h.getContext())}
                        <span className="inline-flex size-3 items-center justify-center">
                          {h.column.getIsSorted() === "asc" ? <ChevronRight className="size-3 rotate-[-90deg]" /> : h.column.getIsSorted() === "desc" ? <ChevronRight className="size-3 rotate-90" /> : <ChevronRight className="size-3 text-muted-foreground/20 rotate-90" />}
                        </span>
                      </button>
                    ) : (
                      flexRender(h.column.columnDef.header, h.getContext())
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={cn(
                    "group transition-colors hover:bg-secondary/50",
                    row.getIsSelected() && "bg-primary/[0.03]",
                  )}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-3 py-2 text-[13px]">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={cols.length} className="h-24 text-center text-[13px] text-muted-foreground">
                  No students match your filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between border-t border-border px-4 py-2">
        <p className="text-[12px] text-muted-foreground/40 tabular-nums">
          {table.getFilteredRowModel().rows.length} student{table.getFilteredRowModel().rows.length !== 1 ? "s" : ""}
        </p>
        <div className="flex items-center gap-1">
          <button type="button" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="flex size-7 items-center justify-center rounded-[8px] text-muted-foreground/50 hover:text-foreground hover:bg-secondary disabled:opacity-30 transition-colors" aria-label="Previous">
            <ChevronLeft className="size-3.5" />
          </button>
          <span className="px-2 text-[11px] tabular-nums text-muted-foreground/50">{table.getState().pagination.pageIndex + 1}/{table.getPageCount()}</span>
          <button type="button" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="flex size-7 items-center justify-center rounded-[8px] text-muted-foreground/50 hover:text-foreground hover:bg-secondary disabled:opacity-30 transition-colors" aria-label="Next">
            <ChevronRight className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function IconBtn({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="flex size-6 items-center justify-center rounded-[8px] text-muted-foreground/40 hover:text-foreground hover:bg-secondary transition-colors" aria-label={label}>
      {icon}
    </button>
  );
}
