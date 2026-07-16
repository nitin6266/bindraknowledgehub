import type { Option } from "@/features/teacher/teacher.types";

export interface FeeCategoryData {
  id: string;
  name: string;
  description: string | null;
  status: string;
}

export interface FeeStructureData {
  id: string;
  sessionId: string;
  sessionName: string;
  classId: string;
  className: string;
  batchId: string | null;
  batchName: string | null;
  categoryId: string;
  categoryName: string;
  amount: number;
  dueDate: string | null;
  lateFeeAmount: number;
  lateFeeAfterDays: number;
  status: string;
}

export interface StudentFeeRow {
  id: string;
  studentId: string;
  studentName: string;
  admissionNumber: string;
  classId: string;
  className: string;
  batchId: string | null;
  batchName: string | null;
  categoryId: string;
  categoryName: string;
  sessionId: string;
  assignmentType: string;
  totalAmount: number;
  discountAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: string;
  dueDate: string | null;
}

export interface InstallmentRow {
  id: string;
  studentFeeId: string;
  dueDate: string | null;
  amount: number;
  status: string;
  paidDate: string | null;
}

export interface DiscountRow {
  id: string;
  studentFeeId: string;
  studentName: string;
  type: string;
  mode: string;
  value: number;
  amount: number;
  reason: string | null;
  approvalRequired: boolean;
  status: string;
  approvedBy: string | null;
}

export interface PaymentRow {
  id: string;
  studentFeeId: string;
  studentName: string;
  amount: number;
  mode: string;
  transactionRef: string | null;
  collectedByName: string;
  paymentDate: string;
  remarks: string | null;
}

export interface ReceiptData {
  id: string;
  receiptNumber: string;
  studentName: string;
  admissionNumber: string;
  parentName: string | null;
  categoryName: string;
  className: string;
  totalAmount: number;
  discountAmount: number;
  paidAmount: number;
  balance: number;
  generatedAt: string;
  lines: { label: string; amount: number }[];
}

export interface LedgerRow {
  id: string;
  type: string;
  amount: number;
  balanceAfter: number;
  description: string | null;
  createdAt: string;
}

export interface OutstandingDashboard {
  totalOutstanding: number;
  collectedThisMonth: number;
  overdueStudents: number;
  upcomingDue: number;
}

export interface FeeFilters {
  sessionId?: string;
  classId?: string;
  batchId?: string;
  categoryId?: string;
  status?: string;
  search?: string;
}

export interface StudentFeeDetail extends StudentFeeRow {
  installments: InstallmentRow[];
  discounts: DiscountRow[];
  payments: PaymentRow[];
  ledger: LedgerRow[];
}

export interface FinanceReports {
  collectionTotal: number;
  collectionByMode: { mode: string; amount: number }[];
  outstanding: StudentFeeRow[];
  discounts: DiscountRow[];
  paymentHistory: PaymentRow[];
}

export type { Option };
