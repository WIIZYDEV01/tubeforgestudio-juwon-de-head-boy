# TubeForgeStudio

A YouTube automation studio portfolio. The public site and the studio desk share one catalog stored in the browser. There is no backend, no API key, and no external data service.

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The studio desk is at [http://localhost:3000/admin](http://localhost:3000/admin).

Production:

```bash
npm run build
npm start
```

## What is real

- Portfolio projects, services, testimonials, FAQs, case studies, comparisons, statistics, and inquiries are stored in **IndexedDB**.
- Theme and favorite projects are stored in **LocalStorage**.
- The desk PIN is stored in plain text in IndexedDB. The session flag is `sessionStorage`.
- Uploaded images and videos are stored as blobs in IndexedDB (12 MB each).
- Export downloads a JSON backup. Import replaces the catalog in this browser after you confirm.
- The contact form **saves an inquiry in this browser**. It does not send email. The success message says so.
- `hello@example.com` is a sample address. `example.com` does not deliver mail. Replace it in Settings.
- Leave WhatsApp blank until you have a real number. The public site hides the link when it is empty.

## What is not real

The seeded catalog is **concept work**. Cards, case studies, and the hero reel say so. Placeholder testimonials are not customer reviews and do not show a star rating. Statistics start with a **Sample** label. Clear that label only when a number is a real studio record.

Do not mark a project or case study as commissioned unless it is real work you are allowed to show. Do not type analytics you cannot verify.

## Studio desk

Demonstration PIN: `forge`.

The lock screen shows the current PIN on purpose. This is **not authentication**. Anyone who can open this browser, its storage, or a backup file can read and change the catalog. Do not deploy this lock as production security. Put a real server and real accounts in front of the desk before it is public.

Project pages live in the browser, so the sitemap lists the fixed routes only. Individual project URLs appear after the catalog loads on that device.

Metadata uses `https://tubeforgestudio.example` as a placeholder origin. Change it in `src/lib/site.ts` when you have a real domain.

## Storage failures

If IndexedDB is blocked, the site falls back to an in-memory sample catalog and says that changes will not be kept. If a save runs out of space, remove media or export a backup.
