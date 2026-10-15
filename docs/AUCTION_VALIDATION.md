# BIDVERSE controlled auction validation

This is an **isolated test framework**, not a certification of production concurrency.

## Before running
1. Create a separate test event; do not test with a live student auction.
2. Register and verify three distinct Supabase Auth users: admin and two captains.
3. Assign both captains to separate teams in Event Setup and ensure the event has one player.
4. Set the event to live, open a lot, and confirm the admin, captain A and captain B are signed in on three devices.
5. Save the test event UUID and three JWT access tokens in a **local-only** environment; never commit tokens or a service-role key.

## Run
```sh
BIDVERSE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co \
BIDVERSE_ANON_KEY=YOUR_PUBLISHABLE_OR_ANON_KEY \
BIDVERSE_TEST_LOT_ID=YOUR_TEST_LOT_UUID \
BIDVERSE_TEST_TEAM_A=YOUR_TEAM_A_UUID \
BIDVERSE_TEST_TEAM_B=YOUR_TEAM_B_UUID \
BIDVERSE_CAPTAIN_A_JWT=CAPTAIN_A_ACCESS_TOKEN \
BIDVERSE_CAPTAIN_B_JWT=CAPTAIN_B_ACCESS_TOKEN \
node tests/concurrent-auction.mjs
```

The script sends two bids **concurrently** to the real `submit_auction_bid` RPC using different authenticated sessions. It reads the authoritative resulting lot and bid rows. A successful run proves only that test's specific circumstances. Run it repeatedly and test finalization, timer expiry, and reconnection separately. It does not create accounts, alter event memberships, or touch other events.

## Manual acceptance gates
- [ ] Exact sequence and highest bid agree across both captain devices, operator and fullscreen arena.
- [ ] A reused request ID produces the original accepted bid rather than a duplicate.
- [ ] Insufficient budget and invalid increments are rejected.
- [ ] After a deadline, a new request is rejected by Postgres.
- [ ] Selling a player creates exactly one roster assignment and decreases purse once.
- [ ] A captain cannot bid on another team's behalf or use the operator's verbal-bid mode.
- [ ] Disconnected devices reconnect and converge to the server state.
- [ ] Unsold or cancelled player can be requeued, but a purchased player cannot.
- [ ] Database backup and recovery procedure have been reviewed before an event.

## Operator fallback
If connectivity is unstable, **pause the active lot**. Stop accepting bids until all screens have synchronized, verify authoritative bid history in Command Center, then resume. Do not use verbal backup bids outside BIDVERSE without a clearly documented reconciliation procedure. A failed deployment or failed acceptance test blocks launch.

## Release gate
Do **not** mark production-ready until the test script, multi-device manual acceptance, role-permission tests, and backup rehearsal all pass and are documented.
