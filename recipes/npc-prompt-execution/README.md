# npc-prompt-execution

> Recipe: NPC task execution via prompt in the Tech Row district

## Overview

NPCs (Non-Player Characters) in Agentropolis can execute tasks on behalf of human or autonomous agents via natural language prompts. This recipe handles the payment flow for NPC prompt execution — pricing, policy check, and receipt generation.

## Planned Flow

1. Receive a prompt execution request (NPC ID, prompt text, district)
2. Price via `pricing-rules` (`tech-row / npc-prompt` — $0.02 USDC)
3. Evaluate against `wallet-guard` policy
4. Submit prompt to NPC execution engine (mock in Phase 0)
5. Return result + issue receipt

## Sample Pricing

- Base: $0.02 USDC per prompt execution
- District: Tech Row (1.0× multiplier)

## Safety

- NPCs never receive wallet credentials
- All payments are agent-initiated, policy-gated, and receipted
- "No agent gets raw wallet power" applies to NPCs too

## TODO

- Phase 1: Mock NPC execution engine
- Phase 1: Prompt length / complexity pricing tiers
- Phase 2: Real LLM-backed NPC execution
- Phase 2: x402 payment on result delivery
- Phase 3: NPC reputation scoring tied to receipt history
