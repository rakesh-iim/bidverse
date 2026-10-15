# BIDVERSE — Phase 2 (Development)

Next.js 15 / React 19 / TypeScript / Supabase auction dashboard. Includes Command Center, Live Arena, Team Portal, and Intelligence with responsive light styling.

## Status
**Source committed to main; build, authentication tests, realtime publication and production readiness NOT verified.** This repository is a compact connected implementation, not yet a bit-for-bit port of the original 83 KB Phase 1 Signature demo. The original standalone prototype remains in the ChatGPT Phase 2 ZIP.

## Setup
1. `cp .env.example .env.local`
2. Replace the placeholder publishable key from Supabase Dashboard → Settings → API Keys; never use your secret/service-role key in `NEXT_PUBLIC_...` values.
3. `npm install`
4. `npx tsc --noEmit`
5. `npm run build`
6. `npm run dev`, then open http://localhost:3000.

Supabase project: `zrzqwtciyaibdeuumaee`.

## Database
Two existing migrations created the schema, RLS, and auction RPCs. Do **not** rerun them automatically against the same database. The backend has event, player, team, lot, bid, roster and audit tables.

## Important limitations
- Auth account creation and team/operator membership assignment need an admin onboarding flow. Event creation assigns the creator as admin only for their new event.
- Realtime publication configuration has not been deployed. Postgres Changes subscriptions may not deliver all changes until configured and tested; this is NOT production-ready synchronization.
- No full concurrency, authorization, auction pause/correction, countdown, offline and edge-case testing has been completed.
- The mobile Team Portal requires an assigned captain role to submit bids.
- Current interface needs a visual parity pass against the approved original Signature Edition HTML.

## Deploy
Connect `rakesh-iim/bidverse` to Vercel after a passing build. Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as environment variables, and set the correct Supabase Auth redirect URLs.

**Do not operate a real auction until server-side bidding, RLS policies, and concurrent bids have been verified.**
