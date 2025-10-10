# Netlify Deployment Guide

This guide will help you deploy the Market Navigator Vanilla JS dashboard to Netlify.

## 🚀 Quick Deployment Options

### Option 1: Drag & Drop (Easiest)

1. **Prepare the build**:
   ```bash
   npm run build
   ```

2. **Create a zip file** of the entire `vanilla_dashboard` folder

3. **Go to Netlify**:
   - Visit [netlify.com](https://netlify.com)
   - Sign up/login
   - Drag and drop your folder to the deploy area

4. **Done!** Your site will be live at a random Netlify URL

### Option 2: Git Integration (Recommended)

1. **Initialize git repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Market Navigator Vanilla JS"
   ```

2. **Push to GitHub**:
   ```bash
   # Create a new repository on GitHub first, then:
   git remote add origin https://github.com/yourusername/market-navigator-vanilla.git
   git branch -M main
   git push -u origin main
   ```

3. **Connect to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Click "New site from Git"
   - Connect your GitHub account
   - Select your repository
   - Build settings:
     - **Build command**: `npm run build` (optional, can be empty)
     - **Publish directory**: `.` (current directory)
   - Click "Deploy site"

4. **Configure custom domain** (optional):
   - Go to Site settings > Domain management
   - Add your custom domain

## 📁 What Gets Deployed

The deployment includes:
- `index.html` - Main application
- `styles.css` - Styling
- `app.js` - Application logic
- `data.js` - Data configuration
- `data/` - All stock and CPI data files
- `netlify.toml` - Netlify configuration

## ⚙️ Netlify Configuration

The `netlify.toml` file includes:
- Static file serving configuration
- CORS headers for data files
- Caching rules for JSON data
- Content-Type headers

## 🔧 Build Process

The build script (`build.js`) verifies:
- ✅ All required files are present
- ✅ Data directories exist
- ✅ Stock ticker data files are available
- ✅ CPI data file exists
- ✅ Creates deployment info file

## 🌐 Environment Variables

No environment variables are required for this static deployment.

## 📊 Data Files

The app includes:
- **Stock Data**: 20+ ticker history files
- **CPI Data**: Consumer Price Index for inflation adjustment
- **Total Size**: ~50MB of historical data

## 🚨 Troubleshooting

### Common Issues:

1. **Data not loading**:
   - Check browser console for fetch errors
   - Verify data files are in correct directories
   - Check CORS headers in netlify.toml

2. **Chart not rendering**:
   - Ensure Plotly.js CDN is accessible
   - Check browser console for JavaScript errors
   - Verify all required files are deployed

3. **Mobile responsiveness**:
   - Test on different screen sizes
   - Check CSS media queries
   - Verify touch interactions work

### Debug Steps:

1. **Check deployment logs** in Netlify dashboard
2. **Test locally** with `npm start` before deploying
3. **Verify data files** with `npm run build`
4. **Check browser console** for errors

## 🔄 Updates

To update your deployed site:

### With Git Integration:
```bash
git add .
git commit -m "Update: description of changes"
git push
```
Netlify will automatically rebuild and deploy.

### With Drag & Drop:
1. Make your changes locally
2. Run `npm run build`
3. Drag the updated folder to Netlify

## 📈 Performance

The deployed site features:
- **Fast Loading**: Static files served from CDN
- **Efficient Caching**: JSON data cached for 1 hour
- **Responsive Design**: Works on all devices
- **No Server**: Pure client-side application

## 🔗 Custom Domain

To use a custom domain:
1. Go to Netlify dashboard
2. Site settings > Domain management
3. Add custom domain
4. Configure DNS records as instructed
5. Enable HTTPS (automatic with Netlify)

## 📱 Features Verified

All original features work on Netlify:
- ✅ Interactive stock charts
- ✅ Ticker selection
- ✅ Inflation adjustment
- ✅ Historical event overlays
- ✅ Reference point analysis
- ✅ Mobile responsiveness
- ✅ Data loading and caching

Your Market Navigator dashboard will be fully functional on Netlify! 🎉
