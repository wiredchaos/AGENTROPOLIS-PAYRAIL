// ---------------------------------------------------------------------------
// AGENTROPOLIS-PAYRAIL — x402-adapter
//
// Stub for x402 / USDC on-chain settlement.
//
// ⚠️  PHASE 2 ONLY — This module does NOT currently perform real settlement.
// ⚠️  This module NEVER stores, accepts, or processes private keys or seed phrases.
// ⚠️  "No agent gets raw wallet power."
//
// Real settlement will be implemented in Phase 2 using an external signing
// service (e.g. hardware wallet, MPC signer, or custodial API). The agent
// submits a signed payment intent — NOT a raw key.
//
// TODO: Phase 2 — integrate x402 protocol (https://x402.org)
// TODO: Phase 2 — connect to Base testnet USDC contract
// TODO: Phase 2 — wire receipt-engine.markSettled() after tx confirmation
// TODO: Phase 2 — implement exponential backoff for tx confirmation polling
// TODO: Phase 3 — support mainnet USDC settlement with approval gates
// ---------------------------------------------------------------------------

import type { UsdcAmount } from "@agentropolis/payrail-core";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A settlement request sent to the x402 adapter.
 *  Note: contains NO private key — signing happens in an external service. */
export interface SettlementRequest {
  receiptId: string;
  agentId: string;
  districtId: string;
  toAddress: string;
  amountUsdc: UsdcAmount;
  taskId: string;
  /** Signed payment intent from external signing service (Phase 2) */
  signedIntent?: string;
}

export interface SettlementResult {
  success: boolean;
  txHash: string | null;
  message: string;
  simulatedOnly: boolean;
}

// ---------------------------------------------------------------------------
// Adapter
// ---------------------------------------------------------------------------

/**
 * Settle a payment via x402 / USDC.
 *
 * Phase 0/1: Always returns a simulated result — no real funds move.
 * Phase 2: Will call external signing service and submit tx to Base.
 *
 * This function intentionally refuses any private key material.
 */
export async function settle(request: SettlementRequest): Promise<SettlementResult> {
  // Phase 0/1 stub: simulate settlement
  // TODO: Phase 2 — replace this block with real x402 HTTP call
  console.warn(
    "[x402-adapter] STUB: Real settlement not implemented. Returning simulated result."
  );

  // Simulate a small async delay (as a real network call would have)
  await new Promise((resolve) => setTimeout(resolve, 50));

  return {
    success: true,
    txHash: null, // TODO: Phase 2 — return real Base tx hash
    message: `[SIMULATED] Settlement of $${request.amountUsdc} USDC to ${request.toAddress} — not yet real.`,
    simulatedOnly: true,
  };
}

/**
 * Verify a settlement by tx hash.
 *
 * Phase 0/1: Always returns unconfirmed.
 * TODO: Phase 2 — query Base RPC to confirm tx finality
 */
export async function verifySettlement(txHash: string): Promise<boolean> {
  console.warn(
    `[x402-adapter] STUB: verifySettlement(${txHash}) — not implemented. Phase 2.`
  );
  return false;
}
