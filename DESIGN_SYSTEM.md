# DESIGN_SYSTEM.md — Bindra Knowledge Hub

> Story `Prompt-02-Design-System` · Role: Lead UI / Design System / Accessibility / Frontend Architect
> Built on top of the existing token system (`src/design-system/tokens`, see `DESIGN_TOKENS.md`).
> Source of truth: `AGENTS.md`. Scope: **reusable design primitives only** — no pages, no content, no forms, no business logic.

This document describes the enterprise-grade, reusable component library that every future
Bindra Knowledge Hub page will consume. Every component is token-driven, accessible, responsive
(mobile-first from 320px), and animation-light (reduced-motion aware).

---

## 1. Philosophy & visual language

Target feeling: **Trust · Hope · Family · Education · Premium · Simplicity · Warmth · Professionalism**.
Reference tier: modern SaaS (Vercel / Stripe / Notion / Linear) — but warm and approachable for parents.
We avoid: corporate coldness, cheapness, over-design, template feel.

This is expressed through:
- A grounded **bronze primary** + **hopeful gold accent** on an **ivory surface** (warm, premium).
- Generous, soft radii and low-contrast warm shadows.
- Fluid typography and an 8pt spacing rhythm.
- Subtle, purposeful motion only.

---

## 2. Color philosophy

All colors are **semantic**, never arbitrary. Defined once in `src/design-system/tokens/colors.ts`
and mirrored as CSS variables in `src/styles/tokens.css` (so `.dark` works).

| Token | Role | Note |
| --- | --- | --- |
| `primary` | Brand bronze | AA on ivory; the anchor action color. |
| `secondary` | Soft tint | Secondary actions / fills. |
| `accent` | Gold | Highlights, badges, CTA glow, hope. |
| `success` / `warning` / `danger` / `info` | Feedback | Conventional, **desaturated** (never neon). |
| `surface` / `background` / `card` / `popover` | Structure | Ivory bg, white cards, tinted surface bands. |
| `muted` / `foreground` / `border` / `input` / `ring` | Text & lines | Calm contrast, brand focus ring. |

Dark mode is **ready** (`.dark` overrides the variables) even though it is not yet toggled.

---

## 3. Typography

Fluid `clamp()` scale (`src/design-system/tokens/typography.ts`), two font roles wired via
`next/font`: `--font-heading` (Plus Jakarta Sans) for display/headings, `--font-sans` (Inter) for
body/UI, `--font-serif` (Fraunces) reserved for editorial accents.

Roles: Hero · H1 · H2 · H3 · H4 · Subheading · Body (sm/base/lg) · Caption · Label · Button · Quote.
Tight tracking on large headings; 1.7 body line-height for calm reading.

---

## 4. Spacing

8pt grid (`src/design-system/tokens/spacing.ts`): 4 / 8 / 12 / 16 / 24 / 32 / 40 / 48 / 64 / 80 / 96 / 128.
No component hardcodes a margin/padding value.

---

## 5. Tokens (single source of truth)

Centralized in `src/design-system/tokens/`:

`colors · typography · spacing · radius · shadow · motion · breakpoints · zIndex · opacity ·
transitions · components` (icon sizes, button sizes, input heights, section spacing, container widths).

`tailwind.config.ts` **imports** these modules — the config contains zero hardcoded values.
Colors stay on CSS variables for dark mode. See `DESIGN_TOKENS.md` for the full token reference.

---

## 6. Component inventory

All components are client/ server-appropriate and reuse tokens. Grouped by folder:

**UI primitives** (`src/components/ui`)
- `button.tsx` — variants: primary, secondary, outline, ghost, accent, **cta**, destructive, link; sizes sm/md/lg/icon; `loading` state.
- `icon-button.tsx` — square, icon-only, **mandatory `aria-label`**.
- `badge.tsx`, `pill.tsx` — status labels (Pill supports a status dot).
- `input.tsx`, `textarea.tsx`, `select.tsx`, `checkbox.tsx`, `radio.tsx`, `switch.tsx`, `file-upload.tsx` — accessible form controls.
- `card.tsx` — Card + Header/Title/Description/Content/Footer.
- `container.tsx`, `heading.tsx`, `icon-wrapper.tsx`, `section.tsx`.
- `spinner.tsx`, `skeleton.tsx`, `banner.tsx` (success/error/warning/info + dismiss), `empty-state.tsx`.

**Layout** (`src/components/layout`)
- `grid.tsx`, `stack.tsx`, `divider.tsx`, `surface.tsx`, `hero-wrapper.tsx`.
- `navbar.tsx` (desktop + mobile, sticky, transparent→solid, a11y), `footer.tsx`, `sticky-cta.tsx`.

**Typography** (`src/components/typography`)
- `subheading.tsx`, `paragraph.tsx`, `quote.tsx`.

**Icons** (`src/components/icons`)
- `feature-icon.tsx`, `animated-icon-container.tsx`.

**Navigation** (`src/components/navigation`)
- `breadcrumb.tsx`, `section-nav.tsx`.

**Cards / domain** (`src/cards`) — content-agnostic shells
- `feature-card`, `faculty-card`, `course-card`, `result-card`, `testimonial-card`,
  `gallery-card`, `statistic-card`, `timeline-card`.

**Utility** (`src/components/utility`)
- `animated-counter.tsx`, `section-header.tsx`, `cta-banner.tsx`, `callout.tsx`,
  `highlight-text.tsx`, `glass-card.tsx`.

**Animations** (`src/components/animations`)
- `motion-primitives.tsx` — `FadeIn`, `FadeUp`, `ScaleIn`, `SlideIn`, `Stagger` + `StaggerItem`, `HoverLift` (all reduced-motion aware).
- `page-transition.tsx` — route-level entrance.

**Sections / placeholder**
- `sections/placeholder.tsx` — "Coming Soon" block for the foundation routes.

---

## 7. Animation philosophy

Subtle, calm, purposeful. Presets in `src/lib/motion.ts` + motion components: Fade Up, Fade In,
Scale, Slide, Stagger, Counter, Hover Lift, Card Hover, Button Hover. Durations are short
(150 / 300 / 600ms); easing is standard material curves. **Reduced motion is honored globally**
(`prefers-reduced-motion` in `tokens.css`) and per-component (Framer Motion `useReducedMotion`).
No excessive movement.

---

## 8. Accessibility (baseline for every component)

- **Keyboard**: all interactive elements are native (`button`, `input`, `select`, `a`) or
  `role`-correct (Switch = `role="switch"`, IconButton requires `aria-label`).
- **Focus ring**: visible `:focus-visible` ring (brand `ring`) with offset on every control.
- **ARIA**: `aria-current` on active nav, `aria-busy` on loading buttons, `aria-invalid` styling,
  `role="status"`/`aria-live` on spinner/file/upload feedback, labelled breadcrumbs.
- **Semantic HTML**: landmarks (`header`/`nav`/`main`/`footer`), real headings, `fieldset`-style labels.
- **Color contrast**: semantic palette chosen for AA on the ivory surface.
- **Reduced motion**: global + component-level opt-out.
- **Large touch targets**: button/input heights >= 44px; mobile sticky CTA.
- **Screen readers**: decorative icons marked `aria-hidden`; meaningful text always present.

(A full automated a11y pass with axe is a recommended next step — see Future.)

---

## 9. Naming conventions

- **Tokens**: `kebab-case` CSS variables (`--color-primary`); camelCase TS exports (`semanticColors`).
- **Components**: PascalCase, single-responsibility, folder-by-purpose (`ui`, `layout`, `cards`, `forms`, `typography`, `icons`, `navigation`, `utility`, `animations`).
- **Variants**: `cva` + `VariantProps`; `variant` first, then `size`.
- **Props**: `className` last, merged via `cn()` (clsx + tailwind-merge); no style props.
- **Imports**: absolute `@/*` aliases only.

---

## 10. Storybook

Storybook 10 (`@storybook/nextjs-vite`) is installed and **builds successfully**.

```bash
npm run storybook        # dev server on :6006
npm run build-storybook  # static build -> storybook-static/
```

Every component has a story with **variants, states (disabled/loading/invalid), responsive
preview (Storybook viewport), accessibility notes (in `docs.description`), and usage examples**.
Autodocs is enabled (`tags: ["autodocs"]`). Stories live next to components as `*.stories.tsx`.
> Screenshots: run `npm run storybook` and capture per component; the static build is verified
> (`storybook build` → success).

---

## 11. Deliverables

1. **Updated project tree** — see section 12.
2. **Storybook** — installed, builds, docs per component (instructions above).
3. **Design token documentation** — `DESIGN_TOKENS.md` (this repo) + `src/design-system/tokens/*`.
4. **Component inventory** — section 6 above.
5. **Accessibility report** — section 8 (built-in; axe audit recommended next).
6. **Future recommendations** — section 12.

---

## 12. Future extension guidelines

- **Add a component**: drop a file in the correct folder, build on tokens + `cva`, add a
  `*.stories.tsx` with `autodocs`, ensure `aria` + focus ring + reduced-motion. Reuse, don't fork.
- **New token**: add to `src/design-system/tokens`, re-export from `index.ts`, and wire into
  `tailwind.config.ts` if it affects utilities. Keep CSS variables in sync for dark mode.
- **New card**: create in `src/cards` as a content-agnostic shell (props, not copy).
- **Dark mode**: add a theme provider + toggle; tokens already support `.dark`.
- **Forms**: build real `ContactForm`/`AdmissionsForm` with React Hook Form + Zod on top of the
  input primitives (already installed).
- **a11y**: add `@storybook/addon-a11y` and run axe in CI; add unit/component tests (Vitelli + Testing Library).
- **Performance**: Lighthouse pass targeting ≥95; add `next/image` wrapper for real imagery.

---

## 13. Verification

```text
npm run typecheck   # ✅ passes
npm run lint        # ✅ passes (next lint)
npm run build       # ✅ compiles (9 static routes)
npm run build-storybook  # ✅ Storybook builds successfully
```

---

## 14. Updated project tree

```text
BindraKnowledgeAcademy/
├─ .storybook/                  # Storybook config (main.ts, preview.tsx)
├─ public/                      # icon.svg, apple-icon.svg
├─ src/
│  ├─ app/                      # routes (/, /about … /admissions), robots, sitemap, manifest, layout
│  ├─ components/
│  │  ├─ ui/                    # button, icon-button, badge, pill, input, textarea, select,
│  │  │                         #   checkbox, radio, switch, file-upload, card, container, heading,
│  │  │                         #   icon-wrapper, section, spinner, skeleton, banner, empty-state
│  │  │                         #   + *.stories.tsx for each
│  │  ├─ layout/                # grid, stack, divider, surface, hero-wrapper, navbar, footer,
│  │  │                         #   sticky-cta  + layout/chrome stories
│  │  ├─ typography/            # subheading, paragraph, quote  + stories
│  │  ├─ icons/                 # feature-icon, animated-icon-container  + stories
│  │  ├─ navigation/            # breadcrumb, section-nav  + stories
│  │  ├─ sections/              # placeholder (Coming Soon)
│  │  ├─ animations/            # motion-primitives (FadeIn/Up/Scale/Slide/Stagger/HoverLift),
│  │  │                         #   page-transition  + stories
│  │  └─ utility/               # animated-counter, section-header, cta-banner, callout,
│  │                              #   highlight-text, glass-card  + stories
│  ├─ cards/                    # feature, faculty, course, result, testimonial, gallery,
│  │                             #   statistic, timeline  + cards.stories.tsx
│  ├─ content/  data/  hooks/  lib/  styles/  types/
│  └─ design-system/tokens/     # colors, typography, spacing, radius, shadow, motion,
│                                #   breakpoints, zIndex, opacity, transitions, components, index
├─ DESIGN_TOKENS.md             # token reference (Prompt-02A)
├─ DESIGN_SYSTEM.md             # this document
├─ package.json  tailwind.config.ts  next.config.ts  tsconfig.json
└─ .eslintrc.json  .prettierrc  postcss.config.js  components.json  .gitignore
```

**Stopping here per the story brief — no Sprint 3 work.**
