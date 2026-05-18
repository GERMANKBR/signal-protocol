/**
 * Korean Trends API — Data Collection Engine
 * 
 * Runs via GitHub Actions every hour.
 * Collects publicly available Korean trend data and generates
 * static JSON files served via GitHub Pages → RapidAPI.
 * 
 * Data Sources (all public, no API keys required):
 *  - Google Trends (Korea) RSS feed
 *  - Open Exchange Rate API (free tier)
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
        'User-Agent': 'KoreanTrendsAPI/1.0 (https://github.com/GERMANKBR/signal-protocol)',
        'Accept': 'application/rss+xml, application/xml, text/xml'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

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
    const description = extractTag(block, 'description');
    const newsItems = extractNewsItems(block);

    if (title) {
      items.push({
        rank: rank++,
        keyword: title,
        url: link || null,
        published_at: pubDate ? new Date(pubDate).toISOString() : null,
        approximate_traffic: traffic || null,
        description: description ? cleanHtml(description) : null,
        related_news: newsItems
      });
    }
  }

  return items;
}

function extractTag(xml, tag) {
  // Handle both plain text and CDATA content
  const regex = new RegExp(
    `<${tag}[^>]*>(?:<!\\[CDATA\\[)?([\\s\\S]*?)(?:\\]\\]>)?<\\/${tag}>`,
    'i'
  );
  const match = xml.match(regex);
  if (!match) return null;
  return match[1].trim();
}

function extractNewsItems(xml) {
  const newsItems = [];
  const newsRegex = /<ht:news_item>([\s\S]*?)<\/ht:news_item>/g;
  let match;

  while ((match = newsRegex.exec(xml)) !== null) {
    const block = match[1];
    const title = extractTag(block, 'ht:news_item_title');
    const url = extractTag(block, 'ht:news_item_url');
    const source = extractTag(block, 'ht:news_item_source');

    if (title || url) {
      newsItems.push({
        title: title || null,
        url: url || null,
        source: source || null
      });
    }
  }

  return newsItems;
}

function cleanHtml(html) {
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

// ──────────────────────────────────────────────
// 2. Exchange Rates (Free, No Key Required)
// ──────────────────────────────────────────────
async function fetchExchangeRates() {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/KRW');
    const data = await response.json();

    if (data.result === 'success') {
      // Invert rates to show "1 USD = ? KRW" format (more intuitive)
      const krwPerUnit = {};
      const targetCurrencies = ['USD', 'EUR', 'JPY', 'CNY', 'GBP', 'AUD', 'CAD', 'CHF', 'SGD', 'HKD'];

      for (const currency of targetCurrencies) {
        if (data.rates[currency]) {
          krwPerUnit[currency] = parseFloat((1 / data.rates[currency]).toFixed(2));
        }
      }

      return {
        base: 'KRW',
        krw_per_unit: krwPerUnit,
        raw_rates: Object.fromEntries(
          targetCurrencies
            .filter(c => data.rates[c])
            .map(c => [c, data.rates[c]])
        ),
        source_updated_at: data.time_last_update_utc || null
      };
    }
  } catch (error) {
    console.error('❌ Exchange rate fetch failed:', error.message);
  }
  return null;
}

// ──────────────────────────────────────────────
// 3. Summary / Statistics Generator
// ──────────────────────────────────────────────
function generateSummary(trends) {
  if (!trends || trends.length === 0) return null;

  // Extract traffic numbers for statistics
  const trafficNumbers = trends
    .map(t => {
      if (!t.approximate_traffic) return 0;
      const num = t.approximate_traffic.replace(/[^0-9]/g, '');
      return parseInt(num) || 0;
    })
    .filter(n => n > 0);

  const totalNewsLinks = trends.reduce((sum, t) => sum + (t.related_news?.length || 0), 0);

  return {
    total_trending_topics: trends.length,
    total_related_news: totalNewsLinks,
    top_keywords: trends.slice(0, 5).map(t => t.keyword),
    traffic_stats: trafficNumbers.length > 0 ? {
      highest: Math.max(...trafficNumbers).toLocaleString() + '+',
      average: Math.round(trafficNumbers.reduce((a, b) => a + b, 0) / trafficNumbers.length).toLocaleString() + '+'
    } : null
  };
}

// ──────────────────────────────────────────────
// Main Execution
// ──────────────────────────────────────────────
async function main() {
  const startTime = Date.now();
  console.log('🇰🇷 Korean Trends API — Data Collection Starting...');
  console.log(`⏰ ${new Date().toISOString()}\n`);

  // Ensure output directory exists
  if (!fs.existsSync(API_DIR)) {
    fs.mkdirSync(API_DIR, { recursive: true });
  }

  const now = new Date().toISOString();

  // ── Collect all data ──
  const [trends, rates] = await Promise.all([
    fetchGoogleTrendsKR(),
    fetchExchangeRates()
  ]);

  console.log(`\n📊 Results:`);
  console.log(`   Trends: ${trends.length} topics collected`);
  console.log(`   Rates:  ${rates ? 'OK' : 'FAILED'}`);

  // ── Generate /api/v1/trends.json ──
  const trendsPayload = {
    status: 'ok',
    api: 'Korean Trends API',
    endpoint: '/api/v1/trends.json',
    description: 'Real-time trending search topics in South Korea',
    updated_at: now,
    update_frequency: 'hourly',
    count: trends.length,
    summary: generateSummary(trends),
    data: trends
  };
  writeJSON('trends.json', trendsPayload);

  // ── Generate /api/v1/rates.json ──
  if (rates) {
    const ratesPayload = {
      status: 'ok',
      api: 'Korean Trends API',
      endpoint: '/api/v1/rates.json',
      description: 'KRW exchange rates against major world currencies',
      updated_at: now,
      update_frequency: 'hourly',
      data: rates
    };
    writeJSON('rates.json', ratesPayload);
  }

  // ── Generate /api/v1/meta.json ──
  const metaPayload = {
    api_name: 'Korean Trends API',
    version: '1.0.0',
    author: 'GERMANKBR',
    description: 'Real-time Korean trending topics, news, and market data. Updated hourly via automated pipeline.',
    base_url: 'https://germankbr.github.io/signal-protocol',
    endpoints: [
      {
        path: '/api/v1/trends.json',
        method: 'GET',
        description: 'Current trending search topics in South Korea with related news articles',
        update_frequency: 'Every hour',
        fields: ['rank', 'keyword', 'approximate_traffic', 'related_news']
      },
      {
        path: '/api/v1/rates.json',
        method: 'GET',
        description: 'KRW exchange rates (Korean Won vs major currencies)',
        update_frequency: 'Every hour',
        fields: ['krw_per_unit', 'raw_rates']
      },
      {
        path: '/api/v1/meta.json',
        method: 'GET',
        description: 'API metadata and available endpoints'
      }
    ],
    data_sources: [
      { name: 'Google Trends', type: 'Public RSS Feed', region: 'South Korea' },
      { name: 'Open Exchange Rates', type: 'Free Public API' }
    ],
    pricing: {
      marketplace: 'RapidAPI',
      free_tier: '50 requests/day',
      pro_tier: '$9.99/month — 500 requests/day',
      ultra_tier: '$29.99/month — unlimited'
    },
    last_collection_run: now,
    github: 'https://github.com/GERMANKBR/signal-protocol'
  };
  writeJSON('meta.json', metaPayload);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`\n✅ All API files generated in ${elapsed}s`);
  console.log(`📁 Output: ${API_DIR}`);
}

function writeJSON(filename, data) {
  const filepath = path.join(API_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`   ✏️  ${filename} written (${(JSON.stringify(data).length / 1024).toFixed(1)} KB)`);
}

main().catch(error => {
  console.error('💥 Fatal error:', error);
  process.exit(1);
});
