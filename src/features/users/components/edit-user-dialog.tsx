"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";

import { updateUserSchema, type UpdateUserValues } from "@/features/users/schemas/user-schemas";
import { updateUserAction } from "@/features/users/actions/user.actions";
import { canCreateRole } from "@/lib/auth/permissions";
import { type Role } from "@/constants/roles";
import type { RoleOption, UserTableRow } from "@/features/users/types";

interface EditUserDialogProps {
  user: UserTableRow | null;
  onOpenChange: (open: boolean) => void;
  roles: RoleOption[];
  currentRole: Role | null;
}

export function EditUserDialog({ user, onOpenChange, roles, currentRole }: EditUserDialogProps) {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const allowedRoles = roles.filter((r) => canCreateRole(currentRole, r.name));

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateUserValues>({
    resolver: zodResolver(updateUserSchema),
  });

  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone ?? "",
        gender: (user.gender as "MALE" | "FEMALE" | "OTHER" | "") ?? "",
        role: user.role,
      });
      setServerError(null);
    }
  }, [user, reset]);

  const onSubmit = async (values: UpdateUserValues) => {
    if (!user) {
      return;
    }
    setServerError(null);
    setPending(true);
    try {
      const result = await updateUserAction(user.id, values);
      if (result.success) {
        onOpenChange(false);
        router.refresh();
      } else {
        setServerError(result.error);
      }
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  };

  return (
    <Dialog open={!!user} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit user</DialogTitle>
          <DialogDescription>
            Update {user ? user.fullName : "user"}&apos;s profile and role.
          </DialogDescription>
        </DialogHeader>

        {user ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-firstName">First name</Label>
                <Input id="edit-firstName" {...register("firstName")} aria-invalid={!!errors.firstName} />
                {errors.firstName ? (
                  <p className="text-body-sm text-destructive">{errors.firstName.message}</p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-lastName">Last name</Label>
                <Input id="edit-lastName" {...register("lastName")} aria-invalid={!!errors.lastName} />
                {errors.lastName ? (
                  <p className="text-body-sm text-destructive">{errors.lastName.message}</p>
                ) : null}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="edit-role">Role</Label>
                <Select id="edit-role" {...register("role")}>
                  {allowedRoles.map((r) => (
                    <option key={r.name} value={r.name}>
                      {r.label}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="edit-gender">Gender</Label>
                <Select id="edit-gender" {...register("gender")}>
                  <option value="">Prefer not to say</option>
                  <option value="MALE">Male</option>
                  <option value="FEMALE">Female</option>
                  <option value="OTHER">Other</option>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="edit-phone">Phone</Label>
              <Input id="edit-phone" type="tel" {...register("phone")} />
              {errors.phone ? (
                <p className="text-body-sm text-destructive">{errors.phone.message}</p>
              ) : null}
            </div>

            {serverError ? (
              <p className="rounded-md bg-destructive/10 p-3 text-body-sm text-destructive" role="alert">
                {serverError}
              </p>
            ) : null}

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" loading={pending} disabled={pending}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
