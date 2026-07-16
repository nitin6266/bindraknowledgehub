"use client";

import { useState } from "react";
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
import { ArrowUpDown, ChevronLeft, ChevronRight, Columns3, Plus, Search } from "lucide-react";

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

import { CreateUserDialog } from "@/features/users/components/create-user-dialog";
import { EditUserDialog } from "@/features/users/components/edit-user-dialog";
import { ResetPasswordDialog } from "@/features/users/components/reset-password-dialog";
import { ConfirmDialog } from "@/features/users/components/confirm-dialog";
import { UserRowActions, type RowAction } from "@/features/users/components/user-row-actions";
import { setUserStatusAction, deleteUserAction } from "@/features/users/actions/user.actions";
import type { UserTableRow, RoleOption } from "@/features/users/types";
import type { Role } from "@/constants/roles";
import { canAccessUserManagement } from "@/lib/auth/permissions";
import type { UserStatus } from "@prisma/client";

const STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: "Active",
  INACTIVE: "Inactive",
  SUSPENDED: "Suspended",
};

interface UsersTableProps {
  users: UserTableRow[];
  roles: RoleOption[];
  currentRole: Role | null;
}

export function UsersTable({ users, roles, currentRole }: UsersTableProps) {
  const router = useRouter();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});

  const [createOpen, setCreateOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserTableRow | null>(null);
  const [resetUser, setResetUser] = useState<UserTableRow | null>(null);
  const [statusUser, setStatusUser] = useState<UserTableRow | null>(null);
  const [deleteUser, setDeleteUser] = useState<UserTableRow | null>(null);

  const columns: ColumnDef<UserTableRow>[] = [
    {
      accessorKey: "fullName",
      header: ({ column }) => (
        <SortHeader label="Name" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
      ),
      cell: ({ row }) => (
        <div className="font-medium text-foreground">{row.original.fullName}</div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <SortHeader label="Email" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
      ),
      cell: ({ row }) => <span className="text-muted-foreground">{row.original.email}</span>,
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => <Badge variant="default">{row.original.roleLabel}</Badge>,
      filterFn: (row, columnId, value) => (value ? row.getValue(columnId) === value : true),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          <Badge variant={status === "ACTIVE" ? "success" : "outline"}>
            {STATUS_LABELS[status]}
          </Badge>
        );
      },
      filterFn: (row, columnId, value) => (value ? row.getValue(columnId) === value : true),
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <SortHeader label="Created" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")} />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => (
        <div className="text-right">
          <UserRowActions
            user={row.original}
            currentRole={currentRole}
            onAction={handleRowAction}
          />
        </div>
      ),
      enableHiding: false,
    },
  ];

  const table = useReactTable({
    data: users,
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

  function handleRowAction(action: RowAction, user: UserTableRow) {
    if (action === "edit") setEditUser(user);
    if (action === "reset") setResetUser(user);
    if (action === "status") setStatusUser(user);
    if (action === "delete") setDeleteUser(user);
  }

  const roleColumn = table.getColumn("role");
  const statusColumn = table.getColumn("status");
  const canManage = canAccessUserManagement(currentRole);

  async function handleStatusConfirm() {
    if (!statusUser) return;
    const next: UserStatus = statusUser.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await setUserStatusAction(statusUser.id, next);
    router.refresh();
  }

  async function handleDeleteConfirm() {
    if (!deleteUser) return;
    await deleteUserAction(deleteUser.id);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search name or email"
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="pl-9"
            aria-label="Search users"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Select
            aria-label="Filter by role"
            value={(roleColumn?.getFilterValue() as string) ?? ""}
            onChange={(e) => roleColumn?.setFilterValue(e.target.value || undefined)}
            className="h-11 w-auto"
          >
            <option value="">All roles</option>
            {roles.map((r) => (
              <option key={r.name} value={r.name}>
                {r.label}
              </option>
            ))}
          </Select>

          <Select
            aria-label="Filter by status"
            value={(statusColumn?.getFilterValue() as string) ?? ""}
            onChange={(e) => statusColumn?.setFilterValue(e.target.value || undefined)}
            className="h-11 w-auto"
          >
            <option value="">All statuses</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>

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
                    <input
                      type="checkbox"
                      checked={column.getIsVisible()}
                      readOnly
                      className="mr-2"
                    />
                    {column.id === "fullName"
                      ? "Name"
                      : column.id === "createdAt"
                        ? "Created"
                        : column.id.charAt(0).toUpperCase() + column.id.slice(1)}
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {canManage ? (
            <Button onClick={() => setCreateOpen(true)}>
              <Plus className="h-4 w-4" />
              Add user
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
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
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
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                  No users found.
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
        <CreateUserDialog
          open={createOpen}
          onOpenChange={setCreateOpen}
          roles={roles}
          currentRole={currentRole}
        />
      ) : null}

      <EditUserDialog user={editUser} onOpenChange={(o) => !o && setEditUser(null)} roles={roles} currentRole={currentRole} />

      <ResetPasswordDialog user={resetUser} onOpenChange={(o) => !o && setResetUser(null)} />

      <ConfirmDialog
        open={!!statusUser}
        onOpenChange={(o) => !o && setStatusUser(null)}
        title={statusUser?.status === "ACTIVE" ? "Deactivate user" : "Activate user"}
        description={
          statusUser
            ? `Are you sure you want to ${statusUser.status === "ACTIVE" ? "deactivate" : "activate"} ${statusUser.fullName}? ${
                statusUser.status === "ACTIVE"
                  ? "They will no longer be able to sign in."
                  : "They will be able to sign in again."
              }`
            : ""
        }
        confirmLabel={statusUser?.status === "ACTIVE" ? "Deactivate" : "Activate"}
        destructive={statusUser?.status === "ACTIVE"}
        onConfirm={handleStatusConfirm}
      />

      <ConfirmDialog
        open={!!deleteUser}
        onOpenChange={(o) => !o && setDeleteUser(null)}
        title="Delete user"
        description={
          deleteUser
            ? `This will permanently deactivate ${deleteUser.fullName} and remove their access. This action can be reversed by an administrator.`
            : ""
        }
        confirmLabel="Delete user"
        destructive
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

function SortHeader({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
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
