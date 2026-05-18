# 🇰🇷 Korean Market & Crypto Trends API

[![RapidAPI](https://img.shields.io/badge/Available_on-RapidAPI-blue?logo=rapid&logoColor=white&style=for-the-badge)](https://rapidapi.com/GERMANKBR/api/korean-trends-api1)
[![Data Update](https://img.shields.io/badge/Data_Update-Hourly-success?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-MIT-gray?style=for-the-badge)]()

A robust, fully automated API providing real-time data for the South Korean market. Designed for crypto traders, marketers, and financial analysts who need reliable, hourly-updated data without maintaining complex scrapers.

## 🌟 Available Data Feeds

1. **📈 Google Trends (Korea)**: Top 10-20 real-time trending search topics and news inside South Korea.
2. **🪙 Kimchi Premium (Crypto)**: Live arbitrage spread tracking between Upbit (KRW) and Binance (USDT) for major assets like BTC, ETH, and SOL.
3. **💱 FX Rates (KRW)**: Real-time Korean Won exchange rates against major global currencies (USD, EUR, JPY, CNY).

## 🚀 How to Use

The API is fully managed and monetized via **RapidAPI**. We offer a **Generous Free Tier** for testing and building MVPs, along with Pro plans for production use.

👉 **[Subscribe and get your API Key on RapidAPI](https://rapidapi.com/GERMANKBR/api/korean-trends-api1)**

### Example Request (Kimchi Premium)

```bash
curl --request GET \
	--url https://korean-trends-api1.p.rapidapi.com/api/v1/crypto.json \
	--header 'x-rapidapi-host: korean-trends-api1.p.rapidapi.com' \
	--header 'x-rapidapi-key: YOUR_RAPID_API_KEY'
```

### Example Response (`/api/v1/crypto.json`)

```json
{
  "status": "ok",
  "endpoint": "/api/v1/crypto.json",
  "description": "Real-time Kimchi Premium (Upbit vs Binance arbitrage spread)",
  "updated_at": "2026-05-18T06:00:00.000Z",
  "data": {
    "usd_krw_rate": 1350.25,
    "average_premium_percentage": -0.75,
    "assets": [
      {
        "symbol": "BTC",
        "upbit_price_krw": 91500000,
        "binance_price_usd": 68250.5,
        "binance_price_krw_converted": 92155237,
        "premium_krw": -655237,
        "premium_percentage": -0.71
      }
    ]
  }
}
```

## 🏗️ Architecture (Zero-Cost Engine)

This project runs on a 100% serverless, zero-cost architecture:
- **Compute**: GitHub Actions triggers `scripts/collect-data.js` every hour to scrape and calculate data.
- **Storage/Hosting**: The static JSON files are committed to the `docs/api/v1/` directory and served globally at lightning speed via GitHub Pages.
- **Gateway**: RapidAPI acts as the commercial gateway, handling authentication, rate-limiting, and billing.

## 📄 License

This project is open-source under the MIT License. The data provided is for informational purposes only and does not constitute financial advice.
