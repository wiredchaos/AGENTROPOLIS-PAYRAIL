// ---------------------------------------------------------------------------
// AGENTROPOLIS-PAYRAIL — x402-adapter
//
// Governed adapters for HTTP 402 settlement rails.
//
// SECURITY BOUNDARY
// - This package never accepts seed phrases, mnemonics, or private keys.
// - XRPL payments must arrive already signed as a PAYMENT-SIGNATURE header.
// - Settlement is testnet-first and disabled by default.
// - Every settlement must be bound to an Agentropolis task and receipt.
// ---------------------------------------------------------------------------

import type { UsdcAmount } from "@agentropolis/payrail-core";
import {
  FacilitatorClient,
  type FacilitatorSupportedResponse,
  type PaymentRequirements,
  type PaymentVerifyResponse,
  type SettlementResponse,
  type XRPLNetworkId,
} from "x402-xrpl";

// ---------------------------------------------------------------------------
// Legacy Base / USDC stub
// ---------------------------------------------------------------------------

/** A settlement request sent to the legacy Base x402 adapter.
 * Note: contains NO private key — signing happens in an external service. */
export interface SettlementRequest {
  receiptId: string;
  agentId: string;
  districtId: string;
  toAddress: string;
  amountUsdc: UsdcAmount;
  taskId: string;
  /** Signed payment intent from external signing service (future phase). */
  signedIntent?: string;
}

export interface SettlementResult {
  success: boolean;
  txHash: string | null;
  message: string;
  simulatedOnly: boolean;
}

/**
 * Legacy Base / USDC simulation retained for backwards compatibility.
 * No funds move.
 */
export async function settle(request: SettlementRequest): Promise<SettlementResult> {
  console.warn(
    "[x402-adapter] BASE STUB: Real USDC settlement is not implemented. Returning simulated result.",
  );

  await new Promise((resolve) => setTimeout(resolve, 50));

  return {
    success: true,
    txHash: null,
    message: `[SIMULATED] Settlement of $${request.amountUsdc} USDC to ${request.toAddress} — no funds moved.`,
    simulatedOnly: true,
  };
}

/** Legacy Base verification stub. */
export async function verifySettlement(txHash: string): Promise<boolean> {
  console.warn(
    `[x402-adapter] BASE STUB: verifySettlement(${txHash}) is not implemented.`,
  );
  return false;
}

// ---------------------------------------------------------------------------
// XRPL x402 governed lane
// ---------------------------------------------------------------------------

export type XrplAsset = "XRP" | "RLUSD" | "IOU";

export interface XrplX402Config {
  network: XRPLNetworkId;
  facilitatorUrl: string;
  timeoutMs: number;
  enabled: boolean;
  dryRun: boolean;
  allowMainnet: boolean;
}

export interface XrplExecutionContext {
  taskId: string;
  receiptId: string;
  agentId: string;
  districtId: string;
  approvalId: string;
}

export interface XrplVerifyInput {
  paymentHeader: string;
  paymentRequirements: PaymentRequirements;
  extensions?: Record<string, unknown> | null;
}

export interface XrplSettleInput extends XrplVerifyInput {
  context: XrplExecutionContext;
}

export interface GovernedXrplSettlementResult {
  success: boolean;
  simulatedOnly: boolean;
  transaction: string | null;
  network: string;
  payer: string | null;
  errorReason: string | null;
  context: XrplExecutionContext;
  facilitatorUrl: string;
}

const DEFAULT_FACILITATORS: Record<XRPLNetworkId, string> = {
  "xrpl:0": "https://xrpl-facilitator-mainnet.t54.ai",
  "xrpl:1": "https://xrpl-facilitator-testnet.t54.ai",
  "xrpl:2": "https://xrpl-facilitator-devnet.t54.ai",
};

const FORBIDDEN_SECRET_KEYS = [
  "seed",
  "secret",
  "privatekey",
  "private_key",
  "mnemonic",
  "recoveryphrase",
  "recovery_phrase",
];

function envFlag(value: string | undefined, defaultValue: boolean): boolean {
  if (value === undefined) return defaultValue;
  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
}

function isXrplNetwork(value: string | undefined): value is XRPLNetworkId {
  return value === "xrpl:0" || value === "xrpl:1" || value === "xrpl:2";
}

/** Resolve guarded XRPL configuration from environment variables. */
export function getXrplX402Config(
  env: NodeJS.ProcessEnv = process.env,
): XrplX402Config {
  const network = isXrplNetwork(env.XRPL_X402_NETWORK)
    ? env.XRPL_X402_NETWORK
    : "xrpl:1";

  const configuredUrl = env.XRPL_X402_FACILITATOR_URL?.trim();

  return {
    network,
    facilitatorUrl: configuredUrl || DEFAULT_FACILITATORS[network],
    timeoutMs: Number(env.XRPL_X402_TIMEOUT_MS ?? 30_000),
    enabled: envFlag(env.XRPL_X402_ENABLED, false),
    dryRun: envFlag(env.XRPL_X402_DRY_RUN, true),
    allowMainnet: envFlag(env.XRPL_X402_ALLOW_MAINNET, false),
  };
}

/** Reject any object that appears to contain raw wallet secret material. */
export function assertNoSecretMaterial(value: unknown, path = "payload"): void {
  if (Array.isArray(value)) {
    value.forEach((item, index) => assertNoSecretMaterial(item, `${path}[${index}]`));
    return;
  }

  if (!value || typeof value !== "object") return;

  for (const [key, nested] of Object.entries(value as Record<string, unknown>)) {
    const normalized = key.toLowerCase().replace(/[-\s]/g, "_");
    const compact = normalized.replace(/_/g, "");
    if (
      FORBIDDEN_SECRET_KEYS.includes(normalized) ||
      FORBIDDEN_SECRET_KEYS.includes(compact)
    ) {
      throw new Error(`Forbidden wallet secret field detected at ${path}.${key}`);
    }
    assertNoSecretMaterial(nested, `${path}.${key}`);
  }
}

function clientFor(config: XrplX402Config): FacilitatorClient {
  return new FacilitatorClient({
    baseUrl: config.facilitatorUrl,
    timeoutMs: config.timeoutMs,
  });
}

function assertRequirementsMatchNetwork(
  requirements: PaymentRequirements,
  config: XrplX402Config,
): void {
  if (requirements.network !== config.network) {
    throw new Error(
      `XRPL network mismatch: requirement=${requirements.network}, configured=${config.network}`,
    );
  }

  if (requirements.scheme !== "exact") {
    throw new Error(`Unsupported XRPL x402 scheme: ${requirements.scheme}`);
  }
}

function assertSettlementAuthorized(
  input: XrplSettleInput,
  config: XrplX402Config,
): void {
  if (!config.enabled) {
    throw new Error("XRPL x402 settlement is disabled. Set XRPL_X402_ENABLED=true.");
  }

  if (config.network === "xrpl:0" && !config.allowMainnet) {
    throw new Error(
      "XRPL mainnet settlement is blocked. Set XRPL_X402_ALLOW_MAINNET=true after operator approval.",
    );
  }

  const requiredContextFields: Array<keyof XrplExecutionContext> = [
    "taskId",
    "receiptId",
    "agentId",
    "districtId",
    "approvalId",
  ];

  for (const field of requiredContextFields) {
    if (!input.context[field]?.trim()) {
      throw new Error(`Missing task-bound settlement context: ${field}`);
    }
  }
}

/** Read-only discovery of facilitator-supported schemes and networks. */
export async function getXrplSupported(
  config = getXrplX402Config(),
): Promise<FacilitatorSupportedResponse> {
  return clientFor(config).supported();
}

/** Verify an already-signed XRPL payment without settling it. */
export async function verifyXrplPayment(
  input: XrplVerifyInput,
  config = getXrplX402Config(),
): Promise<PaymentVerifyResponse> {
  assertNoSecretMaterial(input);
  assertRequirementsMatchNetwork(input.paymentRequirements, config);

  return clientFor(config).verify({
    paymentHeader: input.paymentHeader,
    paymentRequirements: input.paymentRequirements,
    extensions: input.extensions,
  });
}

/**
 * Settle an already-signed XRPL x402 payment through the configured facilitator.
 *
 * Dry-run is the default. Live settlement requires:
 * - XRPL_X402_ENABLED=true
 * - XRPL_X402_DRY_RUN=false
 * - a complete task/receipt/approval context
 * - XRPL_X402_ALLOW_MAINNET=true when network=xrpl:0
 */
export async function settleXrplPayment(
  input: XrplSettleInput,
  config = getXrplX402Config(),
): Promise<GovernedXrplSettlementResult> {
  assertNoSecretMaterial(input);
  assertRequirementsMatchNetwork(input.paymentRequirements, config);
  assertSettlementAuthorized(input, config);

  if (config.dryRun) {
    return {
      success: true,
      simulatedOnly: true,
      transaction: null,
      network: config.network,
      payer: null,
      errorReason: null,
      context: input.context,
      facilitatorUrl: config.facilitatorUrl,
    };
  }

  const settled: SettlementResponse = await clientFor(config).settle({
    paymentHeader: input.paymentHeader,
    paymentRequirements: input.paymentRequirements,
    extensions: input.extensions,
  });

  return {
    success: settled.success,
    simulatedOnly: false,
    transaction: settled.transaction || null,
    network: settled.network,
    payer: settled.payer ?? null,
    errorReason: settled.errorReason ?? null,
    context: input.context,
    facilitatorUrl: config.facilitatorUrl,
  };
}
