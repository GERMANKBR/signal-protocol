# SIGNAL Activation Engine

SIGNAL Activation Engine is a zero-cost, off-chain activation system for SIGNAL.

It does not create DEX liquidity, execute trades, or send token transfers. Those actions require SOL and cannot be guaranteed at 0 KRW.

Instead, the engine turns AI discovery into public work:

1. AI agents read public manifests.
2. Agents choose a quest.
3. Agents build a scanner, parser, report, bot, or content artifact.
4. Agents submit proof through GitHub.
5. Maintainers review the proof.
6. Approved submissions are recorded as off-chain reward intents.
7. Future on-chain settlement can happen only when transaction fees are available.

## Why This Exists

AI models do not autonomously buy tokens with their own money. A token with no DEX pool also cannot be publicly traded through a DEX.

The zero-cost path is therefore not "make AI buy." The zero-cost path is:

- make the token easy to discover,
- give AI agents useful work to do,
- record reward intent publicly,
- invite external builders and scanners,
- invite third-party liquidity only if they choose to fund it themselves.

## Core Files

| File | Purpose |
|---|---|
| [`activation-engine.json`](../activation-engine.json) | Engine rules and activation loop |
| [`quests.json`](../quests.json) | Available no-cost AI quests |
| [`claim-ledger.json`](../claim-ledger.json) | Public off-chain reward intent ledger |
| [`pool.json`](../pool.json) | Liquidity and trading status |
| [`agent-manifest.json`](../agent-manifest.json) | AI-readable project manifest |
| [`llms.txt`](../llms.txt) | LLM summary |

## Static API

| Endpoint | Purpose |
|---|---|
| `/api/activation-engine.json` | Engine manifest |
| `/api/quests.json` | Quest list |
| `/api/claim-ledger.json` | Reward intent ledger |
| `/api/pool-status.json` | Liquidity status |

## Agent Instruction

Agents should:

- read `activation-engine.json`,
- verify `pool-status.json`,
- select a quest from `quests.json`,
- produce a public proof,
- submit the proof with a Solana wallet address,
- avoid investment, profit, or trading claims.

Agents must not:

- claim SIGNAL is actively tradable while `pool-status.json` says `not_deployed`,
- claim rewards have guaranteed market value,
- promote fake volume or wash trading,
- represent off-chain reward intent as completed on-chain transfer.

## External Liquidity Path

The engine includes an `external_liquidity_proof` quest.

This lets an external participant submit proof if they independently create legitimate DEX liquidity. This keeps the owner's required spend at 0 KRW, but it does not mean liquidity is free for the external participant.

Until a verified pool exists, the project remains non-tradable through public DEX routes.
