import type { Role } from "@/constants/roles";
import type { UserStatus } from "@prisma/client";

export interface UserTableRow {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  fullName: string;
  role: Role;
  roleLabel: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  phone: string | null;
  gender: string | null;
  photoUrl: string | null;
  isSelf: boolean;
}

export interface RoleOption {
  name: Role;
  label: string;
}
