# ============================================================================
# BINDRA KNOWLEDGE HUB ERP
# Sprint 7 - Parent Portal
# Story ID: BKH-ERP-007
# ============================================================================

ROLE

You are the Principal ERP Architect, UX Designer and Parent Experience Specialist.

Read AGENTS.md before making any changes.

Do NOT modify previous modules.

Build only the Parent Portal.

==============================================================================
MISSION
==============================================================================

Build a modern Parent Portal.

Parents should have complete visibility into their child's academic
progress without contacting the academy for routine information.

The portal must be mobile-first, intuitive and simple.

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

1. Parent Dashboard

2. My Children

3. Attendance

4. Assignments

5. Test Results

6. Leave Requests

7. Fee Summary

8. Announcements

9. Documents

10. Parent Profile

==============================================================================

PARENT DASHBOARD

Display

Children Summary

Today's Attendance

Upcoming Tests

Pending Assignments

Latest Marks

Pending Fees

Recent Announcements

Quick Actions

Apply Leave

View Attendance

View Results

Download Assignments

==============================================================================

MY CHILDREN

Support multiple children under one parent.

Each child card displays

Photo

Name

Admission Number

Class

Section

Batch

Current Attendance %

Latest Test Score

Outstanding Fees

Switch between children without logging out.

==============================================================================

ATTENDANCE

Display

Daily Attendance

Monthly Calendar View

Attendance %

Present

Absent

Late

Leave

Filters

Academic Session

Month

==============================================================================

ASSIGNMENTS

Display assignments by child.

Show

Title

Subject

Teacher

Assigned Date

Due Date

Status

Download Attachments

==============================================================================

TEST RESULTS

Display

Tests

Marks Obtained

Maximum Marks

Percentage

Teacher Remarks

Filter by

Academic Session

Subject

==============================================================================

LEAVE REQUESTS

Parents can

Apply Leave

Edit Pending Request

Cancel Pending Request

Track Status

Fields

Child

From Date

To Date

Reason

Attachment (Optional)

Status

Pending

Approved

Rejected

==============================================================================

FEE SUMMARY

Display

Total Fees

Paid

Pending

Due Date

Payment History (Placeholder)

Payment integration will be added later.

==============================================================================

ANNOUNCEMENTS

Display announcements published by

SUPER_ADMIN

ADMIN

Teachers (Assigned Batch Only)

==============================================================================

DOCUMENTS

Download

Assignments

Report Cards (Future)

Study Material

Circulars

==============================================================================

PARENT PROFILE

View Profile

Edit Profile

Change Password

Profile Photo

Phone

Email

==============================================================================

SEARCH

Assignments

Tests

Announcements

==============================================================================

FILTERS

Child

Academic Session

Subject

==============================================================================

DATABASE MODELS

Create

LeaveRequest

Announcement

ParentPreference

DocumentAccessLog

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

View Assigned Students Only

PARENT

Own Children Only

==============================================================================

NAVIGATION

Parent Portal

Dashboard

My Children

Attendance

Assignments

Results

Leave Requests

Fees

Announcements

Documents

Profile

==============================================================================

UI

Parent Dashboard

Child Switcher

Attendance Calendar

Assignment List

Results Table

Leave Wizard

Fee Summary Cards

Announcement Feed

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

Parent Workflow Summary

==============================================================================

STOP

Do NOT build

Online Fee Payment

SMS

WhatsApp

Push Notifications

Reports

Analytics

Only complete the Parent Portal.