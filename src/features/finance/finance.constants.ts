export const PAYMENT_MODE_OPTIONS = [
  { value: "CASH", label: "Cash" },
  { value: "UPI", label: "UPI" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CHEQUE", label: "Cheque" },
  { value: "ONLINE", label: "Online" },
] as const;

export const DISCOUNT_TYPE_OPTIONS = [
  { value: "SIBLING", label: "Sibling Discount" },
  { value: "MERIT", label: "Merit Scholarship" },
  { value: "SPECIAL", label: "Special Discount" },
  { value: "CUSTOM", label: "Custom Discount" },
] as const;

export const DISCOUNT_MODE_OPTIONS = [
  { value: "FIXED", label: "Fixed Amount" },
  { value: "PERCENTAGE", label: "Percentage" },
] as const;

export const FEE_STATUS_OPTIONS = [
  { value: "PENDING", label: "Pending" },
  { value: "PARTIAL", label: "Partial" },
  { value: "PAID", label: "Paid" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "WAIVED", label: "Waived" },
] as const;

export const ASSIGNMENT_TYPE_OPTIONS = [
  { value: "SINGLE", label: "Single Student" },
  { value: "BATCH", label: "Entire Batch" },
  { value: "CLASS", label: "Entire Class" },
  { value: "SESSION", label: "Entire Session" },
] as const;

export const SUGGESTED_FEE_CATEGORIES = [
  "Admission Fee",
  "Monthly Tuition",
  "Quarterly Fee",
  "Annual Fee",
  "Lab Fee",
  "Exam Fee",
  "Study Material",
  "Transport",
  "Other Charges",
];

export const ACADEMY_INFO = {
  name: "Bindra Knowledge Hub",
  tagline: "Empowering every child to learn, grow and shine.",
  address: "Bindra Knowledge Academy Campus, India",
  contact: "Contact: +91 00000 00000",
};
