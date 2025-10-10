# Market Navigator - Vanilla JavaScript

A vanilla JavaScript version of the Market Navigator stock chart dashboard, built with Plotly.js and modern web standards.

## Features

- **Interactive Stock Charts**: Zoomable and pannable charts powered by Plotly.js
- **Multiple Ticker Support**: Track ETFs, indices, and individual stocks
- **Inflation Adjustment**: View prices adjusted for inflation using CPI data
- **Historical Events**: Overlay major economic events on charts
- **Reference Point Analysis**: Click any point to calculate percentage changes
- **Responsive Design**: Works on desktop and mobile devices

## Quick Start

1. **Start the server**:
   ```bash
   cd vanilla_dashboard
   npm start
   ```

2. **Open your browser**:
   Navigate to `http://localhost:3001`

## Project Structure

```
vanilla_dashboard/
├── index.html          # Main HTML file
├── styles.css          # CSS styles
├── app.js             # Main application logic
├── data.js            # Data configuration and loading functions
├── server.js          # Simple HTTP server
├── package.json       # Node.js dependencies
└── README.md          # This file
```

## Key Differences from React Version

- **No Build Process**: Pure HTML, CSS, and JavaScript - no compilation needed
- **Vanilla JavaScript**: Uses modern ES6+ features without frameworks
- **Plotly.js CDN**: Loads Plotly from CDN instead of npm package
- **Simple Server**: Basic Node.js HTTP server for development
- **Same Data**: Uses the same JSON data files as the React version

## Available Tickers

### ETFs & Indices
- **SPY**: S&P 500 ETF
- **QQQ**: Nasdaq-100 ETF
- **DIA**: Dow Jones ETF
- **IWM**: Russell 2000 ETF
- **VT**: Total World Stock ETF
- **VTI**: Total US Market ETF
- **Sector ETFs**: XLF, XLK, XLV, XLE, XLY, XLI, XLRE, XLC, XLU, XLB
- **Other**: ^VIX (Volatility), DX-Y.NYB (Dollar Index), UST10Y (10Y Treasury)

### Individual Stocks
- **MSFT**: Microsoft
- **AAPL**: Apple
- **COST**: Costco
- **KO**: Coca-Cola
- **ABBV**: AbbVie
- **GIS**: General Mills
- **DUK**: Duke Energy
- **SAP**: SAP SE

## Historical Events

The dashboard includes overlays for major economic events:
- Recessions (1966, 1969-70, 1973-75, 1980-82, 1990-91)
- Financial Crises (1987 Black Monday, 2008 Financial Crisis, COVID-19)
- Economic Periods (1970s Stagflation, Dot-Com Bubble, European Debt Crisis)
- Recent Events (2022 Inflation Shock, AI Boom, 2024 Trump Election)

## Controls

- **Ticker Selection**: Check/uncheck tickers to add/remove from chart
- **Inflation Adjustment**: Toggle to view inflation-adjusted prices
- **Reference Point**: Click any chart point to set as reference for % calculations
- **Event Overlays**: Toggle individual historical events on/off
- **Chart Controls**: Hide/show grid lines, event overlays, reset zoom

## Browser Compatibility

- Modern browsers with ES6+ support
- Chrome 60+, Firefox 55+, Safari 12+, Edge 79+

## Development

The application uses:
- **Plotly.js**: For interactive charts
- **Vanilla JavaScript**: ES6+ features (classes, async/await, modules)
- **CSS Grid/Flexbox**: For responsive layout
- **Fetch API**: For loading JSON data

## Data Sources

- Stock data: JSON files in `../stock_chart_dashboard/data/tickers/`
- CPI data: `../stock_chart_dashboard/data/consumer-price-index/cpi_data.json`

## Performance

- Lazy loading of ticker data
- Efficient chart updates
- Responsive design optimizations
- CDN-delivered Plotly.js for fast loading

