import { z } from "zod";

export const feeCategorySchema = z.object({
  name: z.string().min(2, "Category name is required"),
  description: z.string().optional().or(z.literal("")),
  status: z.string().default("ACTIVE"),
});

export type FeeCategoryValues = z.infer<typeof feeCategorySchema>;

export const feeStructureSchema = z.object({
  sessionId: z.string().min(1, "Session is required"),
  classId: z.string().min(1, "Class is required"),
  batchId: z.string().optional().or(z.literal("")),
  categoryId: z.string().min(1, "Category is required"),
  amount: z.coerce.number({ invalid_type_error: "Enter a valid amount" }).positive("Amount must be greater than 0"),
  dueDate: z.string().optional().or(z.literal("")),
  lateFeeAmount: z.coerce.number().min(0).default(0),
  lateFeeAfterDays: z.coerce.number().min(0).max(365).default(0),
});

export type FeeStructureValues = z.infer<typeof feeStructureSchema>;

export const studentFeeAssignSchema = z
  .object({
    assignmentType: z.enum(["SINGLE", "BATCH", "CLASS", "SESSION"]),
    studentId: z.string().optional().or(z.literal("")),
    batchId: z.string().optional().or(z.literal("")),
    classId: z.string().optional().or(z.literal("")),
    sessionId: z.string().min(1, "Session is required"),
    structureId: z.string().min(1, "Fee structure is required"),
    installmentCount: z.coerce.number().min(1).max(12).default(1),
  })
  .refine(
    (d) => {
      if (d.assignmentType === "SINGLE") return Boolean(d.studentId);
      if (d.assignmentType === "BATCH") return Boolean(d.batchId);
      if (d.assignmentType === "CLASS") return Boolean(d.classId);
      return true;
    },
    { message: "Select the target for this assignment", path: ["studentId"] },
  );

export type StudentFeeAssignValues = z.infer<typeof studentFeeAssignSchema>;

export const discountSchema = z.object({
  studentFeeId: z.string().min(1, "Student fee is required"),
  type: z.string().min(1, "Discount type is required"),
  mode: z.string().min(1, "Discount mode is required"),
  value: z.coerce.number().min(0, "Value must be 0 or more"),
  reason: z.string().optional().or(z.literal("")),
  approvalRequired: z.boolean().default(false),
});

export type DiscountValues = z.infer<typeof discountSchema>;

export const paymentSchema = z.object({
  studentFeeId: z.string().min(1, "Student fee is required"),
  amount: z.coerce.number().positive("Amount must be greater than 0"),
  mode: z.string().min(1, "Payment mode is required"),
  transactionRef: z.string().optional().or(z.literal("")),
  paymentDate: z.string().min(1, "Payment date is required"),
  remarks: z.string().optional().or(z.literal("")),
});

export type PaymentValues = z.infer<typeof paymentSchema>;
