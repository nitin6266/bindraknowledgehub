"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { useRouter } from "next/navigation";
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
import { ArrowUpDown, ChevronLeft, ChevronRight, Columns3, MoreHorizontal, Pencil, Plus, Search, Trash2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
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

import { MasterDataFormDialog } from "@/features/academic/components/master-data-form-dialog";
import { createMasterAction, updateMasterAction, deleteMasterAction } from "@/features/academic/actions/master-data.actions";
import { rowToFormValues } from "@/features/academic/master-data/config";
import type {
  ColumnConfig,
  MasterFormValues,
  MasterModuleConfig,
  MasterRow,
  SelectOption,
} from "@/features/academic/master-data/types";

const STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  DRAFT: "Draft",
  ARCHIVED: "Archived",
};

const EVENT_LABELS: Record<string, string> = {
  HOLIDAY: "Holiday",
  EXAM: "Exam",
  PARENT_MEETING: "Parent Meeting",
  RESULT: "Result",
  WORKSHOP: "Workshop",
};

interface MasterDataClientProps {
  config: MasterModuleConfig;
  rows: MasterRow[];
  relationOptions: Record<string, SelectOption[]>;
  canManage: boolean;
}

function formatValue(column: ColumnConfig, value: unknown): { text: string; node?: ReactNode } {
  if (value == null) {
    return { text: "" };
  }

  switch (column.render) {
    case "date": {
      const d = new Date(value as string | Date);
      return { text: Number.isNaN(d.getTime()) ? "" : d.toLocaleDateString() };
    }
    case "number":
      return { text: String(value) };
    case "status": {
      const v = String(value);
      const label = STATUS_LABELS[v] ?? v;
      return {
        text: label,
        node: <Badge variant={v === "ACTIVE" ? "success" : "outline"}>{label}</Badge>,
      };
    }
    case "badge": {
      const v = String(value);
      const label = EVENT_LABELS[v] ?? v;
      return { text: label, node: <Badge variant="default">{label}</Badge> };
    }
    case "relation": {
      if (Array.isArray(value)) {
        const names = value.map((v) => (v as { name?: string }).name ?? "").filter(Boolean);
        return { text: names.join(", ") };
      }
      return { text: (value as { name?: string }).name ?? "" };
    }
    default:
      return { text: String(value) };
  }
}

export function MasterDataClient({ config, rows, relationOptions, canManage }: MasterDataClientProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [createOpen, setCreateOpen] = useState(false);
  const [editState, setEditState] = useState<{ id: string; values: MasterFormValues } | null>(null);
  const [deleteState, setDeleteState] = useState<{ id: string; label: string } | null>(null);

  const statusField = config.fields.find((f) => f.key === config.statusField);
  const statusOptions = statusField?.options ?? [];

  const columns: ColumnDef<MasterRow>[] = [
    ...config.columns.map((column): ColumnDef<MasterRow> => {
      const sortable = column.sortable ?? false;
      return {
        accessorKey: column.key,
        header: sortable
          ? ({ column: col }) => (
              <SortHeader
                label={column.label}
                onClick={() => col.toggleSorting(col.getIsSorted() === "asc")}
              />
            )
          : column.label,
        cell: ({ row }) => {
          const { text, node } = formatValue(column, row.getValue(column.key));
          return node ? <div className="text-foreground">{node}</div> : <span className="text-muted-foreground">{text}</span>;
        },
        enableHiding: column.hideable ?? true,
      };
    }),
    ...(canManage
      ? [
          {
            id: "actions",
            header: () => <span className="sr-only">Actions</span>,
            cell: ({ row }: { row: { original: MasterRow; id: string } }) => (
              <div className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" aria-label={`Actions for ${String(row.original[config.columns[0]?.key ?? "id"] ?? "row")}`}>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onSelect={() => setEditState({ id: String(row.original.id), values: rowToFormValues(row.original, config) })}>
                      <Pencil className="h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onSelect={() =>
                        setDeleteState({
                          id: String(row.original.id),
                          label: String(row.original[config.columns[0]?.key ?? "id"] ?? "this record"),
                        })
                      }
                      className="text-destructive focus:bg-destructive/10"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ),
            enableHiding: false,
          } as ColumnDef<MasterRow>,
        ]
      : []),
  ];

  const table = useReactTable({
    data: rows,
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

  const statusColumn = config.statusField ? table.getColumn(config.statusField) : undefined;

  async function handleCreate(values: MasterFormValues) {
    return createMasterAction(config.key, values);
  }

  async function handleEdit(values: MasterFormValues) {
    if (!editState) {
      return { success: false, error: "No record selected." };
    }
    return updateMasterAction(config.key, editState.id, values);
  }

  async function handleDeleteConfirm() {
    if (!deleteState) {
      return;
    }
    await deleteMasterAction(config.key, deleteState.id);
    setDeleteState(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={`Search ${config.title.toLowerCase()}`}
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
            aria-label={`Search ${config.title}`}
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {statusColumn ? (
            <Select
              aria-label="Filter by status"
              value={(statusColumn.getFilterValue() as string) ?? ""}
              onChange={(e) => statusColumn.setFilterValue(e.target.value || undefined)}
              className="h-11 w-auto"
            >
              <option value="">All statuses</option>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          ) : null}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Toggle columns">
                <Columns3 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Columns</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {table
                .getAllColumns()
                .filter((c) => c.getCanHide())
                .map((column) => (
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
              <Plus className="h-4 w-4" />
              Add {config.singular}
            </Button>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
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
                  No {config.title.toLowerCase()} found.
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
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {canManage ? (
        <MasterDataFormDialog
          key="create"
          config={config}
          relationOptions={relationOptions}
          initialValues={null}
          open={createOpen}
          onOpenChange={setCreateOpen}
          onSubmit={handleCreate}
        />
      ) : null}

      {editState ? (
        <MasterDataFormDialog
          key={`edit-${editState.id}`}
          config={config}
          relationOptions={relationOptions}
          initialValues={editState.values}
          open={!!editState}
          onOpenChange={(o) => !o && setEditState(null)}
          onSubmit={handleEdit}
        />
      ) : null}

      <ConfirmDialog
        open={!!deleteState}
        onOpenChange={(o) => !o && setDeleteState(null)}
        title={`Delete ${config.singular}`}
        description={
          deleteState
            ? `Are you sure you want to delete "${deleteState.label}"? This can be reversed by an administrator.`
            : ""
        }
        confirmLabel="Delete"
        destructive
        onConfirm={handleDeleteConfirm}
      />
    </div>
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
