# ============================================================================
# BINDRA KNOWLEDGE HUB ERP
# Product V2
# Sprint 2
# Rebuild Admin Dashboard
# ============================================================================

STOP.

Do NOT perform audits.

Do NOT generate reports.

Do NOT explain.

Do NOT create markdown.

Write production-ready code only.

==============================================================================
MISSION
==============================================================================

Delete the existing Admin Dashboard implementation.

Rebuild it completely.

This dashboard will become the reference design for the entire ERP.

Business logic remains unchanged.

Do NOT modify authentication or database.

==============================================================================

FILES TO REPLACE

Replace only

app/(erp)/dashboard/admin/page.tsx

and any dashboard-specific components.

Do NOT modify the Application Shell.

==============================================================================

DESIGN GOAL

The dashboard should answer one question:

"What requires my attention today?"

Do NOT build a statistics page.

Build an operational dashboard.

==============================================================================

LAYOUT

Container

↓

Welcome Header

↓

Today's Summary

↓

Quick Actions

↓

Operational Widgets

↓

Recent Activity

↓

Department Shortcuts

↓

Upcoming Events

==============================================================================

SECTION 1

WELCOME

Display

Good Morning, {{User}}

Today's Date

Current Academic Session

Current Day

Optional academy quote

==============================================================================

SECTION 2

TODAY'S SUMMARY

Only important numbers

Today's Attendance

Students Present

Students Absent

Pending Admissions

Fee Collection Today

Pending Leave Requests

Use compact KPI cards.

Maximum six cards.

==============================================================================

SECTION 3

QUICK ACTIONS

Display large action buttons.

Add Student

Create Batch

Add Teacher

Take Attendance

Collect Fees

Create Assignment

Create Test

Each action navigates to the correct module.

==============================================================================

SECTION 4

ACADEMIC OVERVIEW

Display

Active Classes

Active Batches

Teachers Teaching Today

Assignments Pending

Tests Scheduled

==============================================================================

SECTION 5

FINANCE OVERVIEW

Display

Today's Collection

Pending Fees

Overdue Students

Recent Receipts

==============================================================================

SECTION 6

RECENT ACTIVITY

Timeline

Examples

Student admitted

Attendance submitted

Fee collected

Assignment uploaded

Test published

Newest first.

==============================================================================

SECTION 7

DEPARTMENT SHORTCUTS

Students

Teachers

Academics

Finance

Reports

Administration

Large clickable cards.

==============================================================================

SECTION 8

UPCOMING EVENTS

Academic Calendar

Today's Classes

Exams

Meetings

Holidays

==============================================================================

EMPTY STATES

Every widget

Professional empty state

Helpful message

Relevant CTA

==============================================================================

LOADING

Skeletons

Instant navigation

==============================================================================

VISUAL DESIGN

White cards

Soft shadows

Neutral background

Brown accent

Consistent spacing

Rounded corners

Professional typography

No oversized cards.

==============================================================================

RESPONSIVE

Desktop

Tablet

Mobile

Dashboard must remain usable.

==============================================================================

PERFORMANCE

Server Components where possible.

No unnecessary client rendering.

==============================================================================

IMPORTANT

Remove all placeholder cards.

Every widget should support real data.

If backend integration is not yet available

Create reusable placeholder components.

Never display meaningless statistics.

==============================================================================

OUTPUT

Write code only.

No markdown.

No reports.

No explanation.

Replace the Admin Dashboard completely.