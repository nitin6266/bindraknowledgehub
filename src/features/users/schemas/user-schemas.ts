import { z } from "zod";

import { ROLES } from "@/constants/roles";

const roleEnum = z.enum([ROLES.SUPER_ADMIN, ROLES.ADMIN, ROLES.TEACHER, ROLES.PARENT]);
const genderEnum = z.enum(["MALE", "FEMALE", "OTHER"]).optional().or(z.literal(""));

export const createUserSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
  role: roleEnum,
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().max(20, "Phone number is too long").optional().or(z.literal("")),
  gender: genderEnum,
});

export type CreateUserValues = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  role: roleEnum.optional(),
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  phone: z.string().max(20, "Phone number is too long").optional().or(z.literal("")),
  gender: genderEnum,
});

export type UpdateUserValues = z.infer<typeof updateUserSchema>;

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
});

export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
