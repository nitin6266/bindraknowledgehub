"use client";

import * as React from "react";
import {
  Form,
  TextInput,
  TextArea,
  SelectField,
  RadioGroup,
  CheckboxField,
  SubmitButton,
  useFormContext,
  admissionEnquirySchema,
  type SelectOption,
  type RadioOption,
} from "@/components/forms";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Surface } from "@/components/layout/surface";
import { Grid } from "@/components/layout/grid";
import { Subheading } from "@/components/typography/subheading";
import { Paragraph } from "@/components/typography/paragraph";

const enquirySchema = admissionEnquirySchema.extend({
  preferredMode: z.string().min(1, "Please select a learning mode"),
  consent: z.boolean().refine((value) => value === true, {
    message: "Please agree so we can contact you about this enquiry",
  }),
});

type EnquiryValues = z.infer<typeof enquirySchema>;

const gradeOptions: SelectOption[] = [
  { value: "grade-1-5", label: "Grade 1 – 5" },
  { value: "grade-6-8", label: "Grade 6 – 8" },
  { value: "grade-9-10", label: "Grade 9 – 10" },
  { value: "grade-11-12", label: "Grade 11 – 12" },
  { value: "competitive", label: "Competitive exam prep" },
  { value: "other", label: "Other / Not sure yet" },
];

const courseOptions: SelectOption[] = [
  { value: "mathematics", label: "Mathematics" },
  { value: "science", label: "Science" },
  { value: "english", label: "English & Communication" },
  { value: "social-studies", label: "Social Studies" },
  { value: "coding", label: "Coding & Computer Skills" },
  { value: "exam-prep", label: "Competitive Exam Preparation" },
  { value: "multiple", label: "Multiple subjects" },
  { value: "help-choose", label: "Help me choose" },
];

const modeOptions: RadioOption[] = [
  { value: "Offline", label: "Offline (campus)" },
  { value: "Online", label: "Online (live)" },
];

const defaultValues: EnquiryValues = {
  studentName: "",
  parentName: "",
  email: "",
  phone: "",
  currentGrade: "",
  course: "",
  preferredMode: "",
  message: "",
  consent: false,
};

function ResetButton() {
  const { reset } = useFormContext();
  return (
    <Button type="button" variant="outline" onClick={() => reset(defaultValues)}>
      Reset
    </Button>
  );
}

function SuccessPanel({ onReset }: { onReset: () => void }) {
  return (
    <Surface tone="card" shadow="sm" radius="xl" className="p-8 text-center">
      <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full bg-accent/15 text-accent">
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <Subheading className="mx-auto max-w-prose">
        Thank you — your enquiry is on its way!
      </Subheading>
      <Paragraph className="mx-auto mt-2 max-w-prose">
        Our admissions team will reach out within one working day. We’re excited
        to learn about your child.
      </Paragraph>
      <Button type="button" variant="outline" className="mt-6" onClick={onReset}>
        Send another enquiry
      </Button>
    </Surface>
  );
}

export function AdmissionEnquiryForm() {
  const [submitted, setSubmitted] = React.useState(false);

  async function handleSubmit(_values: EnquiryValues) {
    // Mock submission — no backend. Simulate a short network delay.
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitted(true);
  }

  if (submitted) {
    return <SuccessPanel onReset={() => setSubmitted(false)} />;
  }

  return (
    <Form
      schema={enquirySchema}
      defaultValues={defaultValues}
      onSubmit={handleSubmit}
      className="w-full"
    >
      <Grid cols={2} gap="md" className="items-start">
        <TextInput
          name="studentName"
          label="Student name"
          placeholder="e.g. Aarav Sharma"
          autoComplete="given-name"
          required
        />
        <TextInput
          name="parentName"
          label="Parent / guardian name"
          placeholder="e.g. Mrs. Sharma"
          autoComplete="name"
          required
        />
        <TextInput
          name="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
        <TextInput
          name="phone"
          label="Phone number"
          type="tel"
          placeholder="+91 98765 43210"
          autoComplete="tel"
          required
        />
        <SelectField
          name="currentGrade"
          label="Current grade"
          placeholder="Select grade"
          options={gradeOptions}
          required
        />
        <SelectField
          name="course"
          label="Subject of interest"
          placeholder="Select subject"
          options={courseOptions}
          required
        />
      </Grid>

      <div className="mt-2">
        <RadioGroup
          name="preferredMode"
          label="Preferred learning mode"
          options={modeOptions}
          orientation="horizontal"
          required
        />
      </div>

      <TextArea
        name="message"
        label="Anything else we should know?"
        placeholder="Share goals, challenges or questions (optional)"
        className="mt-2"
      />

      <div className="mt-2">
        <CheckboxField
          name="consent"
          label="I agree to be contacted by Bindra Knowledge Hub about this enquiry."
          required
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <SubmitButton type="submit" size="lg" fullWidth>
          Submit enquiry
        </SubmitButton>
        <ResetButton />
      </div>
    </Form>
  );
}
