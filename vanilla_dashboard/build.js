#!/usr/bin/env node

// Build script for Netlify deployment
const fs = require('fs');
const path = require('path');

console.log('🚀 Building Market Navigator for Netlify deployment...');

// Verify all required files exist
const requiredFiles = [
    'index.html',
    'styles.css',
    'app.js',
    'data.js',
    'netlify.toml'
];

const requiredDirs = [
    'data/tickers',
    'data/consumer-price-index'
];

console.log('✅ Checking required files...');
for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
        console.error(`❌ Missing required file: ${file}`);
        process.exit(1);
    }
}

console.log('✅ Checking required directories...');
for (const dir of requiredDirs) {
    if (!fs.existsSync(dir)) {
        console.error(`❌ Missing required directory: ${dir}`);
        process.exit(1);
    }
}

// Count data files
const tickerFiles = fs.readdirSync('data/tickers').filter(f => f.endsWith('.json'));
const cpiExists = fs.existsSync('data/consumer-price-index/cpi_data.json');

console.log(`✅ Found ${tickerFiles.length} ticker data files`);
console.log(`✅ CPI data file: ${cpiExists ? 'Found' : 'Missing'}`);

if (!cpiExists) {
    console.error('❌ CPI data file is required');
    process.exit(1);
}

// Create a simple deployment info file
const deployInfo = {
    buildTime: new Date().toISOString(),
    tickerCount: tickerFiles.length,
    tickers: tickerFiles.map(f => f.replace('_history.json', '')),
    version: '1.0.0'
};

fs.writeFileSync('deploy-info.json', JSON.stringify(deployInfo, null, 2));

console.log('✅ Build completed successfully!');
console.log('📦 Ready for Netlify deployment');
console.log('');
console.log('Next steps:');
console.log('1. Initialize git repository: git init');
console.log('2. Add files: git add .');
console.log('3. Commit: git commit -m "Initial commit"');
console.log('4. Push to GitHub/GitLab');
console.log('5. Connect to Netlify');
console.log('');
console.log('Or drag and drop this folder to Netlify for manual deployment');

