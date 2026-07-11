# Bindra Knowledge Hub — Foundation Architecture

> Sprint 1 (Foundation). Built strictly against `AGENTS.md`
> (the referenced `PROJECT_CONSTITUTION.md` does not exist in this repo).
> No page sections were built; every route is a branded placeholder.

---

## 1. Project Tree

```text
BindraKnowledgeAcademy/
├─ public/
│  ├─ icon.svg                 # favicon placeholder (SVG)
│  └─ apple-icon.svg           # Apple touch icon placeholder
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx            # Root layout: fonts, metadata, JSON-LD, nav/footer/transition
│  │  ├─ globals.css           # Tailwind layers + base styles (imports tokens & animations)
│  │  ├─ page.tsx              # / (placeholder)
│  │  ├─ about/page.tsx        # /about
│  │  ├─ courses/page.tsx      # /courses
│  │  ├─ faculty/page.tsx      # /faculty
│  │  ├─ results/page.tsx      # /results
│  │  ├─ gallery/page.tsx      # /gallery
│  │  ├─ testimonials/page.tsx # /testimonials
│  │  ├─ contact/page.tsx      # /contact
│  │  ├─ admissions/page.tsx   # /admissions
│  │  ├─ robots.ts             # SEO: robots route handler
│  │  ├─ sitemap.ts            # SEO: sitemap route handler
│  │  └─ manifest.ts           # PWA: web manifest route handler
│  ├─ components/
│  │  ├─ ui/                   # Design-system primitives
│  │  │  ├─ button.tsx         # Button (cva variants, asChild via Radix Slot)
│  │  │  ├─ card.tsx           # Card + subcomponents
│  │  │  ├─ badge.tsx          # Badge (cva variants)
│  │  │  ├─ container.tsx      # Centered, max-width wrapper
│  │  │  ├─ section.tsx        # Vertical rhythm wrapper
│  │  │  ├─ heading.tsx        # Typographic heading primitive
│  │  │  └─ icon-wrapper.tsx   # Standardized icon sizing/tinting
│  │  ├─ layout/               # Structural chrome
│  │  │  ├─ navbar.tsx         # Desktop + mobile nav (sticky, a11y, transparent→solid)
│  │  │  ├─ footer.tsx         # Responsive footer (newsletter, links, social, contact)
│  │  │  └─ sticky-cta.tsx     # Mobile sticky bottom CTA
│  │  ├─ sections/             # Composable page regions
│  │  │  └─ placeholder.tsx    # "Coming Soon" placeholder block
│  │  └─ animations/
│  │     └─ page-transition.tsx# Framer Motion page entrance (reduced-motion safe)
│  ├─ content/                 # Authored copy (separated from UI)
│  │  └─ pages.ts              # Page title/description/status registry
│  ├─ data/                    # Structured data (separated from UI)
│  │  └─ navigation.ts         # Footer quick-links + social links
│  ├─ hooks/
│  │  └─ useScrolled.ts        # Scroll position → transparent/solid nav state
│  ├─ lib/
│  │  ├─ utils.ts              # cn() class merge utility
│  │  ├─ site.ts               # siteConfig + buildMetadata() SEO factory
│  │  └─ motion.ts             # Framer Motion presets & easings
│  ├─ styles/
│  │  ├─ tokens.css            # Design tokens (colors, type, space, radius, shadow, motion, layout)
│  │  ├─ globals.css           # Tailwind entry + base layer
│  │  └─ animations.css        # Lightweight CSS animation utilities
│  ├─ types/
│  │  └─ index.ts              # Shared domain & UI types (no `any`)
│  └─ (config files)
│     ├─ package.json, tsconfig.json, next.config.ts, tailwind.config.ts,
│     ├─ postcss.config.js, .eslintrc.json, .prettierrc, .env.example,
│     ├─ components.json (shadcn), .gitignore
```

---

## 2. Architecture Explanation

**Stack & conventions**
- Next.js 15 (App Router) + React 19 + TypeScript (strict, `noUncheckedIndexedAccess`, `noUnusedLocals`).
- Tailwind CSS v3 with a token-driven theme (`tokens.css` → `tailwind.config.ts`).
- shadcn/ui pattern (`components.json`, Radix `Slot`, `class-variance-authority`, `clsx` + `tailwind-merge`).
- Framer Motion for orchestrated motion; `lib/motion.ts` centralizes variants & easings.
- React Hook Form + Zod are installed and ready (forms layer deferred to a later sprint).
- Lucide React for icons.

**Layered separation (per AGENTS.md "Separate content from UI")**
- `content/` holds copy; `data/` holds structured lists; `components/` consume them.
- `lib/` = framework glue (SEO, motion, utils); `types/` = contracts shared everywhere.
- `components/ui` = blind primitives; `components/layout` = chrome; `components/sections` = page regions; `components/animations` = motion wrappers.

**Rendering**
- Root `layout.tsx` sets `next/font` (Inter / Plus Jakarta Sans / Fraunces) as CSS variables, the default `metadata` via `buildMetadata()`, an `EducationalOrganization` JSON-LD block, a skip link, and the persistent `Navbar`/`Footer`/`StickyBottomCta` shell.
- `PageTransition` wraps `children` for a subtle, reduced-motion-aware entrance.
- Each route renders `PagePlaceholder` (title + description + Coming Soon) and overrides `metadata` per page (canonical + OG/Twitter inherited from the template).

**SEO surface**
- `robots.ts`, `sitemap.ts`, `manifest.ts` are typed route handlers.
- All pages emit correct `<title>`, description, canonical, OpenGraph, Twitter card, and theme color.

---

## 3. Design Decisions

- **Tokens as the single source of truth.** All colors, type scale, spacing, radius, shadows, durations, easings, and container widths are HSL CSS variables in `tokens.css` and surfaced to Tailwind. Components never hardcode values → re-theming (incl. dark mode via `.dark`) is a one-file change.
- **Warm, premium palette.** Grounded bronze `--brand-600` primary + hopeful gold `--accent` on an ivory surface — conveys trust, warmth, and premium feel without being corporate (AGENTS.md brand personality).
- **Accessibility first.** Skip link, focus-visible rings, semantic landmarks, `aria-current` on active nav, `aria-expanded`/`aria-modal` on the mobile menu, Escape-to-close, body-scroll lock, `prefers-reduced-motion` honored in both CSS and Framer Motion.
- **Mobile-first.** 320px-friendly tap targets, hidden desktop nav < lg, mobile sticky bottom CTA, fluid `clamp()` type scale.
- **Transparent→solid nav.** `Navbar` uses `useScrolled` to switch from transparent (over hero) to a blurred solid bar after 24px. The mechanism exists now; pages without a hero simply show the solid (readable) state.
- **`cva` for variants.** Button/Badge/Heading/IconWrapper expose typed, composable variants instead of one-off classes.
- **`next/font` over CDN.** Self-hosted, performant, no layout shift; variables keep tokens decoupled from font files.
- **No hardcoded copy.** Every string lives in `content/` or `data/` so non-engineers can edit copy later.
- **Security hygiene.** Pinned Next to a CVE-patched `15.5.20`; `postcss` bumped to `^8.5.10`.

---

## 4. Future Extension Points

- **Page sections** live in `components/sections/` — compose real home/about/etc. from existing `ui` primitives + `Section`/`Container`/`Heading`.
- **Forms layer** (`src/forms/`): wire React Hook Form + Zod schemas (already installed) into the contact & admissions pages; `lib/site.ts` already reserves `CONTACT_FORM_API_URL`.
- **Cards** (`src/cards/`): CourseCard, FacultyCard, ResultCard, TestimonialCard, GalleryCard — build on `Card`.
- **Dark mode toggle**: tokens already support `.dark`; add a theme provider + toggle in `Navbar`.
- **Motion**: extend `lib/motion.ts` (scroll-linked, stagger, spring) for richer, still-subtle storytelling sections.
- **CMS migration**: `content/` and `data/` are structured for a later swap to a headless CMS/API with zero component changes.
- **Images**: `next/image` AVIF/WebP config is ready; add a responsive `Image` wrapper in `ui/`.
- **Analytics**: `NEXT_PUBLIC_GA_ID` / `FB_PIXEL_ID` env hooks reserved in `.env.example`.
- **shadcn components**: run `npx shadcn@latest add <component>` — aliases already configured in `components.json`.

---

## 5. Remaining TODO (Sprint 2+)

- [ ] Build real page sections (hero, story, courses grid, faculty, results, gallery, testimonials, contact, admissions).
- [ ] Implement `ContactForm` and `AdmissionsForm` with React Hook Form + Zod validation.
- [ ] Wire newsletter form to a real provider.
- [ ] Add `Card`-based components in `src/cards/`.
- [ ] Add dark-mode toggle + theme provider.
- [ ] Replace favicon/OG placeholders with final brand assets (include a real `opengraph-image`).
- [ ] Add `next/image` wrapper and real imagery with AVIF/WebP.
- [ ] Author final copy across `content/` and `data/`.
- [ ] Add unit/component tests (Vitest + Testing Library) and an a11y audit (axe).
- [ ] Lighthouse pass targeting ≥95 across Performance/A11y/SEO/Best Practices.
- [ ] Add CI (lint + typecheck + build) and a `README.md` for contributors.
- [ ] Confirm/override `PROJECT_CONSTITUTION.md` rules if that file is introduced later.

---

## Verification

```text
npm run typecheck   # ✅ passes (tsc --noEmit)
npm run lint        # ✅ passes (next lint)
npm run build       # ✅ compiles; 9 static routes (/ … /testimonials)
```
