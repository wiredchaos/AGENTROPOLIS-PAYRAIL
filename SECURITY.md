# Security Policy

AGENTROPOLIS-PAYRAIL is a public reference implementation for governed agentic payment flows. It is not a custody service, wallet, merchant processor, or production signing system.

## Non-negotiable boundary

This repository MUST NOT contain:

- private keys, seed phrases, signing credentials, API secrets, or webhook secrets
- production wallet addresses tied to undisclosed operators
- live merchant credentials or provider account identifiers
- production spending policies, allowlists, fraud rules, or approval thresholds
- internal deployment topology, vault configuration, or recovery procedures
- customer payment data, personal data, or unredacted transaction records

Agents MUST NOT receive raw wallet power. Signing and settlement MUST occur through an external, policy-gated execution service.

## Safe public content

This repository may contain:

- protocol-compatible types and schemas
- dry-run policy evaluation
- mock adapters and test fixtures
- reference receipt generation
- conformance tests
- example policies using fictional identifiers and non-production values

## Reporting vulnerabilities

Do not disclose exploitable vulnerabilities, leaked credentials, or production configuration in a public issue.

Use GitHub private vulnerability reporting when available. Otherwise contact the repository owner privately with:

1. affected component and commit
2. reproduction steps using non-production data
3. expected and observed behavior
4. impact assessment
5. suggested mitigation, if known

## Response priorities

1. Revoke or rotate exposed credentials immediately.
2. Disable affected settlement paths.
3. Preserve logs and receipts for investigation.
4. Patch the vulnerable boundary.
5. Publish a sanitized advisory after containment.

## Production responsibility

Operators are responsible for authentication, authorization, durable spend accounting, replay prevention, rate limiting, provider verification, legal compliance, and secure key management before enabling live settlement.
