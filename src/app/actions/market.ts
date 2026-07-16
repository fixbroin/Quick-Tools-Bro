'use server';

export async function fetchMarketRates() {
  // Safe fallbacks matching realistic retail market averages in India (including duty + GST)
  let exchangeRate = 83.5;
  let gold24kBase = 64780;
  let gold24k = 74500;
  let gold22kBase = 59380;
  let gold22k = 68290;
  let silverBase = 78960;
  let silver = 90800;

  try {
    // 1. Fetch USD to INR exchange rate
    try {
      const erRes = await fetch('https://open.er-api.com/v6/latest/USD', { next: { revalidate: 300 } });
      if (erRes.ok) {
        const erData = await erRes.json();
        if (erData?.rates?.INR) {
          exchangeRate = erData.rates.INR;
        }
      }
    } catch (e) {
      console.error('Error fetching exchange rate:', e);
    }

    // 2. Fetch live gold price (XAU) from public keyless API
    let xauPrice = 0;
    try {
      const goldRes = await fetch('https://api.gold-api.com/price/XAU', { next: { revalidate: 300 } });
      if (goldRes.ok) {
        const goldData = await goldRes.json();
        if (goldData?.price) {
          xauPrice = goldData.price;
        }
      }
    } catch (e) {
      console.error('Error fetching live gold price:', e);
    }

    // 3. Fetch live silver price (XAG) from public keyless API
    let xagPrice = 0;
    try {
      const silverRes = await fetch('https://api.gold-api.com/price/XAG', { next: { revalidate: 300 } });
      if (silverRes.ok) {
        const silverData = await silverRes.json();
        if (silverData?.price) {
          xagPrice = silverData.price;
        }
      }
    } catch (e) {
      console.error('Error fetching live silver price:', e);
    }

    // Standard Troy Ounce to Grams ratio
    const ozToGram = 31.1034768;

    if (xauPrice > 0) {
      gold24kBase = Math.round((xauPrice / ozToGram) * 10 * exchangeRate);
      gold24k = Math.round(gold24kBase * 1.15); // Add 15% Indian Customs + GST markup
      
      gold22kBase = Math.round(gold24kBase * 22 / 24);
      gold22k = Math.round(gold24k * 22 / 24);
    }

    if (xagPrice > 0) {
      silverBase = Math.round((xagPrice / ozToGram) * 1000 * exchangeRate);
      silver = Math.round(silverBase * 1.15); // Add 15% Indian Customs + GST markup
    }

    return {
      exchangeRate,
      gold24kBase,
      gold24k,
      gold22kBase,
      gold22k,
      silverBase,
      silver
    };
  } catch (err) {
    console.error('Error in fetchMarketRates main block:', err);
    return {
      exchangeRate,
      gold24kBase,
      gold24k,
      gold22kBase,
      gold22k,
      silverBase,
      silver
    };
  }
}
