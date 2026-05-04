# Zero-Cost Strategy

This document defines the current 0 KRW execution plan for SIGNAL.

## Goal

Make SIGNAL easy for AI agents, crawlers, scanners, and contributors to discover without spending money on liquidity, paid hosting, paid APIs, ads, or paid listings.

This phase is about discoverability, contribution flow, proof submission, and reward-intent records, not trading.

## What Costs 0 KRW

- GitHub repository
- GitHub Pages static website
- Static JSON API files
- `llms.txt`
- `robots.txt`
- `sitemap.xml`
- `.well-known/ai-manifest.json`
- `.well-known/ai-plugin.json`
- OpenAPI schema
- SIGNAL Activation Engine
- Quest list
- Off-chain reward intent ledger
- Submission templates
- Meme kit
- Risk disclosure
- Manual community outreach

## What Is Explicitly Not Included

- DEX liquidity
- Pool creation fees
- Paid RPC services
- Paid domains
- Paid ads
- Paid influencer posts
- Paid token listings
- Automated token transfers that require SOL rent or transaction fees

## Phase Rules

1. Do not claim the token is liquid.
2. Do not claim bots will buy the token.
3. Do not claim profit is likely or guaranteed.
4. Do not incentivize wash trading or fake volume.
5. Reward useful public work: scanners, reports, parsers, indexers, bots, memes, and docs.

## Discovery Surface

Publish and keep these files reachable:

| File | Purpose |
|---|---|
| `/llms.txt` | LLM summary |
| `/.well-known/ai-manifest.json` | AI agent manifest |
| `/.well-known/ai-plugin.json` | Plugin-style metadata |
| `/api/openapi.json` | Static API schema |
| `/api/activation-engine.json` | Zero-cost activation engine |
| `/api/quests.json` | AI quest list |
| `/api/claim-ledger.json` | Reward intent ledger |
| `/api/token-info.json` | Token metadata |
| `/api/airdrop-status.json` | Airdrop state |
| `/api/hunter-tasks.json` | Builder tasks |
| `/api/pool-status.json` | Liquidity status |
| `/robots.txt` | Crawler access |
| `/sitemap.xml` | Search and crawler indexing |

## Weekly Operating Loop

1. Publish one repository update.
2. Add one example submission or template.
3. Share one public post explaining a hunter task.
4. Ask one scanner, indexer, or bot builder to review the manifest.
5. Review GitHub issues and discussions.
6. Update `airdrop-status.json` and `hunter-tasks.json` if anything changes.

## Trigger To Leave 0 KRW Phase

Only consider paid liquidity after measurable organic traction:

- 300+ waitlist registrations
- 50+ active participants
- 100+ content pieces
- 10+ verified hunter submissions
- 30+ organic X mentions
- 30+ GitHub stars

## Success Metric

The zero-cost phase is successful if an external person or bot can answer these questions from public files alone:

- What is SIGNAL?
- What chain and mint address does it use?
- Is it currently liquid?
- How can someone participate without trading?
- What are the risks?
- Where can a tool submit work?

## Current Status

```yaml
phase: zero_cost_activation
engine: SIGNAL Activation Engine sae-0
liquidity_status: not_deployed
paid_infrastructure: false
paid_api: false
paid_ads: false
trading_required: false
profit_guarantee: false
```
