export const LEAVE_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "APPROVED", label: "Approved" },
  { value: "REJECTED", label: "Rejected" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

export type LeaveStatusValue = (typeof LEAVE_STATUS_OPTIONS)[number]["value"];

export const ANNOUNCEMENT_AUDIENCE_OPTIONS = [
  { value: "ALL", label: "Everyone" },
  { value: "BATCH", label: "Batch" },
] as const;
