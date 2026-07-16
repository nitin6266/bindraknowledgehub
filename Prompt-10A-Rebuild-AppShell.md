# ============================================================================
# BINDRA KNOWLEDGE HUB ERP
# Product V2
# Sprint 1
# Complete Application Shell Rewrite
# ============================================================================

STOP.

Do NOT perform any audit.

Do NOT generate markdown reports.

Do NOT generate TODO lists.

Do NOT analyse the project.

Do NOT explain your approach.

Spend 100% of your effort writing production-ready code.

==============================================================================
MISSION
==============================================================================

The current ERP shell is rejected.

It is not production quality.

Do NOT improve it.

Delete it.

Rebuild it.

Business logic, authentication and database remain unchanged.

==============================================================================

FILES TO REPLACE

Completely replace the implementation of

AppShell

Sidebar

Header

Breadcrumb

User Menu

Workspace Navigation

Dashboard Layout

Navigation Provider

Sidebar Provider

Sidebar Components

Navigation Components

Page Header Components

Delete the existing implementation if required.

Do NOT try to preserve poor code.

==============================================================================

DO NOT TOUCH

Authentication

Database

Prisma

Supabase

Business Logic

Permissions

API

CRUD Logic

Forms

==============================================================================

NEW APPLICATION DESIGN

The application should feel like

Stripe Dashboard

Linear

Notion

Vercel

GitHub

Clerk

NOT

a school ERP.

==============================================================================

SIDEBAR

Completely redesign.

Maximum width

240px

Collapsed

72px

Only display

Dashboard

Students

Teachers

Academics

Finance

Reports

Administration

Settings

Nothing else.

NO CRUD PAGES.

==============================================================================

WORKSPACE NAVIGATION

When I click

Students

Open Students Workspace.

Within the page display

Student List

Admissions

Transfers

Promotions

Documents

using tabs or cards.

Do NOT put these inside the sidebar.

Repeat this pattern for

Academics

Finance

Administration

Reports

==============================================================================

HEADER

Replace completely.

Left

Workspace

Center

Breadcrumb

Right

Search

Notifications

Profile

Only one hamburger icon.

Sticky.

64px height.

==============================================================================

PROFILE MENU

Current implementation is broken.

Replace it.

Requirements

Never overflow viewport.

Never clip.

Open left if near screen edge.

ESC closes.

Outside click closes.

Keyboard accessible.

==============================================================================

SCROLLING

This is mandatory.

Sidebar must scroll independently.

Content must scroll independently.

Top bar must remain fixed.

Implementation requirements

height:100vh

display:flex

min-height:0

overflow:hidden

Sidebar navigation

overflow-y:auto

Content

overflow:auto

There must never be double scrollbars.

There must never be inaccessible menu items.

==============================================================================

RESPONSIVENESS

Desktop

Permanent sidebar

Tablet

Collapsible sidebar

Mobile

Drawer

==============================================================================

DASHBOARD

Delete existing implementation.

Rebuild.

Structure

Welcome

Today's Summary

Quick Actions

Recent Activity

Departments

Upcoming Events

No meaningless statistic cards.

Every widget must help the user perform work.

==============================================================================

PAGE TEMPLATE

Every page

Title

Description

Primary Action

Secondary Action

Content

Empty State

Loading State

==============================================================================

VISUAL DESIGN

Use

White surfaces

Neutral gray background

Brown accent

Minimal shadows

16px border radius

Consistent spacing

Modern typography

Premium appearance

==============================================================================

PERFORMANCE

No layout shifts.

Instant navigation.

Loading skeletons.

No UI freezing.

==============================================================================

404 POLICY

Any navigation pointing to a missing page

Either

Create a temporary working page

OR

Remove the navigation.

Never leave broken navigation.

==============================================================================

IMPORTANT

Do NOT stop after replacing one component.

Replace the complete application shell.

If necessary remove thousands of lines of old code.

Do NOT preserve bad UX.

==============================================================================

OUTPUT

Write code only.

Do not generate reports.

Do not generate markdown.

Do not explain.

Continue until the new shell is completely implemented.

Stop only when the application shell has been fully replaced.