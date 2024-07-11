const apiKey = '4MX8QT3E0FJBZNG5'; // Your Alpha Vantage API key

async function fetchStockData() {
    const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=GME&apikey=${apiKey}`);
    const data = await response.json();
    return data['Global Quote'];
}

async function updateTicker() {
    try {
        const stockData = await fetchStockData();

        if (stockData) {
            const price = parseFloat(stockData['05. price']).toFixed(2);
            const change = parseFloat(stockData['09. change']).toFixed(2);
            const changePercent = parseFloat(stockData['10. change percent']).toFixed(2);
            const volume = (parseFloat(stockData['06. volume']) / 1000000).toFixed(2);

            const tickerContent = document.getElementById('ticker-content');
            tickerContent.textContent = `GME: $${price} (${change > 0 ? '+' : ''}${changePercent}%) | Volume: ${volume}M | Latest DD: "The MOASS Theorem" by u/RocketApe | Next Earnings: June 15, 2024`;
            console.log("Ticker updated successfully");
        } else {
            console.error("No stock data received");
        }
    } catch (error) {
        console.error('Error updating ticker:', error);
    }
}

// Update ticker every 5 minutes (300000 ms)
setInterval(updateTicker, 300000);

// Initial update
updateTicker();

// Add click event listeners to tool buttons
document.querySelectorAll('.tool-button').forEach(button => {
    button.addEventListener('click', function() {
        alert(`Launching ${this.textContent}... This feature is not yet implemented.`);
    });
});
