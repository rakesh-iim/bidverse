# BIDVERSE — Supabase security baseline (29 October 2026)

Scope: read-only production inspection of project `zrzqwtciyaibdeuumaee`. No schema, Auth, policy, grants, or auction data were modified.

## Findings

1. **18 callable SECURITY DEFINER functions** (Supabase security advisor: WARN). Every such function checked through `has_function_privilege` was **not executable by `anon`**, but was executable by `authenticated`. These exposed RPC entry points require authorization testing, not blanket revocation: the app depends on them.
   - `submit_auction_bid` currently checks an authenticated principal and event membership role/team before placing a bid, and locks its lot row for bid concurrency. Full negative role testing remains pending.
   - `claim_bidverse_captain_invite` checks that the caller is signed in with the verified invited email and that an invitation is unused/unexpired.
   - All 18 functions report an explicit empty `search_path` in `proconfig`.
   - The above is a source inspection, not proof of exploit resistance or complete functional correctness.
   - Remediation guidance: https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable

2. **RLS enabled with no policy on `public.event_invites`** (advisor INFO). This means direct client access should be denied; invite operations currently use vetted RPCs. Validate the intended closed-table design in staging and confirm no unintended grant/path enables disclosure. Do not add a permissive SELECT policy merely to silence the advisor.
   - https://supabase.com/docs/guides/database/database-linter?lint=0008_rls_enabled_no_policy

3. **Leaked-password protection advisory** (advisor WARN). Review the Supabase Auth dashboard configuration and enable leaked-password protection when supported. Confirm it with a harmless test account in staging rather than testing compromised passwords against real accounts.
   - https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection

4. **Performance notices** include 13 unindexed foreign-key findings. Prioritize based on actual query patterns and execution plans after staging is available; index changes are not part of this read-only review.
   - https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys

## Safety gate added to automated auction integration
`tests/concurrent-auction.mjs` now rejects the known production Supabase hostname **before any network request**. It requires an explicit HTTPS Supabase project URL and is tested in `tests/deployment-policy.test.mjs`. This protects against accidental production-target configuration; it does not replace dedicated staging and test-user permissions.

## Required acceptance before live release
- [ ] Establish a separately provisioned staging Supabase environment; test-only captain accounts, teams and lots.
- [ ] Confirm exact authenticated role checks inside all 18 callable SECURITY DEFINER functions.
- [ ] Execute unauthorized-role, cross-event, cross-team, replay, overflow, timer-expiry, and simultaneous bid test cases.
- [ ] Verify auth signup/confirmation and password recovery email delivery.
- [ ] Validate `event_invites` privacy and account-claim rules.
- [ ] Review leaked-password protection and rate limits in Auth settings.
- [ ] Capture GitHub CI run evidence, concurrency output, multi-device synchronization proof and backup restore rehearsal.
- [ ] Re-run Supabase security and performance advisors after any migration.

**Launch status: NOT APPROVED.** This review does not imply passing live concurrency, authorization, email, or recovery tests.
