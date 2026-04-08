const detailView = document.getElementById("detailView");
const loadingMsg = document.getElementById("loadingMsg");
const errorMsg = document.getElementById("errorMsg");

const getCurrencySymbol = (currency) => {
  const symbols = { 'usd': '$', 'eur': '€', 'inr': '₹' };
  return symbols[currency] || '$';
};

async function loadDetail() {
  const params = new URLSearchParams(window.location.search);
  const coinId = params.get('id');
  const currency = params.get('currency') || 'usd';

  if (!coinId) {
    loadingMsg.style.display = "none";
    errorMsg.style.display = "block";
    errorMsg.textContent = "No coin ID provided in the URL.";
    return;
  }

  try {
    const data = await window.api.getCoinDetails(coinId);
    
    loadingMsg.style.display = "none";
    detailView.style.display = "block";

    const symbol = getCurrencySymbol(currency);
    const priceRaw = data.market_data.current_price[currency];
    const marketCapRaw = data.market_data.market_cap[currency];
    const volRaw = data.market_data.total_volume[currency];
    const change24h = data.market_data.price_change_percentage_24h;

    const isUp = change24h >= 0;

    const formatter = new Intl.NumberFormat(undefined, { maximumFractionDigits: 6 });
    const standardFormat = new Intl.NumberFormat(undefined, { maximumFractionDigits: 0 });

    detailView.innerHTML = `
      <div class="detail-header card">
        <div class="detail-identity">
            <img class="detail-img" src="${data.image.large}" alt="${data.name}" />
            <div class="detail-names">
                <h1 class="detail-title">${data.name}</h1>
                <span class="detail-symbol">${data.symbol.toUpperCase()}</span>
                <span class="detail-rank">Rank #${data.market_cap_rank || 'N/A'}</span>
            </div>
        </div>
        <div class="detail-price-box">
            <div class="detail-price">${symbol}${formatter.format(priceRaw)}</div>
            <div class="coin-change ${isUp ? 'up' : 'down'}">
                ${isUp ? '▲' : '▼'} ${Math.abs(change24h).toFixed(2)}%
            </div>
        </div>
      </div>

      <div class="detail-stats card" style="margin-top: 24px;">
        <h3>Market Statistics</h3>
        <div class="stats-grid">
            <div class="stat-item">
                <div class="stat-label">Market Cap</div>
                <div class="stat-value">${symbol}${standardFormat.format(marketCapRaw)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Trading Volume (24h)</div>
                <div class="stat-value">${symbol}${standardFormat.format(volRaw)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Circulating Supply</div>
                <div class="stat-value">${standardFormat.format(data.market_data.circulating_supply)}</div>
            </div>
            <div class="stat-item">
                <div class="stat-label">Total Supply</div>
                <div class="stat-value">${data.market_data.total_supply ? standardFormat.format(data.market_data.total_supply) : '∞'}</div>
            </div>
        </div>
      </div>

      ${data.description && data.description.en ? `
      <div class="detail-desc card" style="margin-top: 24px;">
          <h3>About ${data.name}</h3>
          <div class="desc-text">${data.description.en}</div>
      </div>
      ` : ''}
    `;

  } catch (err) {
    console.error(err);
    loadingMsg.style.display = "none";
    errorMsg.style.display = "block";
  }
}

document.addEventListener("DOMContentLoaded", loadDetail);
