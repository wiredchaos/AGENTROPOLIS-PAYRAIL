# payrail-core

> Shared types, utilities, and constants for AGENTROPOLIS-PAYRAIL

## What's in here

| Export | Description |
|--------|-------------|
| `PAYRAIL_VERSION` | Semver string |
| `AgentId`, `DistrictId`, `TaskId`, `ReceiptId` | Branded string types |
| `PaymentRequest` | Input shape for a payment |
| `PaymentResult` / `PaymentStatus` | Output shape |
| `DISTRICTS` | Known district constants |
| `formatTimestamp(date)` | ISO 8601 formatter |
| `generateId(prefix)` | Prefixed ID generator |
| `roundUsdc(amount)` | 6-decimal USDC rounding |

## Usage

```ts
import { PaymentRequest, DISTRICTS, formatTimestamp } from "@agentropolis/payrail-core";
```

## TODO

- Phase 1: Replace `generateId` with a proper UUID library
- Phase 1: Add Zod schemas for runtime validation of `PaymentRequest`
