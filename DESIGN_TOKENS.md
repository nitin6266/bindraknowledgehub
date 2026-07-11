# DESIGN_TOKENS.md — Bindra Knowledge Hub

> Story `BKH-DS-001` (Prompt-02A-Design-Tokens)
> Author: Design System Architect · Source of truth: `AGENTS.md`
> Scope: design foundation only — no pages, no business logic, no homepage sections.

This document defines the **scalable Design Token system** for Bindra Knowledge Hub.
Every visual decision in the product must originate from these tokens. There are
**no magic numbers, no hardcoded colors, and no hardcoded spacing** anywhere in the app.

---

## 1. Where tokens live (two synchronized layers)

| Layer | Path | Role |
| --- | --- | --- |
| **TS tokens (authoring)** | `src/design-system/tokens/*` | Canonical, typed definitions consumed by TS/TSX (Tailwind config, Framer Motion, charts, SVG). |
| **CSS variables (runtime)** | `src/styles/tokens.css` | Compiled values that drive Tailwind utilities and enable `.dark` mode via variable overrides. |

The TS modules are the *documented* source. The CSS file mirrors them so that:
- Tailwind classes (`bg-primary`, `text-muted-foreground`, `shadow-lg`…) read CSS variables;
- Dark mode is a single `.dark { --primary: … }` override, not duplicated code;
- Non-Tailwind code (animation, data-viz) imports the TS tokens directly.

`tailwind.config.ts` now **imports** the token modules — so the config contains zero
hardcoded values. Color roles stay on CSS variables (required for dark mode); radius,
shadow, duration, easing and breakpoints are injected straight from the TS tokens.

### File map
```text
src/design-system/tokens/
├─ colors.ts        # brand + gold scales, semantic colors, dark overrides, hsl() helper
├─ typography.ts    # fluid Hero/H1–H4/Body/Caption/Button/Quote scale
├─ spacing.ts       # 8pt grid
├─ radius.ts        # centralized corner radii
├─ shadow.ts        # xs → xl + glow + glass
├─ motion.ts        # duration, easing, hover, focus, reduced-motion
├─ breakpoints.ts   # mobile → ultraWide + media-query strings
├─ zIndex.ts        # stacking layers
├─ opacity.ts       # discrete opacity steps
├─ transitions.ts   # composed transition presets
└─ index.ts         # single barrel: `import { tokens } from "@/design-system/tokens"`
```

---

## 2. Color tokens — decision & rationale

**Brand personality target:** Warm · Professional · Trustworthy · Premium · Family Driven · Hopeful.
We rejected cold blues (corporate/clinical) and avoided loud primaries. Instead:

- **`brand` (bronze) scale 50→900** — a grounded, earthy bronze. It reads as *trustworthy
  and premium* without the sterility of slate. `primary` = `brand-600` (`24 65% 38%`):
  dark enough for AA contrast on ivory, warm enough to feel human.
- **`gold` scale** — a hopeful, celebratory accent (`accent` = `gold-500`). Used for
  highlights, badges, and CTA glows so success/story moments feel rewarding.
- **Surface = ivory `40 33% 98%`** (not pure white) — calmer, premium reading background;
  `card`/`popover` are pure white to lift content off the surface.

### Semantic roles (no raw hues in components)
`background, foreground, surface, card, cardForeground, popover, popoverForeground,
primary, primaryForeground, secondary, secondaryForeground, accent, accentForeground,
muted, mutedForeground, border, input, ring, success, warning, danger, destructive`.

| Role | Decision | Why |
| --- | --- | --- |
| `primary` | bronze `brand-600` | Brand anchor, AA on ivory. |
| `accent` | gold `gold-500` | Hopeful highlight / CTA glow. |
| `success` | green `142 55% 38%` | Conventional positive signal. |
| `warning` | amber `38 92% 50%` | Attention without alarm. |
| `danger` | red `0 72% 48%` | Errors/destructive actions. `destructive` aliases it for shadcn compatibility. |
| `muted` / `mutedForeground` | soft tint + 42% L text | Secondary text, AA on surface. |
| `border` / `input` | `30 20% 86%` | Low-contrast separators; invisible but present. |
| `ring` | `brand-500` | Focus ring matches brand, not default blue. |
| `surface` | `40 30% 95%` | Section bands distinct from page background. |
| `popover` | white + foreground | Menus, tooltips, dropdowns. |

**Dark mode ready:** `darkSemanticColors` overrides only the shifting roles; `colors.dark`
mirrors the `.dark` block in `tokens.css`. Switching themes is a one-line variable change.

---

## 3. Typography — fluid & responsive

Built on **`clamp()`** so every step scales with the viewport (no fixed px jumps),
mobile-first and premium on large screens. Two font roles are wired via `next/font`:
`--font-heading` (Plus Jakarta Sans) for display/headings, `--font-sans` (Inter) for
body/UI, with a `--font-serif` (Fraunces) reserve for editorial accents.

| Role | Size (clamp) | Line-height | Tracking | Weight |
| --- | --- | --- | --- | --- |
| `hero` | 2.75→4.75rem | 1.04 | -0.02em | bold |
| `h1` | 2.25→3.5rem | 1.10 | -0.02em | bold |
| `h2` | 1.875→2.75rem | 1.15 | -0.015em | semibold |
| `h3` | 1.5→2rem | 1.25 | -0.01em | semibold |
| `h4` | 1.25→1.5rem | 1.35 | -0.005em | semibold |
| `body` | 1rem | 1.7 | 0 | normal |
| `caption` | 0.8125rem | 1.5 | +0.01em | normal |
| `button` | 1rem | 1.0 | 0 | medium |
| `quote` | 1.25→1.75rem | 1.45 | -0.01em | medium |

**Decisions:** tight negative tracking on large headings (modern, premium); generous
1.7 body line-height (accessible, calm); `body` fixed at 1rem (legibility floor on mobile).

---

## 4. Spacing — 8pt grid

Base unit **8px (0.5rem)**; every value is a multiple of 4px (half-step) or 8px.
This produces rhythmic, predictable layouts and avoids arbitrary paddings.

`none(0) · xs(4) · sm(8) · md(12) · lg(16) · xl(24) · 2xl(32) · 3xl(40) · 4xl(48) ·
5xl(64) · 6xl(80) · 7xl(96) · 8xl(128)` — plus `px(2)` for hairline gaps.
`spacingScale` exports the numeric rem array for charts/grid math.

---

## 5. Radius — centralized

`sm .375 · md .625 · lg 1 · xl 1.5 · 2xl 2 · full 9999px`. Warm, soft corners;
`md` is the default control radius, `full` drives pills/avatars. No component sets a
raw `border-radius`.

---

## 6. Shadow — elevation

Soft, **warm-tinted** (hsl `24 12% 12%`) low-contrast shadows keep the UI premium and
calm, not heavy.

`xs` (hairline) → `sm` → `md` → `lg` → `xl` (deep lift) · `glow` (accent ring + halo for
primary highlights) · `glass` (frosted inset highlight + soft drop for sticky/overlay bars).

---

## 7. Motion — calm & purposeful

- **Duration:** `instant 0 · fast 150ms · normal 300ms · slow 600ms`. Short by design.
- **Easing:** `softOut` (entrances), `softIn` (exits), `standard` (in/out). Material-style curves.
- **Hover / Focus:** composed transition strings (`transform+shadow`, `outline+ring`) so
  every interactive element animates identically.
- **Reduced motion:** `reducedMotion` flag + global `prefers-reduced-motion` rule in
  `tokens.css` collapses all animation to ~0ms. Framer Motion wrappers also honor it.

---

## 8. Breakpoints — mobile-first

`mobile 0 · tablet 640 · laptop 1024 · desktop 1280 · ultraWide 1536` (px). `screens`
exposes ready-made `min-width` media strings. Tailwind's `screens` is fed from these so
no component hardcodes a width.

---

## 9. zIndex — no stacking wars

`base 0 · dropdown 1000 · sticky 1100 · header 1200 · overlay 1300 · modal 1400 ·
popover 1500 · tooltip 1600 · toast 1700`. Every overlay references a named layer.

---

## 10. Opacity & Transitions

- **Opacity:** discrete `0→100` steps (5% increments) for scrims, disabled states, tints.
- **Transitions:** named presets — `base`, `colors`, `transform`, `fast`, `emphasis` —
  composed from `duration` + `easing`, so motion stays consistent everywhere.

---

## 11. Usage

```ts
import { tokens, colors, spacing, radius } from "@/design-system/tokens";

// In TS (e.g. Framer Motion, charts, inline SVG):
const c = colors.hsl(colors.semantic.primary);          // hsl(24 65% 38%)
const gap = spacing.lg;                                  // "1rem"

// In components: use Tailwind utilities backed by the same tokens
// <section className="bg-surface text-foreground shadow-md rounded-lg">
```

Runtime theme (CSS variables) is consumed via Tailwind classes; dark mode via `.dark`.

---

## 12. Verification

```text
npm run typecheck   # ✅ passes
npm run lint        # ✅ passes
npm run build       # ✅ compiles; tokens wired into tailwind.config.ts
```

**Deliverable complete. Stopping here per the story brief — no further sprint work.**
