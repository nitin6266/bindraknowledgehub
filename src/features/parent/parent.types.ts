export interface ParentProfileData {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  gender: string;
  photoUrl: string | null;
}

export interface ChildSummary {
  id: string;
  name: string;
  admissionNo: string;
  className: string;
  sectionName: string;
  batchName: string;
  batchId: string;
  gender: string;
  photoUrl: string | null;
  attendance: {
    present: number;
    absent: number;
    late: number;
    total: number;
    percentage: number;
  };
}

export interface ParentDashboardStats {
  childrenCount: number;
  presentToday: number;
  absentToday: number;
  pendingLeaves: number;
  pendingAssignments: number;
  unreadAnnouncements: number;
}

export interface AttendanceDayView {
  date: string;
  status: "PRESENT" | "ABSENT" | "LATE";
}

export interface AssignmentView {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  subjectName: string;
  batchName: string;
  attachments: { id: string; fileName: string; fileUrl: string }[];
  isSubmitted: boolean;
}

export interface TestResultView {
  id: string;
  testName: string;
  subjectName: string;
  maxScore: number;
  score: number | null;
  percentage: number | null;
  isAbsent: boolean;
  note: string | null;
  testDate: string | null;
}

export interface LeaveRequestRow {
  id: string;
  studentId: string;
  studentName: string;
  fromDate: string;
  toDate: string;
  reason: string;
  status: LeaveStatusValue;
  reviewNote: string | null;
  attachmentUrl: string | null;
  createdAt: string;
}

export interface AnnouncementRow {
  id: string;
  title: string;
  body: string;
  audience: string;
  batchName: string | null;
  publishedByName: string;
  publishedAt: string;
}

export interface FeeSummary {
  total: number;
  paid: number;
  pending: number;
  dueDate: string | null;
  history: {
    id: string;
    studentName: string;
    amount: number;
    date: string;
    receiptNumber: string;
  }[];
}

export interface DocumentItem {
  id: string;
  title: string;
  type: string;
  url: string;
  studentId: string;
  studentName: string;
}

export type LeaveStatusValue = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
