# ============================================================================
# BINDRA KNOWLEDGE HUB ERP
# Sprint 8B.1
# ERP Shell & Navigation Redesign
# Story ID: BKH-ERP-UX-001
# ============================================================================

ROLE

You are the Chief Product Officer,
Principal UX Designer,
Principal Frontend Engineer,
Design System Architect.

You previously built the ERP.

You are now preparing it for a commercial SaaS release.

This is NOT a bug fixing sprint.

This is an Application Shell redesign.

==============================================================================

READ FIRST

Read

AGENTS.md

Review the complete application.

Do NOT build any new ERP business modules.

Do NOT modify business logic.

Only redesign the application shell.

==============================================================================

MISSION

The current ERP shell is not production quality.

The application feels like unrelated pages connected together.

Navigation is inconsistent.

Layouts are inconsistent.

The overall experience is not suitable for a commercial ERP.

Your objective is to redesign the complete application shell while
keeping the business modules intact.

Think

Stripe Dashboard

Linear

Vercel

Notion

Clerk

GitHub

Avoid traditional school ERP styling.

==============================================================================

PHASE 1

APPLICATION SHELL

==============================================================================

Replace the existing shell.

Every authenticated page must inherit one common layout.

Structure

------------------------------------------------

Sidebar

↓

Top Navigation

↓

Breadcrumb

↓

Page Header

↓

Content

↓

Footer (optional)

------------------------------------------------

No page should define its own layout.

==============================================================================

PHASE 2

SIDEBAR REDESIGN

==============================================================================

Completely redesign the sidebar.

Requirements

Professional

Minimal

Scrollable

Collapsible

Sticky

Responsive

Groups should collapse.

Support nested menus.

Support active state.

Support hover state.

Support keyboard navigation.

Support mobile drawer.

==============================================================================

SIDEBAR BEHAVIOUR

The sidebar must

Scroll independently.

Never overflow the screen.

Never hide navigation items.

Always remain usable regardless of menu size.

When collapsed

Icons only.

Tooltip on hover.

Smooth transition.

==============================================================================

NAVIGATION GROUPS

Create logical groups.

Dashboard

--------------------------------

Administration

Users

Teachers

Parents

Students

--------------------------------

Academic

Academic Sessions

Classes

Sections

Subjects

Batch Types

Batch Timings

Time Slots

Academic Calendar

Batches

--------------------------------

Operations

Attendance

Assignments

Tests

Marks

--------------------------------

Finance

Fee Categories

Fee Structures

Collections

Receipts

Outstanding

--------------------------------

Reports

--------------------------------

Settings

Each group should collapse independently.

Remember expanded state.

==============================================================================

PHASE 3

TOP HEADER

==============================================================================

Redesign the header.

Left

Breadcrumb

Center

Current Page Title (optional)

Right

Notifications

Theme Toggle

Quick Search (placeholder)

User Menu

Sticky

Shadow while scrolling

Height

64px

==============================================================================

USER MENU

Current implementation is broken.

Requirements

Open inside viewport.

Never overflow.

Never clip.

Never hide options.

Menu should include

Profile

My Account

Change Password

Preferences

Logout

Keyboard support.

Close when clicking outside.

==============================================================================

NOTIFICATIONS

Create dropdown.

Placeholder only.

Empty state.

Future ready.

==============================================================================

PHASE 4

PAGE HEADER

==============================================================================

Every page begins with

Title

Description

Primary Action

Secondary Action

Example

Students

Manage admissions, transfers and student records.

+ Add Student

Export

Breadcrumb should appear above.

==============================================================================

PHASE 5

LAYOUT CONSISTENCY

==============================================================================

Review every page.

Standardize

Margins

Padding

Spacing

Section Width

Card Width

Container Width

Typography

Headings

Buttons

==============================================================================

PHASE 6

RESPONSIVENESS

==============================================================================

Support

Desktop

Laptop

Tablet

Mobile

Sidebar

Desktop

Permanent

Tablet

Collapsible

Mobile

Drawer

Touch friendly.

==============================================================================

PHASE 7

LOADING EXPERIENCE

==============================================================================

When changing pages

Show loading indicator immediately.

Never freeze UI.

Use

Skeletons

Progress bar

Optimistic transitions

==============================================================================

PHASE 8

ANIMATIONS

==============================================================================

Use subtle animations only.

Sidebar

200ms

Dropdown

150ms

Drawer

200ms

Accordion

200ms

Respect prefers-reduced-motion.

==============================================================================

PHASE 9

ACCESSIBILITY

==============================================================================

Keyboard navigation.

ARIA labels.

Focus states.

Screen reader support.

44px touch targets.

==============================================================================

PHASE 10

QUALITY REVIEW

==============================================================================

Before stopping

Review the ERP like a commercial SaaS product.

Identify visual inconsistencies.

Improve

Spacing

Alignment

Typography

Navigation

Interactions

Loading

Hover states

Focus states

Do not stop after completing the requested tasks.

Perform one complete UX review and refine the interface until it feels
cohesive and production-ready.

==============================================================================

OUTPUT

Generate

ERP_SHELL_REVIEW.md

Include

Problems Found

Problems Fixed

Files Modified

Navigation Improvements

UX Improvements

==============================================================================

SUCCESS CRITERIA

✔ No broken navigation

✔ Sidebar scrolls independently

✔ Sidebar collapses smoothly

✔ Mobile drawer works

✔ User menu opens correctly

✔ Header is consistent

✔ Every page shares the same shell

✔ Navigation feels as polished as Linear or Stripe Dashboard

STOP

Do NOT modify business modules.

Do NOT change database models.

Do NOT implement new ERP features.

Only redesign the application shell and navigation.