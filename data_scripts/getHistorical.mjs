import yahooFinance from 'yahoo-finance2';
import { writeFile, readFile, mkdir, access } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.join(`${__dirname}/../data`, 'tickers');
const rangesFile = path.join(__dirname, 'tickers-oldest-available-dates', 'ranges-summary.json');

async function fileExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function downloadHistorical(ticker, fromDate) {
  const queryOptions = {
    period1: new Date(fromDate),
    interval: '1d',
  };

  try {
    console.log(`📡 Fetching ${ticker} from ${fromDate}...`);
    const result = await yahooFinance.historical(ticker, queryOptions);

    if (!result || result.length === 0) {
      console.warn(`⚠️ No data for ${ticker}`);
      return;
    }

    const filePath = path.join(dataDir, `${ticker}_history.json`);
    await writeFile(filePath, JSON.stringify(result, null, 2));
    console.log(`✅ Saved ${ticker} (${result.length} records)`);
    return result;
  } catch (err) {
    console.error(`❌ Error for ${ticker}: ${err.message}`);
    return null;
  }
}

async function updateHistorical(ticker, fromDate, existingData) {
  const queryOptions = {
    period1: new Date(fromDate),
    interval: '1d',
  };

  try {
    console.log(`📡 Fetching new data for ${ticker} from ${fromDate}...`);
    const newData = await yahooFinance.historical(ticker, queryOptions);

    if (!newData || newData.length === 0) {
      console.warn(`⚠️ No new data for ${ticker}`);
      return existingData;
    }

    // Filter out any overlapping data by date
    const existingDates = new Set(existingData.map(item => item.date));
    const uniqueNewData = newData.filter(item => !existingDates.has(item.date));
    
    // Merge existing and new data
    const mergedData = [...existingData, ...uniqueNewData];
    
    // Sort by date to ensure chronological order
    mergedData.sort((a, b) => new Date(a.date) - new Date(b.date));

    const filePath = path.join(dataDir, `${ticker}_history.json`);
    await writeFile(filePath, JSON.stringify(mergedData, null, 2));
    console.log(`✅ Updated ${ticker} (added ${uniqueNewData.length} new records, total: ${mergedData.length})`);
    return mergedData;
  } catch (err) {
    console.error(`❌ Error updating ${ticker}: ${err.message}`);
    return existingData;
  }
}

async function getExistingData(filePath) {
  try {
    const fileData = await readFile(filePath, 'utf-8');
    return JSON.parse(fileData);
  } catch (err) {
    console.error(`❌ Error reading existing data: ${err.message}`);
    return null;
  }
}

async function shouldUpdateData(ticker, filePath, rangeLastDate) {
  try {
    const historicalData = await getExistingData(filePath);
    
    if (!historicalData || historicalData.length === 0) {
      return { needsUpdate: true, lastDate: null };
    }
    
    // Get the date of the last entry in the existing data
    const lastEntry = historicalData[historicalData.length - 1];
    const lastDate = new Date(lastEntry.date);
    const availableLastDate = new Date(rangeLastDate);
    
    // If range data has more recent entries, update is needed
    if (availableLastDate > lastDate) {
      const formattedLastDate = lastDate.toISOString().split('T')[0];
      const formattedAvailableDate = availableLastDate.toISOString().split('T')[0];
      console.log(`🔄 Update needed for ${ticker}: Local data ends at ${formattedLastDate}, but newer data available until ${formattedAvailableDate}`);
      return { 
        needsUpdate: true, 
        lastDate: formattedLastDate,
        historicalData
      };
    }
    
    return { needsUpdate: false };
  } catch (err) {
    console.error(`❌ Error checking data for ${ticker}: ${err.message}`);
    return { needsUpdate: true, lastDate: null }; // If we can't determine, try to update
  }
}

export default async function getHistorical() {
  await mkdir(dataDir, { recursive: true });

  const raw = await readFile(rangesFile, 'utf-8');
  const ranges = JSON.parse(raw);

  for (const { ticker, firstDate, lastDate } of ranges) {
    const filePath = path.join(dataDir, `${ticker}_history.json`);
    const exists = await fileExists(filePath);
    
    if (exists) {
      const { needsUpdate, lastDate: existingLastDate, historicalData } = await shouldUpdateData(ticker, filePath, lastDate);
      if (needsUpdate) {
        if (existingLastDate && historicalData) {
          // Get date of next day after last entry to avoid duplicate data
          const nextDay = new Date(existingLastDate);
          nextDay.setDate(nextDay.getDate() + 1);
          const fromDate = nextDay.toISOString().split('T')[0];
          
          console.log(`🔄 Updating ${ticker} data from ${fromDate}...`);
          await updateHistorical(ticker, fromDate, historicalData);
        } else {
          // If no valid last date or data, download all historical data
          console.log(`🔄 Downloading complete history for ${ticker}...`);
          await downloadHistorical(ticker, firstDate);
        }
      } else {
        console.log(`⏩ Skipping ${ticker} — already up to date.`);
      }
    } else {
      await downloadHistorical(ticker, firstDate);
    }
  }

  console.log('✅ All historical data downloaded or updated.');
}
