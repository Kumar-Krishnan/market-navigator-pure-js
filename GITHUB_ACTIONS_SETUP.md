# 🤖 GitHub Actions Setup Guide

This guide will help you set up automated daily data updates for your Market Navigator dashboard using GitHub Actions.

## 🔐 Step 1: Secure Your API Keys

### Get Your FRED API Key
1. Go to [FRED API Registration](https://fred.stlouisfed.org/docs/api/api_key.html)
2. Sign up for a free account
3. Generate an API key
4. Copy the API key (you'll need it for the next step)

### Add API Key to GitHub Secrets
1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `FRED_API_KEY`
5. Value: Paste your FRED API key
6. Click **Add secret**

## 🚀 Step 2: Enable GitHub Actions

### Commit Your Changes
```bash
git add .
git commit -m "Add GitHub Actions for automated data updates"
git push
```

### Verify the Workflow
1. Go to your GitHub repository
2. Click the **Actions** tab
3. You should see "Daily Data Update" workflow
4. Click on it to see the workflow details

## ⚙️ Step 3: Test the Workflow

### Manual Trigger (Recommended First Test)
1. Go to **Actions** → **Daily Data Update**
2. Click **Run workflow**
3. Click the green **Run workflow** button
4. Watch the workflow execute

### Check the Results
- The workflow will run for 2-5 minutes
- If successful, you'll see new commits with updated data
- Your Netlify site will automatically rebuild with fresh data

## 📅 Step 4: Schedule Configuration

The workflow is set to run daily at 6 AM UTC. To change the schedule:

1. Edit `.github/workflows/update-data.yml`
2. Modify the cron schedule:
   ```yaml
   schedule:
     - cron: '0 6 * * *'  # 6 AM UTC daily
   ```

### Common Cron Patterns:
- `'0 6 * * *'` - Daily at 6 AM UTC
- `'0 6 * * 1-5'` - Weekdays only at 6 AM UTC
- `'0 6 1 * *'` - First day of each month at 6 AM UTC
- `'0 */6 * * *'` - Every 6 hours

## 🔍 Step 5: Monitor and Troubleshoot

### Check Workflow Status
- Go to **Actions** tab to see recent runs
- Green checkmark = success
- Red X = failure (check logs)

### Common Issues and Solutions

#### 1. API Key Not Found
**Error**: `FRED_API_KEY environment variable is required`
**Solution**: Verify the secret is added correctly in GitHub Settings

#### 2. Permission Denied
**Error**: `Permission denied (publickey)`
**Solution**: Ensure `GITHUB_TOKEN` has write permissions

#### 3. Data Not Updating
**Check**: 
- Workflow logs for errors
- Browser console for data loading issues
- Verify data files are being updated

### Debug Commands
```bash
# Test locally with your API key
cd data_scripts
FRED_API_KEY=your_key_here npm run update

# Check if data files are updated
ls -la vanilla_dashboard/data/tickers/ | head -10
```

## 📊 What Gets Updated Daily

### Stock Data (via Yahoo Finance)
- All tickers in `allTickers.json`
- Historical price data
- Automatic incremental updates

### Economic Data (via FRED API)
- Consumer Price Index (CPI)
- US Treasury 10-Year Yield
- 40+ macro indicators including:
  - GDP, Employment, Inflation
  - Federal Funds Rate
  - Housing data
  - Consumer sentiment

### Update Logic
- **Smart Updates**: Only fetches new data since last update
- **Error Handling**: Continues if individual data sources fail
- **Incremental**: Merges new data with existing data
- **Deduplication**: Prevents duplicate entries

## 🔄 Workflow Process

1. **Checkout**: Gets latest code from repository
2. **Setup**: Installs Node.js and dependencies
3. **Update**: Runs all data collection scripts
4. **Commit**: Commits any new data to repository
5. **Deploy**: Triggers Netlify rebuild automatically

## 📈 Benefits

### Automated Data Freshness
- ✅ Daily updates without manual intervention
- ✅ Always current market data
- ✅ Historical data preserved
- ✅ Incremental updates (faster, more efficient)

### Secure API Management
- ✅ API keys stored securely in GitHub Secrets
- ✅ No hardcoded credentials in code
- ✅ Environment-based configuration

### Reliable Deployment
- ✅ Automatic Netlify rebuilds
- ✅ Error handling and logging
- ✅ Manual trigger capability
- ✅ Rollback capability via Git

## 🛠️ Customization Options

### Add More Data Sources
1. Create new script in `data_scripts/`
2. Add to `main.mjs`
3. Update `package.json` if new dependencies needed

### Change Update Frequency
- Modify cron schedule in workflow file
- Consider API rate limits

### Add Notifications
- Email notifications on failure
- Slack/Discord webhooks
- GitHub Issues on errors

## 🎯 Success Indicators

Your setup is working correctly when:
- ✅ Workflow runs daily without errors
- ✅ Data files show recent timestamps
- ✅ Netlify site updates automatically
- ✅ Charts display current data
- ✅ No API key errors in logs

## 📞 Support

If you encounter issues:
1. Check GitHub Actions logs
2. Verify API key is correctly set
3. Test scripts locally first
4. Check Netlify deployment logs
5. Ensure all dependencies are installed

Your Market Navigator dashboard will now stay updated automatically! 🎉📈
