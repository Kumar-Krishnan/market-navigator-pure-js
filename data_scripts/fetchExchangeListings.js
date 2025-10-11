import { writeFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const urls = {
  nasdaq: 'https://www.nasdaqtrader.com/dynamic/SymDir/nasdaqlisted.txt',
  nyse: 'https://www.nasdaqtrader.com/dynamic/SymDir/otherlisted.txt',
};

async function downloadFile(url, filename) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch ${url}: ${res.statusText}`);
  const text = await res.text();
  const filePath = path.join(`${__dirname}/listed-tickers`, filename);
  await writeFile(filePath, text);
  console.log(`Saved ${filename}`);
}

async function main() {
  try {
    await downloadFile(urls.nasdaq, 'nasdaqlisted.txt');
    await downloadFile(urls.nyse, 'otherlisted.txt');
    console.log('✅ Listings downloaded successfully.');
  } catch (err) {
    console.error('❌ Error:', err.message);
  }
}

main();
