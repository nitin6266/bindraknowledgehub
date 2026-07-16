# ============================================================================
# BINDRA KNOWLEDGE HUB ERP
# Sprint 2 - Authentication & User Management
# Story ID: BKH-ERP-002
# ============================================================================

ROLE

You are the Principal Software Architect and Security Engineer.

Read AGENTS.md before making any changes.

Do NOT modify the project architecture.

Build only the Authentication and User Management module.

==============================================================================
MISSION
==============================================================================

Build a secure authentication and user management system.

This module will be the foundation of the ERP.

All future modules must use this authentication system.

==============================================================================

TECH STACK

Supabase Auth

Supabase PostgreSQL

Prisma

TypeScript

Next.js App Router

==============================================================================

ROLES

Create the following roles.

SUPER_ADMIN

ADMIN

TEACHER

PARENT

Roles must be stored in the database.

Implement role-based middleware.

==============================================================================

LOGIN

Implement

/login

Features

Email

Password

Remember Me

Forgot Password

Show Password

Validation

Loading State

Error Handling

Redirect based on role.

==============================================================================

LOGOUT

Secure logout.

Clear session.

Redirect to login.

==============================================================================

SUPER ADMIN

Create User Management.

SUPER_ADMIN can

Create Admin

Create Teacher

Create Parent

Reset Password

Disable User

Enable User

Search Users

Filter Users

Edit User

Delete User (Soft Delete)

==============================================================================

ADMIN

ADMIN can

Create Teacher

Create Parent

Edit Teacher

Edit Parent

Reset Password

Disable User

Cannot create SUPER_ADMIN.

==============================================================================

TEACHER

Can only

Login

View own profile

Update profile

Change password

==============================================================================

PARENT

Can only

Login

View own profile

Change password

==============================================================================

USER PROFILE

Fields

First Name

Last Name

Email

Phone

Gender

Profile Photo

Status

Role

Created Date

Updated Date

==============================================================================

DATABASE

Create Prisma models.

User

Role

UserProfile

AuditLog

Soft Delete support.

UUID primary keys.

==============================================================================

AUDIT LOG

Track

Login

Logout

User Created

User Updated

Password Reset

Status Changed

==============================================================================

SECURITY

Use Supabase Auth.

Do not store passwords.

Implement protected routes.

Role-based authorization.

==============================================================================

UI

Build

User List

Create User Dialog

Edit User Dialog

View Profile

Profile Menu

Change Password Dialog

Deactivate Confirmation

==============================================================================

SEARCH

Search by

Name

Email

Role

Status

==============================================================================

FILTERS

Role

Status

==============================================================================

TABLE

Use TanStack Table.

Sorting

Filtering

Pagination

Column Visibility

==============================================================================

VALIDATION

React Hook Form

Zod

==============================================================================

OUTPUT

Provide

Updated Project Tree

Database Models

Authentication Flow

Role Matrix

==============================================================================

STOP

Do NOT build

Students

Classes

Sessions

Attendance

Assignments

Fees

Tests

Reports

Only complete Authentication & User Management.