# ============================================================================
# BINDRA KNOWLEDGE HUB
# Sprint 2D - Animation System
# Story ID: BKH-DS-004
# ============================================================================

ROLE

You are the Principal Motion Designer, Frontend Animation Engineer,
Accessibility Engineer and Performance Engineer.

Before writing any code:

1. Read AGENTS.md
2. Read DESIGN_SYSTEM.md
3. Read DESIGN_TOKENS.md
4. Read COMPONENT_LIBRARY.md
5. Read FORM_SYSTEM.md

Do NOT change completed work.

Do NOT modify existing components unless absolutely necessary.

Do NOT build homepage animations.

Do NOT animate any feature sections.

==============================================================================
MISSION
==============================================================================

Create a reusable animation framework that every page and component
will use throughout the application.

Animations must be elegant, subtle, performant and accessible.

The animation system must feel similar to modern products such as
Vercel, Stripe, Apple and Linear.

Animation should enhance usability,
never distract from content.

==============================================================================
TECH STACK
==============================================================================

Use

- Framer Motion
- TypeScript
- Existing Design Tokens
- Existing Motion Tokens

Do not introduce another animation library.

==============================================================================
FOLDER STRUCTURE
==============================================================================

Create

src/components/animations/

Suggested structure

animations/

    Fade.tsx

    FadeUp.tsx

    FadeDown.tsx

    FadeLeft.tsx

    FadeRight.tsx

    Scale.tsx

    Slide.tsx

    Reveal.tsx

    Stagger.tsx

    HoverLift.tsx

    HoverScale.tsx

    HoverGlow.tsx

    AnimatedCounter.tsx

    AnimatedText.tsx

    AnimatedContainer.tsx

    PageTransition.tsx

    ScrollReveal.tsx

    MotionProvider.tsx

    index.ts

Create

src/lib/animations/

motionVariants.ts

motionConfig.ts

motionHelpers.ts

==============================================================================
BUILD
==============================================================================

Reusable motion variants

Fade

Fade Up

Fade Down

Fade Left

Fade Right

Scale

Slide

Reveal

Stagger

Hover Lift

Hover Scale

Hover Glow

Page Transition

Animated Counter

Animated Text

Scroll Reveal

Animated Container

==============================================================================
CONFIGURATION
==============================================================================

All animations must consume

Existing Motion Tokens

Existing Duration Tokens

Existing Easing Tokens

No hardcoded durations.

No hardcoded easing.

==============================================================================
REQUIREMENTS
==============================================================================

Support

Entrance Animations

Exit Animations

Hover Animations

Focus Animations

Viewport Animations

Stagger Children

Parent Variants

Reusable Variants

Delayed Variants

Custom Delay

==============================================================================
ACCESSIBILITY
==============================================================================

Support

prefers-reduced-motion

Keyboard Navigation

Focus Visibility

No flashing content

No infinite animations

Respect WCAG motion guidelines

If reduced motion is enabled,
animations should gracefully degrade.

==============================================================================
PERFORMANCE
==============================================================================

Optimize for

GPU acceleration

Transform

Opacity

Avoid layout thrashing

Avoid expensive repainting

Lazy motion where appropriate

Keep bundle size minimal

==============================================================================
ANIMATION PHILOSOPHY
==============================================================================

Animations should feel

Elegant

Premium

Natural

Confident

Professional

Never

Bouncy

Playful

Distracting

Overly slow

==============================================================================

DOCUMENTATION
==============================================================================

Generate

ANIMATION_SYSTEM.md

Include

Architecture

Animation Principles

Variant Library

Usage Examples

Accessibility

Performance Considerations

Best Practices

Future Extension Strategy

==============================================================================

EXAMPLES
==============================================================================

Create

src/components/animations/examples/

Include

Fade Example

Hover Example

Counter Example

Scroll Reveal Example

Stagger Example

Page Transition Example

Developer examples only.

Do not expose them as routes.

==============================================================================

TESTING
==============================================================================

Ensure

npm run build passes

npm run lint passes

npm run typecheck passes

==============================================================================

OUTPUT
==============================================================================

Provide

1. Updated Project Tree

2. Animation Components Created

3. Motion Variant Library

4. Accessibility Summary

5. Performance Summary

==============================================================================

STOP

Do NOT animate

Homepage

Hero

Navigation

Faculty

Courses

Forms

Results

Testimonials

Gallery

Contact

Do NOT create pages.

Do NOT modify business logic.

Stop immediately after the reusable Animation System is complete.