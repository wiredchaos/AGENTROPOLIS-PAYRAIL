# terra54-property-check

> Recipe: Property data lookup in the Terra54 district

## Overview

Terra54 is Agentropolis's real-estate and land-registry district. This recipe queries property records, ownership history, and zoning data for a given parcel — and bills the appropriate Terra54 pricing premium via PAYRAIL.

## Planned Flow

1. Receive a property lookup request (parcel ID or coordinates)
2. Price the lookup via `pricing-rules` (`terra54 / property-lookup` — 1.2× multiplier)
3. Evaluate against `wallet-guard` policy
4. Fetch mock property record
5. Issue a receipt via `receipt-engine`

## Sample Pricing

- Base: $0.015 USDC
- Terra54 multiplier: 1.2×
- **Effective: $0.018 USDC per lookup**

## TODO

- Phase 1: Implement mock property data store
- Phase 1: Parcel ID validation
- Phase 2: Connect to real Terra54 data registry (REST API)
- Phase 2: Real x402 payment on delivery
- Phase 3: Bulk lookup discounts
