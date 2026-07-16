"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, KeyRound } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";

import { profileSchema, type ProfileValues } from "@/features/profile/schemas/profile-schemas";
import { updateOwnProfileAction } from "@/features/profile/actions/profile.actions";
import { ChangePasswordDialog } from "@/features/profile/components/change-password-dialog";
import { type Role } from "@/constants/roles";

interface ProfileField {
  label: string;
  value: string;
}

interface ProfileViewProps {
  email: string;
  role: Role;
  status: string;
  profile: {
    firstName: string;
    lastName: string;
    phone: string | null;
    gender: string | null;
  };
}

const GENDER_LABELS: Record<string, string> = {
  MALE: "Male",
  FEMALE: "Female",
  OTHER: "Other",
};

export function ProfileView({ email, role, status, profile }: ProfileViewProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone ?? "",
      gender: (profile.gender as "MALE" | "FEMALE" | "OTHER" | "") ?? "",
    },
  });

  const onSubmit = async (values: ProfileValues) => {
    setServerError(null);
    setPending(true);
    try {
      const result = await updateOwnProfileAction(values);
      if (result.success) {
        setEditOpen(false);
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

  const roleLabel = role
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");

  const fields: ProfileField[] = [
    { label: "First name", value: profile.firstName },
    { label: "Last name", value: profile.lastName },
    { label: "Phone", value: profile.phone || "—" },
    { label: "Gender", value: profile.gender ? GENDER_LABELS[profile.gender] ?? profile.gender : "—" },
    { label: "Email", value: email },
    { label: "Role", value: roleLabel },
    { label: "Status", value: status },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h3 font-semibold text-foreground">My Profile</h1>
          <p className="text-body text-muted-foreground">View and manage your account details.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPasswordOpen(true)}>
            <KeyRound className="h-4 w-4" />
            Change password
          </Button>
          <Button onClick={() => { reset(); setEditOpen(true); }}>
            <Pencil className="h-4 w-4" />
            Edit profile
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Account details</CardTitle>
          <CardDescription>
            <Badge variant="default">{roleLabel}</Badge>{" "}
            <Badge variant={status === "ACTIVE" ? "success" : "outline"}>{status}</Badge>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            {fields.map((field) => (
              <div key={field.label} className="space-y-1">
                <dt className="text-body-sm text-muted-foreground">{field.label}</dt>
                <dd className="text-body font-medium text-foreground">{field.value}</dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Update your personal information.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="pf-firstName">First name</Label>
                <Input id="pf-firstName" {...register("firstName")} aria-invalid={!!errors.firstName} />
                {errors.firstName ? (
                  <p className="text-body-sm text-destructive">{errors.firstName.message}</p>
                ) : null}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="pf-lastName">Last name</Label>
                <Input id="pf-lastName" {...register("lastName")} aria-invalid={!!errors.lastName} />
                {errors.lastName ? (
                  <p className="text-body-sm text-destructive">{errors.lastName.message}</p>
                ) : null}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pf-gender">Gender</Label>
              <select
                id="pf-gender"
                {...register("gender")}
                className="h-11 w-full rounded-md border border-input bg-background px-4 text-body text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">Prefer not to say</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pf-phone">Phone</Label>
              <Input id="pf-phone" type="tel" {...register("phone")} />
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
                <Button type="button" variant="outline" disabled={pending}>
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" loading={pending} disabled={pending}>
                Save changes
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ChangePasswordDialog open={passwordOpen} onOpenChange={setPasswordOpen} />
    </div>
  );
}
