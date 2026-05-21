# Korean Market & Crypto Trends API

Production-ready static data API for South Korea market intelligence, monetized through RapidAPI.

[RapidAPI Listing](https://rapidapi.com/GERMANKBR/api/korean-trends-api1) | [Live Landing Page](https://germankbr.github.io/signal-protocol/) | [OpenAPI Schema](https://germankbr.github.io/signal-protocol/api/openapi.json) | [AI Context](https://germankbr.github.io/signal-protocol/llms.txt)

## What It Provides

- Korean search trends: hourly South Korea Google Trends topics with traffic labels and related news.
- Kimchi Premium: Upbit KRW versus Binance USDT spreads for BTC, ETH, SOL, XRP, and DOGE.
- KRW FX rates: KRW conversion rates for USD, EUR, JPY, CNY, GBP, AUD, CAD, CHF, SGD, and HKD.
- API metadata: endpoint catalog, source health, update cadence, and RapidAPI pricing entry point.

## RapidAPI Usage

```bash
curl --request GET \
  --url https://korean-trends-api1.p.rapidapi.com/api/v1/crypto.json \
  --header 'x-rapidapi-host: korean-trends-api1.p.rapidapi.com' \
  --header 'x-rapidapi-key: YOUR_RAPIDAPI_KEY'
```

## Endpoints

| Endpoint | Description | Update Cadence |
| --- | --- | --- |
| `/api/v1/trends.json` | Korean search trend topics, traffic labels, and related news | Hourly |
| `/api/v1/crypto.json` | Kimchi Premium spreads between Upbit and Binance | Hourly |
| `/api/v1/rates.json` | KRW exchange rates against major currencies | Hourly |
| `/api/v1/meta.json` | API metadata and source status | Hourly |

## Example: Kimchi Premium

```json
{
  "status": "ok",
  "endpoint": "/api/v1/crypto.json",
  "data": {
    "usd_krw_rate": 1497.01,
    "average_premium_percentage": -0.75,
    "assets": [
      {
        "symbol": "BTC",
        "upbit_price_krw": 114209000,
        "binance_price_usdt": 76878.24,
        "binance_price_krw_converted": 115087494,
        "premium_krw": -878494,
        "premium_percentage": -0.76,
        "direction": "kimchi_discount"
      }
    ]
  }
}
```

## Architecture

This repository uses a low-maintenance static API architecture:

- Collection: GitHub Actions runs `scripts/collect-data.js` every hour.
- Discovery: `scripts/publish-discovery.js` regenerates `llms.txt`, feeds, sitemap, and AI manifests from the latest snapshot.
- Notification: `scripts/ping-discovery.js` notifies IndexNow-compatible search engines when committed data changes.
- Storage: generated JSON is committed under `docs/api/v1/`.
- Delivery: GitHub Pages serves the public origin.
- Monetization: RapidAPI handles API keys, billing, rate limits, and plan enforcement.

## Automatic Distribution

The repo now ships no-touch discovery surfaces that are updated by GitHub Actions, so the project can be found without manual posting or RapidAPI dashboard edits:

| Surface | URL | Purpose |
| --- | --- | --- |
| LLM context | [`/llms.txt`](https://germankbr.github.io/signal-protocol/llms.txt) | Compact AI-readable product summary and endpoint links |
| Full LLM context | [`/llms-full.txt`](https://germankbr.github.io/signal-protocol/llms-full.txt) | Expanded snapshot for AI agents and research tools |
| API catalog | [`/api/catalog.json`](https://germankbr.github.io/signal-protocol/api/catalog.json) | Machine-readable product, endpoint, feed, and use-case metadata |
| JSON Feed | [`/feed.json`](https://germankbr.github.io/signal-protocol/feed.json) | Feed-reader and automation friendly updates |
| RSS | [`/feed.xml`](https://germankbr.github.io/signal-protocol/feed.xml) | Standard crawler/feed discovery |
| Atom | [`/atom.xml`](https://germankbr.github.io/signal-protocol/atom.xml) | Standard crawler/feed discovery |
| AI manifest | [`/.well-known/ai-manifest.json`](https://germankbr.github.io/signal-protocol/.well-known/ai-manifest.json) | Well-known metadata for agents and crawlers |

This improves passive discovery. It does not guarantee traffic or sales by itself; conversion still depends on demand, pricing, and whether developers choose the RapidAPI listing for keyed access.

## Data Sources

- Google Trends RSS for South Korea search topics.
- Open ER API for foreign exchange rates.
- Upbit public ticker for KRW crypto prices.
- Binance public ticker for offshore USDT crypto prices.

## Repository Scope

The repository is now scoped to the Korean Market & Crypto Trends API only. The active codebase and Pages surface contain only the RapidAPI product, collector, schema, and generated JSON feeds.

## Disclaimer

The API is provided for informational and developer use. It is not financial advice, trading advice, or a guarantee of exchange execution conditions.
