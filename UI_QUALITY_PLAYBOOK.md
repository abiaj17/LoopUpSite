# UI Quality Playbook (Vercel-Style)

Use this checklist for every release.

## 1) Performance and React/Next Rendering Discipline

- Prefer Server Components by default in Next.js App Router.
- Keep client components minimal and leaf-level.
- Avoid unnecessary global state; colocate state near usage.
- Memoize expensive derived values only when profiling shows need.
- Use stable keys for lists; never index keys for dynamic data.
- Avoid inline object/array props in hot rendering paths.
- Prevent re-renders with clear component boundaries.
- Use dynamic imports for non-critical heavy UI.
- Defer analytics and non-essential scripts.
- Preload critical fonts; avoid too many font weights.
- Use optimized images and explicit dimensions.
- Avoid layout shift (reserve media space).
- Keep above-the-fold CSS lean.
- Avoid giant DOM trees in hero sections.
- Keep animation properties GPU-friendly (`transform`, `opacity`).
- Avoid expensive scroll handlers without throttling.
- Keep event listeners cleaned up.
- Split large sections into reusable components.
- Keep hydration scope small.
- Verify mobile performance and battery impact.

## 2) Accessibility and UX Audit

- One `<h1>` per page.
- Semantic landmarks: `header`, `main`, `nav`, `footer`.
- All interactive elements keyboard reachable.
- Visible `:focus-visible` state on links/buttons.
- Color contrast passes for body and CTA text.
- Buttons and links have descriptive text (no "click here").
- Touch targets are comfortably large.
- Form fields have labels and error messaging.
- Placeholder is not the only instruction text.
- Loading states are visible and non-blocking.
- Empty states explain what to do next.
- Error states are actionable and polite.
- Motion respects user preferences when possible.
- Avoid autoplay distractions.
- Navigation labels are consistent across pages.
- Keep one clear primary CTA per section.
- Avoid competing accent colors in one view.
- Limit paragraph width for readability.
- Keep heading hierarchy logical (h1 > h2 > h3).
- Validate reading flow on mobile first.

## 3) Anti-"AI Slop" Visual Standards

- Remove decorative elements that do not aid hierarchy.
- Limit shadows to subtle depth cues.
- Keep border treatment thin and consistent.
- Use one accent and neutral surface palette.
- Enforce spacing rhythm before adding effects.
- Avoid generic marketing buzzwords; write concrete copy.
- Keep icon usage intentional and consistent.
- Prefer quality whitespace over extra components.

## 4) Workflow Commands

- **polish**: improve hierarchy, spacing, and interaction quality.
- **type-set**: tune typography scale, line lengths, and rhythm.
- **audit**: run a11y + UX + perf review and fix high-impact issues.

## 5) Composer Multi-file Usage

When using Cursor Composer (`Cmd+I`), request:

1. target files explicitly,
2. intended visual hierarchy,
3. required tokens (color/space/type/radius),
4. audit pass after generation.
