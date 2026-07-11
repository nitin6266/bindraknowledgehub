import { z } from "zod";

/**
 * Common validation schemas reusable across forms.
 * All schemas use Zod and integrate with React Hook Form via @hookform/resolvers/zod.
 */

export const emailSchema = z.string().min(1, "Email is required").email("Enter a valid email address");

export const phoneSchema = z.string()
  .min(10, "Phone number must be at least 10 digits")
  .max(15, "Phone number must not exceed 15 digits")
  .regex(/^[\d\s\-\+\(\)]+$/, "Enter a valid phone number");

export const indianPhoneSchema = z.string()
  .min(10, "Phone number must be 10 digits")
  .max(10, "Phone number must be 10 digits")
  .regex(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number");

export const passwordSchema = z.string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must not exceed 128 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Password must contain at least one special character");

export const requiredString = (fieldName: string) => z.string().min(1, `${fieldName} is required`);

export const optionalString = () => z.string().optional();

export const minLength = (min: number, fieldName: string) =>
  z.string().min(min, `${fieldName} must be at least ${min} characters`);

export const maxLength = (max: number, fieldName: string) =>
  z.string().max(max, `${fieldName} must not exceed ${max} characters`);

export const lengthBetween = (min: number, max: number, fieldName: string) =>
  z.string().min(min, `${fieldName} must be at least ${min} characters`).max(max, `${fieldName} must not exceed ${max} characters`);

export const regexSchema = (pattern: RegExp, message: string) =>
  z.string().regex(pattern, message);

/**
 * Pre-built schema compositions for common form patterns.
 */

export const contactFormSchema = z.object({
  name: requiredString("Name").max(100),
  email: emailSchema,
  phone: indianPhoneSchema.optional().nullable(),
  subject: requiredString("Subject").max(200),
  message: requiredString("Message").min(20, "Message must be at least 20 characters").max(2000),
});

export const admissionEnquirySchema = z.object({
  studentName: requiredString("Student name").max(100),
  parentName: requiredString("Parent name").max(100),
  email: emailSchema,
  phone: indianPhoneSchema,
  course: requiredString("Course"),
  currentGrade: requiredString("Current grade"),
  message: z.string().max(1000).optional().nullable(),
});

export const newsletterSchema = z.object({
  email: emailSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required"),
  remember: z.boolean().optional(),
});

export const registerSchema = z.object({
  name: requiredString("Name").max(100),
  email: emailSchema,
  phone: indianPhoneSchema.optional().nullable(),
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const resetPasswordSchema = z.object({
  email: emailSchema,
});

export const updatePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: passwordSchema,
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: "Passwords do not match",
  path: ["confirmNewPassword"],
});

/**
 * Helper to create a field schema with common patterns.
 */
export function createFieldSchema(options: {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  patternMessage?: string;
  customValidator?: (val: string) => boolean | string;
  customMessage?: string;
}): z.ZodTypeAny {
  const required = options.required ?? false;
  
  const base = z.string().min(required ? 1 : 0, required ? "This field is required" : undefined);
  
  const withMin = options.minLength
    ? base.min(options.minLength, `Must be at least ${options.minLength} characters`)
    : base;
  
  const withMax = options.maxLength
    ? withMin.max(options.maxLength, `Must not exceed ${options.maxLength} characters`)
    : withMin;
  
  const withPattern = options.pattern
    ? withMax.regex(options.pattern, options.patternMessage || "Invalid format")
    : withMax;
  
  const withRefine = (options.customValidator && options.customMessage)
    ? withPattern.refine((val: string) => options.customValidator!(val), options.customMessage)
    : withPattern;
  
  if (!required) {
    return withRefine.optional();
  }
  
  return withRefine;
}

/**
 * Type helper to infer form values from a Zod schema.
 */
export type InferFormValues<T extends z.ZodTypeAny> = z.infer<T>;

/**
 * Compose multiple schemas into one (useful for multi-step forms).
 */
export function composeSchemas<T extends Record<string, z.ZodTypeAny>>(schemas: T): z.ZodObject<T> {
  return z.object(schemas);
}

/**
 * Create a partial schema (all fields optional) from a base schema.
 */
export function partialSchema<T extends z.ZodRawShape>(schema: z.ZodObject<T>): z.ZodObject<{
  [K in keyof T]: z.ZodOptional<T[K]>;
}> {
  return schema.partial();
}

/**
 * Create a required schema (all fields required) from a base schema.
 * Note: In Zod v3, .required() is not available. Handle required at field level.
 */
export function requiredSchema<T extends z.ZodRawShape>(schema: z.ZodObject<T>): z.ZodObject<T> {
  return schema as z.ZodObject<T>;
}