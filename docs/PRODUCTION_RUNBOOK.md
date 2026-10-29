# BIDVERSE — Live event release and recovery runbook

## Launch gate (all required)
- [ ] Latest Vercel production deployment is READY.
- [ ] Administrator, operator and two separate verified captain accounts can sign in.
- [ ] Each captain sees only their assigned team; test unauthorized team bid rejection.
- [ ] Execute `node tests/concurrent-auction.mjs` using an isolated event, two freshly authenticated test-captain sessions, and a test lot. Record output and timestamp.
- [ ] Verify bid sequence, duplicate request behavior, timer cutoff, budget reservation, and exactly-one roster assignment after sale.
- [ ] Verify cross-device sync, forced offline/reconnect, and projector fullscreen.
- [ ] Confirm database backup coverage and complete one recovery rehearsal with a disposable environment.
- [ ] Designate an auction controller, backup operator, and an incident escalation contact.

## During auction
1. Keep System Health open on the operator console. A green connection only indicates subscription state, not multi-device consistency.
2. Announce and open the player lot. Confirm all bidding devices display the same player and minimum bid.
3. Start countdown if desired. Deadlines are enforced by the database; operator still finalizes or pauses the lot.
4. For each sold player, confirm exactly one roster entry and the team purse deduction.
5. Export post-auction results and preserve audit logs in an access-controlled location.

## Incident response
1. **Stop the auction** and pause its active lot. Do not accept unrecorded bids.
2. Capture event ID, lot ID, device time, and latest bid sequence. Never collect JWTs or passwords.
3. On System Health, refresh authoritative state. Confirm bid and lot details using an administrator account.
4. Check Supabase logs, Vercel deployment status and audit trail. If data diverges, leave auction paused.
5. Resume only after operator and captains confirm the same current player, bid and purse.
6. If an emergency rollback is necessary, use the Vercel dashboard to redeploy the last known-good build. Database migrations require their own reviewed recovery plan and must not be assumed reversible.

## Backups
Confirm the Supabase project's current plan-supported backup/PITR options in its dashboard. Enable applicable backups and validate a restore in an isolated database. Do not restore over production during a live auction without an approved incident plan.

## Limitations
The automated JS rule tests and static architecture checks are **not** database transaction tests. The authenticated concurrent-bidding test must be run separately with real isolated accounts. No production-launch approval is implied by a successful build alone.
