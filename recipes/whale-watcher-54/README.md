# Whale Watcher 54

> Recipe: Monitor wallet activity in the Harbor district and fire threshold alerts

## What It Does

1. **Scans mock wallet events** — simulates 5 wallet transactions in Harbor district
2. **Checks transaction threshold** — flags transactions ≥ $100 USDC as whale events
3. **Creates a mock alert** — structured `WhaleAlert` with severity classification
4. **Evaluates wallet-guard policy** — confirms the alert task fee is within policy
5. **Logs a mock receipt** — via `receipt-engine`, dry-run status, printed to console

## Safety

> **"No agent gets raw wallet power."**

- ✅ `dryRun: true` — no real funds move
- ✅ No real wallet addresses monitored (mock events only)
- ✅ No private keys handled
- ✅ All alerts and receipts are clearly marked `[MOCK]` / `DRY-RUN`

## Running

```bash
pnpm --filter @agentropolis/recipe-whale-watcher-54 dev
```

## Output

```
═══════════════════════════════════════════════════════
  AGENTROPOLIS-PAYRAIL — Recipe: Whale Watcher 54
  District: Harbor | Mode: DRY-RUN | Phase: 0 (MVP)
  No agent gets raw wallet power.
═══════════════════════════════════════════════════════

[whale-watcher-54] Scanning 5 mock wallet events...
[whale-watcher-54] Task fee: $0.01 USDC per alert

🐋 WHALE ALERT [MEDIUM]
  Alert ID:  alert_...
  Amount:    $150.00 USDC (inbound)
  Policy:    [DRY-RUN] Policy evaluated. No funds moved.

─────────────────────────── RECEIPT [DRY-RUN] ──────────────────────────
Receipt ID: rcpt_...
Amount:     $0.01 USDC
Status:     dry-run-accepted
```

## Alert Severity

| Amount | Severity |
|--------|----------|
| < $100 | (ignored) |
| $100 – $999 | medium |
| $1,000 – $9,999 | high |
| ≥ $10,000 | critical |

## TODO

- Phase 2: Replace mock events with real chain indexer / webhook
- Phase 2: Wire x402-adapter for real payment after approval
- Phase 2: Send alert to Discord / Slack webhook
- Phase 3: Persistent alert history
