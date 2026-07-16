import type {
  StudentStatusValue,
  GenderValue,
  ParentRelationshipValue,
} from "./student.constants";

export type { AdmissionValues, PromoteValues, TransferValues } from "./student.schemas";

export interface StudentRow {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: GenderValue;
  status: StudentStatusValue;
  sessionId: string;
  classId: string;
  sectionId: string | null;
  batchId: string | null;
  sessionName: string;
  className: string;
  sectionName: string | null;
  batchName: string | null;
  primaryParentName: string | null;
  createdAt: string;
  deletedAt: string | null;
}

export interface StudentData {
  id: string;
  admissionNumber: string;
  rollNumber: string | null;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: GenderValue;
  bloodGroup: string | null;
  photoUrl: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  pincode: string | null;
  sessionId: string;
  classId: string;
  sectionId: string | null;
  batchId: string | null;
  admissionDate: string;
  status: StudentStatusValue;
  sessionName: string;
  className: string;
  sectionName: string | null;
  batchName: string | null;
  primaryParentName: string | null;
  createdAt: string;
  deletedAt: string | null;
}

export interface StudentParentData {
  id: string;
  parentId: string;
  parentName: string;
  parentEmail: string | null;
  parentPhone: string | null;
  relationship: ParentRelationshipValue;
  isPrimary: boolean;
  forcePasswordChange: boolean;
}

export interface EmergencyContactData {
  id: string;
  contactName: string;
  relationship: string;
  phoneNumber: string;
  alternatePhone: string | null;
  email: string | null;
}

export interface MedicalInformationData {
  bloodGroup: string | null;
  medicalConditions: string | null;
  allergies: string | null;
  medication: string | null;
  notes: string | null;
}

export interface StudentDocumentData {
  id: string;
  documentType: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  description?: string | null;
}

export interface StudentBatchHistoryData {
  id: string;
  batchId: string;
  batchName: string;
  sessionName: string;
  changeType: "ALLOCATION" | "TRANSFER";
  startDate: string;
  endDate: string | null;
}

export interface StudentPromotionHistoryData {
  id: string;
  fromClassName: string;
  toClassName: string;
  promotionDate: string;
  note: string | null;
}

export interface StudentDetail {
  student: StudentData;
  parents: StudentParentData[];
  emergencyContacts: EmergencyContactData[];
  medicalInformation: MedicalInformationData | null;
  documents: StudentDocumentData[];
  batchHistory: StudentBatchHistoryData[];
  promotionHistory: StudentPromotionHistoryData[];
  currentBatch: { id: string; name: string } | null;
}

export interface EmergencyContactValues {
  contactName: string;
  relationship: string;
  phoneNumber: string;
  alternatePhone?: string;
  email?: string;
}

export interface MedicalInformationValues {
  bloodGroup?: string;
  medicalConditions?: string;
  allergies?: string;
  medication?: string;
  notes?: string;
}

export type { UpdateStudentValues } from "@/features/student/student.schemas";

export interface Option {
  value: string;
  label: string;
}

export interface StudentFilters {
  search?: string;
  sessionId?: string;
  classId?: string;
  batchId?: string;
  status?: string;
}
