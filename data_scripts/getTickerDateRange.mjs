import yahooFinance from 'yahoo-finance2';
import { writeFile, readFile, mkdir, access } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const outputDir = path.join(__dirname, 'tickers-oldest-available-dates');
const summaryPath = path.join(outputDir, 'ranges-summary.json');

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function loadSummary() {
  if (await fileExists(summaryPath)) {
    const raw = await readFile(summaryPath, 'utf-8');
    return JSON.parse(raw);
  }
  return [];
}

async function getDateRange(ticker, lastKnownDate = null) {
  try {
    console.log(`📡 Fetching ${ticker}...`);
    const result = await yahooFinance.historical(ticker, {
      period1: new Date('1980-01-01'),
      interval: '1d',
    });

    if (!result || result.length === 0) {
      console.warn(`⚠️ No data for ${ticker}`);
      return null;
    }

    const first = result[0].date.toISOString().split('T')[0];
    const last = result[result.length - 1].date.toISOString().split('T')[0];

    return {
      ticker,
      firstDate: first,
      lastDate: last,
      totalDays: result.length,
      updated: new Date().toISOString().split('T')[0]
    };
  } catch (err) {
    console.error(`❌ Error with ${ticker}:`, err.message);
    return null;
  }
}

export default async function getTickerDateRange() {
  const {default: allTickers} = await import('./allTickers.json', {
    with: { type: 'json' }
  });
  await mkdir(outputDir, { recursive: true });

  const summary = await loadSummary();
  
  // Create a map of existing tickers for easy lookup and updates
  const tickerMap = new Map();
  for (const entry of summary) {
    tickerMap.set(entry.ticker, entry);
  }
  
  const results = [];
  const today = new Date().toISOString().split('T')[0];

  for (const ticker of allTickers) {
    const existingData = tickerMap.get(ticker);
    
    if (existingData) {
      // Check if we should update data that might be outdated
      const lastUpdated = existingData.updated || existingData.lastDate;
      if (lastUpdated !== today) {
        console.log(`🔄 Checking for updates to ${ticker} (last updated: ${lastUpdated})`);
        const updatedData = await getDateRange(ticker, existingData.lastDate);
        
        if (updatedData) {
          // If more recent data is available, update the entry
          if (updatedData.lastDate !== existingData.lastDate || 
              updatedData.totalDays !== existingData.totalDays) {
            console.log(`📊 Updating ${ticker}: ${existingData.totalDays} → ${updatedData.totalDays} days`);
            results.push(updatedData);
          } else {
            console.log(`✓ No new data for ${ticker}, updating timestamp`);
            existingData.updated = today;
            results.push(existingData);
          }
        } else {
          // Keep existing data if fetch failed
          results.push(existingData);
        }
      } else {
        console.log(`⏩ Skipping ${ticker} — already updated today.`);
        results.push(existingData);
      }
    } else {
      // This is a new ticker
      const data = await getDateRange(ticker);
      if (data) results.push(data);
    }
  }

  await writeFile(summaryPath, JSON.stringify(results, null, 2));
  console.log(`📄 Summary updated: ${summaryPath}`);
}