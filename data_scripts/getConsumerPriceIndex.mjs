import axios from 'axios';
import fs from 'fs';
import path from 'path';

// Get API key from environment variable
const API_KEY = process.env.FRED_API_KEY;
const SERIES_ID = 'CPIAUCSL';
const DATA_FILE = './data/consumer-price-index/cpi_data.json';

// Ensure directory exists
const ensureDirectoryExists = (filePath) => {
  const dirname = path.dirname(filePath);
  if (!fs.existsSync(dirname)) {
    fs.mkdirSync(dirname, { recursive: true });
    console.log(`Created directory: ${dirname}`);
  }
};

export default async function fetchCPI () {
  // Check if API key is available
  if (!API_KEY) {
    console.error('❌ FRED_API_KEY environment variable is required');
    return;
  }
  
  // Make sure directory exists
  ensureDirectoryExists(DATA_FILE);
  
  let existingData = [];
  let startDate = '';
  
  // Check if we already have data
  if (fs.existsSync(DATA_FILE)) {
    try {
      existingData = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      if (existingData.length > 0) {
        // Get the date of the last entry
        const lastEntry = existingData[existingData.length - 1];
        startDate = lastEntry.date;
        console.log(`Found existing data. Last entry date: ${startDate}`);
      }
    } catch (error) {
      console.error('Error reading existing data file:', error.message);
    }
  }

  // Build URL with optional start date filter
  let url = `https://api.stlouisfed.org/fred/series/observations?series_id=${SERIES_ID}&api_key=${API_KEY}&file_type=json`;
  if (startDate) {
    url += `&observation_start=${startDate}`;
  }

  try {
    const response = await axios.get(url);
    const newData = response.data.observations.map(obs => ({
      date: obs.date,
      value: parseFloat(obs.value),
    }));

    if (newData.length === 0) {
      console.log('No new data available.');
      return;
    }

    console.log(`Retrieved ${newData.length} new entries.`);
    
    // Use a Map to ensure unique entries based on date
    const dataMap = new Map();
    
    // Add existing data to the map
    existingData.forEach(item => {
      dataMap.set(item.date, item);
    });
    
    // Add new data to the map (this will overwrite any duplicates with newer data)
    newData.forEach(item => {
      dataMap.set(item.date, item);
    });
    
    // Convert map back to array and sort by date
    const mergedData = Array.from(dataMap.values()).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    const newEntriesCount = mergedData.length - existingData.length;
    console.log(`Added ${newEntriesCount} new unique entries.`);
    
    if (newEntriesCount > 0) {
      console.log("Latest entries:", mergedData.slice(-5)); // last 5 entries
      
      // Write to file
      fs.writeFileSync(DATA_FILE, JSON.stringify(mergedData, null, 2));
      console.log(`CPI data saved to ${DATA_FILE}. Total entries: ${mergedData.length}`);
    } else {
      console.log('No new unique entries to add.');
    }
  } catch (error) {
    console.error('Error fetching CPI data:', error.message);
  }
};