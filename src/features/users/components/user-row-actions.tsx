"use client";

import { MoreHorizontal, Pencil, KeyRound, Ban, CheckCircle, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import {
  canManageUser,
  canResetPassword,
  canChangeStatus,
  canDeleteUser,
} from "@/lib/auth/permissions";
import type { Role } from "@/constants/roles";
import type { UserTableRow } from "@/features/users/types";

export type RowAction = "edit" | "reset" | "status" | "delete";

interface UserRowActionsProps {
  user: UserTableRow;
  currentRole: Role | null;
  onAction: (action: RowAction, user: UserTableRow) => void;
}

export function UserRowActions({ user, currentRole, onAction }: UserRowActionsProps) {
  if (user.isSelf) {
    return null;
  }

  const canEdit = canManageUser(currentRole, user.role);
  const canReset = canResetPassword(currentRole, user.role);
  const canStatus = canChangeStatus(currentRole, user.role);
  const canDelete = canDeleteUser(currentRole, user.role);

  if (!canEdit && !canReset && !canStatus && !canDelete) {
    return null;
  }

  const isActive = user.status === "ACTIVE";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Actions for ${user.fullName}`}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {canEdit ? (
          <DropdownMenuItem onSelect={() => onAction("edit", user)}>
            <Pencil className="h-4 w-4" />
            Edit
          </DropdownMenuItem>
        ) : null}
        {canReset ? (
          <DropdownMenuItem onSelect={() => onAction("reset", user)}>
            <KeyRound className="h-4 w-4" />
            Reset password
          </DropdownMenuItem>
        ) : null}
        {canStatus ? (
          <DropdownMenuItem
            onSelect={() => onAction("status", user)}
            className={isActive ? "text-destructive focus:bg-destructive/10" : "text-success focus:bg-success/10"}
          >
            {isActive ? <Ban className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
            {isActive ? "Deactivate" : "Activate"}
          </DropdownMenuItem>
        ) : null}
        {canDelete ? <DropdownMenuSeparator /> : null}
        {canDelete ? (
          <DropdownMenuItem
            onSelect={() => onAction("delete", user)}
            className="text-destructive focus:bg-destructive/10"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </DropdownMenuItem>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
