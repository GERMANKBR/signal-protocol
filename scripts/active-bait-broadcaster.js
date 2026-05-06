const https = require('https');
const http = require('http');

const HOST = 'germankbr.github.io';
const SITE_URL = `https://${HOST}/signal-protocol/`;

// The highest-value honey pots
const urlsToPing = [
  `${SITE_URL}api/solana-risk-signal.json`,
  `${SITE_URL}api/lp-status-monitor.json`,
  `${SITE_URL}api/ai-readiness-score.json`,
  `${SITE_URL}api/wallet-distribution.json`,
  `${SITE_URL}api/mev-arb-rpc-access.json`,
  `${SITE_URL}api/jito-mev-bundle-leak.json`
];

console.log("🚀 Starting Aggressive Bait Broadcaster (Option 2)...");

// 1. IndexNow Ping (For Bing, Yandex, Seznam, etc.)
function pingIndexNow() {
  const data = JSON.stringify({
    host: HOST,
    key: '8a7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d',
    keyLocation: `${SITE_URL}indexnow-key.txt`,
    urlList: urlsToPing
  });

  const options = {
    hostname: 'api.indexnow.org',
    port: 443,
    path: '/IndexNow',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Content-Length': data.length
    }
  };

  const req = https.request(options, (res) => {
    console.log(`📡 IndexNow Ping Status: ${res.statusCode}`);
  });
  req.on('error', (e) => console.error('IndexNow Error:', e.message));
  req.write(data);
  req.end();
}

// 2. Google Ping (Legacy but still draws Googlebot)
function pingGoogle() {
  urlsToPing.forEach(url => {
    https.get(`https://www.google.com/ping?sitemap=${encodeURIComponent(SITE_URL + 'sitemap.xml')}`, (res) => {
      console.log(`🕷️ Googlebot Ping for Sitemap: ${res.statusCode}`);
    }).on('error', (e) => {});
  });
}

// 3. Pingomatic XML-RPC (Broadcasts to various feed readers and scrapers)
function pingomatic() {
  const xmlPayload = `<?xml version="1.0"?>
<methodCall>
  <methodName>weblogUpdates.ping</methodName>
  <params>
    <param><value>SIGNAL Protocol API</value></param>
    <param><value>${SITE_URL}</value></param>
  </params>
</methodCall>`;

  const options = {
    hostname: 'rpc.pingomatic.com',
    port: 80,
    path: '/',
    method: 'POST',
    headers: {
      'Content-Type': 'text/xml',
      'Content-Length': Buffer.byteLength(xmlPayload)
    }
  };

  const req = http.request(options, (res) => {
    console.log(`📣 Ping-O-Matic Broadcaster Status: ${res.statusCode}`);
  });
  req.on('error', (e) => console.error('Pingomatic Error:', e.message));
  req.write(xmlPayload);
  req.end();
}

// Execute all pings
pingIndexNow();
pingGoogle();
pingomatic();

console.log("🎣 Aggressive Baits cast! Wait for crawlers, feed scrapers, and MEV indexers to hit the JSON endpoints.");
