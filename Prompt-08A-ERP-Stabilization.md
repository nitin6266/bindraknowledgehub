# ============================================================================
# BINDRA KNOWLEDGE HUB ERP
# Sprint 8.5 - ERP Stabilization & Production Readiness
# Story ID: BKH-ERP-STABILIZATION-001
# ============================================================================

ROLE

You are the Chief Software Architect, Principal Frontend Engineer,
Principal UX Designer and Technical Lead.

Read AGENTS.md.

You are NOT building new features.

You are reviewing the ERP like a senior engineering team preparing for
its first production release.

Your responsibility is to audit, repair and complete the application.

==============================================================================
MISSION
==============================================================================

The ERP foundation has been built over multiple sprints.

Before adding new modules, perform a complete stabilization pass.

Think like a Technical Lead reviewing a Beta Release.

Do not blindly rewrite code.

Inspect first.

Repair second.

Improve third.

==============================================================================

PHASE 1
APPLICATION AUDIT
==============================================================================

Perform a complete audit.

Review

Project structure

Routes

Navigation

Layouts

Authentication

Role Guards

Database Models

Reusable Components

Forms

Tables

Dialogs

Providers

Hooks

Services

Repositories

Middleware

Generate

ERP_AUDIT_REPORT.md

Include

Architecture Issues

Broken Features

Missing Features

Design Problems

Performance Concerns

Security Concerns

Code Duplication

==============================================================================

PHASE 2
ROUTE AUDIT
==============================================================================

Verify every application route.

Ensure

No 404 pages

No broken links

No missing layouts

No missing route handlers

No dead menu items

Every navigation item must resolve correctly.

==============================================================================

PHASE 3
ROLE EXPERIENCE
==============================================================================

Each role must have a dedicated dashboard.

SUPER_ADMIN

/dashboard

Complete administration dashboard.

ADMIN

/admin/dashboard

Operational dashboard.

TEACHER

/teacher/dashboard

Teacher-only experience.

Show

Today's Classes

Assigned Batches

Assigned Students

Attendance

Assignments

Tests

Marks

PARENT

/parent/dashboard

Parent-only experience.

Show

My Children

Attendance

Assignments

Results

Fees

Leave Requests

No role should ever see another role's navigation.

==============================================================================

PHASE 4
SIDEBAR
==============================================================================

Review the sidebar.

Remove duplicate items.

Group navigation logically.

Collapse correctly.

Highlight active page.

Support mobile.

No broken links.

==============================================================================

PHASE 5
UI CONSISTENCY
==============================================================================

Review every page.

Standardize

Spacing

Typography

Cards

Tables

Dialogs

Buttons

Inputs

Section Headers

Containers

Create a modern SaaS interface similar to

Stripe Dashboard

Clerk

Vercel

Linear

Notion

Avoid outdated school ERP styling.

==============================================================================

PHASE 6
PAGE REVIEW
==============================================================================

Review every module.

Authentication

Users

Academic

Batches

Students

Teachers

Parents

Fees

Every page should have

Loading State

Skeleton

Empty State

Error State

Search

Filters

Pagination

Confirmation Dialogs

Responsive Layout

==============================================================================

PHASE 7
FUNCTIONAL REVIEW
==============================================================================

Verify

CRUD

Forms

Validation

Tables

Search

Filters

Pagination

Dialogs

Role Permissions

Database Queries

Relationships

==============================================================================

PHASE 8
DATABASE REVIEW
==============================================================================

Review

Indexes

Relations

Foreign Keys

Soft Deletes

Cascade Rules

Unique Constraints

Audit Fields

==============================================================================

PHASE 9
PERFORMANCE
==============================================================================

Review

Bundle Size

Dynamic Imports

Server Components

Client Components

Memoization

Duplicate Queries

Unused Components

==============================================================================

PHASE 10
ACCESSIBILITY
==============================================================================

Review

Keyboard Navigation

ARIA

Focus

Contrast

Responsive Behaviour

==============================================================================

PHASE 11
DESIGN POLISH
==============================================================================

Improve

Sidebar

Header

Dashboard Cards

Tables

Dialogs

Forms

Charts Placeholders

Icons

Badges

Status Chips

Breadcrumbs

Page Headers

The ERP should feel like a premium SaaS application.

==============================================================================

PHASE 12
QUALITY
==============================================================================

Verify

npm run build

npm run lint

npm run typecheck

All must pass.

==============================================================================

OUTPUT
==============================================================================

Generate

ERP_AUDIT_REPORT.md

ERP_FIX_LOG.md

Include

Problems Found

Problems Fixed

Files Modified

Remaining Issues

Recommendations

==============================================================================

SUCCESS CRITERIA
==============================================================================

The ERP should feel production-ready.

Every role must have its own dashboard.

Every menu item must work.

No broken routes.

No placeholder navigation.

No inconsistent layouts.

No duplicate components.

No unfinished screens.

Do NOT add new business modules.

Complete only the stabilization, UX improvements and missing functionality.