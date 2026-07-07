# receipt-engine

> Creates, validates, and stores auditable task receipts for AGENTROPOLIS-PAYRAIL

## Overview

Every agent task payment produces an immutable `AgentTaskReceipt`. Receipts are:

- **Structured** — typed TypeScript interface + JSON Schema
- **Immutable** — once created, not modified (only status updates via `markSettled`)
- **Auditable** — every field is explicit and logged
- **Dry-run aware** — receipts in dry-run mode are clearly marked; no tx hash

## API

```ts
import { createReceipt, printReceipt, markSettled } from "@agentropolis/receipt-engine";

const receipt = createReceipt({
  taskId: "task_abc123" as TaskId,
  agentId: "whale-watcher-54" as AgentId,
  districtId: "harbor" as DistrictId,
  taskType: "whale-alert",
  description: "Wallet threshold alert — mock only",
  amountUsdc: 0.01,
  status: "dry-run-accepted",
  dryRun: true,
});

printReceipt(receipt);
```

## Schema

See [`src/schemas/receipt.schema.json`](src/schemas/receipt.schema.json).

## TODO

- Phase 1: Replace in-memory store with SQLite / Postgres
- Phase 1: Add receipt query filters (by agent, district, date range)
- Phase 2: `markSettled` called by x402-adapter with real tx hash
- Phase 3: Receipt export to CSV / JSON for audit
