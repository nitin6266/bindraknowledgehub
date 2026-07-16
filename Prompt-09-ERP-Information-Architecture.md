# ============================================================================
# BINDRA KNOWLEDGE HUB ERP
# Product Redesign Sprint
# Phase 1 - Information Architecture
# Story ID: BKH-ERP-UX-002
# ============================================================================

ROLE

You are the Chief Product Officer,
Principal UX Architect,
Senior Product Designer,
Staff Frontend Engineer.

You are NOT fixing bugs.

You are redesigning the ERP as a commercial SaaS product.

Think

Linear

Notion

Stripe Dashboard

ClickUp

GitHub

Vercel

Do NOT think like a traditional School ERP.

==============================================================================

MISSION

The current ERP exposes too many navigation items.

The application feels overwhelming.

Users cannot understand where to begin.

The sidebar is cluttered.

Many pages are incomplete.

Several routes return 404.

Your responsibility is to redesign the product architecture while
preserving all existing business logic.

==============================================================================

OBJECTIVES

1.

Redesign Information Architecture.

2.

Simplify Navigation.

3.

Improve User Journey.

4.

Hide unfinished modules.

5.

Eliminate all 404 navigation.

6.

Prepare the ERP for future growth.

==============================================================================

CRITICAL REQUIREMENT

Do NOT expose every database entity in the sidebar.

The sidebar is for WORKSPACES.

Individual entities belong inside each workspace.

==============================================================================

NEW SIDEBAR

The maximum number of root menu items should be 8.

Dashboard

Students

Teachers

Academics

Finance

Reports

Administration

Settings

Nothing else.

==============================================================================

WORKSPACE MODEL

When the user clicks

Academics

They should enter an Academic Workspace.

Inside that workspace display

Academic Sessions

Classes

Sections

Subjects

Time Slots

Batch Types

Batch Timings

Batches

These should NOT appear in the global sidebar.

==============================================================================

Students Workspace

Student List

Admissions

Promotions

Transfers

Documents

==============================================================================

Teachers Workspace

Teacher List

Teacher Allocation

Teacher Timetable

==============================================================================

Finance Workspace

Fee Categories

Fee Structures

Collections

Receipts

Outstanding Fees

Reports

==============================================================================

Administration Workspace

Users

Roles

Permissions

Audit Logs

==============================================================================

Settings Workspace

Organization

Profile

Preferences

Theme

Academic Defaults

System Configuration

==============================================================================

ROLE-BASED NAVIGATION

SUPER_ADMIN

See every workspace.

ADMIN

Cannot access

System Configuration

Audit Logs

Role Management

TEACHER

Dashboard

My Classes

Attendance

Assignments

Tests

Marks

Students

Profile

Nothing else.

PARENT

Dashboard

My Children

Attendance

Assignments

Results

Fees

Leave Requests

Profile

Nothing else.

==============================================================================

REMOVE

Do NOT show pages that are unfinished.

If a feature has not been implemented

Hide it from navigation.

Never show a menu item that opens a 404.

==============================================================================

404 POLICY

Perform a full navigation audit.

Verify every menu item.

If a route is missing

Either

Create a minimal working page

OR

Remove the navigation entry.

Zero broken navigation is acceptable.

==============================================================================

DASHBOARD

The dashboard should no longer feel like a sitemap.

Instead show

Good Morning

↓

Today's Summary

↓

Pending Tasks

↓

Quick Actions

↓

Recent Activity

↓

Department Shortcuts

The dashboard must help users begin their work.

==============================================================================

VISUAL DESIGN

Reduce visual noise.

Use

White cards

Gray backgrounds

Brown accent only

More whitespace

Cleaner typography

Smaller sidebar

Better spacing

Premium shadows

Modern SaaS appearance.

==============================================================================

USER EXPERIENCE

Users should never wonder

"Where do I click?"

The application should naturally guide them.

==============================================================================

QUALITY REVIEW

Before stopping

Review every page.

Remove duplicate navigation.

Remove unnecessary cards.

Improve hierarchy.

Improve spacing.

Improve consistency.

If something feels unfinished

Refine it.

==============================================================================

OUTPUT

Generate

ERP_INFORMATION_ARCHITECTURE.md

Include

Old Navigation

New Navigation

Workspace Structure

Routes Removed

Routes Added

404 Fixes

UX Improvements

==============================================================================

SUCCESS CRITERIA

✔ Maximum 8 sidebar items

✔ No broken navigation

✔ Zero 404 pages

✔ Role-specific navigation

✔ Workspace-based experience

✔ Modern SaaS UX

✔ Simple enough that a first-time user immediately understands where to begin

STOP

Do NOT modify database models.

Do NOT change backend business logic.

Do NOT add new ERP modules.

Focus entirely on redesigning the information architecture and user journey.