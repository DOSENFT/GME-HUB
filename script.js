// Function to fetch stock data from Yahoo Finance
async function fetchStockData() {
    const response = await fetch('https://query1.finance.yahoo.com/v7/finance/quote?symbols=GME');
    const data = await response.json();
    return data.quoteResponse.result[0];
}

// Function to fetch FTD data from SEC EDGAR (called less frequently)
async function fetchFTDData() {
    // Check if we have cached data and it's less than a day old
    const cachedData = localStorage.getItem('ftdData');
    const cachedTime = localStorage.getItem('ftdDataTime');
    if (cachedData && cachedTime && (Date.now() - parseInt(cachedTime)) < 86400000) {
        return JSON.parse(cachedData);
    }

    const response = await fetch('https://data.sec.gov/api/xbrl/companyconcept/CIK13263801/us-gaap/FailuresToDeliver');
    const data = await response.json();
    const latestFTD = data.units['USD']?.[data.units['USD'].length - 1];
    
    // Cache the data
    localStorage.setItem('ftdData', JSON.stringify(latestFTD));
    localStorage.setItem('ftdDataTime', Date.now().toString());

    return latestFTD;
}

// Function to update the ticker
async function updateTicker() {
    try {
        const stockData = await fetchStockData();

        const price = stockData.regularMarketPrice.toFixed(2);
        const change = stockData.regularMarketChange.toFixed(2);
        const changePercent = stockData.regularMarketChangePercent.toFixed(2);
        const volume = (stockData.regularMarketVolume / 1000000).toFixed(2);
        const shortPercentOfFloat = stockData.shortPercentOfFloat ? (stockData.shortPercentOfFloat * 100).toFixed(2) : 'N/A';

        // Fetch FTD data only once a day
        let ftdData = localStorage.getItem('ftdData');
        if (!ftdData) {
            const ftdResponse = await fetchFTDData();
            ftdData = ftdResponse?.val || 'N/A';
        } else {
            ftdData = JSON.parse(ftdData).val || 'N/A';
        }

        const tickerContent = document.getElementById('ticker-content');
        tickerContent.textContent = `GME: $${price} (${change > 0 ? '+' : ''}${changePercent}%) | Volume: ${volume}M | Short % of Float: ${shortPercentOfFloat}% | FTDs: ${ftdData}M | Latest DD: "The MOASS Theorem" by u/RocketApe | Next Earnings: June 15, 2024`;
    } catch (error) {
        console.error('Error updating ticker:', error);
    }
}

// Update ticker every 60 seconds
setInterval(updateTicker, 60000);

// Initial update
updateTicker();

// Add click event listeners to tool buttons
document.querySelectorAll('.tool-button').forEach(button => {
    button.addEventListener('click', function() {
        alert(`Launching ${this.textContent}... This feature is not yet implemented.`);
    });
});