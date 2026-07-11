# COMPONENT_LIBRARY.md — Bindra Knowledge Hub

> Sprint 2B · Role: Component Architect (Prompt-04-Core-Components)
> Source of truth: `AGENTS.md`, `DESIGN_SYSTEM.md`, `DESIGN_TOKENS.md`
> Scope: **reusable UI primitives only** — no pages, no forms, no navigation, no feature components.

This library is the shared foundation every Bindra Knowledge Hub page consumes. Every
component is **token-driven** (`@/design-system/tokens`), **fully typed** (no `any`),
**accessible** (WCAG AA, keyboard + ARIA), **responsive** (mobile-first from 320px),
**dark-mode ready** (`.dark` overrides CSS variables) and **animation-light**
(reduced-motion aware). Stories live next to each component as `*.stories.tsx`
(Storybook 10, autodocs enabled).

---

## Conventions

- **Variants / sizes**: `class-variance-authority` (`cva`) + `VariantProps`. `variant` first, then `size`.
- **Merging**: `cn()` (clsx + tailwind-merge); `className` is always the last prop, never a style prop.
- **Imports**: absolute `@/*` aliases only.
- **No hardcoded values**: colors, spacing, radius, shadow and motion all come from design tokens.
- **Polymorphism**: primitives accept `as` / `asChild` (Radix `Slot`) where semantic HTML matters.

---

## 1. Button — `src/components/ui/button.tsx`

**Purpose**: Primary call-to-action and every interactive action across the site. Anchors
the brand bronze and drives conversions (every page section ends in a Button CTA).

**Variants**: `primary` · `secondary` · `outline` · `ghost` · `accent` · `cta` · `destructive` · `link`
**Sizes**: `sm` (h-10) · `md` (h-11) · `lg` (h-12) · `icon` (h-11 w-11)

**Props**

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| `variant` | ButtonVariant | `"primary"` | Visual intent |
| `size` | ButtonSize | `"md"` | Touch-target height |
| `loading` | `boolean` | `false` | Shows spinner, sets `aria-busy`, blocks clicks |
| `asChild` | `boolean` | `false` | Render as child element via `Slot` (e.g. link styled as button) |
| `disabled` | `boolean` | `false` | `disabled` + `loading` both block interaction |

**Example**

```tsx
<Button variant="cta" size="lg">Enquire now</Button>
<Button variant="outline" asChild><a href="/admissions">Apply</a></Button>
<Button loading>Submitting…</Button>
```

**Accessibility**: native `<button>` (or `Slot`); visible `focus-visible` ring in brand color;
`aria-busy` while loading; `disabled` blocks pointer + keyboard; `&_svg` sized 16px.

**Best practices**: Use `cta` for the single highest-intent action per view; prefer `asChild`
with a real `<a>` for navigation; never disable without an explanation nearby.

---

## 2. Typography — `src/components/typography` & `src/components/ui/heading.tsx`

All built on the fluid `clamp()` type scale in `DESIGN_TOKENS.md`.

### 2.1 Heading — `ui/heading.tsx`

**Purpose**: Semantic section/display headings paired with the type scale.

**Props**: `as` (`h1`–`h6`, default `h2`) · `size` (`display`/`xl`/`lg`/`md`/`sm`) · `tone` (`default`/`muted`/`primary`/`accent`) · `align`.

```tsx
<Heading as="h1" size="display">Why families trust us</Heading>
```

### 2.2 Subheading — `typography/subheading.tsx`

**Purpose**: Lead text under a heading (calm, `text-body-lg`, muted). Props: `align`.

### 2.3 Paragraph — `typography/paragraph.tsx`

**Purpose**: Body copy. Props: `size` (`sm`/`base`/`lg`, default `base`).

### 2.4 Quote — `typography/quote.tsx`

**Purpose**: Editorial pull-quote / testimonial. Props: `author`.

### 2.5 Label — `typography/label.tsx` *(added in Sprint 2B)*

**Purpose**: Uppercase, tracked form/section label. Renders a real `<label>` when `htmlFor`
is provided; otherwise a presentational `<span>`.

**Props**: `size` (`sm`/`md`/`lg`, default `sm`) · `tone` (`default`/`primary`/`accent`) · `htmlFor`.

```tsx
<Label htmlFor="name">Full name</Label>
<Label>Trending courses</Label> {/* presentational span */}
```

### 2.6 Caption — `typography/caption.tsx` *(added in Sprint 2B)*

**Purpose**: Small supporting text — metadata, footnotes, image credits.

**Props**: `tone` (`muted`/`default`/`primary`/`accent`, default `muted`) · `align`.

```tsx
<Caption>Results published after the final term examination.</Caption>
```

**Accessibility**: Headings use real tags + `size` for visuals only (meaning not size-dependent);
Label associates with controls via `htmlFor`; Caption is decorative supporting text.

**Best practices**: One `h1` per page; never skip heading levels; never convey meaning by
color/size alone; pair Captions with the content they describe.

---

## 3. Layout — `src/components/ui` & `src/components/layout`

### 3.1 Container — `ui/container.tsx`

**Purpose**: Centered, max-width wrapper (`max-w-container` = 1280px) with responsive padding.

```tsx
<Container>…</Container>
```

### 3.2 Section — `ui/section.tsx`

**Purpose**: Vertical rhythm wrapper applying `py-section-y-sm lg:py-section-y` (token-driven).
Props: `as` (default `section`).

### 3.3 Stack — `layout/stack.tsx`

**Purpose**: Vertical flex stack with consistent spacing. Props: `gap` (`xs`–`xl`) · `align` · `justify`.

### 3.4 Grid — `layout/grid.tsx`

**Purpose**: Mobile-first auto-collapsing grid. Props: `cols` (1–4) · `gap` (`sm`/`md`/`lg`).

```tsx
<Grid cols={3} gap="lg">{cards}</Grid>
```

### 3.5 Divider — `layout/divider.tsx`

**Purpose**: Accessible separator. Props: `orientation` (`horizontal`/`vertical`) · `label` (renders a labeled `role="separator"`).

### 3.6 Surface — `layout/surface.tsx`

**Purpose**: Elevated panel primitive. Props: `tone` (`surface`/`card`/`muted`/`transparent`) · `border` · `shadow` (`none`/`sm`/`md`/`lg`/`glass`) · `radius`.

**Accessibility**: Divider uses `role="separator"` + `aria-orientation`/`aria-label`; Surface is a
generic `<div>` (add landmarks at the section level).

**Best practices**: Prefer `Container` for page width; use `Section` for vertical rhythm instead
of ad-hoc margins; `Surface` is the building block for cards/banners — compose, don't fork.

---

## 4. Feedback — `src/components/ui` & `src/components/utility`

### 4.1 Badge — `ui/badge.tsx`

**Purpose**: Small static status label. Variants: `default` (brand) · `accent` · `outline` · `success`.

### 4.2 Pill — `ui/pill.tsx`

**Purpose**: Compact status chip with an optional status dot. Variants: `neutral`/`primary`/`accent`/`success`/`warning`/`danger`; prop `showDot`.

### 4.3 Chip — `ui/chip.tsx` *(added in Sprint 2B)*

**Purpose**: Compact, optionally interactive chip for filters, tags and selections. Distinct from
Pill: supports a **leading icon** and an **accessible dismiss (×) button**.

**Variants**: `default` · `accent` · `outline` · `success` · `warning` · `danger`
**Props**: `icon` (`ReactNode`) · `onDismiss` (`() => void`) · `dismissLabel` (required with `onDismiss`) · `selected` (focus ring).

```tsx
<Chip variant="accent" icon={<Star />}>Top rated</Chip>
<Chip onDismiss={() => remove(tag)} dismissLabel={`Remove ${tag}`}>{tag}</Chip>
```

**Accessibility**: dismiss button is keyboard reachable with `aria-label`; icon is `aria-hidden`;
focus-visible ring on both chip (`selected`) and button.

### 4.4 Callout — `utility/callout.tsx`

**Purpose**: Inline note inside content flow (distinct from Banner). Variants: `info`/`warning`/`success`/`danger`; prop `title`. Includes a semantic status icon (`aria-hidden`).

### 4.5 Banner — `ui/banner.tsx`

**Purpose**: Prominent success/error/warning/info message, optionally dismissible (`onDismiss`).

### 4.6 EmptyState — `ui/empty-state.tsx`

**Purpose**: Friendly no-data placeholder. Props: `title` · `description` · `action` (e.g. a Button) · `icon`.

### 4.7 Spinner — `ui/spinner.tsx`

**Purpose**: Loading indicator. Props: `size` (`sm`/`md`/`lg`) · `label` (default `"Loading"`).
`role="status"` + `aria-label` announce to assistive tech.

### 4.8 Skeleton — `ui/skeleton.tsx`

**Purpose**: Loading placeholder block. Compose with utility classes (`h-* w-*`).

**Accessibility**: Spinner/Banner use `role="status"`/`aria-live`; Callout icons are decorative;
dismiss controls always have labels; never rely on color alone for status.

**Best practices**: Use `Spinner` inside `loading` Buttons; `Skeleton` for content loading;
`Callout` for inline guidance, `Banner` for page-level messages; `EmptyState` replaces blank lists.

---

## 5. Cards — `src/components/ui/card.tsx`

**Purpose**: Generic, content-agnostic card shell. Domain cards (Faculty, Course, Result,
Testimonial, Gallery, Statistic, Timeline, Feature) live in `src/cards` and compose this shell —
they are **not** part of the core primitive set.

**Exports**: `Card` · `CardHeader` · `CardTitle` · `CardDescription` · `CardContent` · `CardFooter`

```tsx
<Card>
  <CardHeader>
    <CardTitle>Course title</CardTitle>
    <CardDescription>Short summary</CardDescription>
  </CardHeader>
  <CardContent>…</CardContent>
  <CardFooter><Button size="sm">Enquire</Button></CardFooter>
</Card>
```

**Accessibility**: `CardTitle` renders a real `<h3>`; the card is a generic container — wrap in a
landmark or link at the composition layer.

**Best practices**: Keep `Card` free of copy; build domain cards on top of it via composition.

---

## 6. Verification

```bash
npm run typecheck        # passes (strict, no any)
npm run lint             # passes (next lint)
npm run build            # compiles
npm run build-storybook  # Storybook builds; autodocs per component
```

## 7. Status

Sprint 2B core primitives are complete. Added in this pass: **Label**, **Caption** (Typography)
and **Chip** (Feedback) — all token-driven, typed, accessible and Storybook-documented.

**Stopping here per the brief — no feature components, no homepage, no forms, no navigation.**
