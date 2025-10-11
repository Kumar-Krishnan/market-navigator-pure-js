
import getTickerDateRange from './getTickerDateRange.mjs'
import getHistorical from './getHistorical.mjs'
import fetchCPI from './getConsumerPriceIndex.mjs'
import retrieveUSTyields from './retrieveUSTyields.mjs'
import getFredMacroIndicators from './fredData/getFredMacroIndicators.mjs'

async function main(){
    console.log('🚀 Starting data update process...');
    
    try {
        console.log('📊 Updating ticker date ranges...');
        await getTickerDateRange();
        
        console.log('📈 Fetching historical stock data...');
        await getHistorical();
        
        console.log('💰 Fetching CPI data...');
        await fetchCPI();
        
        console.log('🏦 Fetching US Treasury yields...');
        await retrieveUSTyields();
        
        console.log('📋 Fetching FRED macro indicators...');
        await getFredMacroIndicators();
        
        console.log('✅ All data updates completed successfully!');
    } catch (error) {
        console.error('❌ Error during data update:', error);
        process.exit(1);
    }
}

main();