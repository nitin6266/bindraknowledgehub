# ============================================================================
# BINDRA KNOWLEDGE HUB ERP
# Sprint 8 - Finance & Fee Management
# Story ID: BKH-ERP-008
# ============================================================================

ROLE

You are the Principal ERP Architect, Finance Systems Designer and School
Management Domain Expert.

Read AGENTS.md before making any changes.

Do NOT modify previous modules.

Build only the Finance & Fee Management module.

==============================================================================
MISSION
==============================================================================

Build a complete Fee Management system.

The system should support flexible fee structures, discounts,
installments, payment tracking and outstanding balances.

Parents should be able to view fee status from their portal.

Teachers should NOT have access to financial information.

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

1. Fee Structure

2. Fee Categories

3. Student Fee Assignment

4. Discounts & Scholarships

5. Installment Plans

6. Fee Collection

7. Receipt Generation

8. Outstanding Fee Dashboard

9. Fee Reports

==============================================================================

FEE CATEGORIES

Support

Admission Fee

Monthly Tuition

Quarterly Fee

Annual Fee

Lab Fee

Exam Fee

Study Material

Transport (Future)

Other Charges

==============================================================================

FEE STRUCTURE

Fields

Academic Session

Class

Batch (Optional)

Fee Category

Amount

Due Date

Late Fee Rules

Status

==============================================================================

STUDENT FEE ASSIGNMENT

Assign fee structure to

Single Student

Entire Batch

Entire Class

Entire Session

Support bulk assignment.

==============================================================================

DISCOUNTS

Support

Sibling Discount

Merit Scholarship

Special Discount

Custom Discount

Fixed Amount

Percentage

Approval Required

==============================================================================

INSTALLMENTS

Support

Monthly

Quarterly

Custom Installments

Each installment has

Due Date

Amount

Status

==============================================================================

FEE COLLECTION

Record payments.

Payment Modes

Cash

UPI

Bank Transfer

Cheque

Online (Future)

Fields

Receipt Number

Transaction Reference

Collected By

Payment Date

Remarks

==============================================================================

RECEIPTS

Generate printable receipt.

Receipt Number

Student Details

Parent Details

Fee Breakdown

Discount

Paid Amount

Balance

Academy Information

PDF Ready

==============================================================================

OUTSTANDING FEES

Dashboard Cards

Total Outstanding

Collected This Month

Overdue Students

Upcoming Due Fees

==============================================================================

REPORTS

Collection Report

Outstanding Report

Discount Report

Payment History

Student Ledger

==============================================================================

SEARCH

Student

Admission Number

Parent Name

Receipt Number

==============================================================================

FILTERS

Session

Class

Batch

Fee Category

Payment Status

Date Range

==============================================================================

TABLES

TanStack Table

Sorting

Filtering

Pagination

Export Ready

==============================================================================

DATABASE MODELS

Create

FeeCategory

FeeStructure

StudentFee

StudentFeeInstallment

FeeDiscount

FeePayment

FeeReceipt

FeeLedger

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

No Access

PARENT

View Own Child Fees Only

==============================================================================

NAVIGATION

Finance

Fee Categories

Fee Structures

Student Fees

Fee Collection

Receipts

Outstanding Fees

Reports

==============================================================================

UI

Fee Dashboard

Fee Structure Wizard

Student Fee Assignment

Fee Collection Screen

Receipt Viewer

Outstanding Dashboard

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

Finance Workflow

==============================================================================

STOP

Do NOT implement

Online Payment Gateway

SMS

WhatsApp Reminders

Accounting Integration

GST

Payroll

Only complete the Fee Management module.