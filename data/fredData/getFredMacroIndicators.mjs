import { writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const API_KEY = 'c42037c47c8810fceb2ea2112d913c80';
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
  'FEDFUNDS', 'GS10', 'GS2', 'WALCL',
  // Income - Overall (Real/Inflation-Adjusted)
  'MEHOINUSA672N'
];

async function fetchAndSaveSeries(seriesId) {
  const url = `${FRED_URL}?series_id=${seriesId}&api_key=${API_KEY}&file_type=json`;
  const res = await fetch(url);

  if (!res.ok) {
    console.error(`❌ Failed to fetch ${seriesId}: ${res.statusText}`);
    return;
  }

  const data = await res.json();
  const filePath = path.join(__dirname, `${seriesId}.json`);
  await writeFile(filePath, JSON.stringify(data, null, 2));
  console.log(`✅ Saved ${seriesId}.json`);
}

async function main() {
  for (const id of series) {
    try {
      await fetchAndSaveSeries(id);
    } catch (err) {
      console.error(`❗ Error fetching ${id}:`, err.message);
    }
  }
}

main();
