# ERP Audit Report — Bindra Knowledge Hub

**Story:** BKH-ERP-STABILIZATION-001
**Sprint:** 8.5 — ERP Stabilization & Production Readiness
**Date:** 2026-07-16
**Scope:** `src/app/(erp)` ERP, supporting features, repositories, services, actions, schemas.
**Baseline status:** `npm run build`, `npm run lint`, `npm run typecheck` all passed before changes.

---

## 1. Executive Summary

The ERP is a substantial, working Next.js 15 (App Router) + Prisma application covering Auth, Users, Students, Academic Master Data, Batches, Teachers, Parents and Finance. The foundation is solid: build/lint/typecheck were green, role-based navigation exists, and CRUD/server actions are largely implemented with Zod validation.

The audit identified issues in five categories: **broken navigation** (dead routes + a broken `/signin` redirect), **authorization gaps** (layout guard did not cover non-role-prefixed routes like `/dashboard/finance`), **UI inconsistency** (hardcoded palette colors, duplicated components, mixed page headers), **placeholder/unfinished surfaces** (admin dashboard, announcements "coming soon"), and **data-layer correctness bugs** (unvalidated updates, missing ownership checks, `currentStrength` drift, dead code).

All critical and high-priority issues have been fixed. Medium-priority UI polish and remaining low-priority schema hardening items are documented in the Fix Log and Recommendations.

---

## 2. Architecture Issues

- **Layout role guard was incomplete.** `src/app/(erp)/dashboard/layout.tsx` only redirected when a path started with `/dashboard/admin`, `/dashboard/teacher` or `/dashboard/parent`. Routes such as `/dashboard/finance/*`, `/dashboard/students`, `/dashboard/academic/*` were protected only by per-page `assertRole` — but several pages had **no** guard at all, and a non-matching role could reach a wrong-prefix page if it bypassed the prefix check.
- **Repository-vs-action layering violated.** `finance.actions.ts` dynamically imported `@/database/prisma` to query batches (`prismaBatches()`) instead of using `batchRepository`.
- **Dead code.** `src/services/auth.service.ts` (entire `authService`) had zero importers; `src/repositories/base.repository.ts` (`BaseRepository` abstract class) was never extended; `parent.repository.getFeeSummary()` was a zero-returning stub never called by the action.

## 3. Broken Features

- **Broken redirect target.** `students/page.tsx` and `students/[id]/page.tsx` called `redirect("/signin")`, but no `/signin` route exists (only `/login`). Unauthenticated or role-less access produced a 404 instead of sending the user to login.
- **Dead navigation items.** The sidebar exposed links to `/dashboard/teachers`, `/dashboard/classes`, `/dashboard/attendance`, `/dashboard/reports`, `/dashboard/notifications`, `/dashboard/settings`, and 8 `academic/[module]` links — none of which had route files, producing 404s. (The `academic/[module]` page *does* exist; the audit's initial scan was corrected on verification.)
- **Duplicate sidebar items.** "Batch List", "Batch Schedule" and "Teacher Assignment" all pointed to `/dashboard/academic/batch`.

## 4. Missing Features (at audit time)

- No dedicated routes/pages for Teachers, Classes, Attendance overview, Reports, Notifications, or Settings — even though the nav linked to them.
- No `createAnnouncementAction`/`updateAnnouncementAction` — `Announcement` was readable but not writable through server actions.

## 5. Design Problems

- **Hardcoded palette colors** violated the design-token mandate: `teacher-dashboard-client.tsx` (`bg-blue-500`, `bg-green-500`, `bg-amber-500`, `bg-purple-500`, `bg-red-500`, `bg-blue-100`, etc.), `students-table.tsx` (`text-green-600/amber/red`), `fee-status-badge.tsx` (`bg-amber-50 text-amber-700`…), `leave-status-badge.tsx`, `attendance-calendar.tsx` (`bg-amber-100/300`), `parent/attendance/page.tsx` (`text-amber-600`), and two `text-green-600` success messages.
- **Inconsistent status chips.** Finance, Parent, and Teacher/Admin each implemented status styling differently; the shared `Chip`/`Pill` primitives were unused for status.
- **Duplicated `StatCard`** (byte-identical in `features/finance` and `features/parent`) with a non-token `warning` tone.
- **Mixed page headers** — some pages used `PageHeader`, others hand-rolled `<h1>`.

## 6. Performance Concerns

- No `loading.tsx` files existed anywhere under `(erp)`; all pages are `force-dynamic` and fetch server-side with no streaming fallback, showing a blank screen until full render.
- Minor: the `SortHeader` helper was duplicated 6× across table components (left as-is; tracked as a future refactor — see Recommendations).

## 7. Security Concerns

- **Layout guard bypass** for `/dashboard/finance/*` and other non-prefixed routes (see §2).
- **Missing ownership checks.** `teacher.updateAssignment`/`updateTest` accepted any id with no verification that the record belonged to the authenticated teacher.
- Plain-string foreign keys (Sprints 4–8 design) mean **no DB-level referential integrity / cascade** for `teacherId`, `parentId`, `studentId`, `sessionId`, `classId`, `batchId`, `subjectId`. Documented as a deliberate trade-off; not changed in stabilization.

## 8. Code Duplication

- 6× `SortHeader` helper; TanStack table scaffolding repeated across 6 table components.
- `nameMap`/`batchNameMap`/`userNameMap`/`fullName` duplicated across 5 repositories.
- 2× `StatCard`; 2 status-badge configs.

---

## 9. Role Dashboard Coverage (verified)

| Role | Dashboard route | Status |
|------|----------------|--------|
| SUPER_ADMIN | `/dashboard/admin` | Real (shares Admin dashboard with operational stats) |
| ADMIN | `/dashboard/admin` | Real, rebuilt with live stats + quick links |
| TEACHER | `/dashboard/teacher` | Real (client dashboard, loading + empty states added) |
| PARENT | `/dashboard/parent` | Real (existing) |

Every role's navigation now resolves to a real, guarded page.
