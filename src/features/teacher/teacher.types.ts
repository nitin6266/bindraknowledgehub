import type {
  AttendanceStatusValue,
  AssignmentStatusValue,
  TestStatusValue,
} from "./teacher.constants";

export interface TeacherFilters {
  search?: string;
  sessionId?: string;
  classId?: string;
  batchId?: string;
  subjectId?: string;
  status?: string;
  date?: string;
}

export interface Scope {
  teacherScopeId?: string;
}

export interface Option {
  value: string;
  label: string;
}

export interface DashboardStats {
  todaysClasses: number;
  upcomingClasses: number;
  pendingAttendance: number;
  pendingAssignments: number;
  pendingTestEvaluations: number;
}

export interface TodayClass {
  id: string;
  batchId: string;
  subjectId: string;
  batchName: string;
  subjectName: string;
  startTime: string;
  endTime: string;
  room: string;
  attendanceStatus: "NOT_TAKEN" | "IN_PROGRESS" | "COMPLETED";
}

export interface UpcomingClass {
  id: string;
  batchName: string;
  subjectName: string;
  date: string;
  time: string;
  room: string;
}

export interface BatchRow {
  id: string;
  name: string;
  code: string;
  className: string;
  sectionName: string | null;
  sessionName: string;
  strength: number;
  todaysSchedule: string;
  teacherRole: "PRIMARY" | "SUBJECT" | "ASSISTANT";
}

export interface StudentRow {
  id: string;
  admissionNumber: string;
  rollNumber: string | null;
  fullName: string;
  parentName: string | null;
  attendancePercent: number | string;
  latestTestScore: string;
  status: string;
  batchId: string;
  batchName: string;
}

export interface AttendanceRecord {
  id: string;
  batchId: string;
  batchName: string;
  date: string;
  status: AttendanceStatusValue;
  markedBy: string;
  createdAt: string;
}

export interface AttendanceDetailRow {
  studentId: string;
  admissionNumber: string;
  rollNumber: string | null;
  fullName: string;
  status: AttendanceStatusValue;
  remarks: string | null;
}

export interface AssignmentRow {
  id: string;
  title: string;
  description: string | null;
  subjectId: string;
  subjectName: string;
  batchId: string;
  batchName: string;
  dueDate: string;
  maxMarks: number | null;
  status: AssignmentStatusValue;
  attachmentsCount: number;
  createdAt: string;
  createdBy: string;
}

export interface AssignmentAttachmentRow {
  id: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
}

export interface TestRow {
  id: string;
  title: string;
  subjectId: string;
  subjectName: string;
  batchId: string;
  batchName: string;
  testDate: string;
  maxMarks: number;
  status: TestStatusValue;
  createdAt: string;
  createdBy: string;
}

export interface MarksEntryRow {
  studentId: string;
  admissionNumber: string;
  rollNumber: string | null;
  fullName: string;
  marksObtained: number | null;
  isAbsent: boolean;
  remarks: string;
}

export interface MarksEntryData {
  test: { id: string; title: string; maxScore: number; batchId: string; subjectId: string };
  students: MarksEntryRow[];
}

export interface TeacherProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  photoUrl: string | null;
  qualification: string | null;
  specialization: string | null;
  experienceYears: number | null;
}