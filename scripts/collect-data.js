/**
 * Korean Market & Crypto Trends API — Data Collection Engine
 * 
 * Runs via GitHub Actions every hour.
 * Collects publicly available Korean trend data and generates
 * static JSON files served via GitHub Pages → RapidAPI.
 * 
 * Data Sources (all public, no API keys required):
 *  - Google Trends (Korea) RSS feed
 *  - Open Exchange Rate API (free tier)
 *  - Upbit & Binance Public APIs (Kimchi Premium Calculator)
 */

const fs = require('fs');
const path = require('path');

const API_DIR = path.join(__dirname, '..', 'docs', 'api', 'v1');

// ──────────────────────────────────────────────
// 1. Google Trends Korea (Public RSS Feed)
// ──────────────────────────────────────────────
async function fetchGoogleTrendsKR() {
  const url = 'https://trends.google.com/trending/rss?geo=KR';
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'KoreanMarketAPI/2.0 (https://github.com/GERMANKBR/signal-protocol)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const xml = await response.text();
    return parseTrendsRSS(xml);
  } catch (error) {
    console.error('❌ Google Trends fetch failed:', error.message);
    return [];
  }
}

function parseTrendsRSS(xml) {
  const items = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;
  let rank = 1;

  while ((match = itemRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = extractTag(block, 'title');
    const link = extractTag(block, 'link');
    const pubDate = extractTag(block, 'pubDate');
    const traffic = extractTag(block, 'ht:approx_traffic');
    
    if (title) {
      items.push({
        rank: rank++,
        keyword: title,
        url: link || null,
        published_at: pubDate ? new Date(pubDate).toISOString() : null,
        approximate_traffic: traffic || null,
      });
    }
  }
  return items;
}

function extractTag(xml, tag) {
  const regex = new RegExp(`<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

// ──────────────────────────────────────────────
// 2. Exchange Rates (Free, No Key Required)
// ──────────────────────────────────────────────
async function fetchExchangeRates() {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/KRW');
    const data = await response.json();

    if (data.result === 'success') {
      const krwPerUnit = {};
      const targetCurrencies = ['USD', 'EUR', 'JPY', 'CNY', 'GBP'];
      for (const currency of targetCurrencies) {
        if (data.rates[currency]) {
          krwPerUnit[currency] = parseFloat((1 / data.rates[currency]).toFixed(2));
        }
      }
      // Return both USD/KRW explicitly for the Crypto calculator
      return {
        base: 'KRW',
        krw_per_usd: krwPerUnit['USD'],
        krw_per_unit: krwPerUnit,
        raw_rates: data.rates,
        source_updated_at: data.time_last_update_utc || null
      };
    }
  } catch (error) {
    console.error('❌ Exchange rate fetch failed:', error.message);
  }
  return null;
}

// ──────────────────────────────────────────────
// 3. Kimchi Premium Calculator (Upbit vs Binance)
// ──────────────────────────────────────────────
async function fetchCryptoKimchiPremium(krwPerUsd) {
  if (!krwPerUsd) {
    console.error('❌ Cannot calculate Kimchi Premium without USD/KRW rate.');
    return null;
  }

  try {
    // Fetch Upbit (KRW)
    const upbitRes = await fetch('https://api.upbit.com/v1/ticker?markets=KRW-BTC,KRW-ETH,KRW-SOL');
    const upbitData = await upbitRes.json();
    
    // Fetch Binance (USDT)
    const binanceRes = await fetch('https://api.binance.com/api/v3/ticker/price?symbols=["BTCUSDT","ETHUSDT","SOLUSDT"]');
    const binanceData = await binanceRes.json();

    const result = {
      usd_krw_rate: krwPerUsd,
      assets: []
    };

    const symbols = ['BTC', 'ETH', 'SOL'];
    for (const sym of symbols) {
      const uData = upbitData.find(d => d.market === `KRW-${sym}`);
      const bData = binanceData.find(d => d.symbol === `${sym}USDT`);

      if (uData && bData) {
        const upbitPriceKRW = uData.trade_price;
        const binancePriceUSD = parseFloat(bData.price);
        const binancePriceConverted = binancePriceUSD * krwPerUsd;
        
        const premiumKRW = upbitPriceKRW - binancePriceConverted;
        const premiumPercentage = (premiumKRW / binancePriceConverted) * 100;

        result.assets.push({
          symbol: sym,
          upbit_price_krw: upbitPriceKRW,
          binance_price_usd: binancePriceUSD,
          binance_price_krw_converted: parseFloat(binancePriceConverted.toFixed(0)),
          premium_krw: parseFloat(premiumKRW.toFixed(0)),
          premium_percentage: parseFloat(premiumPercentage.toFixed(2))
        });
      }
    }
    
    // Calculate global market average premium
    if (result.assets.length > 0) {
      result.average_premium_percentage = parseFloat(
        (result.assets.reduce((sum, a) => sum + a.premium_percentage, 0) / result.assets.length).toFixed(2)
      );
    }

    return result;
  } catch (error) {
    console.error('❌ Crypto premium fetch failed:', error.message);
    return null;
  }
}

// ──────────────────────────────────────────────
// Main Execution
// ──────────────────────────────────────────────
async function main() {
  const startTime = Date.now();
  console.log('🇰🇷 Korean Market API — Data Collection Starting...');
  
  if (!fs.existsSync(API_DIR)) {
    fs.mkdirSync(API_DIR, { recursive: true });
  }

  const now = new Date().toISOString();

  // 1. Fetch Rates (Needed for Kimchi Premium)
  const rates = await fetchExchangeRates();
  
  // 2. Fetch Trends and Crypto Data concurrently
  const [trends, crypto] = await Promise.all([
    fetchGoogleTrendsKR(),
    rates ? fetchCryptoKimchiPremium(rates.krw_per_usd) : null
  ]);

  console.log(`\n📊 Results:`);
  console.log(`   Trends: ${trends.length} topics collected`);
  console.log(`   Rates:  ${rates ? 'OK' : 'FAILED'}`);
  console.log(`   Crypto: ${crypto ? 'OK (Premium: ' + crypto.average_premium_percentage + '%)' : 'FAILED'}`);

  // ── GENERATE: trends.json ──
  writeJSON('trends.json', {
    status: 'ok',
    endpoint: '/api/v1/trends.json',
    updated_at: now,
    count: trends.length,
    data: trends
  });

  // ── GENERATE: rates.json ──
  if (rates) {
    writeJSON('rates.json', {
      status: 'ok',
      endpoint: '/api/v1/rates.json',
      updated_at: now,
      data: rates
    });
  }

  // ── GENERATE: crypto.json (NEW) ──
  if (crypto) {
    writeJSON('crypto.json', {
      status: 'ok',
      endpoint: '/api/v1/crypto.json',
      description: 'Real-time Kimchi Premium (Upbit vs Binance arbitrage spread)',
      updated_at: now,
      data: crypto
    });
  }

  // ── GENERATE: meta.json (UPDATED) ──
  writeJSON('meta.json', {
    api_name: 'Korean Market & Crypto Trends API',
    version: '2.0.0',
    description: 'Real-time Korean trending search topics, FX rates, and Crypto Kimchi Premium.',
    base_url: 'https://germankbr.github.io/signal-protocol',
    endpoints: [
      { path: '/api/v1/trends.json', method: 'GET', description: 'Google Trends South Korea' },
      { path: '/api/v1/rates.json', method: 'GET', description: 'KRW Exchange Rates' },
      { path: '/api/v1/crypto.json', method: 'GET', description: 'Crypto Kimchi Premium (Upbit vs Binance)' },
      { path: '/api/v1/meta.json', method: 'GET', description: 'API Metadata' }
    ],
    pricing: {
      marketplace: 'RapidAPI',
      plans: ['Free (1.5k/mo)', 'Pro ($9.99/mo)', 'Ultra ($29.99/mo)']
    },
    last_collection_run: now
  });

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ All API files generated in ${elapsed}s`);
}

function writeJSON(filename, data) {
  const filepath = path.join(API_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
}

main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
