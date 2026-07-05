# Invoera

AI-powered invoice and expense tracking. Upload a receipt or invoice and a
multi-agent pipeline extracts, validates, and categorizes it — so your
dashboard is always up to date.

Live at [invoera.vercel.app](https://invoera.vercel.app).

## Features

- **AI document pipeline** — upload a PDF or image; Google's Gemini API
  extracts merchant/client, amount, currency, date, and category, with a
  validation pass and a review screen before anything is saved.
- **Multi-currency** — invoices and expenses keep their original currency;
  dashboard totals convert to your chosen display currency using daily
  cached exchange rates.
- **Dashboard** — profit/loss over time, spend by category, invoice ratio,
  revenue gauge.
- **Clients & invoices** — track clients, create invoices manually or via
  AI extraction, mark paid/overdue.
- **Expenses** — categorized spend tracking with receipt attachments.
- **Notifications** — in-app + email alerts for overdue invoices, processed
  receipts, and optional weekly summaries.
- **Search** — quick lookup across clients and invoices from the topbar.
- **Security** — every Server Action is rate-limited (Postgres-backed
  sliding window), inputs are length/amount-capped and validated, uploads
  are checked for file type/size, and all data is scoped per-user via
  Postgres RLS.

## Tech stack

- [Next.js 16](https://nextjs.org) (App Router, TypeScript, Server Actions)
- [Tailwind CSS v4](https://tailwindcss.com)
- [Supabase](https://supabase.com) — Postgres, Auth, Storage, Edge Functions
- [Google Gemini API](https://ai.google.dev) — document extraction pipeline
- [Resend](https://resend.com) — transactional email
- [Frankfurter](https://frankfurter.dev) — daily exchange rates (no API key)

## Getting started

Install dependencies and copy the environment template:

```bash
npm install
```

Create `.env.local` in the project root with:

```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
GEMINI_API_KEY=your-gemini-api-key
# optional, defaults to gemini-2.5-flash
GEMINI_MODEL=gemini-2.5-flash
```

Then run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up to create an
account — you'll land on an empty dashboard, ready to add clients, invoices,
or expenses.

> **Windows note:** `npm run dev`/`npm run start` already set
> `NODE_OPTIONS=--use-system-ca` (via `cross-env`) so Node trusts the Windows
> system certificate store. This avoids hangs on machines where antivirus or
> a corporate VPN does HTTPS inspection.

## Supabase setup

The app expects the following in the Supabase project:

- Tables: `profiles`, `clients`, `invoices`, `expenses`, `notifications`,
  `exchange_rates`, `rate_limits` — all with RLS enabled, scoped to
  `auth.uid()`.
- A `handle_new_user_seed()` trigger on `auth.users` that creates the
  matching `profiles` row on signup (nothing else — no demo data).
- Two Edge Functions, each needing their own secrets configured in the
  Supabase dashboard (Edge Functions → Secrets):
  - `send-notification-email` — needs `RESEND_API_KEY` and
    `NOTIFICATION_WEBHOOK_SECRET` (also stored in Vault and read by the
    Postgres dispatch trigger).
  - `fetch-exchange-rates` — needs the same `NOTIFICATION_WEBHOOK_SECRET`,
    called daily via `pg_cron`.
- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are available to Edge
  Functions automatically; never expose the service role key to the
  Next.js app itself.

## Deployment

Deployed on [Vercel](https://vercel.com), which only needs the three
`NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` / `GEMINI_API_KEY`
environment variables set in the project settings — everything else lives in
Supabase's own Edge Function secrets.

## Project structure

```
app/
  (app)/          # authenticated routes: dashboard, clients, expenses, settings, plan, search
  (legal)/        # public privacy policy & terms of use
  login/          # sign in / sign up
lib/
  data/           # server-side data fetching (RLS-scoped)
  gemini/         # AI extraction pipeline
  supabase/       # Supabase client setup (browser, server, middleware)
  rate-limit.ts   # Postgres-backed rate limiter
  currency.ts     # display-currency conversion
components/       # UI, grouped by feature area
supabase/functions/ # Deno Edge Functions
```
