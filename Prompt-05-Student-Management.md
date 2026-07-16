# ============================================================================
# BINDRA KNOWLEDGE HUB ERP
# Sprint 5 - Student Management
# Story ID: BKH-ERP-005
# ============================================================================

ROLE

You are the Principal ERP Architect and School Management Domain Expert.

Read AGENTS.md before making any changes.

Do NOT modify previous modules.

Build only the Student Management module.

==============================================================================
MISSION
==============================================================================

Build a complete Student Management module.

This module will manage student admissions, parent accounts, batch
allocation and student records.

Every student must belong to one Academic Session, one Class and one
Batch.

Every student must have at least one Parent account.

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

1. Student Admission

2. Student Profile

3. Parent Account Creation

4. Batch Allocation

5. Student Documents

6. Emergency Contact

7. Medical Information

8. Student Promotion

9. Student Transfer

==============================================================================

STUDENT PROFILE

Fields

Admission Number (Auto Generate)

Roll Number

First Name

Last Name

Gender

Date of Birth

Blood Group

Profile Photo

Address

City

State

Country

Pincode

Status

Active

Inactive

Left

Graduated

==============================================================================

ACADEMIC DETAILS

Academic Session

Class

Section

Batch

Admission Date

==============================================================================

PARENT DETAILS

Primary Parent

Father Name

Mother Name

Guardian Name (Optional)

Relationship

Mobile Number

Email

Address

==============================================================================

PARENT LOGIN

Automatically create Parent account.

Generate

Username

Temporary Password

Force password change on first login.

Allow multiple students to be linked to one parent account.

==============================================================================

EMERGENCY CONTACT

Contact Name

Relationship

Phone Number

==============================================================================

MEDICAL INFORMATION

Medical Conditions

Allergies

Special Notes

==============================================================================

DOCUMENT MANAGEMENT

Upload

Birth Certificate

Student Photograph

Previous School Record

Transfer Certificate

Identity Proof

Store in Supabase Storage.

==============================================================================

BATCH MANAGEMENT

Assign Batch

Change Batch

Transfer Batch

Maintain history.

==============================================================================

PROMOTION

Promote students to next Academic Session.

Support bulk promotion.

==============================================================================

TRANSFER

Move student to another batch.

Maintain transfer history.

==============================================================================

SEARCH

Admission Number

Student Name

Parent Name

Phone

Batch

==============================================================================

FILTERS

Session

Class

Batch

Status

==============================================================================

CRUD

Create

View

Edit

Deactivate

Archive

Soft Delete

==============================================================================

TABLES

Use TanStack Table

Sorting

Filtering

Pagination

Column Visibility

==============================================================================

DASHBOARD

Display

Total Students

New Admissions

Active Students

Inactive Students

==============================================================================

DATABASE MODELS

Create

Student

StudentParent

StudentDocument

EmergencyContact

MedicalInformation

StudentBatchHistory

StudentPromotionHistory

StudentTransferHistory

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

View Own Child Only

==============================================================================

NAVIGATION

Student Management

Students

Admissions

Documents

Promotions

Transfers

==============================================================================

UI

Student List

Student Details

Admission Wizard

Parent Details

Batch Assignment

Documents Upload

Promotion Wizard

Transfer Wizard

==============================================================================

VALIDATION

React Hook Form

Zod

==============================================================================

OUTPUT

Provide

Updated Project Tree

Database Schema

Entity Relationship Diagram Summary

Navigation Structure

==============================================================================

STOP

Do NOT build

Attendance

Assignments

Tests

Marks

Fees

Teacher Portal

Parent Portal

Only complete Student Management.