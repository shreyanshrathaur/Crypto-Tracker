const coinsGrid = document.getElementById("coinsGrid");
const errorMsg = document.getElementById("errorMsg");
const currencySelect = document.getElementById("currencySelect");
const sortSelect = document.getElementById("sortSelect");
const refreshBtn = document.getElementById("refreshBtn");
const lastUpdated = document.getElementById("lastUpdated");

let currentData = [];

const getCurrencySymbol = (currency) => {
  const symbols = { 'usd': '$', 'eur': '€', 'inr': '₹' };
  return symbols[currency] || '$';
};

async function loadMarketData() {
  errorMsg.style.display = "none";
  const currency = currencySelect.value;
  
  try {
    currentData = await window.api.getMarkets(currency);
    
    // Update time snippet
    const now = new Date();
    lastUpdated.textContent = `Updated at ${now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true })}`;
    
    renderCoins();
  } catch (error) {
    coinsGrid.innerHTML = "";
    errorMsg.style.display = "block";
    console.error(error);
  }
}

function renderCoins() {
  if (!currentData || !currentData.length) return;

  const currency = currencySelect.value;
  const symbol = getCurrencySymbol(currency);
  const sortBy = sortSelect.value;
  
  let sortedData = [...currentData];

  // Perform Local Sorting
  if (sortBy === 'price') {
    sortedData.sort((a, b) => b.current_price - a.current_price);
  } else if (sortBy === 'percent_change') {
    sortedData.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h);
  } else {
    // Default to sorting by Market Cap
    sortedData.sort((a, b) => b.market_cap - a.market_cap);
  }

  coinsGrid.innerHTML = "";

  const priceFormat = new Intl.NumberFormat(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
  const compactFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });

  sortedData.forEach(coin => {
    const isUp = coin.price_change_percentage_24h >= 0;
    const card = document.createElement("div");
    
    // Notice the clickable-card class adding cursor:pointer styles
    card.className = "card clickable-card";
    
    // Link entire card to the detail page
    card.addEventListener("click", () => {
      window.location.href = `coin.html?id=${coin.id}&currency=${currency}`;
    });

    card.innerHTML = `
      <div class="card-top">
        <div class="coin-identity">
          <img class="coin-img" src="${coin.image}" alt="${coin.name}" loading="lazy" />
          <div>
            <span class="coin-name">${coin.name}</span>
            <span class="coin-symbol">${coin.symbol.toUpperCase()}</span>
          </div>
        </div>
        <span class="coin-rank">#${coin.market_cap_rank}</span>
      </div>

      <div class="coin-price">${symbol}${priceFormat.format(coin.current_price)}</div>

      <span class="coin-change ${isUp ? 'up' : 'down'}">
        ${isUp ? '▲' : '▼'} ${Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
      </span>

      <div class="coin-meta">
        <div class="meta-row">
          <span class="meta-label">Market Cap</span>
          <span class="meta-val">${symbol}${compactFormat.format(coin.market_cap)}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">24h Volume</span>
          <span class="meta-val">${symbol}${compactFormat.format(coin.total_volume)}</span>
        </div>
      </div>
    `;

    coinsGrid.appendChild(card);
  });
}

// Event Listeners for UI
currencySelect.addEventListener("change", loadMarketData);
sortSelect.addEventListener("change", renderCoins);

refreshBtn.addEventListener("click", () => {
    refreshBtn.classList.add("spinning");
    loadMarketData().finally(() => {
        setTimeout(() => refreshBtn.classList.remove("spinning"), 500);
    });
});

// Run Initializer
loadMarketData();