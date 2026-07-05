# x402-adapter

> x402 / USDC settlement adapter stub for AGENTROPOLIS-PAYRAIL

## ⚠️ Phase 2 — Not yet implemented

This package is a **stub**. It defines the settlement interface that will be wired to real x402 / USDC on-chain settlement in Phase 2.

## Safety Model

> **"No agent gets raw wallet power."**

- This adapter **never** accepts, stores, or processes private keys or seed phrases.
- Real settlement will use an **external signing service** (hardware wallet, MPC signer, or custodial API).
- Agents submit a **signed payment intent** — not a raw key.

## Current Behavior

All calls to `settle()` return a simulated result with `simulatedOnly: true` and `txHash: null`. No funds move.

## Phase 2 Plan

1. Integrate [x402 protocol](https://x402.org) HTTP payment headers
2. Connect to Base testnet USDC contract (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`)
3. Wire `receipt-engine.markSettled()` after tx confirmation
4. Implement exponential backoff for confirmation polling
5. Approval gate for mainnet

## TODO

- Phase 2: Real x402 HTTP call in `settle()`
- Phase 2: Base RPC tx verification in `verifySettlement()`
- Phase 2: Connect to receipt-engine on confirmation
- Phase 3: Mainnet USDC with approval gates
