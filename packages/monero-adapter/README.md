# Monero Adapter

Dry-run reference adapter for privacy-preserving XMR settlement under Hush54 governance.

## Boundary

This package may define types, validation, simulated lifecycle behavior, and receipt evidence. It must not contain wallet RPC credentials, private keys, seed phrases, spend keys, production endpoints, live custody configuration, or undisclosed compliance logic.

## Required corridor

```text
Identity -> Mandate -> Payment Intent -> Hush54 Privacy Decision
         -> Explicit Approval when required -> Monero Adapter
         -> Restricted Receipt -> Audit
```

The adapter does not grant privacy authority. It consumes a Hush54 decision and fails closed when approval is denied or incomplete.

## Status

Dry-run only. No funds move.
