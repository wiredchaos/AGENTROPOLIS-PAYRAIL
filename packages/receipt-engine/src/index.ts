// ---------------------------------------------------------------------------
// AGENTROPOLIS-PAYRAIL — receipt-engine
// Creates, validates, and stores auditable task receipts.
//
// Receipts are immutable records. Once issued, they are never modified.
// Settled receipts include a tx hash from the x402-adapter (Phase 2).
// ---------------------------------------------------------------------------

import {
  generateId,
  formatTimestamp,
  roundUsdc,
  type AgentId,
  type DistrictId,
  type TaskId,
  type ReceiptId,
  type UsdcAmount,
} from "@agentropolis/payrail-core";

export const RECEIPT_SCHEMA_VERSION = "1.0.0";

// ---------------------------------------------------------------------------
// Receipt type
// ---------------------------------------------------------------------------

export type ReceiptStatus =
  | "dry-run-accepted"
  | "pending-approval"
  | "settled"
  | "failed"
  | "cancelled";

export interface AgentTaskReceipt {
  receiptId: ReceiptId;
  schemaVersion: typeof RECEIPT_SCHEMA_VERSION;
  taskId: TaskId;
  agentId: AgentId;
  districtId: DistrictId;
  taskType: string;
  description: string;
  amountUsdc: UsdcAmount;
  currency: "USDC";
  status: ReceiptStatus;
  dryRun: boolean;
  /** TODO: Phase 2 — x402-adapter populates this after on-chain settlement */
  settlementTxHash: string | null;
  policyId?: string;
  issuedAt: string;
  settledAt: string | null;
  metadata?: Record<string, unknown>;
}

export interface CreateReceiptInput {
  taskId: TaskId;
  agentId: AgentId;
  districtId: DistrictId;
  taskType: string;
  description: string;
  amountUsdc: UsdcAmount;
  status: ReceiptStatus;
  dryRun: boolean;
  policyId?: string;
  metadata?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// In-memory store (Phase 1: replace with DB)
// ---------------------------------------------------------------------------

/** TODO: Phase 1 — replace in-memory store with SQLite / Postgres persistence */
const receiptStore = new Map<ReceiptId, AgentTaskReceipt>();

// ---------------------------------------------------------------------------
// Core functions
// ---------------------------------------------------------------------------

/**
 * Create and store a new receipt for an agent task payment.
 * This is the only way to produce a receipt — never construct one manually.
 */
export function createReceipt(input: CreateReceiptInput): AgentTaskReceipt {
  const receiptId = generateId("rcpt") as ReceiptId;
  const now = formatTimestamp(new Date());

  const receipt: AgentTaskReceipt = {
    receiptId,
    schemaVersion: RECEIPT_SCHEMA_VERSION,
    taskId: input.taskId,
    agentId: input.agentId,
    districtId: input.districtId,
    taskType: input.taskType,
    description: input.description,
    amountUsdc: roundUsdc(input.amountUsdc),
    currency: "USDC",
    status: input.status,
    dryRun: input.dryRun,
    settlementTxHash: null,
    policyId: input.policyId,
    issuedAt: now,
    settledAt: null,
    metadata: input.metadata,
  };

  receiptStore.set(receiptId, receipt);
  return receipt;
}

/**
 * Retrieve a receipt by ID.
 */
export function getReceipt(receiptId: ReceiptId): AgentTaskReceipt | undefined {
  return receiptStore.get(receiptId);
}

/**
 * Mark a receipt as settled (called after x402 on-chain confirmation).
 * TODO: Phase 2 — called by x402-adapter after settlement confirmation
 */
export function markSettled(receiptId: ReceiptId, txHash: string): AgentTaskReceipt {
  const receipt = receiptStore.get(receiptId);
  if (!receipt) {
    throw new Error(`Receipt not found: ${receiptId}`);
  }
  const settled: AgentTaskReceipt = {
    ...receipt,
    status: "settled",
    settlementTxHash: txHash,
    settledAt: formatTimestamp(new Date()),
  };
  receiptStore.set(receiptId, settled);
  return settled;
}

/**
 * List all receipts (for audit/dashboard use).
 * TODO: Phase 1 — add filtering by agentId, districtId, date range
 */
export function listReceipts(): AgentTaskReceipt[] {
  return Array.from(receiptStore.values());
}

/**
 * Print a receipt to console in a structured, human-readable format.
 */
export function printReceipt(receipt: AgentTaskReceipt): void {
  const dryTag = receipt.dryRun ? " [DRY-RUN]" : "";
  console.log("─────────────────────────────────────────");
  console.log(`AGENTROPOLIS-PAYRAIL RECEIPT${dryTag}`);
  console.log("─────────────────────────────────────────");
  console.log(`Receipt ID:   ${receipt.receiptId}`);
  console.log(`Task ID:      ${receipt.taskId}`);
  console.log(`Agent:        ${receipt.agentId}`);
  console.log(`District:     ${receipt.districtId}`);
  console.log(`Task Type:    ${receipt.taskType}`);
  console.log(`Description:  ${receipt.description}`);
  console.log(`Amount:       $${receipt.amountUsdc} ${receipt.currency}`);
  console.log(`Status:       ${receipt.status}`);
  console.log(`TX Hash:      ${receipt.settlementTxHash ?? "—"}`);
  console.log(`Issued At:    ${receipt.issuedAt}`);
  console.log(`Settled At:   ${receipt.settledAt ?? "—"}`);
  console.log("─────────────────────────────────────────");
}
