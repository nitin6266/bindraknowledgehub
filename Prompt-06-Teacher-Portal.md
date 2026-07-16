# ============================================================================
# BINDRA KNOWLEDGE HUB ERP
# Sprint 6 - Teacher Portal
# Story ID: BKH-ERP-006
# ============================================================================

ROLE

You are the Principal ERP Architect, UX Designer and School Management
Domain Expert.

Read AGENTS.md before making any changes.

Do NOT modify previous modules.

Build only the Teacher Portal.

==============================================================================
MISSION
==============================================================================

Build a complete Teacher Portal.

Teachers should only see data related to their assigned batches.

The portal must enable teachers to efficiently manage attendance,
assignments, tests and marks with minimal clicks.

==============================================================================

TECH STACK

Next.js 15

Supabase PostgreSQL

Prisma

TypeScript

React Hook Form

Zod

TanStack Table

Supabase Storage

==============================================================================

MODULES

Build

1. Teacher Dashboard

2. My Batches

3. My Students

4. Daily Attendance

5. Assignment Management

6. Test Management

7. Marks Entry

8. Teacher Profile

==============================================================================

TEACHER DASHBOARD

Display

Today's Classes

Upcoming Classes

Pending Attendance

Pending Assignments

Pending Test Evaluations

Recent Announcements (Placeholder)

Quick Actions

Take Attendance

Upload Assignment

Create Test

Enter Marks

==============================================================================

MY BATCHES

Show only assigned batches.

Display

Batch Name

Class

Section

Session

Strength

Today's Schedule

Teacher Role

Clicking a batch opens Batch Details.

==============================================================================

MY STUDENTS

Display students only from assigned batches.

Show

Photo

Admission Number

Roll Number

Student Name

Parent Name

Attendance %

Latest Test Score

Status

Search and Filter supported.

==============================================================================

DAILY ATTENDANCE

Teachers can take attendance only for assigned batches.

Attendance Types

Present

Absent

Late

Leave

Features

Mark All Present

Bulk Update

Search Student

Attendance Remarks

Edit Same Day Attendance

Attendance History

==============================================================================

ASSIGNMENT MANAGEMENT

Teachers can

Create Assignment

Upload PDF

Upload Images

Upload Documents

Assignment Title

Description

Subject

Batch

Due Date

Marks (Optional)

Status

Draft

Published

Closed

Store files in Supabase Storage.

Students/Parents can view published assignments.

==============================================================================

TEST MANAGEMENT

Teachers can

Create Test

Subject

Batch

Date

Maximum Marks

Instructions

Status

Draft

Published

Completed

==============================================================================

MARKS ENTRY

Select

Batch

↓

Subject

↓

Test

Display students.

Enter marks for each student.

Validation

Cannot exceed maximum marks.

Save Draft.

Publish Results.

Edit before publishing.

==============================================================================

TEACHER PROFILE

View Profile

Edit Profile

Change Password

Profile Photo

Phone

Email

Qualification

Specialization

==============================================================================

SEARCH

Search

Student

Batch

Assignment

Test

==============================================================================

FILTERS

Academic Session

Class

Batch

Subject

==============================================================================

TABLES

Use TanStack Table

Sorting

Filtering

Pagination

Column Visibility

==============================================================================

DATABASE MODELS

Create

Attendance

AttendanceDetail

Assignment

AssignmentAttachment

Test

TestResult

TeacherDashboardPreference

Use UUID primary keys.

Audit fields.

Soft Delete.

==============================================================================

PERMISSIONS

SUPER_ADMIN

Full Access

ADMIN

Full Access

TEACHER

Assigned Batches Only

PARENT

No Access

==============================================================================

NAVIGATION

Teacher Portal

Dashboard

My Batches

My Students

Attendance

Assignments

Tests

Marks

Profile

==============================================================================

UI

Dashboard

Attendance Screen

Assignment Wizard

Test Wizard

Marks Entry Grid

Profile Screen

==============================================================================

VALIDATION

React Hook Form

Zod

==============================================================================

OUTPUT

Provide

Updated Project Tree

Database Schema

Navigation Structure

Teacher Workflow Summary

==============================================================================

STOP

Do NOT build

Parent Portal

Fee Management

Notifications

Reports

Analytics

Only complete the Teacher Portal.