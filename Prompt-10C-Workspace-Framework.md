# ============================================================================
# BINDRA KNOWLEDGE HUB ERP
# Product V2
# Sprint 3
# Workspace Framework
# ============================================================================

STOP.

No audits.

No reports.

No markdown.

No TODO lists.

Write production-ready code only.

==============================================================================
MISSION
==============================================================================

The ERP currently has pages.

It should instead have WORKSPACES.

Create a reusable Workspace Framework that every module will inherit.

Examples

Students

Teachers

Academics

Finance

Reports

Administration

Settings

The framework must be generic and reusable.

==============================================================================

DO NOT MODIFY

Authentication

Database

Business Logic

API

Permissions

CRUD Logic

==============================================================================

CREATE

A reusable WorkspaceLayout component.

Every workspace must inherit this layout.

==============================================================================

WORKSPACE LAYOUT

Each workspace contains

------------------------------------------------

Workspace Header

↓

Workspace Description

↓

Primary Actions

↓

Secondary Navigation

↓

Filters

↓

Search

↓

Content

------------------------------------------------

No exceptions.

==============================================================================

WORKSPACE HEADER

Display

Title

Description

Last Updated (optional)

Status Badge

==============================================================================

PRIMARY ACTIONS

Display

Primary CTA

Secondary CTA

Export

Refresh

Actions Menu

These should be configurable.

==============================================================================

SECONDARY NAVIGATION

Do NOT use the sidebar.

Display navigation as

Tabs

or

Segmented Control

Examples

Students

Student List

Admissions

Transfers

Promotions

Documents

Academics

Sessions

Classes

Sections

Subjects

Batch Types

Batch Timings

Time Slots

Batches

Finance

Overview

Collections

Receipts

Outstanding

Fee Structures

Fee Categories

Administration

Users

Roles

Permissions

Audit

==============================================================================

SEARCH

Reusable global search component.

Sticky.

==============================================================================

FILTER BAR

Reusable.

Support

Dropdowns

Date Range

Status

Reset

Save Filters (future)

==============================================================================

CONTENT AREA

Every workspace supports

Table

Cards

Calendar

Timeline

Dashboard

depending on module.

==============================================================================

EMPTY STATE

Reusable.

Large Illustration

Description

Primary CTA

==============================================================================

ERROR STATE

Reusable.

Retry Button.

==============================================================================

LOADING

Reusable skeletons.

==============================================================================

RIGHT PANEL

Optional.

Can display

Details

Recent Activity

Notes

Quick Help

Future AI Assistant

Must collapse.

==============================================================================

WORKSPACE TYPES

Support

List Workspace

Dashboard Workspace

Calendar Workspace

Analytics Workspace

==============================================================================

DESIGN

The workspace should feel like

Notion

Linear

GitHub

ClickUp

==============================================================================

RESPONSIVENESS

Desktop

Tablet

Mobile

==============================================================================

OUTPUT

Replace the current workspace implementation.

Create reusable components.

Refactor existing pages to use them.

No reports.

No markdown.

Write code only.

Stop when the reusable Workspace Framework has been fully implemented.