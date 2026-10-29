# BIDVERSE Phase 1 — Foundation and staging

## Current implementation (verified from source)
- The root route renders the authenticated Dashboard.
- The public /demo route uses local state only and must not write to Supabase.
- Supabase client receives only a public/publishable credential.
- Authenticated auction data continues to be protected by database row-level policies.
- A session-loading screen prevents the sign-in form flashing while authentication is restored.
- Tests in tests/architecture.test.mjs protect the primary route and demo isolation.

## Staging creation (not yet provisioned)
1. Create a *separate* Supabase staging project in the dashboard, with its own database, Auth settings, and publishable key. Do not copy production user accounts or secrets.
2. Apply reviewed SQL migrations in order to staging, and use test-only emails and events.
3. In Vercel, use a staging Git branch or Preview environment; set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY **for Preview** to staging values.
4. Allow the Preview deployment URL in the staging Supabase Auth URL configuration (redirect allow-list). Do not add wildcard origins covering arbitrary subdomains.
5. Validate demo signup, confirmation, password recovery, captain invites, Realtime connectivity, bidding, and audit logs against staging.
6. Confirm production environment points only at the production Supabase project. Test credentials must never be used for real auctions.

## Production safeguards
- Do not put service-role credentials, JWT secrets, SMTP passwords or database connection credentials in NEXT_PUBLIC variables.
- Do not bypass auth in Dashboard to enable demonstrations. Public demo lives at /demo.
- Keep API-side authorization in Postgres policies and RPCs; UI restrictions alone are insufficient.
- Require passing CI, two-captain transactional integration tests, role isolation tests, four-device manual acceptance, and a backup rehearsal before live use.
- Restore the login reference artwork only after adding the actual asset. A fallback illustration remains possible.

## Known blockers
- package-lock.json is not committed: npm install resolves floating transitive dependencies. Create and commit a reviewed lockfile using npm install on a trusted development machine, then switch CI to npm ci.
- The repository's previous README is stale and should not be treated as a release certification.
- Staging Supabase/Vercel environments have not been provisioned.
- End-to-end Auth email delivery, concurrent bidding, four-device recovery, and backup restoration are not yet verified.
