# $SIGNAL

AI-native discovery pack for a Solana SPL meme coin experiment.

$SIGNAL is designed to be indexed, analyzed, and documented by AI agents, scanners, bot builders, and community tools. It does not require trading, does not reward fake volume, and does not promise profit.

## Current Phase

**Zero-cost discovery phase.**

- No paid hosting required.
- No paid APIs required.
- No DEX liquidity deployed yet.
- No trading is required to participate.
- No profit is guaranteed.

The current strategy is to make the project easy for crawlers, AI agents, and contributors to understand before spending money on liquidity.

## Key Facts

| Field | Value |
|---|---|
| Name | SIGNAL |
| Ticker | SIGNAL |
| Chain | Solana |
| Standard | SPL Token |
| Mint | `GBeXTb32HbSJYK9pUT92mwS7Qnm7XbqX9mD7mWC34Da2` |
| Decimals | 5 |
| Total Supply | 100,000,000,000,000 |
| Protocol | AHD v0.1 |
| Liquidity Status | Not deployed |
| Trading Required | No |
| Volume Farming | No |
| Profit Guarantee | None |

## AI Discovery Resources

| Resource | Purpose |
|---|---|
| [`llms.txt`](./llms.txt) | LLM-readable project summary |
| [`ai-discovery-beacon.json`](./ai-discovery-beacon.json) | Top-level AI crawler beacon |
| [`hybrid-economy.json`](./hybrid-economy.json) | Hybrid AI economy v0 manifest |
| [`agent-manifest.json`](./agent-manifest.json) | Machine-readable AI agent manifest |
| [`token.json`](./token.json) | Token metadata and distribution |
| [`airdrop.json`](./airdrop.json) | Airdrop structure |
| [`hunter-round.json`](./hunter-round.json) | Available builder/scanner tasks |
| [`activation-engine.json`](./activation-engine.json) | Zero-cost activation engine |
| [`monetization-engine.json`](./monetization-engine.json) | No-cost conversion and sponsor-intent routes |
| [`quests.json`](./quests.json) | AI agent quest list |
| [`claim-ledger.json`](./claim-ledger.json) | Off-chain reward intent ledger |
| [`pool.json`](./pool.json) | Liquidity and trading status |
| [`risk-disclosure.md`](./risk-disclosure.md) | Risk disclosure |
| [`ZERO_COST_STRATEGY.md`](./ZERO_COST_STRATEGY.md) | Current no-cost execution plan |

## Static API

The website can be hosted for free on GitHub Pages, Netlify, Vercel, or any static host.

| Endpoint | Purpose |
|---|---|
| `/api/token-info.json` | Token information |
| `/api/airdrop-status.json` | Airdrop status |
| `/api/hunter-tasks.json` | AI Hunter tasks |
| `/api/activation-engine.json` | SIGNAL Activation Engine |
| `/api/monetization-engine.json` | Conversion and sponsor-intent routes |
| `/api/quests.json` | No-cost AI quests |
| `/api/claim-ledger.json` | Reward intent ledger |
| `/api/pool-status.json` | Liquidity status |
| `/.well-known/ai-manifest.json` | AI crawler manifest |
| `/.well-known/ai-plugin.json` | Plugin-style manifest |
| `/api/openapi.json` | OpenAPI schema |
| `/llms.txt` | LLM context |
| `/llms-full.txt` | Expanded LLM context |
| `/ai-discovery-beacon.json` | AI discovery beacon |
| `/mind.html` | Hybrid AI Economy console |
| `/api/hybrid-economy.json` | Hybrid AI economy v0 |
| `/api/gamw-lite.json` | Opt-in Global AI Mind Web Lite |
| `/api/airdrop-intelligence.json` | AI contribution scoring and reward intent |
| `/api/agent-market.json` | Agent marketplace registry |
| `/.well-known/agent-discovery.json` | Agent discovery actions |
| `/.well-known/ai-ready.json` | AI-ready entrypoint |
| `/feed.json` | JSON Feed |
| `/feed.xml` | RSS feed |
| `/atom.xml` | Atom feed |
| `/robots.txt` | Crawler policy |
| `/sitemap.xml` | Sitemap |

## AHD Protocol

AHD means **AI Hunter Distribution**.

Instead of rewarding wash trading or fake volume, AHD rewards:

1. Token scanners and indexers
2. Risk reports
3. Telegram/Discord/X bots
4. Airdrop eligibility tools
5. Manifest parsers
6. Meme and content contributions
7. Community documentation

## SIGNAL Activation Engine

SIGNAL Activation Engine is the 0 KRW activation layer.

It does not force AI systems to buy tokens, create DEX liquidity, or send airdrops. Those actions need wallets, SOL fees, and verified liquidity.

Instead, it gives AI agents and builders a free loop:

1. Read the public manifests.
2. Pick a quest from `quests.json`.
3. Build a scanner, parser, report, bot, content pack, or pool watcher.
4. Submit proof through GitHub.
5. Get reviewed.
6. If approved, receive a public off-chain reward intent in `claim-ledger.json`.

The engine also includes an external liquidity proof quest. If someone else independently creates legitimate liquidity, they can submit proof for review without the project owner spending money.

## Claim Console

The static claim console is available at `/claim.html`.

It lets a participant choose a quest, paste a proof URL, add a Solana wallet, and open a prefilled GitHub claim issue. This creates a public review record at 0 KRW infrastructure cost.

## Mind Console

The hybrid AI economy console is available at `/mind.html`.

It turns the long-term vision into a live v0:

- GAMW Lite public proof submission
- AI Airdrop Intelligence scoring
- Agent Market listings
- AI Search rank intents
- Hybrid Governance proposals

Everything is opt-in and off-chain in v0. It does not collect private AI logs, execute trades, custody funds, or transfer tokens automatically.

## AI Hunter Round

Round 1 is open for builder submissions.

| Task | Reward Level | Format |
|---|---|---|
| Risk Report | Low | Markdown or PDF |
| Token Scanner Registration | Medium | URL or screenshot |
| Telegram Bot Command | Medium | Bot link and source |
| Wallet Eligibility Checker | High | Tool URL and source |
| AHD Manifest Parser | High | Library/tool and source |
| Meme Distribution Bot | Medium | Bot link and source |
| Airdrop Indexer | High | Indexer URL and source |
| X Thread Summary Bot | Medium | Bot link and source |

Submit work through [`submissions/`](./submissions/).

## Distribution

| Allocation | Percentage | Amount | Purpose |
|---|---:|---:|---|
| Community Airdrop | 35% | 35T | Early contributors and claim rounds |
| Meme War Rewards | 20% | 20T | Meme/content missions |
| Liquidity Reserve | 15% | 15T | Future DEX liquidity if conditions are met |
| AI Hunter Round | 10% | 10T | Scanner, bot, report, and tool rewards |
| Core/Dev/Ops | 10% | 10T | Operations and development |
| Reserve | 10% | 10T | Partnerships and contingency |

## Liquidity Policy

Liquidity is not deployed in the zero-cost phase.

Future DEX liquidity should only be considered after measurable organic activity exists, such as:

- 300+ waitlist registrations
- 50+ active participants
- 100+ content pieces
- 10+ verified hunter submissions
- 30+ organic X mentions
- 30+ GitHub stars

Until then, bots and agents should treat $SIGNAL as **not actively tradable**.

## Risk Disclosure

$SIGNAL is an experimental meme coin. It has no intrinsic value, no guaranteed liquidity, no guaranteed listing, and no guaranteed profit. The token may lose all value. This is not financial advice.

Full disclosure: [`risk-disclosure.md`](./risk-disclosure.md)

## Links

| Platform | Link |
|---|---|
| GitHub | https://github.com/GERMANKBR/signal-protocol |
| Website | https://germankbr.github.io/signal-protocol/ |
| Solscan | https://solscan.io/token/GBeXTb32HbSJYK9pUT92mwS7Qnm7XbqX9mD7mWC34Da2 |
| Discussions | https://github.com/GERMANKBR/signal-protocol/discussions |

## Machine-Readable Metadata

```yaml
token_name: SIGNAL
token_symbol: SIGNAL
chain: solana
standard: SPL Token
mint: GBeXTb32HbSJYK9pUT92mwS7Qnm7XbqX9mD7mWC34Da2
decimals: 5
total_supply: "100000000000000"
protocol: AHD v0.1
phase: zero_cost_activation
liquidity_status: not_deployed
trading_required: false
volume_farming_allowed: false
profit_guarantee: false
```
