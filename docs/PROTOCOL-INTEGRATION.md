# AGENTROPOLIS Pay Protocol Integration

AGENTROPOLIS-PAYRAIL is a reference implementation of the public objects and lifecycle defined by [`wiredchaos/AGENTROPOLIS-PAY-PROTOCOL`](https://github.com/wiredchaos/AGENTROPOLIS-PAY-PROTOCOL).

## Responsibility split

| Layer | Responsibility |
|---|---|
| PAY-PROTOCOL | Defines portable mandates, payment intents, approvals, receipts, lifecycle states, adapter expectations, and conformance rules. |
| PAYRAIL | Demonstrates dry-run evaluation, receipt production, provider-neutral adapter boundaries, and protocol conformance. |
| Private operator runtime | Holds production policy state, identity bindings, durable accounting, provider credentials, signing authority, fraud controls, and deployment configuration. |
| Payment provider or chain | Performs settlement, custody-adjacent services, reversals, disputes, and provider-specific confirmation. |

## Required request flow

```text
Principal grants mandate
        |
Agent proposes payment intent
        |
Identity and mandate validation
        |
Policy evaluation
        |
Human or delegated approval when required
        |
Revocation and expiry re-check
        |
Provider adapter submission with idempotency key
        |
Authenticated provider confirmation
        |
Terminal receipt and audit record
```

## Conformance requirements

PAYRAIL must:

1. validate all protocol objects against the published schemas
2. bind approvals to an immutable intent digest and exact mandate version
3. fail closed when identity, policy, approval, or provider evidence is missing
4. re-check mandate status immediately before execution
5. prevent replay and duplicate settlement
6. authenticate provider callbacks
7. produce receipts for success, denial, failure, expiry, reversal, and refund
8. keep production secrets and operator policy configuration outside this public repository

## Public reference versus production enforcement

The public implementation exists to make behavior inspectable and interoperable. It does not make a deployment production-safe by itself.

Production authority must remain bounded by private credentials, operator-controlled policy state, secure signing infrastructure, durable spend accounting, and revocable human governance.

**The protocol is public. The authority remains controlled.**
