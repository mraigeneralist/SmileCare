@AGENTS.md

# SmileCare Dental - Booking Website

## Project Overview

Dentist appointment booking website with WhatsApp OTP verification, automated reminders, and admin dashboard.

## Tech Stack

- **Framework:** Next.js 16.2.3 (App Router)
- **Frontend:** React 19, Tailwind CSS v4
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth (email/password)
- **Messaging:** WhatsApp Cloud API or Telegram Bot API (configurable via `MESSAGING_PROVIDER`)
- **Deployment:** Vercel
- **Language:** TypeScript (strict)

## Project Structure

```
app/               Pages and API routes (Next.js App Router)
  admin/            Admin dashboard (protected)
  api/              API endpoints (booking, admin, reminders)
  book/             Multi-step booking flow
  login/            Admin login
components/         Reusable UI components
  landing/          Landing page sections
  booking/          Booking flow step components
  admin/            Admin dashboard components
lib/                Shared utilities
  supabase.ts       Client-side Supabase (anon key)
  supabase-server.ts Server-side Supabase (service role key)
  whatsapp.ts       WhatsApp Cloud API helpers
  telegram.ts       Telegram Bot API helpers
  messaging.ts      Provider switcher (whatsapp or telegram)
  types.ts          TypeScript interfaces
```

## Key Conventions

- All styling is inline Tailwind CSS (no component library)
- Theme uses CSS variables defined in `globals.css` (teal/cyan palette)
- Server-side API routes use `supabaseServer` from `lib/supabase-server.ts`
- Client-side code uses `supabase` from `lib/supabase.ts`
- Admin routes require Supabase auth session
- Cron endpoint (`/api/reminders`) is secured with `CRON_SECRET` bearer token

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
WHATSAPP_PHONE_NUMBER_ID=
WHATSAPP_ACCESS_TOKEN=
DENTIST_WHATSAPP_NUMBER=
MESSAGING_PROVIDER=          # "whatsapp" (default) or "telegram"
TELEGRAM_BOT_TOKEN=          # Telegram Bot API token (from @BotFather)
TELEGRAM_DENTIST_CHAT_ID=    # Telegram chat ID for dentist notifications
CRON_SECRET=
```

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
npm run lint     # Run ESLint
```
