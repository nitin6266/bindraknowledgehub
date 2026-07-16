# ERP Fix Log — Bindra Knowledge Hub

**Story:** BKH-ERP-STABILIZATION-001
**Sprint:** 8.5
**Date:** 2026-07-16

All changes keep `npm run build`, `npm run lint`, and `npm run typecheck` green.

---

## Problems Found

1. Sidebar linked to 6 non-existent routes (Teachers, Classes, Attendance, Reports, Notifications, Settings) → 404s.
2. 3 duplicate Batch Management nav items pointing to the same href.
3. `students/page.tsx` & `students/[id]/page.tsx` redirected to `/signin` (no such route) → 404 on unauthenticated access.
4. Dashboard layout guard only checked `admin`/`teacher`/`parent` prefixes; `/dashboard/finance/*` and other non-prefixed routes were not gated for wrong-role access.
5. Teacher dashboard used hardcoded palette colors (`bg-blue-500`, etc.) violating design tokens.
6. Status badges (`fee-status-badge`, `leave-status-badge`) used hardcoded amber/blue/red classes.
7. Duplicate `StatCard` in `features/finance` and `features/parent` with non-token `warning` tone.
8. Mixed page headers (hand-rolled `<h1>` vs `PageHeader`).
9. No `loading.tsx` route-level loading states anywhere in the ERP.
10. `admin/page.tsx` was a placeholder (heading only).
11. `teacher-dashboard-client.tsx` showed "Announcements coming soon" and a raw "Loading..." string.
12. `updateStudentAction` performed no input validation.
13. `teacher.updateAssignment`/`updateTest` had no ownership/authorization check.
14. `Batch.currentStrength` drifted — never updated on admission, transfer, or soft-delete.
15. Dead code: `services/auth.service.ts`, `repositories/base.repository.ts`, `parent.repository.getFeeSummary` stub.
16. `finance.actions.ts` bypassed the repository layer via dynamic `prisma` import (`prismaBatches()`).
17. `finance.repository.getFinanceReports` had a no-op session filter; `dueDate` had a dead expression.
18. Several ERP pages used raw `<a href>` for internal navigation (lint `@next/next/no-html-link-for-pages`).

---

## Problems Fixed

### Routes & Navigation
- **Created 6 real pages** so every nav item resolves:
  - `dashboard/teachers/page.tsx` — teacher list (SUPER_ADMIN/ADMIN, role-guarded).
  - `dashboard/classes/page.tsx` — classes with section counts (SUPER_ADMIN/ADMIN/TEACHER).
  - `dashboard/attendance/page.tsx` — recent attendance records overview.
  - `dashboard/reports/page.tsx` — operational metrics cards.
  - `dashboard/notifications/page.tsx` — announcements feed (all roles).
  - `dashboard/settings/page.tsx` — account settings hub linking to role profile.
- **De-duplicated** the 3 Batch Management items into a single "Batches" item (`nav-config.ts`).
- **Fixed `/signin` → `/login`** redirects in `students/page.tsx` and `students/[id]/page.tsx`, and upgraded them to proper `assertRole` guards + `PageHeader`.

### Authorization
- **Rewrote the dashboard layout guard** (`dashboard/layout.tsx`) to use `ROLE_ROUTES` and gate any path starting with a role prefix; unknown/unauthenticated users are redirected to `/login` or their default dashboard.

### UI Consistency
- Replaced **all hardcoded palette colors** with semantic tokens (`primary`, `success`, `warning`, `danger`, `info`, `accent`) across `teacher-dashboard-client.tsx`, `students-table.tsx`, `fee-status-badge.tsx`, `leave-status-badge.tsx`, `attendance-calendar.tsx`, `parent/attendance/page.tsx`, and two success messages.
- **Promoted a single shared `StatCard`** to `src/components/ui/stat-card.tsx`; the two feature copies now re-export it. Fixed the `warning` tone to use `bg-warning/15 text-warning`.
- Converted raw `<a href>` internal links to `next/link` in `teacher-dashboard-client.tsx` and `batches-table.tsx`.

### State & Polish
- **Added `loading.tsx`** at the `dashboard` segment and for `students`, `teacher`, `parent`, `finance`, `academic`, `admin` segments using the shared `PageLoader`.
- **Rebuilt `admin/page.tsx`** as a real operational dashboard with live stats and quick links.
- Replaced the teacher dashboard "coming soon" / "Loading..." placeholders with `EmptyState` and `Spinner`.

### Data Layer
- **Added `updateStudentSchema`** (Zod `.strict()`) and validated input in `updateStudentAction`.
- **Added ownership checks** to `teacher.updateAssignment`/`updateTest` (SUPER_ADMIN/ADMIN bypass; teachers can only edit their own records).
- **Fixed `Batch.currentStrength`** to increment on admission/allocation and decrement on soft-delete/transfer (`student.repository.ts`).
- **Removed dead code**: `services/auth.service.ts`, `repositories/base.repository.ts`, `parent.repository.getFeeSummary` stub.
- **Restored repository layering**: `finance.actions.ts` now uses `batchRepository.listOptions()` instead of a dynamic `prisma` import.
- **Fixed `getFinanceReports`** session filter (now filters payments by `studentFee.sessionId`) and removed a dead `dueDate` expression.

---

## Files Modified

- `src/features/dashboard/nav-config.ts`
- `src/app/(erp)/dashboard/layout.tsx`
- `src/app/(erp)/dashboard/students/page.tsx`
- `src/app/(erp)/dashboard/students/[id]/page.tsx`
- `src/app/(erp)/dashboard/teachers/page.tsx` (new)
- `src/app/(erp)/dashboard/classes/page.tsx` (new)
- `src/app/(erp)/dashboard/attendance/page.tsx` (new)
- `src/app/(erp)/dashboard/reports/page.tsx` (new)
- `src/app/(erp)/dashboard/notifications/page.tsx` (new)
- `src/app/(erp)/dashboard/settings/page.tsx` (new)
- `src/app/(erp)/dashboard/admin/page.tsx`
- `src/app/(erp)/dashboard/loading.tsx` (new) + `students/loading.tsx`, `teacher/loading.tsx`, `parent/loading.tsx`, `finance/loading.tsx`, `academic/loading.tsx`, `admin/loading.tsx` (new)
- `src/features/teacher/components/teacher-dashboard-client.tsx`
- `src/features/teacher/components/students-table.tsx`
- `src/features/teacher/components/batches-table.tsx`
- `src/features/teacher/components/marks-entry-client.tsx`
- `src/features/teacher/components/teacher-profile-form.tsx`
- `src/features/teacher/actions/teacher.actions.ts`
- `src/features/finance/components/fee-status-badge.tsx`
- `src/features/finance/actions/finance.actions.ts`
- `src/features/finance/components/stat-card.tsx` (now re-export)
- `src/features/parent/components/stat-card.tsx` (now re-export)
- `src/features/parent/components/leave-status-badge.tsx`
- `src/features/parent/components/attendance-calendar.tsx`
- `src/app/(erp)/dashboard/parent/attendance/page.tsx`
- `src/components/ui/stat-card.tsx` (new)
- `src/features/student/student.schemas.ts`
- `src/features/student/student.types.ts`
- `src/features/student/actions/student.actions.ts`
- `src/features/student/components/student-detail-client.tsx`
- `src/repositories/student.repository.ts`
- `src/repositories/parent.repository.ts`
- `src/repositories/batch.repository.ts`
- `src/repositories/finance.repository.ts`
- `src/services/auth.service.ts` (deleted)
- `src/repositories/base.repository.ts` (deleted)

---

## Remaining Issues

- **Announcement creation** is still read-only (no `createAnnouncementAction`). Viewing works via Notifications.
- **Plain-string foreign keys** (no DB-level FK/cascade) remain by prior-sprint design; application-level cleanup on delete is not enforced.
- **No `createdBy`/`updatedBy` audit columns** on models; `AuditLog` covers user mutations only.
- **Finance `status`/`mode` fields** are stored as `String` rather than the existing Prisma enums.
- **Duplicated `SortHeader` + TanStack scaffolding** (6 table components) — refactor candidate, not a defect.
- **Bare `catch {}`** in a few finance/parent actions masks the underlying error message.

---

## Recommendations

1. Implement `createAnnouncementAction`/`updateAnnouncementAction` (+ `announcement.repository`) to complete the announcements lifecycle.
2. Extract a shared `<DataTable>` (columns + search + filters + pagination + sort header + empty row) to remove ~1,000 lines of duplicated table code.
3. Standardize all status rendering on one `StatusBadge` built from design tokens; retire the per-module configs.
4. Add `createdBy`/`updatedBy` and convert finance enums to typed Prisma enums; add a partial unique index for "single ACTIVE session".
5. Replace bare `catch {}` blocks with the `err instanceof Error` pattern used elsewhere.
6. Decide on referential-integrity strategy for plain-string FKs (real `@relation` + cascade, or documented application-level cleanup).
