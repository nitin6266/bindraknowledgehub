---
name: erp-ui-booster
description: Improve the ERP UI
compatibility: opencode
---

## Tailwind CSS Enterprise Rules

### 1. Modern Dashboard & Card Design
- Replace sharp, heavy-bordered sections with clean, minimalist enterprise containers.
- Use a soft, elegant base structure for dashboard metrics: `bg-white dark:bg-slate-900 rounded-xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm p-6`.
- Elevate text hierarchy: Titles should be small and muted (`text-xs font-medium text-slate-500 uppercase tracking-wider`), and metrics should be bold and prominent (`text-3xl font-semibold tracking-tight text-slate-900`).

### 2. Dense ERP Data Tables
- Convert raw, cluttered rows into highly readable data grids.
- Header Style: `bg-slate-50/70 dark:bg-slate-800/50 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider border-b border-slate-200`.
- Row Style: `hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors border-b border-slate-100`.
- Text Truncation: Use `truncate max-w-[200px]` with clear tooltips on data cells to prevent text wrapping from breaking column alignments.

### 3. Sleek Form Elements
- Standardize all text inputs, selects, and textareas to a unified, premium look:
  `w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all`.
- Primary Button: `inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500/20 transition-all active:scale-[0.98]`.

### 4. Dynamic Layout Controls
- Sidebars must leverage fixed widths (`w-64`) with smooth flex alignments (`flex flex-col h-screen border-r border-slate-200`).
- Use Tailwind's arbitrary values or color opacity shifts (e.g., `bg-indigo-50 text-indigo-700` or `indigo-600/10`) to create beautiful, clear "Active State" navigation buttons instead of using glaring, fully saturated backgrounds.
