/**
 * Notifies IndexNow-compatible search engines after static discovery files move.
 *
 * This is deliberately conservative: it submits only URLs listed in sitemap.xml,
 * treats indexing notification as best-effort, and never fails the data pipeline.
 */

const fs = require("fs");
const path = require("path");

const DOCS_DIR = path.join(__dirname, "..", "docs");
const SITE_URL = "https://germankbr.github.io/signal-protocol";
const INDEXNOW_ENDPOINT = process.env.INDEXNOW_ENDPOINT || "https://api.indexnow.org/indexnow";

async function main() {
  if (process.env.SKIP_INDEXNOW === "1") {
    console.log("IndexNow notification skipped by SKIP_INDEXNOW=1.");
    return;
  }

  const key = readFile("indexnow-key.txt").trim();
  const urls = readSitemapUrls();

  if (!key || !urls.length) {
    console.warn("IndexNow notification skipped: missing key or sitemap URLs.");
    return;
  }

  const payload = {
    host: new URL(SITE_URL).host,
    key,
    keyLocation: `${SITE_URL}/indexnow-key.txt`,
    urlList: urls
  };

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "User-Agent": "KoreanMarketAPI-DiscoveryBot/1.0"
      },
      body: JSON.stringify(payload)
    });
    const responseText = await response.text();

    if (response.status === 200 || response.status === 202) {
      console.log(`IndexNow accepted ${urls.length} URLs with HTTP ${response.status}.`);
      return;
    }

    console.warn(`IndexNow returned HTTP ${response.status}: ${responseText.slice(0, 300)}`);
  } catch (error) {
    console.warn(`IndexNow notification failed: ${error.message}`);
  }
}

function readSitemapUrls() {
  const sitemap = readFile("sitemap.xml");
  const matches = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)];
  return matches
    .map((match) => match[1].trim())
    .filter((url) => url.startsWith(SITE_URL))
    .slice(0, 100);
}

function readFile(relativePath) {
  return fs.readFileSync(path.join(DOCS_DIR, relativePath), "utf8");
}

main().catch((error) => {
  console.warn(`IndexNow notification failed: ${error.message}`);
});
