import { writeFile, mkdir } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Get API key from environment variable
const API_KEY = process.env.FRED_API_KEY;
const FRED_URL = 'https://api.stlouisfed.org/fred/series/observations';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const series = [
  // Growth & Output
  'GDP', 'GDPC1', 'INDPRO', 'TCU', 'DGORDER', 'PCEC96',
  // Labor Market
  'PAYEMS', 'UNRATE', 'CIVPART', 'JTSJOL', 'ICSA', 'ECIALLCIV',
  // Inflation
  'CPIAUCSL', 'CPILFESL', 'PCE', 'PCEPILFE', 'PPIACO', 'IR14270',
  // Consumer
  'RSAFS', 'UMCSENT', 'UMCSENTEX', 'PSAVERT', 'DRCCLACBS',
  // Money & Credit
  'M2SL', 'TOTBKCR', 'BUSLOANS', 'CONSUMERLOANS', 'DBAA',
  // Housing
  'HOUST', 'PERMIT', 'NHSLTOT', 'EXHOSLUSM495S', 'MSPNHSUS', 'MORTGAGE30US',
  // Trade
  'BOPGSTB', 'IMPGSC1', 'EXPGSC1', 'DTWEXBGS',
  // Monetary Policy
  'FEDFUNDS', 'GS2', 'WALCL',
  // Income - Overall (Real/Inflation-Adjusted)
  'MEHOINUSA672N'
];

async function fetchAndSaveSeries(seriesId) {
  // Check if API key is available
  if (!API_KEY) {
    console.error('❌ FRED_API_KEY environment variable is required');
    return;
  }
  
  const url = `${FRED_URL}?series_id=${seriesId}&api_key=${API_KEY}&file_type=json`;
  const res = await fetch(url);

  if (!res.ok) {
    console.error(`❌ Failed to fetch ${seriesId}: ${res.statusText}`);
    return;
  }

  const data = await res.json();
  const filePath = path.join(__dirname, '..', '..', 'data', 'fredData', `${seriesId}.json`);
  await writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Saved ${seriesId}.json`);
}

export default async function getFredMacroIndicators() {
  console.log('📋 Fetching FRED macro indicators...');
  
  // Ensure directory exists
  const outputDir = path.join(__dirname, '..', '..', 'data', 'fredData');
  await mkdir(outputDir, { recursive: true });
  
  for (const id of series) {
    try {
      await fetchAndSaveSeries(id);
    } catch (err) {
      console.error(`❗ Error fetching ${id}:`, err.message);
    }
  }
  
  console.log('✅ FRED macro indicators completed');
}
