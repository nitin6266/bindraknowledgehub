# ROLE

The design token system has already been implemented. Reuse the existing design tokens. Do not recreate or replace them. Build on top of them

You are the Lead UI Architect, Design System Engineer, Accessibility Engineer and Frontend Architect for the Bindra Knowledge Hub website.

Before writing any code, read PROJECT_CONSTITUTION.md.

Your goal is NOT to build the website.

Your goal is to build a reusable enterprise-grade design system that every future page will consume.

This is one of the most important sprints of the entire project.

Everything created here must be reusable.

--------------------------------------------------

PROJECT CONTEXT

Bindra Knowledge Hub is a premium educational academy.

The visual language should communicate:

• Trust
• Hope
• Family
• Education
• Premium
• Simplicity
• Warmth
• Professionalism

Avoid anything that feels:

• Corporate
• Cheap
• Over-designed
• Template-like

The final visual quality should resemble modern SaaS products from Vercel, Stripe, Notion and Linear while remaining warm and approachable for parents.

--------------------------------------------------

DESIGN TOKENS

Create a centralized design token system.

Include:

Colors

Typography

Spacing

Border Radius

Shadows

Container Widths

Breakpoints

Animation Timing

Animation Curves

Icon Sizes

Button Sizes

Input Heights

Section Spacing

Z-index Scale

Opacity Scale

Transition Scale

All tokens must live in a single centralized location.

Never hardcode values inside components.

--------------------------------------------------

COLOR SYSTEM

Create semantic colors instead of arbitrary colors.

Examples:

Primary

Secondary

Accent

Success

Warning

Danger

Info

Surface

Muted

Border

Background

Foreground

Card

Popover

Do NOT use overly saturated colors.

The palette should feel premium and educational.

Support Dark Mode even if unused.

--------------------------------------------------

TYPOGRAPHY SYSTEM

Create reusable typography primitives.

Hero Display

H1

H2

H3

H4

Subtitle

Body Large

Body

Body Small

Caption

Label

Button Text

Quote

All typography must be responsive.

Use fluid typography where appropriate.

--------------------------------------------------

SPACING SYSTEM

Create an 8pt spacing system.

Examples

2

4

8

12

16

20

24

32

40

48

56

64

80

96

128

--------------------------------------------------

COMPONENT LIBRARY

Build reusable components.

Buttons

Primary

Secondary

Outline

Ghost

Link

CTA

Loading Button

Icon Button

Cards

Feature Card

Faculty Card

Course Card

Result Card

Testimonial Card

Gallery Card

Statistic Card

Timeline Card

Inputs

Text Input

Textarea

Select

Checkbox

Radio

Switch

File Upload

Layouts

Container

Section

Grid

Stack

Divider

Surface

Hero Wrapper

Typography Components

Heading

Subheading

Paragraph

Quote

Badge

Pill

Icons

Icon Wrapper

Feature Icon

Animated Icon Container

Navigation

Desktop Navigation

Mobile Navigation

Breadcrumb

Section Navigation

Feedback

Loading Spinner

Skeleton

Success Banner

Error Banner

Empty State

Utility Components

Animated Counter

Section Header

CTA Banner

Callout

Highlight Text

Glass Card

--------------------------------------------------

ANIMATION SYSTEM

Create reusable animation presets.

Fade Up

Fade In

Scale

Slide

Stagger

Counter

Hover Lift

Card Hover

Button Hover

Reduced Motion Support

No excessive animations.

Everything should feel subtle.

--------------------------------------------------

RESPONSIVENESS

Support

320

375

390

414

768

1024

1280

1440

1920

Every component should be responsive.

--------------------------------------------------

ACCESSIBILITY

Every component must support

Keyboard

Focus Ring

ARIA

Semantic HTML

Color Contrast

Reduced Motion

Large Touch Targets

Screen Readers

--------------------------------------------------

STORYBOOK

Install Storybook.

Every component must have

Documentation

Variants

States

Responsive Preview

Accessibility Notes

Usage Examples

This is mandatory.

--------------------------------------------------

DOCUMENTATION

Generate

DESIGN_SYSTEM.md

Explain

Color Philosophy

Typography

Spacing

Components

Tokens

Accessibility

Animation Philosophy

Naming Convention

Future Extension Guidelines

--------------------------------------------------

DO NOT

Do not build pages.

Do not build homepage.

Do not create content.

Do not create forms.

Do not implement business logic.

Only reusable design primitives.

--------------------------------------------------

DELIVERABLES

Provide

1. Updated project tree

2. Storybook screenshots (or instructions if screenshots aren't possible)

3. Design token documentation

4. Component inventory

5. Accessibility report

6. Future recommendations

Stop after completion.

Do NOT continue to Sprint 3.