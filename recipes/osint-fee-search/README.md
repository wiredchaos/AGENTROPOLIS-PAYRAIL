# osint-fee-search

> Recipe: OSINT fee estimation for Agentropolis data lookups

## Overview

This recipe queries open-source intelligence sources to estimate fees for information retrieval tasks within Agentropolis districts. It uses the `pricing-rules` package to determine the appropriate fee for each lookup type.

## Planned Flow

1. Receive an OSINT query request (target address, domain, or entity)
2. Classify the query into a task type (`osint-lookup`, `data-retrieval`, etc.)
3. Look up the district-appropriate fee via `pricing-rules`
4. Evaluate against `wallet-guard` policy (dry-run)
5. Execute the lookup (mock in Phase 0)
6. Issue a receipt via `receipt-engine`

## TODO

- Phase 1: Implement query classification logic
- Phase 1: Connect to mock OSINT data sources
- Phase 2: Wire real OSINT data APIs (behind gateway, no raw key sharing)
- Phase 2: Real x402 payment after lookup delivery
- Phase 3: Result caching to avoid duplicate billing
