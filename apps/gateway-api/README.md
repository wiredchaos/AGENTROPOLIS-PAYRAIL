# gateway-api

> Agent-facing REST gateway for AGENTROPOLIS-PAYRAIL

## Overview

The `gateway-api` is the primary HTTP entry point for autonomous agents requesting payment operations inside Agentropolis. It delegates to:

- **`wallet-guard`** — enforces spend limits, dry-run policy, blocked districts
- **`receipt-engine`** — creates auditable task receipts
- **`pricing-rules`** — looks up district pricing
- **`x402-adapter`** — settlement (stub until Phase 2)

> **"No agent gets raw wallet power."** The gateway accepts task metadata and amounts — never private keys or seed phrases.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Liveness check — returns version and timestamp |
| `POST` | `/pay` | Submit a payment request for a completed task |

## Running

```bash
pnpm --filter gateway-api dev
```

Default port: `3000`

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | HTTP port to listen on |

## TODO

- Phase 1: Wire real `wallet-guard` policy evaluation on `/pay`
- Phase 1: Wire `receipt-engine` persistence
- Phase 2: Connect x402-adapter for real USDC settlement on testnet
- Phase 2: Agent authentication (JWT / API key)
- Phase 3: Rate limiting, audit export
