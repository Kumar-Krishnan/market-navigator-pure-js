// fetchUSTSave.mjs

import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

// Get API key from environment variable
const API_KEY = process.env.FRED_API_KEY;
const SERIES_ID = 'DGS10';
const BASE_URL = 'https://api.stlouisfed.org/fred/series/observations';

const params = new URLSearchParams({
  series_id: SERIES_ID,
  api_key: API_KEY,
  file_type: 'json'
});

const url = `${BASE_URL}?${params.toString()}`;
export default async function retrieveUSTyields() {
  // Check if API key is available
  if (!API_KEY) {
    console.error('❌ FRED_API_KEY environment variable is required');
    return;
  }
  
  // Ensure directory exists
  const outputDir = './data/fredData';
  await mkdir(outputDir, { recursive: true });
  
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP error ${response.status}`);

    const data = await response.json();

    console.log(`📈 ${SERIES_ID} - Saving ${data.observations.length} entries to UST10Y.json...`);

    await writeFile('./data/fredData/UST10Y.json', JSON.stringify(data, null, 2), 'utf8');

    console.log('✅ Data saved to UST10Y.json');
  } catch (err) {
    console.error('⚠️ Failed to fetch or save UST data:', err.message);
  }
}
