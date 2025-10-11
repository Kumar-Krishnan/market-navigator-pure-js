#!/bin/bash

# Test script for GitHub Actions data update process
# Run this locally to verify everything works before pushing to GitHub

echo "🧪 Testing GitHub Actions data update process locally..."

# Check if we're in the right directory
if [ ! -f "data_scripts/main.mjs" ]; then
    echo "❌ Please run this script from the project root directory"
    exit 1
fi

# Check if FRED_API_KEY is set
if [ -z "$FRED_API_KEY" ]; then
    echo "❌ FRED_API_KEY environment variable is required"
    echo "   Set it with: export FRED_API_KEY=your_api_key_here"
    exit 1
fi

echo "✅ FRED_API_KEY is set"

# Install dependencies
echo "📦 Installing dependencies..."
cd data_scripts
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Test the data update process
echo "🔄 Running data update process..."
npm run update

if [ $? -eq 0 ]; then
    echo "✅ Data update completed successfully!"
    echo "📊 Check the data files to verify updates"
else
    echo "❌ Data update failed"
    exit 1
fi

# Check if data files were updated
echo "📁 Checking updated data files..."
cd ..

if [ -f "vanilla_dashboard/data/tickers/SPY_history.json" ]; then
    echo "✅ Stock data files exist"
else
    echo "❌ Stock data files missing"
fi

if [ -f "vanilla_dashboard/data/consumer-price-index/cpi_data.json" ]; then
    echo "✅ CPI data file exists"
else
    echo "❌ CPI data file missing"
fi

if [ -f "vanilla_dashboard/data/tickers/UST10Y_history.json" ]; then
    echo "✅ Treasury yield data exists"
else
    echo "❌ Treasury yield data missing"
fi

echo ""
echo "🎉 Local test completed!"
echo "📝 Next steps:"
echo "   1. Commit your changes: git add . && git commit -m 'Add GitHub Actions'"
echo "   2. Push to GitHub: git push"
echo "   3. Add FRED_API_KEY secret in GitHub repository settings"
echo "   4. Test the workflow in GitHub Actions tab"
