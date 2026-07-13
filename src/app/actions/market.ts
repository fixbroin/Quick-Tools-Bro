'use server';

export async function fetchMarketRates() {
  try {
    // Fetch live Indian benchmark rates directly from goldratetodaylive (which pulls from IBJA)
    const res = await fetch('https://goldratetodaylive.in/api/v1/rates/today.json', {
      next: { revalidate: 3600 } // Cache for 1 hour to avoid rate limit blocks
    });
    const data = await res.json();

    const gold24k = data?.gold?.['999'] ? Math.round(data.gold['999'] * 10) : 147630;
    const gold22k = data?.gold?.['916'] ? Math.round(data.gold['916'] * 10) : 135230;
    const silver = data?.silver?.['999'] ? Math.round(data.silver['999']) : 212480;

    // Fetch USD to INR exchange rate for scaling fuel prices
    const erRes = await fetch('https://open.er-api.com/v6/latest/USD', { next: { revalidate: 3600 } });
    const erData = await erRes.json();
    const exchangeRate = erData?.rates?.INR || 95.5;

    return {
      exchangeRate,
      gold24k,
      gold22k,
      silver
    };
  } catch (err) {
    console.error('Error fetching live IBJA rates:', err);
    return {
      exchangeRate: 95.5,
      gold24k: 147630,
      gold22k: 135230,
      silver: 212480
    };
  }
}
