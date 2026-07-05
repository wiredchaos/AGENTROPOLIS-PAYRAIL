# pricing-rules

> District pricing rules for AGENTROPOLIS-PAYRAIL

## Overview

`pricing-rules` maps `(districtId, taskType)` pairs to a USDC price. Rules are loaded from built-in defaults (Phase 0) and will be configurable via JSON / DB in Phase 1.

## Usage

```ts
import { lookupPrice } from "@agentropolis/pricing-rules";

const result = lookupPrice("harbor" as DistrictId, "whale-alert");
if (result) {
  console.log(`Price: $${result.effectivePriceUsdc} USDC`);
}
```

## Examples

See [`examples/base-pricing.json`](examples/base-pricing.json) for all built-in rules.

| District | Task Type | Base Price | Multiplier | Effective |
|----------|-----------|-----------|------------|-----------|
| downtown | osint-lookup | $0.005 | 1.0x | $0.005 |
| harbor | whale-alert | $0.010 | 1.0x | $0.010 |
| tech-row | npc-prompt | $0.020 | 1.0x | $0.020 |
| terra54 | property-lookup | $0.015 | 1.2x | $0.018 |
| archives | data-retrieval | $0.003 | 0.8x | $0.0024 |

## TODO

- Phase 1: Load rules from JSON config file or database
- Phase 1: Admin API to add/update/disable rules
- Phase 2: Dynamic pricing based on district congestion
