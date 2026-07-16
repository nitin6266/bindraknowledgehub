import { z } from "zod";

export const leaveRequestSchema = z
  .object({
    studentId: z.string().min(1, "Please select a child"),
    fromDate: z.string().min(1, "From date is required"),
    toDate: z.string().min(1, "To date is required"),
    reason: z.string().min(3, "Please provide a reason"),
    attachmentUrl: z.string().optional().or(z.literal("")),
  })
  .refine((data) => data.toDate >= data.fromDate, {
    message: "To date cannot be before from date",
    path: ["toDate"],
  });

export type LeaveRequestValues = z.infer<typeof leaveRequestSchema>;

export const parentProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .regex(/^[0-9+\s-]{10,15}$/, "Enter a valid phone number"),
  gender: z.string().optional().or(z.literal("")),
});

export type ParentProfileValues = z.infer<typeof parentProfileSchema>;
