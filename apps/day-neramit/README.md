# AI-BOS Document Studio — Day Neramit

Production Document Engine for AI-BOS Phase 1, styled Luxury Gold-Black,
installable as a PWA. Built as a reusable document engine (`BaseDocument`
+ per-document-type template registry) so Quotation, Receipt / Payment
Voucher, and Warranty Certificate all plug into the same editor pattern,
autosave, undo/redo, numbering, and export machinery.

## What's implemented today

- **Quotation module** (`/quotation`) — ใบเสนอราคา
- **Receipt / Payment Voucher module** (`/receipt`) — ใบเสร็จรับเงิน /
  ใบรับเงิน. One module, one toggle (`receiptKind`) switches the printed
  title between the two — they share the same layout in Thai SME
  practice. Includes a payment-details panel (method, date, amount,
  reference document, PromptPay QR).
- **Warranty Certificate module** (`/warranty`) — ใบรับประกัน. Coverage
  item table, warranty period (install / start / end dates), coverage
  and exclusion terms, linked document reference.
- Each module ships with: live split-view editor (dark editor pane /
  light document pane), unlimited item rows where relevant, VAT/
  withholding tax, Thai Baht text conversion, Thai Buddhist calendar
  dates, automatic running numbers (`QT-`/`RC-`/`WR-YYYYMMDD-NNNN`),
  Smart Document Rules (auto-hide empty sections), watermark
  (draft/cancelled), document list with search/filter/duplicate/
  archive/delete, and print/export.
- **Home hub** (`/`) — luxury gold-black landing linking to all three
  modules, generated logo, PWA install prompt surface.
- **PWA:** `public/manifest.json`, a hand-written offline-capable
  service worker (`public/sw.js`, no extra build dependency), app icons
  generated from the brand logo, and an offline fallback page. Works on
  iOS/Android "Add to Home Screen" and desktop Chrome/Edge install.
- **Export:** the live preview and the print/export view render the
  *same* React component — PDF export goes through the browser's native
  print-to-PDF (`window.print()`), producing real selectable-text,
  vector output. Never a screenshot.
- **Persistence today:** browser `localStorage`, one repository per
  document type (`src/services/document.service.ts`,
  `receipt.service.ts`, `warranty.service.ts`), all behind the same
  repository interface shape. Fully functional offline. Designed so
  swapping in Firestore later is a new class implementing the same
  interface per document type — no call-site changes.
- **Firebase:** scaffolded and ready (see below) but **not yet the
  active persistence layer** — env vars are empty until you configure a
  real Firebase project.

## Getting started

```bash
pnpm install
pnpm --filter day-neramit dev
```

Open http://localhost:3000 — the Day Neramit document hub, linking to
`/quotation`, `/receipt`, and `/warranty`.

## Environment variables

Copy `.env.example` to `.env.local` and fill in a real Firebase project's
values once you're ready to move off localStorage:

```bash
cp .env.example .env.local
```

## Firebase setup (when you're ready to go live)

1. Create a Firebase project, enable **Authentication**, **Cloud
   Firestore**, and **Storage**.
2. Fill in `.env.local` with the web app config and a service account
   key (Project Settings → Service Accounts).
3. Deploy the prepared rules/indexes:
   ```bash
   firebase deploy --only firestore:rules,firestore:indexes,storage
   ```
   (`firestore.rules`, `firestore.indexes.json`, `storage.rules` are
   already in this folder, modeling a company-scoped multi-tenant
   structure — see the comments at the top of `firestore.rules`.)
4. Implement a Firestore-backed repository against the same interface
   shape used in `src/services/document.service.ts`,
   `receipt.service.ts`, and `warranty.service.ts`, then swap the
   exported repository instances.

## Deploying to Vercel

This app lives inside a pnpm workspace monorepo (`apps/day-neramit`).

1. Import the repo in Vercel. **Root Directory:** `apps/day-neramit`.
2. Vercel auto-detects Next.js; `vercel.json` in this folder pins the
   install/build commands to run from the workspace root so pnpm
   workspace resolution works correctly.
3. Add the environment variables from `.env.example` in the Vercel
   project settings (Production + Preview).
4. After the first manual import, every push to `main` deploys
   automatically — no further Vercel-side setup needed.

## Deploying to Netlify

`netlify.toml` is provided both at the repo root and inside
`apps/day-neramit/`, using the official `@netlify/plugin-nextjs` runtime
(handles the App Router, SSR, and image optimization automatically).

1. In Netlify: **Add new site → Import an existing project** → connect
   the same Git repo.
2. If Netlify asks for a base directory, set it to `apps/day-neramit`
   (already pinned in `netlify.toml` either way).
3. Add the same environment variables as `.env.example` under **Site
   settings → Environment variables**.
4. Deploy. Every push to the connected branch auto-deploys afterward.

Both platforms' Git integration means "auto deploy on push" is native —
no extra CI/CD file is required. See top-level `DEPLOYMENT.md` for the
full step-by-step including first-time repo setup.

## Architecture

See `src/types`, `src/lib`, `src/components/document`,
`src/components/templates`, and the three per-document-type folders
(`src/components/quotation`, `src/components/receipt`,
`src/components/warranty`) for the layered structure: base document
types → calculation/validation/formatting libs → shared document
primitives (`HeaderBanner`, `InfoCards`, `ItemsTable`, `SummaryPanel`,
`FooterBand`, `SignatureBlock`, `QRPromptPay`, `StampSlot`,
`WatermarkLayer`, `PageFooter`) → pluggable per-document-type template
registries → the module itself (form + editor + document renderer +
list/new/[id]/preview pages). New document types extend `BaseDocument`
and register a template component — the editor shell, autosave,
undo/redo, and numbering are document-agnostic patterns, replicated per
module for clarity rather than over-abstracted.
