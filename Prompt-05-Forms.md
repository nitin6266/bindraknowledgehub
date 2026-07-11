# ============================================================================
# BINDRA KNOWLEDGE HUB
# Sprint 2C - Form System
# Story ID: BKH-DS-003
# ============================================================================

ROLE

You are the Principal Frontend Engineer, Form Systems Architect,
Accessibility Engineer and UX Engineer.

Before writing any code:

1. Read AGENTS.md
2. Read DESIGN_SYSTEM.md
3. Read DESIGN_TOKENS.md
4. Read COMPONENT_LIBRARY.md

Do NOT violate any established architecture.

Do NOT modify completed work.

Do NOT refactor existing components unless absolutely required.

==============================================================================
MISSION
==============================================================================

Create a reusable, enterprise-grade Form System.

The output of this sprint is NOT a contact form.

The output is a reusable collection of form components that can be used
throughout the application.

Every future form must be built using these components.

==============================================================================
TECH STACK
==============================================================================

Use

- React Hook Form
- Zod
- TypeScript
- shadcn/ui (where appropriate)
- Tailwind CSS
- Existing Design Tokens
- Existing Component Library

==============================================================================
FOLDER STRUCTURE
==============================================================================

Create

src/components/forms/

Suggested structure

forms/

    Form.tsx

    FormField.tsx

    FormLabel.tsx

    FormMessage.tsx

    FormDescription.tsx

    TextInput.tsx

    TextArea.tsx

    Select.tsx

    Checkbox.tsx

    RadioGroup.tsx

    Switch.tsx

    FileUpload.tsx

    PhoneInput.tsx

    SearchInput.tsx

    PasswordInput.tsx

    SubmitButton.tsx

    FormSection.tsx

    index.ts

==============================================================================

BUILD THE FOLLOWING
==============================================================================

Text Input

Textarea

Dropdown

Checkbox

Radio Group

Switch

Password Input

Phone Number Input

Search Input

File Upload

Submit Button

Form Section

==============================================================================

REQUIREMENTS
==============================================================================

Every component must support

Disabled

Loading

Read Only

Required

Optional

Error State

Success State

Focus State

Hover State

Keyboard Navigation

ARIA Labels

Responsive Layout

Dark Mode

Full TypeScript typing

No use of any

==============================================================================

VALIDATION
==============================================================================

Integrate with

React Hook Form

Zod

Provide reusable validation helpers.

Support

Email

Phone

Required

Min Length

Max Length

Regex

Custom Validators

==============================================================================

ACCESSIBILITY
==============================================================================

Support

Screen Readers

Focus Ring

Tab Navigation

Error Announcements

Required Indicators

Label Associations

Autocomplete

Correct HTML Input Types

Touch Friendly Controls

WCAG AA

==============================================================================

DESIGN
==============================================================================

Consume ONLY

Existing Design Tokens

Existing Typography

Existing Colors

Existing Radius

Existing Shadows

Existing Motion

Do NOT hardcode styles.

==============================================================================

EXAMPLES
==============================================================================

Create an examples folder

src/components/forms/examples/

Include example forms demonstrating

Simple Form

Validation

Error States

Loading States

Disabled States

These examples are for developers only.

Do NOT expose them in application routes.

==============================================================================

DOCUMENTATION
==============================================================================

Generate

FORM_SYSTEM.md

Include

Architecture

Component List

Props

Examples

Validation Strategy

Accessibility Notes

Best Practices

Future Extension Guidelines

==============================================================================

TESTING
==============================================================================

Ensure

npm run build passes

npm run lint passes

npm run typecheck passes

==============================================================================

OUTPUT
==============================================================================

Provide

1. Updated Project Tree

2. Components Created

3. Validation Architecture

4. Accessibility Summary

5. Future Recommendations

==============================================================================

STOP

Do NOT create

Contact Form

Admission Form

Assessment Form

Enquiry Form

Newsletter Form

Authentication Forms

Do NOT create pages.

Do NOT create business logic.

Stop immediately after the reusable Form System is complete.