# BIDVERSE — Production Hardening In Progress

Next.js 15 / React 19 / TypeScript / Supabase auction dashboard. Includes Command Center, Live Arena, Team Portal, and Intelligence with responsive light styling.

## Status
**Current Vercel deployment is READY; production approval is NOT granted.** This repository is a compact connected implementation, not yet a bit-for-bit port of the original 83 KB Phase 1 Signature demo. The original standalone prototype remains in the ChatGPT Phase 2 ZIP.

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
- Email signup, account confirmation, captain invitations and role assignment exist in code, but end-to-end email delivery and onboarding still require acceptance testing.
- Realtime publication contains events, teams, auction_lots, bids and roster_assignments. Multi-device delivery and reconnect consistency are not yet proven.
- Automated auction-rule tests and an authenticated concurrency script exist; full database concurrency, authorization, offline and correction acceptance has not been verified.
- The mobile Team Portal requires an assigned captain role to submit bids.
- Current interface needs a visual parity pass against the approved original Signature Edition HTML.

## Deploy
The repository is connected to Vercel; deploy from the reviewed main branch after passing validation. Configure `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` as environment variables, and set the correct Supabase Auth redirect URLs.

**Do not operate a real auction until server-side bidding, RLS policies, and concurrent bids have been verified.**

## Current access model
The root route is authenticated. The public /demo route is local-only and does not use Supabase for its simulated actions. See docs/PHASE1_FOUNDATION.md for staging and outstanding release checks.

## Dependency reproducibility
A reviewed package-lock.json is not yet committed. The CI installation step warns when missing; generate, review and commit a lockfile before making release builds reproducible.
