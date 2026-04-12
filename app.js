let coinsGrid = document.getElementById("coinsGrid");
let errorMsg = document.getElementById("errorMsg");
let currencySelect = document.getElementById("currencySelect");
let sortSelect = document.getElementById("sortSelect");
let refreshBtn = document.getElementById("refreshBtn");
let lastUpdated = document.getElementById("lastUpdated");

let currentData = [];

function getCurrencySymbol(currency) {
  if (currency === "usd") {
    return "$";
  } else if (currency === "eur") {
    return "€";
  } else if (currency === "inr") {
    return "₹";
  } else {
    return "$";
  }
}

async function loadMarketData() {
  errorMsg.style.display = "none";
  let currency = currencySelect.value;

  try {
    currentData = await window.api.getMarkets(currency);

    let now = new Date();
    let timeString = now.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    lastUpdated.textContent = "Updated at " + timeString;

    renderCoins();
  } catch (error) {
    coinsGrid.innerHTML = "";
    errorMsg.style.display = "block";
    console.error("Oops something broke: ", error);
  }
}

function renderCoins() {
  if (currentData === undefined || currentData.length === 0) {
    return;
  }

  let currency = currencySelect.value;
  let symbol = getCurrencySymbol(currency);
  let sortBy = sortSelect.value;

  let sortedData = currentData.slice();

  if (sortBy === 'price') {
    sortedData.sort(function(a, b) {
      return b.current_price - a.current_price;
    });
  } else if (sortBy === 'percent_change') {
    sortedData.sort(function(a, b) {
      return b.price_change_percentage_24h - a.price_change_percentage_24h;
    });
  } else {
    sortedData.sort(function(a, b) {
      return b.market_cap - a.market_cap;
    });
  }

  coinsGrid.innerHTML = "";

  for (let i = 0; i < sortedData.length; i++) {
    let coin = sortedData[i];

    let isUp = false;
    if (coin.price_change_percentage_24h >= 0) {
      isUp = true;
    }

    let formattedPrice = coin.current_price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 });
    let formattedMarketCap = coin.market_cap.toLocaleString(undefined, { maximumFractionDigits: 0 });
    let formattedVolume = coin.total_volume.toLocaleString(undefined, { maximumFractionDigits: 0 });

    let card = document.createElement("div");
    card.className = "card clickable-card";

    card.addEventListener("click", function() {
      window.location.href = "https://www.coingecko.com/en/coins/" + coin.id;
    });

    let arrowIcon = "▼";
    let changeClass = "down";

    if (isUp === true) {
      arrowIcon = "▲";
      changeClass = "up";
    }

    let percentageNumber = Math.abs(coin.price_change_percentage_24h).toFixed(2);

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

      <div class="coin-price">${symbol}${formattedPrice}</div>

      <span class="coin-change ${changeClass}">
        ${arrowIcon} ${percentageNumber}%
      </span>

      <div class="coin-meta">
        <div class="meta-row">
          <span class="meta-label">Market Cap</span>
          <span class="meta-val">${symbol}${formattedMarketCap}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">24h Volume</span>
          <span class="meta-val">${symbol}${formattedVolume}</span>
        </div>
      </div>
    `;

    coinsGrid.appendChild(card);
  }
}

currencySelect.addEventListener("change", function() {
  loadMarketData();
});

sortSelect.addEventListener("change", function() {
  renderCoins();
});

refreshBtn.addEventListener("click", async function() {
  refreshBtn.classList.add("spinning");
  await loadMarketData();
  setTimeout(function() {
    refreshBtn.classList.remove("spinning");
  }, 500);
});

loadMarketData();
