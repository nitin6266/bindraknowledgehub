/**
 * Form System - Bindra Knowledge Hub
 * Enterprise-grade reusable form components built on React Hook Form + Zod
 */

// Core Form
export { Form, useFormContext, useForm, FormProvider } from "./Form";
export type { FormProps } from "./Form";

// Form Field Primitives
export { FormLabel } from "./FormField";
export type { FormLabelProps } from "./FormField";

export { FormMessage } from "./FormField";
export type { FormMessageProps } from "./FormField";

export { FormDescription } from "./FormField";
export type { FormDescriptionProps } from "./FormField";

// Input Components
export { TextInput, PasswordInput, SearchInput, PhoneInput } from "./TextInput";
export type { TextInputProps, PasswordInputProps, SearchInputProps, PhoneInputProps } from "./TextInput";

export { TextArea } from "./TextArea";
export type { TextAreaProps } from "./TextArea";

export { SelectField } from "./SelectField";
export type { SelectFieldProps, SelectOption } from "./SelectField";

export { CheckboxField } from "./CheckboxField";
export type { CheckboxFieldProps } from "./CheckboxField";

export { RadioGroup } from "./RadioGroup";
export type { RadioGroupProps, RadioOption } from "./RadioGroup";

export { SwitchField } from "./SwitchField";
export type { SwitchFieldProps } from "./SwitchField";

export { FileUploadField } from "./FileUploadField";
export type { FileUploadFieldProps } from "./FileUploadField";

// Actions
export { SubmitButton, FormActions } from "./SubmitButton";
export type { SubmitButtonProps, FormActionsProps } from "./SubmitButton";

// Layout
export { FormSection } from "./FormSection";
export type { FormSectionProps } from "./FormSection";

// Validation
export {
  // Core validation schemas
  emailSchema,
  indianPhoneSchema,
  passwordSchema,
  requiredString,
  optionalString,
  minLength,
  maxLength,
  lengthBetween,
  regexSchema,
  createFieldSchema,

  // Pre-built form schemas
  contactFormSchema,
  admissionEnquirySchema,
  newsletterSchema,
  loginSchema,
  registerSchema,
  resetPasswordSchema,
  updatePasswordSchema,

  // Schema composition helpers
  composeSchemas,
  partialSchema,
  requiredSchema,

  // Types
  type InferFormValues,
} from "./validation";

// Re-export Zod for consumers
export { z } from "zod";