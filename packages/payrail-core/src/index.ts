// ---------------------------------------------------------------------------
// AGENTROPOLIS-PAYRAIL — payrail-core
// Shared types, utilities, and constants used across the monorepo.
// ---------------------------------------------------------------------------

export const PAYRAIL_VERSION = "0.1.0";

// ---------------------------------------------------------------------------
// Core domain types
// ---------------------------------------------------------------------------

/** Unique identifier types — branded strings for type safety */
export type AgentId = string & { readonly __brand: "AgentId" };
export type DistrictId = string & { readonly __brand: "DistrictId" };
export type TaskId = string & { readonly __brand: "TaskId" };
export type ReceiptId = string & { readonly __brand: "ReceiptId" };
export type PolicyId = string & { readonly __brand: "PolicyId" };

/** USDC amount represented as a decimal number (e.g. 0.05 = $0.05) */
export type UsdcAmount = number;

// ---------------------------------------------------------------------------
// Payment request
// ---------------------------------------------------------------------------

export interface PaymentRequest {
  agentId: AgentId;
  districtId: DistrictId;
  taskId: TaskId;
  taskType: string;
  amountUsdc: UsdcAmount;
  description: string;
  dryRun: boolean;
  requestedAt: string; // ISO 8601
  metadata?: Record<string, unknown>;
}

// ---------------------------------------------------------------------------
// Payment result
// ---------------------------------------------------------------------------

export type PaymentStatus =
  | "dry-run-accepted"
  | "policy-blocked"
  | "pending-approval"
  | "settled"
  | "failed";

export interface PaymentResult {
  status: PaymentStatus;
  taskId: TaskId;
  receiptId: ReceiptId | null;
  amountUsdc: UsdcAmount;
  message: string;
  timestamp: string;
}

// ---------------------------------------------------------------------------
// Districts
// ---------------------------------------------------------------------------

export const DISTRICTS = {
  DOWNTOWN: "downtown" as DistrictId,
  HARBOR: "harbor" as DistrictId,
  TECH_ROW: "tech-row" as DistrictId,
  TERRA54: "terra54" as DistrictId,
  DARK_ALLEY: "dark-alley" as DistrictId,
  ARCHIVES: "archives" as DistrictId,
} as const;

export type KnownDistrict = (typeof DISTRICTS)[keyof typeof DISTRICTS];

// ---------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------

/** Format a Date as an ISO 8601 timestamp string */
export function formatTimestamp(date: Date): string {
  return date.toISOString();
}

/** Generate a prefixed unique ID using crypto.randomUUID() (Node.js 15.6+) */
export function generateId(prefix: string): string {
  const uuid = crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  return `${prefix}_${uuid}`;
}

/** Clamp a number to a min/max range */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Round USDC to 6 decimal places (USDC has 6 decimals on-chain) */
export function roundUsdc(amount: UsdcAmount): UsdcAmount {
  return Math.round(amount * 1_000_000) / 1_000_000;
}
