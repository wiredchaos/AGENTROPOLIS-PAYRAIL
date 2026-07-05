// ---------------------------------------------------------------------------
// AGENTROPOLIS-PAYRAIL — pricing-rules
// Looks up district pricing rules for task types.
// ---------------------------------------------------------------------------

import type { DistrictId, UsdcAmount } from "@agentropolis/payrail-core";

// ---------------------------------------------------------------------------
// Pricing rule types
// ---------------------------------------------------------------------------

export interface PricingRule {
  ruleId: string;
  districtId: DistrictId | "*";
  taskType: string;
  basePriceUsdc: UsdcAmount;
  description: string;
  multiplier: number;
  notes?: string;
  active: boolean;
}

// ---------------------------------------------------------------------------
// Built-in rules (mirrors examples/base-pricing.json)
// TODO: Phase 1 — load from JSON config or DB, not hardcoded
// ---------------------------------------------------------------------------

const BASE_RULES: PricingRule[] = [
  {
    ruleId: "downtown-osint-lookup",
    districtId: "downtown" as DistrictId,
    taskType: "osint-lookup",
    basePriceUsdc: 0.005,
    description: "Standard OSINT data lookup in downtown district",
    multiplier: 1.0,
    active: true,
  },
  {
    ruleId: "harbor-whale-alert",
    districtId: "harbor" as DistrictId,
    taskType: "whale-alert",
    basePriceUsdc: 0.01,
    description: "Wallet activity monitoring and threshold alert in harbor district",
    multiplier: 1.0,
    active: true,
  },
  {
    ruleId: "tech-row-npc-prompt",
    districtId: "tech-row" as DistrictId,
    taskType: "npc-prompt",
    basePriceUsdc: 0.02,
    description: "NPC task execution via prompt in tech-row district",
    multiplier: 1.0,
    active: true,
  },
  {
    ruleId: "terra54-property-check",
    districtId: "terra54" as DistrictId,
    taskType: "property-lookup",
    basePriceUsdc: 0.015,
    description: "Property data lookup in Terra54 district",
    multiplier: 1.2,
    notes: "20% premium for Terra54 district data access",
    active: true,
  },
  {
    ruleId: "archives-data-retrieval",
    districtId: "archives" as DistrictId,
    taskType: "data-retrieval",
    basePriceUsdc: 0.003,
    description: "Historical data retrieval from the Archives district",
    multiplier: 0.8,
    notes: "20% discount — archives are open access by default",
    active: true,
  },
];

// ---------------------------------------------------------------------------
// Lookup
// ---------------------------------------------------------------------------

/**
 * Look up the effective price (basePriceUsdc × multiplier) for a task in a district.
 * Returns undefined if no rule matches.
 *
 * Priority: exact district match > wildcard district match
 */
export function lookupPrice(
  districtId: DistrictId,
  taskType: string
): { rule: PricingRule; effectivePriceUsdc: UsdcAmount } | undefined {
  const active = BASE_RULES.filter((r) => r.active);

  // Exact district match first
  const exact = active.find(
    (r) => r.districtId === districtId && r.taskType === taskType
  );

  // Wildcard fallback
  const wildcard = active.find(
    (r) => r.districtId === "*" && r.taskType === taskType
  );

  const rule = exact ?? wildcard;
  if (!rule) return undefined;

  return {
    rule,
    effectivePriceUsdc: Math.round(rule.basePriceUsdc * rule.multiplier * 1_000_000) / 1_000_000,
  };
}

/**
 * List all active pricing rules.
 */
export function listRules(): PricingRule[] {
  return BASE_RULES.filter((r) => r.active);
}
