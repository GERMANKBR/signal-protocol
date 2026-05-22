/**
 * Generates machine-readable discovery surfaces for the Korean Market API.
 *
 * The output is intentionally static so GitHub Pages, search crawlers, feed
 * readers, and AI agents can discover the product without any manual posting.
 */

const fs = require("fs");
const path = require("path");

const DOCS_DIR = path.join(__dirname, "..", "docs");
const API_DIR = path.join(DOCS_DIR, "api", "v1");
const WELL_KNOWN_DIR = path.join(DOCS_DIR, ".well-known");
const SITE_URL = "https://germankbr.github.io/signal-protocol";
const RAPIDAPI_URL = "https://rapidapi.com/GERMANKBR/api/korean-trends-api1";
const REPOSITORY_URL = "https://github.com/GERMANKBR/signal-protocol";
const INDEXNOW_KEY = "b731e2ac22ab4c1c9bc317d54e17f12a";

const API_NAME = "Korean Market & Crypto Trends API";
const DESCRIPTION = "Hourly South Korea market data for developers: Google Trends topics, KRW exchange rates, and crypto Kimchi Premium spreads.";
const KEYWORDS = [
  "Korea API",
  "South Korea trends",
  "Google Trends KR",
  "Kimchi Premium API",
  "Upbit Binance spread",
  "KRW exchange rates",
  "crypto market data",
  "RapidAPI"
];

function main() {
  ensureDirectories();

  const meta = readJson("meta.json");
  const trends = readJson("trends.json");
  const rates = readJson("rates.json");
  const crypto = readJson("crypto.json");
  const updatedAt = latestTimestamp([meta.last_collection_run, meta.updated_at, trends.updated_at, rates.updated_at, crypto.updated_at]);

  const urls = buildSitemapUrls(updatedAt);
  const feedItems = buildFeedItems({ trends, rates, crypto, updatedAt });
  const catalog = buildCatalog({ meta, trends, rates, crypto, updatedAt });
  const manifest = buildAiManifest({ meta, catalog, updatedAt });

  writeText("robots.txt", buildRobotsTxt());
  writeText("sitemap.xml", buildSitemap(urls));
  writeText("llms.txt", buildLlmsTxt({ meta, trends, rates, crypto, updatedAt }));
  writeText("llms-full.txt", buildLlmsFullTxt({ meta, trends, rates, crypto, catalog, updatedAt }));
  writeJson("feed.json", buildJsonFeed(feedItems, updatedAt));
  writeText("feed.xml", buildRssFeed(feedItems, updatedAt));
  writeText("atom.xml", buildAtomFeed(feedItems, updatedAt));
  writeText("icon.svg", buildIconSvg());
  writeJson("api/catalog.json", catalog);
  writeJson(".well-known/ai-plugin.json", buildAiPluginManifest());
  writeJson(".well-known/ai-manifest.json", manifest);
  writeJson(".well-known/agent-discovery.json", manifest);
  writeText("indexnow-key.txt", `${INDEXNOW_KEY}\n`);

  console.log(`Discovery files published for ${updatedAt}.`);
}

function ensureDirectories() {
  fs.mkdirSync(DOCS_DIR, { recursive: true });
  fs.mkdirSync(path.join(DOCS_DIR, "api"), { recursive: true });
  fs.mkdirSync(WELL_KNOWN_DIR, { recursive: true });
}

function readJson(filename) {
  const filepath = path.join(API_DIR, filename);
  return JSON.parse(fs.readFileSync(filepath, "utf8"));
}

function buildRobotsTxt() {
  return [
    "User-agent: *",
    "Allow: /",
    "",
    `Sitemap: ${urlFor("/sitemap.xml")}`,
    `LLMs: ${urlFor("/llms.txt")}`,
    `LLMs-Full: ${urlFor("/llms-full.txt")}`,
    ""
  ].join("\n");
}

function buildSitemapUrls(updatedAt) {
  return [
    ["/", "weekly", "1.0"],
    ["/api/openapi.json", "weekly", "0.8"],
    ["/api/catalog.json", "hourly", "0.9"],
    ["/api/v1/meta.json", "hourly", "0.9"],
    ["/api/v1/trends.json", "hourly", "0.9"],
    ["/api/v1/crypto.json", "hourly", "0.9"],
    ["/api/v1/rates.json", "hourly", "0.8"],
    ["/llms.txt", "hourly", "0.8"],
    ["/llms-full.txt", "hourly", "0.7"],
    ["/feed.json", "hourly", "0.7"],
    ["/feed.xml", "hourly", "0.7"],
    ["/atom.xml", "hourly", "0.7"],
    ["/.well-known/ai-plugin.json", "hourly", "0.6"],
    ["/.well-known/ai-manifest.json", "hourly", "0.6"],
    ["/.well-known/agent-discovery.json", "hourly", "0.6"]
  ].map(([pathValue, changefreq, priority]) => ({
    loc: urlFor(pathValue),
    lastmod: updatedAt,
    changefreq,
    priority
  }));
}

function buildSitemap(urls) {
  const entries = urls.map((url) => [
    "  <url>",
    `    <loc>${escapeXml(url.loc)}</loc>`,
    `    <lastmod>${escapeXml(url.lastmod)}</lastmod>`,
    `    <changefreq>${escapeXml(url.changefreq)}</changefreq>`,
    `    <priority>${escapeXml(url.priority)}</priority>`,
    "  </url>"
  ].join("\n"));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries,
    "</urlset>",
    ""
  ].join("\n");
}

function buildCatalog({ meta, trends, rates, crypto, updatedAt }) {
  return {
    name: API_NAME,
    description: DESCRIPTION,
    generated_at: updatedAt,
    homepage_url: urlFor("/"),
    repository_url: REPOSITORY_URL,
    rapidapi_url: RAPIDAPI_URL,
    openapi_url: urlFor("/api/openapi.json"),
    llms_url: urlFor("/llms.txt"),
    llms_full_url: urlFor("/llms-full.txt"),
    feeds: {
      json: urlFor("/feed.json"),
      rss: urlFor("/feed.xml"),
      atom: urlFor("/atom.xml")
    },
    keywords: KEYWORDS,
    endpoints: (meta.endpoints || []).map((endpoint) => ({
      ...endpoint,
      url: urlFor(endpoint.path)
    })),
    example_use_cases: [
      "Korean trend monitoring dashboards",
      "Crypto arbitrage and premium alerts",
      "Korean market sentiment research",
      "KRW-denominated trading bots",
      "Newsroom and social listening workflows"
    ],
    latest_snapshot: {
      top_trends: getTopKeywords(trends),
      krw_per_usd: rates.data && rates.data.krw_per_usd ? rates.data.krw_per_usd : null,
      kimchi_premium: summarizeCrypto(crypto),
      source_status: meta.source_status || {}
    },
    commercial_access: {
      marketplace: "RapidAPI",
      url: RAPIDAPI_URL,
      note: "RapidAPI manages API keys, subscriptions, quotas, and billing."
    },
    disclaimer: "Informational data only. Not financial advice."
  };
}

function buildLlmsTxt({ meta, trends, rates, crypto, updatedAt }) {
  const topKeywords = getTopKeywords(trends).slice(0, 5).join(", ") || "temporarily unavailable";
  const premium = summarizeCrypto(crypto);
  const krw = rates.data && rates.data.krw_per_usd ? `${rates.data.krw_per_usd} KRW per USD` : "temporarily unavailable";
  const premiumText = premium
    ? `${premium.average_premium_percentage}% average across ${premium.tracked_assets} tracked assets`
    : "temporarily unavailable";

  return [
    `# ${API_NAME}`,
    "",
    `> ${DESCRIPTION}`,
    "",
    "This site is the public documentation and static origin for a RapidAPI marketplace API. Use the RapidAPI listing for commercial access, API keys, quotas, and billing.",
    "",
    `Last generated: ${updatedAt}`,
    `Current top Korean trend keywords: ${topKeywords}`,
    `Current USD/KRW reference: ${krw}`,
    `Current Kimchi Premium snapshot: ${premiumText}`,
    "",
    "## Core API",
    `- [OpenAPI schema](${urlFor("/api/openapi.json")}): Machine-readable API contract.`,
    `- [API catalog](${urlFor("/api/catalog.json")}): Product metadata, use cases, feeds, and endpoint list.`,
    `- [API metadata](${urlFor("/api/v1/meta.json")}): Status, pricing entry point, data sources, and endpoint catalog.`,
    `- [Korean trends](${urlFor("/api/v1/trends.json")}): Hourly South Korea Google Trends topics and related news links.`,
    `- [Kimchi Premium](${urlFor("/api/v1/crypto.json")}): Upbit KRW versus Binance USDT spreads for BTC, ETH, SOL, XRP, and DOGE.`,
    `- [KRW exchange rates](${urlFor("/api/v1/rates.json")}): USD/KRW and major currency rates.`,
    "",
    "## Commercial Access",
    `- [RapidAPI listing](${RAPIDAPI_URL}): Subscribe, get keys, and manage plans.`,
    "",
    "## Feeds",
    `- [JSON Feed](${urlFor("/feed.json")}): Feed-reader and automation friendly update stream.`,
    `- [RSS feed](${urlFor("/feed.xml")}): Standard RSS discovery feed.`,
    `- [Atom feed](${urlFor("/atom.xml")}): Standard Atom discovery feed.`,
    "",
    "## Optional",
    `- [Full LLM context](${urlFor("/llms-full.txt")}): Expanded snapshot for AI agents.`,
    `- [AI manifest](${urlFor("/.well-known/ai-manifest.json")}): Well-known discovery metadata.`,
    `- [Repository](${REPOSITORY_URL}): Source repository and GitHub Actions collector.`,
    "",
    "Data is informational only and not financial advice.",
    ""
  ].join("\n");
}

function buildLlmsFullTxt({ meta, trends, rates, crypto, catalog, updatedAt }) {
  const trendRows = (trends.data || []).slice(0, 10).map((trend) =>
    `- ${trend.rank}. ${safeMarkdown(trend.keyword)} (${trend.approximate_traffic || "traffic unavailable"})`
  );
  const cryptoRows = crypto.data && Array.isArray(crypto.data.assets)
    ? crypto.data.assets.map((asset) =>
      `- ${asset.symbol}: ${asset.premium_percentage}% ${asset.direction}, Upbit ${asset.upbit_price_krw} KRW, Binance ${asset.binance_price_usdt} USDT`
    )
    : ["- Crypto premium data is temporarily partial."];
  const endpointRows = (meta.endpoints || []).map((endpoint) =>
    `- ${endpoint.method || "GET"} ${endpoint.path}: ${endpoint.description}`
  );

  return [
    `# ${API_NAME} - Full Context`,
    "",
    `> ${DESCRIPTION}`,
    "",
    `Generated at: ${updatedAt}`,
    `Homepage: ${urlFor("/")}`,
    `Commercial access: ${RAPIDAPI_URL}`,
    `OpenAPI: ${urlFor("/api/openapi.json")}`,
    "",
    "## Positioning",
    "The API is built for developers who need Korea-specific market intelligence without maintaining their own collectors. GitHub Actions refreshes the static JSON origin hourly. RapidAPI is the commercial gateway for keys, quotas, subscriptions, and billing.",
    "",
    "## Endpoints",
    ...endpointRows,
    "",
    "## Latest Korean Trends",
    ...(trendRows.length ? trendRows : ["- Trend data is temporarily partial."]),
    "",
    "## Latest Kimchi Premium",
    ...cryptoRows,
    "",
    "## Latest FX Snapshot",
    `- USD/KRW: ${rates.data && rates.data.krw_per_usd ? rates.data.krw_per_usd : "unavailable"}`,
    `- Provider: ${rates.data && rates.data.provider ? rates.data.provider : "unavailable"}`,
    "",
    "## Discovery Surfaces",
    `- llms.txt: ${urlFor("/llms.txt")}`,
    `- API catalog: ${urlFor("/api/catalog.json")}`,
    `- JSON Feed: ${urlFor("/feed.json")}`,
    `- RSS Feed: ${urlFor("/feed.xml")}`,
    `- Atom Feed: ${urlFor("/atom.xml")}`,
    `- AI Manifest: ${urlFor("/.well-known/ai-manifest.json")}`,
    "",
    "## Machine Summary",
    "```json",
    JSON.stringify(catalog.latest_snapshot, null, 2),
    "```",
    "",
    "Data is informational only and not financial advice.",
    ""
  ].join("\n");
}

function buildJsonFeed(items, updatedAt) {
  return {
    version: "https://jsonfeed.org/version/1.1",
    title: API_NAME,
    home_page_url: urlFor("/"),
    feed_url: urlFor("/feed.json"),
    description: DESCRIPTION,
    language: "en",
    authors: [
      {
        name: "Korean Market Data Bot",
        url: REPOSITORY_URL
      }
    ],
    user_comment: "This feed announces hourly Korean market API snapshots and links to the RapidAPI commercial listing.",
    next_url: null,
    items: items.map((item) => ({
      id: item.id,
      title: item.title,
      url: item.url,
      external_url: item.external_url,
      summary: item.summary,
      content_text: item.content_text,
      date_published: updatedAt,
      date_modified: updatedAt,
      tags: item.tags
    }))
  };
}

function buildRssFeed(items, updatedAt) {
  const pubDate = new Date(updatedAt).toUTCString();
  const itemXml = items.map((item) => [
    "    <item>",
    `      <guid isPermaLink="false">${escapeXml(item.id)}</guid>`,
    `      <title>${escapeXml(item.title)}</title>`,
    `      <link>${escapeXml(item.url)}</link>`,
    `      <description>${escapeXml(item.content_text)}</description>`,
    `      <pubDate>${escapeXml(pubDate)}</pubDate>`,
    ...item.tags.map((tag) => `      <category>${escapeXml(tag)}</category>`),
    "    </item>"
  ].join("\n"));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
    "  <channel>",
    `    <title>${escapeXml(API_NAME)}</title>`,
    `    <link>${escapeXml(urlFor("/"))}</link>`,
    `    <description>${escapeXml(DESCRIPTION)}</description>`,
    `    <language>en</language>`,
    `    <lastBuildDate>${escapeXml(pubDate)}</lastBuildDate>`,
    `    <atom:link href="${escapeXml(urlFor("/feed.xml"))}" rel="self" type="application/rss+xml" />`,
    ...itemXml,
    "  </channel>",
    "</rss>",
    ""
  ].join("\n");
}

function buildAtomFeed(items, updatedAt) {
  const itemXml = items.map((item) => [
    "  <entry>",
    `    <id>${escapeXml(`${urlFor("/feed.json")}#${item.id}`)}</id>`,
    `    <title>${escapeXml(item.title)}</title>`,
    `    <link href="${escapeXml(item.url)}" />`,
    `    <updated>${escapeXml(updatedAt)}</updated>`,
    `    <summary>${escapeXml(item.content_text)}</summary>`,
    "  </entry>"
  ].join("\n"));

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<feed xmlns="http://www.w3.org/2005/Atom">',
    `  <id>${escapeXml(urlFor("/"))}</id>`,
    `  <title>${escapeXml(API_NAME)}</title>`,
    `  <updated>${escapeXml(updatedAt)}</updated>`,
    `  <link href="${escapeXml(urlFor("/"))}" />`,
    `  <link href="${escapeXml(urlFor("/atom.xml"))}" rel="self" type="application/atom+xml" />`,
    ...itemXml,
    "</feed>",
    ""
  ].join("\n");
}

function buildAiPluginManifest() {
  return {
    schema_version: "v1",
    name_for_human: API_NAME,
    name_for_model: "korean_market_crypto_trends_api",
    description_for_human: DESCRIPTION,
    description_for_model: "Use this API to retrieve hourly South Korea Google Trends topics, KRW exchange rates, and Upbit versus Binance Kimchi Premium spreads. Data is informational only and not financial advice. Commercial access is available through RapidAPI.",
    auth: {
      type: "none"
    },
    api: {
      type: "openapi",
      url: urlFor("/api/openapi.json"),
      is_user_authenticated: false
    },
    logo_url: urlFor("/icon.svg"),
    contact_email: "GERMANKBR@users.noreply.github.com",
    legal_info_url: urlFor("/")
  };
}

function buildIconSvg() {
  return [
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" role="img" aria-label="Korean Market API">',
    '  <rect width="512" height="512" rx="96" fill="#07111f"/>',
    '  <path d="M112 344h288" stroke="#52a8ff" stroke-width="34" stroke-linecap="round"/>',
    '  <path d="M136 292l66-72 58 52 96-120" fill="none" stroke="#3ee089" stroke-width="34" stroke-linecap="round" stroke-linejoin="round"/>',
    '  <circle cx="356" cy="152" r="34" fill="#f6c44f"/>',
    '  <text x="256" y="410" text-anchor="middle" fill="#edf2f7" font-family="Arial, sans-serif" font-size="56" font-weight="700">KR</text>',
    '</svg>',
    ''
  ].join("\n");
}

function buildAiManifest({ meta, catalog, updatedAt }) {
  return {
    name: API_NAME,
    description: DESCRIPTION,
    generated_at: updatedAt,
    homepage_url: urlFor("/"),
    openapi_url: urlFor("/api/openapi.json"),
    catalog_url: urlFor("/api/catalog.json"),
    llms_url: urlFor("/llms.txt"),
    llms_full_url: urlFor("/llms-full.txt"),
    rapidapi_url: RAPIDAPI_URL,
    repository_url: REPOSITORY_URL,
    feeds: catalog.feeds,
    keywords: KEYWORDS,
    endpoints: catalog.endpoints,
    data_sources: meta.data_sources || [],
    pricing: meta.pricing || {},
    update_frequency: "hourly",
    audience: [
      "API developers",
      "trading bot builders",
      "market intelligence dashboards",
      "Korea-focused data products"
    ],
    restrictions: [
      "Informational data only",
      "Not financial advice"
    ]
  };
}

function buildFeedItems({ trends, rates, crypto, updatedAt }) {
  const topKeywords = getTopKeywords(trends).slice(0, 8);
  const premium = summarizeCrypto(crypto);
  const krw = rates.data && rates.data.krw_per_usd ? rates.data.krw_per_usd : null;

  return [
    {
      id: "korean-trends-latest",
      title: "Latest South Korea trending topics",
      url: urlFor("/api/v1/trends.json"),
      external_url: RAPIDAPI_URL,
      summary: "Hourly Google Trends KR data.",
      content_text: topKeywords.length
        ? `Top Korean trend keywords: ${topKeywords.join(", ")}.`
        : "Korean trend data is temporarily partial.",
      tags: ["korea", "trends", "google-trends", "api"]
    },
    {
      id: "kimchi-premium-latest",
      title: "Latest Kimchi Premium snapshot",
      url: urlFor("/api/v1/crypto.json"),
      external_url: RAPIDAPI_URL,
      summary: "Upbit versus Binance crypto spread monitor.",
      content_text: premium
        ? `Average Kimchi Premium is ${premium.average_premium_percentage}% across ${premium.tracked_assets} assets. ${formatHighestPremium(premium)}`
        : "Kimchi Premium data is temporarily partial.",
      tags: ["crypto", "kimchi-premium", "upbit", "binance", "api"]
    },
    {
      id: "krw-rates-latest",
      title: "Latest KRW exchange rates",
      url: urlFor("/api/v1/rates.json"),
      external_url: RAPIDAPI_URL,
      summary: "KRW FX rates for market applications.",
      content_text: krw
        ? `USD/KRW reference rate is ${krw}.`
        : "KRW exchange rate data is temporarily partial.",
      tags: ["fx", "krw", "exchange-rates", "api"]
    },
    {
      id: "api-catalog-latest",
      title: "Korean Market API discovery catalog",
      url: urlFor("/api/catalog.json"),
      external_url: RAPIDAPI_URL,
      summary: "Machine-readable product and endpoint catalog.",
      content_text: `Discovery metadata for ${API_NAME}, generated at ${updatedAt}.`,
      tags: ["openapi", "rapidapi", "developer-tools", "api"]
    }
  ];
}

function summarizeCrypto(crypto) {
  if (!crypto.data) return null;
  return {
    average_premium_percentage: crypto.data.average_premium_percentage,
    tracked_assets: crypto.data.tracked_assets,
    highest_premium: crypto.data.highest_premium,
    lowest_premium: crypto.data.lowest_premium
  };
}

function formatHighestPremium(premium) {
  if (!premium.highest_premium || !premium.highest_premium.symbol) {
    return "Highest asset is temporarily unavailable.";
  }
  return `Highest: ${premium.highest_premium.symbol} at ${premium.highest_premium.premium_percentage}%.`;
}

function getTopKeywords(trends) {
  if (trends.summary && Array.isArray(trends.summary.top_keywords)) {
    return trends.summary.top_keywords;
  }
  return Array.isArray(trends.data) ? trends.data.slice(0, 5).map((trend) => trend.keyword) : [];
}

function latestTimestamp(values) {
  const dates = values
    .filter(Boolean)
    .map((value) => new Date(value))
    .filter((date) => Number.isFinite(date.getTime()));

  if (!dates.length) return new Date().toISOString();
  return new Date(Math.max(...dates.map((date) => date.getTime()))).toISOString();
}

function urlFor(pathValue) {
  if (pathValue === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${pathValue.startsWith("/") ? pathValue : `/${pathValue}`}`;
}

function writeJson(relativePath, payload) {
  writeText(relativePath, `${JSON.stringify(payload, null, 2)}\n`);
}

function writeText(relativePath, content) {
  const filepath = path.join(DOCS_DIR, relativePath);
  fs.mkdirSync(path.dirname(filepath), { recursive: true });
  fs.writeFileSync(filepath, content, "utf8");
  console.log(`Wrote ${path.relative(process.cwd(), filepath)}`);
}

function escapeXml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function safeMarkdown(value) {
  return String(value || "").replace(/\|/g, "\\|").replace(/\n/g, " ");
}

main();
