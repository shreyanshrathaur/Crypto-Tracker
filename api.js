const API_KEY = "CG-teizHFS6WHgRrdaXkc3H44Sh";
const BASE_URL = "https://api.coingecko.com/api/v3";

const fetchOptions = {
  headers: { "x-cg-demo-api-key": API_KEY }
};

window.api = {
  getMarkets: async (currency) => {
    const url = `${BASE_URL}/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=20&page=1`;
    const res = await fetch(url, fetchOptions);
    if (!res.ok) throw new Error("Failed to fetch markets");
    return res.json();
  },
  
  getCoinDetails: async (coinId) => {
    // Exclude redundant info, just keep the market_data and desc
    const url = `${BASE_URL}/coins/${coinId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`;
    const res = await fetch(url, fetchOptions);
    if (!res.ok) throw new Error("Failed to fetch coin details");
    return res.json();
  }
};
