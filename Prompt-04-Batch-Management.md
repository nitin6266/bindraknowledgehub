# ============================================================================
# BINDRA KNOWLEDGE HUB ERP
# Sprint 4 - Batch Management
# Story ID: BKH-ERP-004
# ============================================================================

ROLE

You are the Principal ERP Architect and School Management Domain Expert.

Read AGENTS.md before making any changes.

Do NOT modify Authentication or Academic Master Data.

Build only the Batch Management module.

==============================================================================
MISSION
==============================================================================

Create a flexible Batch Management system.

A Batch is the core academic entity that connects

Academic Session

↓

Class

↓

Section

↓

Subjects

↓

Teacher

↓

Students

↓

Attendance

↓

Assignments

↓

Tests

↓

Fees

Design this module so future ERP features can plug into it.

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

1. Batch Management

2. Batch Schedule

3. Teacher Assignment

4. Subject Assignment

==============================================================================

BATCH

Fields

Batch Name

Batch Code

Academic Session

Class

Section

Batch Type

Offline / Online / Hybrid

Capacity

Current Strength

Status

Active

Inactive

Completed

Archived

Description

==============================================================================

BATCH SCHEDULE

Each Batch supports multiple weekly schedules.

Fields

Day

Monday

Tuesday

Wednesday

Thursday

Friday

Saturday

Sunday

Time Slot

Start Time

End Time

Room (Optional)

==============================================================================

TEACHER ASSIGNMENT

Assign one Primary Teacher.

Support additional Subject Teachers.

Maintain assignment history.

==============================================================================

SUBJECT ASSIGNMENT

Assign multiple subjects to the batch.

Each subject can have

Assigned Teacher

Weekly Hours

Display Order

==============================================================================

VALIDATIONS

Batch Code must be unique.

Capacity cannot be less than current strength.

Teacher cannot be assigned twice.

No duplicate schedules.

No overlapping timings for the same batch.

==============================================================================

CRUD

Support

Create

View

Edit

Archive

Soft Delete

Clone Batch

==============================================================================

SEARCH

Search by

Batch Name

Teacher

Class

Section

Session

==============================================================================

FILTERS

Academic Session

Class

Teacher

Status

Batch Type

==============================================================================

TABLES

Use TanStack Table

Sorting

Filtering

Pagination

Column Visibility

==============================================================================

DASHBOARD CARDS

Display

Total Batches

Active Batches

Offline Batches

Online Batches

Total Students (Placeholder)

==============================================================================

DATABASE MODELS

Create

Batch

BatchSchedule

BatchTeacher

BatchSubject

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

Read Assigned Batches Only

PARENT

No Access

==============================================================================

NAVIGATION

Academic Management

    Batch Management

        Batch List

        Batch Schedule

        Teacher Assignment

==============================================================================

UI

Create

Batch List

Batch Details

Create Batch

Edit Batch

Teacher Assignment

Subject Assignment

Weekly Schedule Editor

Archive Confirmation

==============================================================================

OUTPUT

Provide

Updated Project Tree

Database Schema

Entity Relationship Summary

Navigation Structure

==============================================================================

STOP

Do NOT build

Student Management

Attendance

Assignments

Tests

Marks

Fees

Parent Portal

Teacher Portal

Only complete Batch Management.