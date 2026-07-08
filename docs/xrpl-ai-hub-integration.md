# XRPL AI Hub Integration Plan

Source: `https://xrpl-ai.org/`

## Why This Matters

XRPL AI Hub is a live discovery layer for AI projects, agents, x402 services, developer tools, and payment endpoints building on the XRP Ledger.

For AGENTROPOLIS-PAYRAIL, this creates a clean external lane for agentic commerce:

- XRP and RLUSD payment support
- x402-compatible paid APIs
- Public directory listing for production-safe endpoints
- Live payment endpoint discovery
- A builder map for XRPL-native agent infrastructure

## Positioning

AGENTROPOLIS-PAYRAIL should not become a raw wallet agent.

PAYRAIL remains the policy and receipt layer between agents and settlement rails.

```text
Agent request
  -> PAYRAIL gateway
  -> wallet guard policy
  -> task-bound receipt
  -> x402 adapter
  -> external signer or facilitator
  -> XRP / RLUSD settlement
```

## Implementation Phases

### Phase A - Research Lock

- [ ] Review `x402-xrpl` TypeScript and Python quickstarts.
- [ ] Review XRPL facilitator docs at `https://xrpl-x402.t54.ai`.
- [ ] Confirm whether PAYRAIL should use facilitator mode, direct settlement mode, or both.
- [ ] Define the minimum receipt fields required for audit and replay protection.

### Phase B - Dry-Run Adapter

- [ ] Add `XRPL_X402_DRY_RUN=true` config.
- [ ] Add XRP and RLUSD token enums to the payrail core package.
- [ ] Add mock XRPL x402 payment verification result.
- [ ] Emit receipts with `chain: xrpl`, `asset: XRP | RLUSD`, `settlementMode: dry-run`.

### Phase C - Guarded Live Settlement

- [ ] Integrate external signer or facilitator.
- [ ] Add per-agent, per-district, and per-token spend caps.
- [ ] Require operator approval for thresholds above policy.
- [ ] Reject settlement if the receipt is not bound to a task and endpoint.
- [ ] Add replay nonce and concurrency lock.

### Phase D - XRPL AI Hub Listing

- [ ] Publish a stable service manifest.
- [ ] Add docs for endpoint purpose, price, token, and rate limits.
- [ ] List only production-safe endpoints.
- [ ] Keep Akashic/FEN-only material out of business listings unless explicitly allowed.

## Candidate Public Services

| Service | Description | Settlement |
|---------|-------------|------------|
| PAYRAIL Quote | Return estimated cost for an agent task | Dry-run first |
| Receipt Verify | Verify task receipt hash and metadata | XRP/RLUSD candidate |
| District Billing | Return allowed districts and spending policies | Internal first |
| Agent Endpoint Registry | Discover approved Agentropolis agent services | Public candidate |

## Hard No Rules

- No seed phrase storage.
- No agent receives direct wallet signing power.
- No live payment without policy approval.
- No reused payment proof across endpoints.
- No hidden Akashic/FEN content leaking into business-safe listings.

## Build Notes

The XRPL AI Hub is a discovery layer. PAYRAIL is the controlled settlement layer. AGENTROPOLIS should use the hub for visibility and interoperability, while keeping all money movement behind wallet guard, receipt engine, and operator policy.
