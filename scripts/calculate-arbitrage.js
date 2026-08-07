const fs = require('fs');
const path = require('path');

// Fee Constants
const UPBIT_FEE_RATE = 0.0005;   // 0.05%
const BINANCE_FEE_RATE = 0.001;  // 0.10%
const EST_NETWORK_SLIPPAGE = 0.0015; // 0.15% estimated network fee & slippage

function calculateArbitrageSignals() {
  const premiumFilePath = path.join(__dirname, '..', 'docs', 'api', 'v1', 'premium-all.json');
  const outputFilePath = path.join(__dirname, '..', 'docs', 'api', 'v1', 'arbitrage-signals.json');

  if (!fs.existsSync(premiumFilePath)) {
    console.error('premium-all.json file not found.');
    return null;
  }

  const rawData = JSON.parse(fs.readFileSync(premiumFilePath, 'utf8'));
  const coins = rawData.data?.assets || [];

  const signals = [];

  for (const coin of coins) {
    const symbol = coin.symbol;
    const premiumPct = coin.premium_percentage;
    const upbitPrice = coin.upbit_price_krw;
    const binancePriceKrw = coin.binance_price_krw_converted;
    const binancePriceUsdt = coin.binance_price_usdt;

    if (!upbitPrice || !binancePriceKrw || upbitPrice <= 0 || binancePriceKrw <= 0) continue;

    // 1. Kimchi Premium Direction (Buy abroad on Binance, Sell domestically on Upbit)
    // Buy on Binance: Effective cost = binancePriceKrw * (1 + BINANCE_FEE_RATE)
    // Transfer cost & Slippage: * (1 + EST_NETWORK_SLIPPAGE)
    // Sell on Upbit: Revenue = upbitPrice * (1 - UPBIT_FEE_RATE)
    const binanceBuyTotalCost = binancePriceKrw * (1 + BINANCE_FEE_RATE) * (1 + EST_NETWORK_SLIPPAGE);
    const upbitSellNetRevenue = upbitPrice * (1 - UPBIT_FEE_RATE);
    const netRoiKimchiPct = ((upbitSellNetRevenue - binanceBuyTotalCost) / binanceBuyTotalCost) * 100;

    // 2. Kimchi Discount / Reverse Premium Direction (Buy domestically on Upbit, Sell abroad on Binance)
    // Buy on Upbit: Cost = upbitPrice * (1 + UPBIT_FEE_RATE)
    // Transfer cost & Slippage: * (1 + EST_NETWORK_SLIPPAGE)
    // Sell on Binance: Revenue = binancePriceKrw * (1 - BINANCE_FEE_RATE)
    const upbitBuyTotalCost = upbitPrice * (1 + UPBIT_FEE_RATE) * (1 + EST_NETWORK_SLIPPAGE);
    const binanceSellNetRevenue = binancePriceKrw * (1 - BINANCE_FEE_RATE);
    const netRoiReversePct = ((binanceSellNetRevenue - upbitBuyTotalCost) / upbitBuyTotalCost) * 100;

    // Best opportunity determination
    let maxNetRoi = netRoiKimchiPct;
    let strategy = "BINANCE_BUY_UPBIT_SELL";
    let direction = "kimchi_premium";

    if (netRoiReversePct > netRoiKimchiPct) {
      maxNetRoi = netRoiReversePct;
      strategy = "UPBIT_BUY_BINANCE_SELL";
      direction = "kimchi_discount";
    }

    let signalGrade = "NEUTRAL";
    if (maxNetRoi >= 3.0) {
      signalGrade = "STRONG_BUY";
    } else if (maxNetRoi >= 1.0) {
      signalGrade = "BUY";
    }

    signals.push({
      symbol,
      gross_premium_pct: parseFloat(premiumPct.toFixed(2)),
      net_roi_pct: parseFloat(maxNetRoi.toFixed(2)),
      signal_grade: signalGrade,
      recommended_strategy: strategy,
      direction: direction,
      prices: {
        upbit_krw: upbitPrice,
        binance_usdt: binancePriceUsdt,
        binance_krw_equiv: parseFloat(binancePriceKrw.toFixed(2))
      },
      estimated_fees: {
        upbit_fee_pct: 0.05,
        binance_fee_pct: 0.10,
        estimated_network_slippage_pct: 0.15
      }
    });
  }

  // Sort signals by net ROI descending
  signals.sort((a, b) => b.net_roi_pct - a.net_roi_pct);

  const strongBuySignals = signals.filter(s => s.signal_grade === "STRONG_BUY");
  const buySignals = signals.filter(s => s.signal_grade === "BUY");

  const resultPayload = {
    status: "ok",
    api: "Arbitrage Profit Signal API",
    endpoint: "/api/v1/arbitrage-signals.json",
    description: "Net ROI profit signals considering Upbit/Binance trading fees and network slippage.",
    updated_at: new Date().toISOString(),
    summary: {
      total_tracked_coins: signals.length,
      strong_buy_signals_count: strongBuySignals.length,
      buy_signals_count: buySignals.length,
      max_net_roi_coin: signals[0] ? { symbol: signals[0].symbol, net_roi_pct: signals[0].net_roi_pct } : null
    },
    signals: signals
  };

  fs.writeFileSync(outputFilePath, JSON.stringify(resultPayload, null, 2), 'utf8');
  console.log(`[Arbitrage Engine] Successfully generated signals for ${signals.length} coins. Strong BUYs: ${strongBuySignals.length}, BUYs: ${buySignals.length}`);
  return resultPayload;
}

if (require.main === module) {
  calculateArbitrageSignals();
}

module.exports = { calculateArbitrageSignals };
