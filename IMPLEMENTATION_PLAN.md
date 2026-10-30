# TubeForgeStudio — Implementation Plan

Premium YouTube automation portfolio. Client-only Next.js application. No backend, no API keys, no external data calls at runtime.

## Product rules

- Brand: TubeForgeStudio. Dark cinematic studio. Accent `#FF6B24`. Background `#090909`.
- Seeded projects, case studies, and testimonials are **concept or placeholder** material. The UI must say so.
- Do not invent clients, revenue, view counts, or testimonials and present them as real.
- Statistics ship as labelled sample figures until edited in admin. A verified flag removes the sample label only after an editor sets it.
- Contact success means the inquiry was saved in this browser. It does not mean an email was sent.
- Admin PIN is a local demonstration lock, documented as not secure.

## Stack

Next.js App Router, TypeScript, Tailwind CSS, Framer Motion, Lucide React, IndexedDB (`idb`), LocalStorage, React Hook Form, Zod, Recharts.

## Architecture

```
src/
  app/                  routes (public, case studies, contact, admin, 404, sitemap, robots)
  components/
    layout/             nav, footer, progress, back-to-top, theme
    hero/               hero, reel, capability strip
    portfolio/          gallery, filters, cards, modals, posters
    services/           service grid and detail dialog
    case-studies/       cards and detail layout
    testimonials/       carousel
    contact/            inquiry form
    workflow/           timeline
    compare/            before/after slider
    animations/         reveal, particles, grid, counters
    ui/                 button, dialog, toast, tooltip, skeleton, empty
    admin/              shell, tables, forms, charts
  lib/
    db/                 IndexedDB schema, seed, repository
    storage/            localStorage preferences
    validation/         Zod schemas
    utils/              cn, format, ids
  hooks/                content, theme, favorites, media query
  types/                domain types
  data/                 seed content and poster motifs
```

Public pages and admin share one content provider. The provider hydrates from IndexedDB, seeds empty stores, and writes every mutation back. LocalStorage holds theme, favorite project ids, and small UI preferences.

Built-in cinematic posters are original SVG key art (motif, grade, title). Uploaded media is stored as blobs in IndexedDB and can replace a poster or attach a preview video.

## Phases

### Phase 1 — Initialize

Inspect the directory. Create the Next.js app with TypeScript, Tailwind, ESLint, App Router, and `src/`. Install runtime dependencies. Confirm the toolchain typechecks.

### Phase 2 — Design system

CSS variables for dark and light. Type scale (Syne display, Outfit body, JetBrains Mono labels via `next/font`). Spacing, borders, focus rings, buttons, inputs, badges, dialogs, toasts, tooltips, skeletons, empty states. Reduced-motion baseline.

### Phase 3 — Public website

Home: navigation, hero, capability strip, sample statistics, featured project, portfolio preview, services, before/after, workflow, case-study preview, testimonial placeholders, FAQ, contact, footer.

Additional routes: `/portfolio`, `/portfolio/[slug]`, `/services`, `/case-studies`, `/case-studies/[slug]`, `/contact`, `/faq`, `/favorites`, not-found.

Metadata, Open Graph, sitemap, robots, semantic headings.

### Phase 4 — Interactions

Category filters, search, favorites, video preview modal, project details, image lightbox, draggable comparison (pointer and keyboard), FAQ accordion, testimonial carousel, validated contact form, theme switch, mobile nav, back-to-top, scroll progress, toasts, confirm dialogs. Every control performs its action.

### Phase 5 — Admin dashboard

`/admin` demonstration lock with an on-screen explanation. Sidebar, overview charts from real stored inquiries and catalog counts, recent activity, quick actions, search. Modules: portfolio, services, testimonials, FAQs, case studies, inquiries, media, settings, statistics.

### Phase 6 — CRUD and storage

Create, read, update, delete with validation, duplicate-submit guards, delete confirmation, empty and loading states. Inquiry persistence. JSON export, validated import, backup and restore. Storage failure messaging. Public pages read the same records the admin edits.

### Phase 7 — Motion and polish

Scroll reveal, counters, floating thumbnails, slow grid, restrained particles, hover states, timeline. All gated by `prefers-reduced-motion`. Custom cursor only for fine pointers, without removing focus visibility.

### Phase 8 — Testing

Typecheck, lint, route smoke, CRUD smoke (seed, edit, refresh persistence), responsive overflow checks at 360, 390, 768, 1024, 1440, 1920, keyboard focus, reduced motion.

### Phase 9 — Production build

`next build`. Fix every TypeScript, lint, and build error. Re-run until the production build passes.

## Data honesty

| Content | How it is labelled |
| --- | --- |
| Portfolio seed | Concept project badge |
| Case studies | Concept case study; results section says none are published |
| Testimonials | Placeholder, not a customer review |
| Statistics | Sample figure until marked verified in admin |
| Contact | Saved locally; email not sent |
| Admin access | Demonstration PIN, not authentication |

## Acceptance

Premium studio landing, working portfolio and services, working previews, search and filters, admin CRUD, browser persistence, inquiry management, responsive layout, polished motion, production build passes.
