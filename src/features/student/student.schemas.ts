import { z } from "zod";

const genderEnum = z.enum(["MALE", "FEMALE", "OTHER"]);
const relationshipEnum = z.enum(["FATHER", "MOTHER", "GUARDIAN"]);

export const admissionSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  gender: genderEnum,
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  bloodGroup: z.string().optional().or(z.literal("")),
  rollNumber: z.string().optional().or(z.literal("")),
  address: z.string().optional().or(z.literal("")),
  city: z.string().optional().or(z.literal("")),
  state: z.string().optional().or(z.literal("")),
  country: z.string().optional().or(z.literal("")),
  pincode: z.string().optional().or(z.literal("")),
  sessionId: z.string().min(1, "Academic session is required"),
  classId: z.string().min(1, "Class is required"),
  sectionId: z.string().optional().or(z.literal("")),
  batchId: z.string().min(1, "Batch is required"),
  parentEmail: z.string().min(1, "Parent email is required").email("Enter a valid email"),
  parentFirstName: z.string().min(1, "Parent first name is required"),
  parentLastName: z.string().min(1, "Parent last name is required"),
  parentMobile: z.string().min(1, "Parent mobile is required"),
  relationship: relationshipEnum,
  parentAddress: z.string().optional().or(z.literal("")),
  emergencyName: z.string().min(1, "Emergency contact name is required"),
  emergencyRelationship: z.string().min(1, "Relationship is required"),
  emergencyPhone: z.string().min(1, "Emergency phone is required"),
  medicalConditions: z.string().optional().or(z.literal("")),
  medicalAllergies: z.string().optional().or(z.literal("")),
  medicalNotes: z.string().optional().or(z.literal("")),
});

export type AdmissionValues = z.infer<typeof admissionSchema>;

export const promoteSchema = z.object({
  toSessionId: z.string().min(1, "Target session is required"),
  toClassId: z.string().min(1, "Target class is required"),
  note: z.string().optional().or(z.literal("")),
});

export type PromoteValues = z.infer<typeof promoteSchema>;

export const transferSchema = z.object({
  toBatchId: z.string().min(1, "Target batch is required"),
  reason: z.string().optional().or(z.literal("")),
});

export type TransferValues = z.infer<typeof transferSchema>;

export const updateStudentSchema = z
  .object({
    status: z.enum(["ACTIVE", "INACTIVE", "LEFT", "GRADUATED"]).optional(),
    address: z.string().nullable().optional(),
    bloodGroup: z.string().nullable().optional(),
    emergencyContacts: z.array(z.any()).optional(),
    medical: z
      .object({
        conditions: z.string().nullable().optional(),
        allergies: z.string().nullable().optional(),
        notes: z.string().nullable().optional(),
      })
      .optional(),
  })
  .strict();

export type UpdateStudentValues = z.infer<typeof updateStudentSchema>;
