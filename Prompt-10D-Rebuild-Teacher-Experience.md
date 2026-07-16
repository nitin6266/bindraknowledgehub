# ============================================================================
# BINDRA KNOWLEDGE HUB ERP
# Product V2
# Sprint 4
# Complete Teacher Experience Rewrite
# ============================================================================

STOP.

Do NOT audit.

Do NOT generate reports.

Do NOT generate markdown.

Do NOT explain your changes.

Write production-ready code only.

==============================================================================

MISSION

Delete the current Teacher experience.

Rebuild it from scratch.

Teachers should feel like they are using a dedicated application.

Do NOT reuse the Admin Dashboard.

Teacher UX must be independent.

==============================================================================

DO NOT MODIFY

Authentication

Database

Prisma

Supabase

Business Logic

Permissions

Attendance Logic

Assignments Logic

Tests Logic

Marks Logic

Only rebuild the UI and user experience.

==============================================================================

FILES TO REPLACE

Replace every Teacher layout and dashboard component.

Replace

Teacher Dashboard

Teacher Navigation

Teacher Workspace

Teacher Landing Page

Teacher Widgets

Teacher Header

Teacher Quick Actions

Do not preserve existing layouts.

==============================================================================

LOGIN FLOW

Teacher Login

↓

/teacher/dashboard

Teachers should never land on the Admin dashboard.

==============================================================================

LEFT NAVIGATION

Maximum 7 items.

Dashboard

My Classes

Attendance

Assignments

Tests

Marks

Profile

Nothing else.

==============================================================================

DASHBOARD

Structure

------------------------------------------------

Welcome

↓

Today's Classes

↓

Attendance Pending

↓

Assignments To Review

↓

Tests To Evaluate

↓

Recent Activity

↓

Quick Actions

------------------------------------------------

==============================================================================

TODAY'S CLASSES

Display

Batch

Subject

Time

Room

Students

Take Attendance

==============================================================================

ATTENDANCE

Teacher clicks

Take Attendance

Attendance opens immediately.

No unnecessary navigation.

==============================================================================

MY CLASSES

Display

Batch Cards

Each card shows

Batch

Students

Today's Time

Pending Tasks

Clicking opens

Class Workspace.

==============================================================================

CLASS WORKSPACE

Tabs

Students

Attendance

Assignments

Tests

Marks

Everything related to one batch remains together.

==============================================================================

ASSIGNMENTS

Show

Draft

Published

Submitted

Needs Review

Quick Publish

==============================================================================

TESTS

Display

Upcoming

Completed

Draft

Quick Create

==============================================================================

MARKS

Spreadsheet style.

Fast entry.

Keyboard navigation.

Bulk save.

==============================================================================

PROFILE

Simple.

Professional.

Change Password

Qualification

Subjects

Profile Picture

==============================================================================

DESIGN

Use

Large spacing

Minimal cards

Professional tables

Modern typography

Brown accent only

White surfaces

Neutral background

==============================================================================

RESPONSIVE

Desktop

Tablet

Mobile

==============================================================================

PERFORMANCE

No unnecessary client rendering.

Loading skeletons.

Instant navigation.

==============================================================================

SUCCESS

Teacher should never feel they are inside an Admin application.

Teacher should feel like this ERP was built specifically for them.

==============================================================================

OUTPUT

Write code only.

No markdown.

No reports.

Replace the Teacher Experience completely.