const API_KEY = "CG-teizHFS6WHgRrdaXkc3H44Sh";

const URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1";

const coinsGrid = document.getElementById("coinsGrid");
const errorMsg = document.getElementById("errorMsg");

function fetchCoins() {
  fetch(URL, {
    headers: {
      "x-cg-demo-api-key": API_KEY
    }
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(coins) {
      coinsGrid.innerHTML = "";

      coins.forEach(function(coin) {
        const isUp = coin.price_change_percentage_24h >= 0;

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
          <div class="card-top">
            <div class="coin-identity">
              <img class="coin-img" src="${coin.image}" alt="${coin.name}" />
              <div>
                <span class="coin-name">${coin.name}</span>
                <span class="coin-symbol">${coin.symbol.toUpperCase()}</span>
              </div>
            </div>
            <span class="coin-rank">#${coin.market_cap_rank}</span>
          </div>

          <div class="coin-price">$${coin.current_price.toLocaleString()}</div>

          <span class="coin-change ${isUp ? 'up' : 'down'}">
            ${isUp ? '▲' : '▼'} ${Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
          </span>

          <div class="coin-meta">
            <div class="meta-row">
              <span class="meta-label">Market Cap</span>
              <span class="meta-val">$${coin.market_cap.toLocaleString()}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">24h Volume</span>
              <span class="meta-val">$${coin.total_volume.toLocaleString()}</span>
            </div>
          </div>
        `;

        coinsGrid.appendChild(card);
      });
    })
    .catch(function(error) {
      coinsGrid.innerHTML = "";
      errorMsg.style.display = "block";
      console.log("Error:", error);
    });
}

fetchCoins();