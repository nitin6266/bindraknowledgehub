# ============================================================================
# BINDRA KNOWLEDGE HUB ERP
# Sprint 3 - Academic Master Data
# Story ID: BKH-ERP-003
# ============================================================================

ROLE

You are the Principal Software Architect and ERP Domain Expert.

Read AGENTS.md before making any changes.

Do NOT modify existing authentication or user management.

Build only the Academic Master Data module.

==============================================================================
MISSION
==============================================================================

Create the academic foundation for the ERP.

Everything related to students, teachers, attendance, tests, assignments,
fees and reports will depend on this module.

The module must be flexible enough to support multiple academic years.

==============================================================================

TECH STACK

Next.js 15

Supabase PostgreSQL

Prisma

TypeScript

React Hook Form

Zod

TanStack Table

==============================================================================

MODULES

Build

1. Academic Sessions

2. Classes

3. Sections

4. Subjects

5. Time Slots

6. Batch Timings

7. Batch Types

8. Academic Calendar

==============================================================================

ACADEMIC SESSION

Fields

Session Name

Example

2026-2027

Start Date

End Date

Status

Upcoming

Active

Closed

Only one Active Session allowed.

==============================================================================

CLASSES

Fields

Class Name

Example

Class 3

Class 4

...

Class 12

Description

Display Order

Status

==============================================================================

SECTIONS

Support

A

B

C

D

Custom

Linked to Class.

==============================================================================

SUBJECTS

Fields

Subject Name

Subject Code

Description

Applicable Classes

Status

Examples

Mathematics

Science

English

Hindi

Punjabi

Social Science

Physics

Chemistry

Biology

Computer Science

==============================================================================

TIME SLOTS

Fields

Slot Name

Start Time

End Time

Display Order

Example

08:00 – 09:00

==============================================================================

BATCH TIMINGS

Create reusable timing templates.

Morning

Evening

Weekend

Online

Custom

==============================================================================

BATCH TYPES

Offline

Online

Hybrid

Crash Course

Foundation

Board Preparation

==============================================================================

ACADEMIC CALENDAR

Fields

Title

Description

Date

Event Type

Holiday

Exam

Parent Meeting

Result

Workshop

==============================================================================

CRUD

Every module must support

Create

Edit

Delete (Soft Delete)

View

Search

Filter

Pagination

==============================================================================

VALIDATION

React Hook Form

Zod

==============================================================================

TABLES

Use TanStack Table

Sorting

Filtering

Pagination

Column Selection

==============================================================================

UI

Create

List Pages

Create Dialog

Edit Dialog

Delete Confirmation

Empty State

Loading State

==============================================================================

DATABASE MODELS

Create Prisma Models

AcademicSession

Class

Section

Subject

TimeSlot

BatchTiming

BatchType

AcademicCalendar

Audit fields

UUID primary keys

Soft Delete

==============================================================================

PERMISSIONS

SUPER_ADMIN

Full Access

ADMIN

Full Access

TEACHER

Read Only

PARENT

No Access

==============================================================================

NAVIGATION

Add menu

Academic Management

    Academic Sessions

    Classes

    Sections

    Subjects

    Time Slots

    Batch Timings

    Batch Types

    Academic Calendar

==============================================================================

OUTPUT

Provide

Updated Project Tree

Database Schema

Navigation Structure

CRUD Summary

==============================================================================

STOP

Do NOT build

Students

Batch Allocation

Attendance

Assignments

Tests

Fees

Reports

Only complete Academic Master Data.