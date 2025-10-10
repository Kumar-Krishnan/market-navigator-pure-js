// Configuration and data for the Market Navigator app

// Available tickers
const availableTickers = ['SPY', 'QQQ', 'DIA', 'IWM', 'VT', 'VTI', 'XLF', 'XLK', 'XLV',
    'XLE', 'XLY', 'XLI', 'XLRE', 'XLC', 'XLU', 'XLB', '^VIX', 'DX-Y.NYB'].sort();

const individualStocks = ['MSFT', 'AAPL', 'COST', 'KO', 'ABBV', 'GIS', 'DUK', 'XYZ', 'SAP'].sort();

// Macro economic indicators
const macroIndicators = ['UST10Y', 'FEDFUNDS', 'UNRATE', 'CPIAUCSL', 'PSAVERT', 'GDP', 'M2SL', 'MEHOINUSA672N'].sort();

// Ticker colors
const tickerColors = {
    SPY: '#1f77b4',      // Blue
    QQQ: '#ff7f0e',      // Orange  
    DIA: '#2ca02c',      // Green
    IWM: '#d62728',      // Red
    VT: '#9467bd',       // Purple
    VTI: '#8c564b',      // Brown
    XLF: '#e377c2',      // Pink
    XLK: '#7f7f7f',      // Gray
    XLV: '#bcbd22',      // Olive
    XLE: '#17becf',      // Cyan
    XLY: '#ff9896',      // Light Red
    XLI: '#c5b0d5',      // Light Purple
    XLRE: '#c49c94',     // Light Brown
    XLC: '#f7b6d3',      // Light Pink
    XLU: '#c7c7c7',      // Light Gray
    XLB: '#dbdb8d',      // Light Olive
    '^VIX': '#ff6b6b',   // Bright Red
    'DX-Y.NYB': '#4ecdc4', // Teal
    'UST10Y': '#45b7d1',   // Sky Blue
    MSFT: '#00a2ed',     // Microsoft Blue
    AAPL: '#007aff',     // Apple Blue
    COST: '#e31837',     // Costco Red
    KO: '#f40009',       // Coca-Cola Red
    ABBV: '#4169e1',     // Royal Blue
    GIS: '#0057b8',      // General Mills Blue
    DUK: '#005eb8',      // Duke Energy Blue
    XYZ: '#6c757d',      // Neutral Gray
    SAP: '#0f7db8',      // SAP Blue
    // Macro indicators
    FEDFUNDS: '#dc3545',   // Fed Red
    UNRATE: '#ffc107',     // Unemployment Yellow
    CPIAUCSL: '#28a745',   // CPI Green
    PSAVERT: '#17a2b8',    // Savings Teal
    GDP: '#6f42c1',        // GDP Purple
    M2SL: '#fd7e14',       // Money Supply Orange
    MEHOINUSA672N: '#20c997'  // Median Income Teal-Green
};

// Ticker information
const tickerInfo = {
    SPY: 'SPDR S&P 500 ETF — tracks the S&P 500 index.',
    QQQ: 'Invesco QQQ ETF — tracks the Nasdaq-100 index.',
    DIA: 'SPDR Dow Jones Industrial Average ETF.',
    IWM: 'iShares Russell 2000 ETF — small-cap U.S. stocks.',
    VT: 'Vanguard Total World Stock ETF.',
    VTI: 'Vanguard Total Stock Market ETF — entire U.S. market.',
    MSFT: 'Microsoft Corporation — technology and software company.',
    AAPL: 'Apple Inc. — technology and consumer electronics company.',
    XLF: 'Financial Select Sector SPDR Fund — tracks financial sector stocks.',
    XLK: 'Technology Select Sector SPDR Fund — tracks technology sector stocks.',
    XLV: 'Health Care Select Sector SPDR Fund — tracks healthcare sector stocks.',
    XLE: 'Energy Select Sector SPDR Fund — tracks energy sector stocks.',
    XLY: 'Consumer Discretionary Select Sector SPDR Fund — tracks consumer discretionary sector stocks.',
    XLI: 'Industrial Select Sector SPDR Fund — tracks industrial sector stocks.',
    XLRE: 'Real Estate Select Sector SPDR Fund — tracks real estate sector stocks.',
    XLC: 'Communication Services Select Sector SPDR Fund — tracks communication services sector stocks.',
    XLU: 'Utilities Select Sector SPDR Fund — tracks utilities sector stocks.',
    XLB: 'Materials Select Sector SPDR Fund — tracks materials sector stocks.',
    COST: 'Costco Wholesale Corporation — membership warehouse club.',
    KO: 'The Coca-Cola Company — beverage company.',
    ABBV: 'AbbVie Inc. — biopharmaceutical company.',
    GIS: 'General Mills, Inc. — food processing company.',
    DUK: 'Duke Energy Corporation — electric power and natural gas company.',
    '^VIX': 'CBOE Volatility Index — measures market volatility and investor sentiment.',
    'DX-Y.NYB': 'U.S. Dollar Index — measures the value of the U.S. dollar relative to a basket of foreign currencies.',
    'UST10Y': '10-Year U.S. Treasury Yield — benchmark interest rate for long-term U.S. government debt.',
    'FEDFUNDS': 'Federal Funds Rate — the interest rate at which banks lend to each other overnight.',
    'UNRATE': 'Unemployment Rate — percentage of labor force that is unemployed and actively seeking employment.',
    'CPIAUCSL': 'Consumer Price Index — measures inflation by tracking price changes in consumer goods and services.',
    'PSAVERT': 'Personal Savings Rate — percentage of disposable income that households save.',
    'GDP': 'Gross Domestic Product — total value of goods and services produced in the economy.',
    'M2SL': 'M2 Money Supply — measure of money supply including cash, checking deposits, and easily convertible near money.',
    'MEHOINUSA672N': 'Real Median Household Income — inflation-adjusted median income of U.S. households, showing actual purchasing power over time.'
};

// Ticker short names for display
const tickerShortNames = {
    SPY: 'S&P 500',
    QQQ: 'Nasdaq 100',
    DIA: 'Dow Jones',
    IWM: 'Russell 2000',
    VT: 'Global Stocks',
    VTI: 'Total US Market',
    XLF: 'Financials',
    XLK: 'Technology',
    XLV: 'Healthcare',
    XLE: 'Energy',
    XLY: 'Consumer Disc.',
    XLI: 'Industrials',
    XLRE: 'Real Estate',
    XLC: 'Communication',
    XLU: 'Utilities',
    XLB: 'Materials',
    '^VIX': 'Volatility',
    'DX-Y.NYB': 'Dollar Index',
    'UST10Y': '10Y Treasury',
    'FEDFUNDS': 'Fed Funds Rate',
    'UNRATE': 'Unemployment',
    'CPIAUCSL': 'CPI Inflation',
    'PSAVERT': 'Savings Rate',
    'GDP': 'GDP Growth',
    'M2SL': 'Money Supply',
    'MEHOINUSA672N': 'Median Income'
};

// Historical events
const events = [
    {
        label: '1966 Credit Crunch',
        start: '1966-01-01',
        end: '1966-12-31',
        color: 'rgba(255, 0, 0, 0.2)',
        description: 'Credit crunch and market downturn following Federal Reserve tightening.'
    },
    {
        label: '1969-70 Recession',
        start: '1969-12-01',
        end: '1970-11-01',
        color: 'rgba(255, 0, 0, 0.2)',
        description: 'Recession triggered by tight monetary policy and fiscal tightening.'
    },
    {
        label: '1973-75 Recession',
        start: '1973-11-01',
        end: '1975-03-01',
        color: 'rgba(255, 0, 0, 0.2)',
        description: 'Severe recession due to oil crisis and stock market crash.'
    },
    {
        label: '1970s Stagflation',
        start: '1974-01-01',
        end: '1982-12-31',
        color: 'rgba(255, 165, 0, 0.2)',
        description: 'Period of high inflation and stagnant economic growth.'
    },
    {
        label: '1980-82 Recession',
        start: '1980-01-01',
        end: '1982-11-01',
        color: 'rgba(255, 0, 0, 0.2)',
        description: 'Double-dip recession with high interest rates to combat inflation.'
    },
    {
        label: '1987 Black Monday',
        start: '1987-10-19',
        end: '1987-10-19',
        color: 'rgba(128, 0, 128, 0.2)',
        description: 'Largest one-day percentage decline in stock market history.'
    },
    {
        label: '1990-91 Recession',
        start: '1990-07-01',
        end: '1991-03-01',
        color: 'rgba(255, 0, 0, 0.2)',
        description: 'Recession following savings and loan crisis and Gulf War.'
    },
    {
        label: 'Dot-Com Bubble Burst',
        start: '2000-03-10',
        end: '2002-10-09',
        color: 'rgba(255, 165, 0, 0.2)',
        description: 'A dramatic decline in the valuation of technology stocks following a period of massive growth and speculation in internet-related companies.'
    },
    {
        label: 'Housing Bubble',
        start: '2004-01-01',
        end: '2006-12-31',
        color: 'rgba(255, 215, 0, 0.2)',
        description: 'Real estate mania driven by low interest rates, loose lending standards, and speculation. Home prices soared nationwide before the bubble burst, setting the stage for the 2008 financial crisis.'
    },
    {
        label: '2008 Financial Crisis',
        start: '2008-09-01',
        end: '2009-06-01',
        color: 'rgba(255, 0, 0, 0.2)',
        description: 'Global financial collapse triggered by subprime mortgage crisis.'
    },
    {
        label: 'European Debt Crisis',
        start: '2010-04-01',
        end: '2012-06-01',
        color: 'rgba(255, 215, 0, 0.2)',
        description: 'Crisis stemming from the collapse of financial institutions, high government debt, and rapidly rising bond yield spreads in several European countries.'
    },
    {
        label: 'COVID-19 Crash',
        start: '2020-02-20',
        end: '2020-04-01',
        color: 'rgba(0, 0, 255, 0.2)',
        description: 'Market crash due to coronavirus pandemic uncertainty.'
    },
    {
        label: '2022 Inflation Shock',
        start: '2022-01-01',
        end: '2022-12-31',
        color: 'rgba(128, 0, 128, 0.2)',
        description: 'Markets declined due to interest rate hikes in response to high post-COVID inflation levels.'
    },
    {
        label: 'AI Boom',
        start: '2022-11-30',
        end: '2024-12-31',
        color: 'rgba(0, 255, 127, 0.2)',
        description: 'Market surge driven by artificial intelligence revolution, starting with ChatGPT launch and accelerating with AI chip demand and generative AI adoption.'
    },
    {
        label: '2024 Trump Election',
        start: '2024-11-05',
        end: '2024-11-06',
        color: 'rgba(255, 140, 0, 0.2)',
        description: 'Market rally following Donald Trump\'s 2024 presidential election victory, driven by expectations of deregulation, tax cuts, and pro-business policies.'
    },
    {
        label: 'Tariff Chaos',
        start: '2025-03-03',
        end: '2025-04-15',
        color: 'rgba(255, 69, 0, 0.2)',
        description: 'Market volatility from Trump\'s tariff threats on Mexico and Canada, including "Liberation Day" announcements on April 2nd. Markets initially panicked but recovered as Wall Street recognized Trump\'s pattern of backing down from extreme positions during negotiations.'
    },
    {
        label: 'DeepSeek Shock',
        start: '2025-01-27',
        end: '2025-01-28',
        color: 'rgba(148, 0, 211, 0.2)',
        description: 'Tech stock selloff triggered by Chinese AI startup DeepSeek\'s low-cost AI model breakthrough, challenging the dominance of U.S. AI giants and questioning massive AI infrastructure investments.'
    }
];

// Data loading functions
async function loadTickerData(ticker) {
    try {
        // Check if this is a macro indicator (FRED data)
        if (macroIndicators.includes(ticker)) {
            return await loadFredData(ticker);
        }
        
        // Load regular ticker data from tickers directory
        const response = await fetch(`data/tickers/${ticker}_history.json`);
        if (!response.ok) {
            throw new Error(`Failed to load ${ticker} data`);
        }
        const data = await response.json();
        return data.map(d => ({
            date: d.date.split('T')[0], // Remove time component
            close: d.close
        }));
    } catch (error) {
        console.error(`Error loading ${ticker} data:`, error);
        return [];
    }
}

async function loadFredData(indicator) {
    try {
        console.log(`Loading FRED data for ${indicator}...`);
        // Load FRED data from fredData directory
        const response = await fetch(`data/fredData/${indicator}.json`);
        console.log(`Response status for ${indicator}:`, response.status);
        if (!response.ok) {
            throw new Error(`Failed to load FRED data for ${indicator}: ${response.status}`);
        }
        const data = await response.json();
        console.log(`FRED data structure for ${indicator}:`, data);
        
        // FRED data structure: { observations: [{ date, value }] }
        if (data.observations && Array.isArray(data.observations)) {
            return data.observations.map(d => ({
                date: d.date,
                close: parseFloat(d.value) || 0,
                value: parseFloat(d.value) || 0
            })).filter(d => d.value !== null && !isNaN(d.value));
        }
        
        return [];
    } catch (error) {
        console.error(`Error loading FRED data for ${indicator}:`, error);
        return [];
    }
}

async function loadCPIData() {
    try {
        const response = await fetch('data/consumer-price-index/cpi_data.json');
        if (!response.ok) {
            throw new Error('Failed to load CPI data');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading CPI data:', error);
        return [];
    }
}
