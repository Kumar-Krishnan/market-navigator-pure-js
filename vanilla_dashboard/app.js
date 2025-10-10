// Market Navigator - Vanilla JavaScript Application

class MarketNavigator {
    constructor() {
        // State
        this.selectedTickers = ['SPY'];
        this.selectedMacroIndicators = [];
        this.dataMap = {};
        this.cpiData = [];
        this.activeEvent = null;
        this.adjustForInflation = false;
        this.referenceDate = null;
        this.loadingTickers = new Set();
        this.resetZoomTrigger = 0;
        this.showGridLines = true;
        this.showEventOverlays = true;
        this.showMacroGridLines = true;
        this.showMacroEventOverlays = true;
        this.enabledEvents = new Set(events.map(event => event.label));
        this.isDarkMode = false;

        // Initialize the app
        this.init();
    }

    async init() {
        // Initialize theme
        this.initializeTheme();
        
        // Initialize mobile-specific features
        this.initializeMobileFeatures();
        
        // Load CPI data first
        this.cpiData = await loadCPIData();
        
        // Initialize UI
        this.initializeUI();
        this.setupEventListeners();
        
        // Load initial data
        await this.loadSelectedTickersData();
        
        // Initial render
        this.updateChart();
        this.updateSelectedTickersDisplay();
    }

    initializeMobileFeatures() {
        // Detect mobile device
        this.isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        
        // Handle orientation changes
        if (this.isMobile) {
            window.addEventListener('orientationchange', () => {
                setTimeout(() => {
                    this.updateChart();
                    this.updateMacroChart();
                }, 100);
            });
            
            // Prevent zoom on double tap for better UX
            let lastTouchEnd = 0;
            document.addEventListener('touchend', (event) => {
                const now = (new Date()).getTime();
                if (now - lastTouchEnd <= 300) {
                    event.preventDefault();
                }
                lastTouchEnd = now;
            }, false);
        }
        
        // Handle window resize for responsive updates
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimeout);
            this.resizeTimeout = setTimeout(() => {
                // Update mobile detection on resize
                this.isMobile = window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                this.updateChart();
                this.updateMacroChart();
            }, 150);
        });
    }

    initializeTheme() {
        // Check for saved theme preference or default to system preference
        const savedTheme = localStorage.getItem('marketNavigatorTheme');
        const systemDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            this.isDarkMode = savedTheme === 'dark';
        } else {
            this.isDarkMode = systemDarkMode;
        }
        
        // Apply theme
        this.applyTheme();
        
        // Listen for system theme changes
        if (window.matchMedia) {
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!localStorage.getItem('marketNavigatorTheme')) {
                    this.isDarkMode = e.matches;
                    this.applyTheme();
                    this.updateChart(); // Refresh chart with new theme
                }
            });
        }
    }

    applyTheme() {
        document.documentElement.setAttribute('data-theme', this.isDarkMode ? 'dark' : 'light');
        
        // Update theme toggle icon
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = this.isDarkMode ? '☀️' : '🌙';
        }
    }

    toggleTheme() {
        this.isDarkMode = !this.isDarkMode;
        localStorage.setItem('marketNavigatorTheme', this.isDarkMode ? 'dark' : 'light');
        this.applyTheme();
        this.updateChart(); // Refresh chart with new theme colors
    }

    getThemeColors() {
        return {
            background: this.isDarkMode ? '#1e293b' : '#f8fafc',
            paper: this.isDarkMode ? '#1e293b' : '#f8fafc',
            text: this.isDarkMode ? '#f1f5f9' : '#111827',
            gridColor: this.isDarkMode ? '#334155' : '#e2e8f0',
            lineColor: this.isDarkMode ? '#475569' : '#cbd5e1'
        };
    }

    initializeUI() {
        // Initialize ticker checkboxes
        this.initializeTickerCheckboxes();
        
        // Initialize macro indicator checkboxes
        this.initializeMacroCheckboxes();
        
        // Initialize events
        this.initializeEventsUI();
        
        // Update event count
        this.updateEventCount();
    }

    initializeTickerCheckboxes() {
        const etfContainer = document.getElementById('etfTickers');
        const stockContainer = document.getElementById('stockTickers');

        // ETF tickers
        availableTickers.forEach(ticker => {
            const tickerItem = this.createTickerCheckbox(ticker, true);
            etfContainer.appendChild(tickerItem);
        });

        // Individual stocks
        individualStocks.forEach(ticker => {
            const tickerItem = this.createTickerCheckbox(ticker, false);
            stockContainer.appendChild(tickerItem);
        });
    }

    initializeMacroCheckboxes() {
        const macroContainer = document.getElementById('macroTickers');

        // Macro indicators
        macroIndicators.forEach(indicator => {
            const indicatorItem = this.createTickerCheckbox(indicator, false, true);
            macroContainer.appendChild(indicatorItem);
        });
    }

    createTickerCheckbox(ticker, isETF, isMacro = false) {
        const div = document.createElement('div');
        div.className = 'ticker-item';

        const label = document.createElement('label');
        label.style.cursor = 'pointer';
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.width = '100%';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = isMacro ? this.selectedMacroIndicators.includes(ticker) : this.selectedTickers.includes(ticker);
        checkbox.addEventListener('change', (e) => {
            if (isMacro) {
                this.handleMacroToggle(ticker, e.target.checked);
            } else {
                this.handleTickerToggle(ticker, e.target.checked);
            }
        });

        const tickerInfo = document.createElement('div');
        tickerInfo.className = 'ticker-info';

        const symbol = document.createElement('span');
        symbol.className = 'ticker-symbol';
        symbol.textContent = ticker;

        if (isETF && tickerShortNames[ticker]) {
            const separator = document.createElement('span');
            separator.className = 'ticker-separator';
            separator.textContent = '·';

            const name = document.createElement('span');
            name.className = 'ticker-name';
            name.textContent = tickerShortNames[ticker];

            tickerInfo.appendChild(symbol);
            tickerInfo.appendChild(separator);
            tickerInfo.appendChild(name);
        } else {
            tickerInfo.appendChild(symbol);
        }

        label.appendChild(checkbox);
        label.appendChild(tickerInfo);
        div.appendChild(label);

        return div;
    }

    initializeEventsUI() {
        const eventsContainer = document.getElementById('eventsList');
        
        events.forEach(event => {
            const eventItem = this.createEventCheckbox(event);
            eventsContainer.appendChild(eventItem);
        });
    }

    createEventCheckbox(event) {
        const div = document.createElement('div');
        div.className = 'event-item';

        const label = document.createElement('label');
        label.style.cursor = 'pointer';
        label.style.display = 'flex';
        label.style.alignItems = 'flex-start';
        label.style.gap = '0.75rem';
        label.style.width = '100%';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = this.enabledEvents.has(event.label);
        checkbox.addEventListener('change', (e) => {
            this.handleEventToggle(event.label, e.target.checked);
        });

        const details = document.createElement('div');
        details.className = 'event-details';

        const header = document.createElement('div');
        header.className = 'event-header';

        const colorIndicator = document.createElement('div');
        colorIndicator.className = 'event-color-indicator';
        colorIndicator.style.backgroundColor = event.color.replace('0.2', '0.8');

        const eventLabel = document.createElement('span');
        eventLabel.className = `event-label ${this.enabledEvents.has(event.label) ? 'enabled' : 'disabled'}`;
        eventLabel.textContent = event.label;

        const description = document.createElement('p');
        description.className = `event-description ${this.enabledEvents.has(event.label) ? 'enabled' : 'disabled'}`;
        description.textContent = event.description;

        header.appendChild(colorIndicator);
        header.appendChild(eventLabel);
        details.appendChild(header);
        details.appendChild(description);

        label.appendChild(checkbox);
        label.appendChild(details);
        div.appendChild(label);

        return div;
    }

    setupEventListeners() {
        // Theme toggle
        document.getElementById('themeToggle').addEventListener('click', () => {
            this.toggleTheme();
        });

        // Inflation adjustment
        document.getElementById('adjustInflation').addEventListener('change', (e) => {
            this.adjustForInflation = e.target.checked;
            this.updateChart();
        });

        // Deselect all
        document.getElementById('deselectAll').addEventListener('click', () => {
            this.selectedTickers = [];
            this.updateTickerCheckboxes();
            this.updateSelectedTickersDisplay();
            this.updateChart();
        });

        // Clear reference
        document.getElementById('clearReference').addEventListener('click', () => {
            this.referenceDate = null;
            this.updateReferenceDisplay();
            this.updateChart();
        });

        // Event controls
        document.getElementById('enableAllEvents').addEventListener('click', () => {
            this.enabledEvents = new Set(events.map(e => e.label));
            this.updateEventCheckboxes();
            this.updateEventCount();
            this.updateChart();
        });

        document.getElementById('disableAllEvents').addEventListener('click', () => {
            this.enabledEvents = new Set();
            this.updateEventCheckboxes();
            this.updateEventCount();
            this.updateChart();
        });

        // Chart controls
        document.getElementById('toggleEvents').addEventListener('click', () => {
            this.showEventOverlays = !this.showEventOverlays;
            this.updateToggleButton('toggleEvents', this.showEventOverlays, 'Hide Events', 'Show Events');
            this.updateChart();
        });

        document.getElementById('toggleGrid').addEventListener('click', () => {
            this.showGridLines = !this.showGridLines;
            this.updateToggleButton('toggleGrid', this.showGridLines, 'Hide Grid', 'Show Grid');
            this.updateChart();
        });

        document.getElementById('resetZoom').addEventListener('click', () => {
            this.resetZoom();
        });

        // Macro chart controls
        document.getElementById('toggleMacroEvents').addEventListener('click', () => {
            this.showMacroEventOverlays = !this.showMacroEventOverlays;
            this.updateToggleButton('toggleMacroEvents', this.showMacroEventOverlays, 'Hide Events', 'Show Events');
            this.updateMacroChart();
        });

        document.getElementById('toggleMacroGrid').addEventListener('click', () => {
            this.showMacroGridLines = !this.showMacroGridLines;
            this.updateToggleButton('toggleMacroGrid', this.showMacroGridLines, 'Hide Grid', 'Show Grid');
            this.updateMacroChart();
        });

        document.getElementById('resetMacroZoom').addEventListener('click', () => {
            this.updateMacroChart();
        });
    }

    updateToggleButton(buttonId, isActive, activeText, inactiveText) {
        const button = document.getElementById(buttonId);
        button.textContent = isActive ? activeText : inactiveText;
        if (isActive) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    }

    async handleTickerToggle(ticker, isChecked) {
        if (isChecked) {
            this.selectedTickers.push(ticker);
            await this.loadTickerData(ticker);
        } else {
            this.selectedTickers = this.selectedTickers.filter(t => t !== ticker);
        }
        
        this.updateSelectedTickersDisplay();
        this.updateChart();
    }

    async handleMacroToggle(indicator, isChecked) {
        if (isChecked) {
            this.selectedMacroIndicators.push(indicator);
            await this.loadTickerData(indicator);
        } else {
            this.selectedMacroIndicators = this.selectedMacroIndicators.filter(i => i !== indicator);
        }
        
        this.updateMacroChartVisibility();
        this.updateSelectedTickersDisplay();
        this.updateMacroChart();
        
        // If this is the first macro indicator selected, sync with main chart
        if (this.selectedMacroIndicators.length === 1) {
            this.initializeMacroChartSync();
        }
    }

    handleEventToggle(eventLabel, isChecked) {
        if (isChecked) {
            this.enabledEvents.add(eventLabel);
        } else {
            this.enabledEvents.delete(eventLabel);
        }
        
        this.updateEventCheckboxes();
        this.updateEventCount();
        this.updateChart();
    }

    updateTickerCheckboxes() {
        const checkboxes = document.querySelectorAll('#etfTickers input[type="checkbox"], #stockTickers input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const label = checkbox.closest('label');
            const ticker = label.querySelector('.ticker-symbol').textContent;
            checkbox.checked = this.selectedTickers.includes(ticker);
        });
    }

    updateEventCheckboxes() {
        const checkboxes = document.querySelectorAll('#eventsList input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            const label = checkbox.closest('label');
            const eventLabel = label.querySelector('.event-label').textContent;
            checkbox.checked = this.enabledEvents.has(eventLabel);
            
            // Update styling
            const labelElement = label.querySelector('.event-label');
            const descElement = label.querySelector('.event-description');
            
            if (this.enabledEvents.has(eventLabel)) {
                labelElement.className = 'event-label enabled';
                descElement.className = 'event-description enabled';
            } else {
                labelElement.className = 'event-label disabled';
                descElement.className = 'event-description disabled';
            }
        });
    }

    updateEventCount() {
        const eventCount = document.getElementById('eventCount');
        eventCount.textContent = `(${this.enabledEvents.size}/${events.length} enabled)`;
    }

    updateReferenceDisplay() {
        const referenceText = document.getElementById('referenceText');
        if (this.referenceDate) {
            referenceText.textContent = `Reference Point: ${new Date(this.referenceDate).toLocaleDateString()}`;
        } else {
            referenceText.textContent = 'Click any point on the chart to set it as reference for % change calculations';
        }
    }

    async loadSelectedTickersData() {
        const promises = this.selectedTickers.map(ticker => this.loadTickerData(ticker));
        await Promise.all(promises);
    }

    async loadTickerData(ticker) {
        if (this.dataMap[ticker]) return; // Already loaded

        this.loadingTickers.add(ticker);
        this.updateSelectedTickersDisplay();

        try {
            const data = await loadTickerData(ticker);
            this.dataMap[ticker] = data;
        } catch (error) {
            console.error(`Failed to load ${ticker}:`, error);
            this.dataMap[ticker] = [];
        }

        this.loadingTickers.delete(ticker);
        this.updateSelectedTickersDisplay();
        this.updateChart();
    }

    updateSelectedTickersDisplay() {
        const container = document.getElementById('selectedTickers');
        const tickersList = document.getElementById('selectedTickersList');
        const macroList = document.getElementById('selectedMacroList');

        // Show container if either tickers or macro indicators are selected
        if (this.selectedTickers.length === 0 && this.selectedMacroIndicators.length === 0) {
            container.style.display = 'none';
            return;
        }

        container.style.display = 'block';
        
        // Update tickers list
        tickersList.innerHTML = '';
        if (this.selectedTickers.length > 0) {
            const tickersHeader = document.createElement('h4');
            tickersHeader.textContent = 'Stock Tickers & ETFs';
            tickersHeader.style.marginBottom = '0.5rem';
            tickersHeader.style.color = 'var(--text-secondary)';
            tickersHeader.style.fontSize = '1rem';
            tickersList.appendChild(tickersHeader);
        }

        this.selectedTickers.forEach(ticker => {
            const item = document.createElement('div');
            item.className = 'selected-ticker-item';

            const colorIndicator = document.createElement('div');
            colorIndicator.className = 'ticker-color-indicator';
            const isLoading = this.loadingTickers.has(ticker);
            
            if (isLoading) {
                colorIndicator.classList.add('loading');
                colorIndicator.style.backgroundColor = '#6b7280';
            } else {
                colorIndicator.style.backgroundColor = tickerColors[ticker] || '#1f77b4';
            }

            const description = document.createElement('p');
            description.className = 'ticker-description';

            const tickerName = document.createElement('span');
            tickerName.className = 'ticker-name-bold';
            tickerName.style.color = isLoading ? '#6b7280' : (tickerColors[ticker] || '#1f77b4');
            tickerName.textContent = `${ticker}: `;

            const descText = document.createElement('span');
            descText.className = 'description-text';
            descText.textContent = isLoading ? 'Loading...' : (tickerInfo[ticker] || 'No description available');

            description.appendChild(tickerName);
            description.appendChild(descText);

            item.appendChild(colorIndicator);
            item.appendChild(description);
            tickersList.appendChild(item);
        });

        // Update macro indicators list
        macroList.innerHTML = '';
        if (this.selectedMacroIndicators.length > 0) {
            const macroHeader = document.createElement('h4');
            macroHeader.textContent = 'Economic Indicators';
            macroHeader.style.marginTop = this.selectedTickers.length > 0 ? '1rem' : '0';
            macroHeader.style.marginBottom = '0.5rem';
            macroHeader.style.color = 'var(--text-secondary)';
            macroHeader.style.fontSize = '1rem';
            macroList.appendChild(macroHeader);

            this.selectedMacroIndicators.forEach(indicator => {
                const item = document.createElement('div');
                item.className = 'selected-ticker-item';

                const colorIndicator = document.createElement('div');
                colorIndicator.className = 'ticker-color-indicator';
                const isLoading = this.loadingTickers.has(indicator);
                
                if (isLoading) {
                    colorIndicator.classList.add('loading');
                    colorIndicator.style.backgroundColor = '#6b7280';
                } else {
                    colorIndicator.style.backgroundColor = tickerColors[indicator] || '#1f77b4';
                }

                const description = document.createElement('p');
                description.className = 'ticker-description';

                const indicatorName = document.createElement('span');
                indicatorName.className = 'ticker-name-bold';
                indicatorName.style.color = isLoading ? '#6b7280' : (tickerColors[indicator] || '#1f77b4');
                indicatorName.textContent = `${tickerShortNames[indicator] || indicator}: `;

                const descText = document.createElement('span');
                descText.className = 'description-text';
                descText.textContent = isLoading ? 'Loading...' : (tickerInfo[indicator] || 'Economic indicator data');

                description.appendChild(indicatorName);
                description.appendChild(descText);

                item.appendChild(colorIndicator);
                item.appendChild(description);
                macroList.appendChild(item);
            });
        }
    }

    // CPI and inflation adjustment functions
    getCPIForDate(date) {
        const dateObj = new Date(date);
        const year = dateObj.getFullYear();
        const month = dateObj.getMonth() + 1;
        const formattedDate = `${year}-${month.toString().padStart(2, '0')}-01`;
        
        const cpiEntry = this.cpiData.find(d => d.date === formattedDate);
        return cpiEntry ? cpiEntry.value : null;
    }

    adjustPriceForInflation(price, date) {
        const currentCPI = this.getCPIForDate(date);
        const baseCPI = this.cpiData[this.cpiData.length - 1].value;
        return currentCPI ? price * (baseCPI / currentCPI) : price;
    }

    calculatePercentChange(currentValue, referenceValue) {
        const percentChange = ((currentValue - referenceValue) / referenceValue) * 100;
        const sign = percentChange >= 0 ? '+' : '';
        return `${sign}${percentChange.toFixed(2)}%`;
    }

    getReferenceValues() {
        if (!this.referenceDate) return {};
        
        const values = {};
        this.selectedTickers.forEach(ticker => {
            const data = this.dataMap[ticker] || [];
            const referencePoint = data.find(d => d.date === this.referenceDate);
            if (referencePoint) {
                values[ticker] = this.adjustForInflation 
                    ? this.adjustPriceForInflation(referencePoint.close, referencePoint.date)
                    : referencePoint.close;
            }
        });
        return values;
    }

    // Chart functions
    createTraces() {
        const traces = this.selectedTickers.map(ticker => {
            const data = this.dataMap[ticker] || [];
            const referenceValues = this.getReferenceValues();
            const referenceValue = referenceValues[ticker];

            return {
                x: data.map(d => d.date),
                y: data.map(d => this.adjustForInflation ? this.adjustPriceForInflation(d.close, d.date) : d.close),
                type: 'scatter',
                mode: 'lines',
                name: ticker,
                line: {
                    color: tickerColors[ticker] || '#1f77b4',
                    width: 2
                },
                hovertemplate: 
                    '%{x|%b %d, %Y}<br>' +
                    '%{y:$,.2f}%{customdata}<br>' +
                    (referenceValue ? '%{text}<br>' : '') +
                    '<extra>%{fullData.name}</extra>',
                text: data.map(d => {
                    if (!referenceValue) return '';
                    const currentValue = this.adjustForInflation ? this.adjustPriceForInflation(d.close, d.date) : d.close;
                    return `Change from reference: ${this.calculatePercentChange(currentValue, referenceValue)}`;
                }),
                customdata: data.map(d => {
                    const cpi = this.getCPIForDate(d.date);
                    const baseCPI = this.cpiData[this.cpiData.length - 1]?.value;
                    const dollarValue = cpi && baseCPI ? baseCPI / cpi : null;
                    return dollarValue ? `<br>Equivalent to $${dollarValue.toFixed(2)} today` : '';
                })
            };
        });

        // Add dollar value erosion trace
        if (this.cpiData.length > 0) {
            const dollarValueTrace = {
                x: this.cpiData.map(d => d.date),
                y: this.cpiData.map(d => {
                    const baseCPI = this.cpiData[this.cpiData.length - 1].value;
                    return baseCPI / d.value;
                }),
                type: 'scatter',
                mode: 'lines',
                name: 'Dollar Value Erosion',
                line: {
                    color: 'rgba(128, 128, 128, 0.8)',
                    dash: 'dot',
                    width: 2
                },
                hovertemplate: '%{x|%b %d, %Y}<br>%{y:$,.2f} in today\'s dollars<extra>Dollar Value Erosion</extra>',
                yaxis: 'y',
                customdata: this.cpiData.map(() => ''),
                text: this.cpiData.map(() => '')
            };
            traces.push(dollarValueTrace);
        }

        return traces;
    }

    createShapes() {
        return events
            .filter(event => this.enabledEvents.has(event.label))
            .map(event => ({
                type: 'rect',
                xref: 'x',
                yref: 'paper',
                x0: event.start,
                x1: event.end,
                y0: 0,
                y1: 1,
                fillcolor: event.color,
                opacity: 0.3,
                line: { width: 0 },
            }));
    }

    getStaggeredPosition(eventIndex, totalEvents) {
        const basePositions = [0.85, 0.75, 0.65, 0.55, 0.45, 0.35, 0.25];
        return basePositions[eventIndex % basePositions.length] || 0.85;
    }

    formatEventText(event) {
        const startYear = new Date(event.start).getFullYear();
        const endYear = new Date(event.end).getFullYear();
        
        if (startYear === endYear) {
            return `${event.label}<br><span style="font-size: 9px; color: #666;">(${startYear})</span>`;
        } else {
            return `${event.label}<br><span style="font-size: 9px; color: #666;">(${startYear}-${endYear})</span>`;
        }
    }

    createAnnotations() {
        const enabledEventsArray = events.filter(event => this.enabledEvents.has(event.label));
        const themeColors = this.getThemeColors();
        const annotationBg = this.isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255,255,255,0.95)';
        const annotationTextColor = this.isDarkMode ? '#f1f5f9' : '#333';
        
        return enabledEventsArray.map((event, index) => {
            // Check if we're only displaying yield data
            const onlyYieldData = this.selectedTickers.length === 1 && 
                (this.selectedTickers[0] === 'UST10Y' || this.selectedTickers[0].includes('Treasury'));
            
            if (onlyYieldData) {
                return {
                    x: event.start,
                    y: this.getStaggeredPosition(index, enabledEventsArray.length),
                    xref: 'x',
                    yref: 'paper',
                    text: this.formatEventText(event),
                    showarrow: true,
                    arrowhead: 2,
                    arrowsize: 1,
                    arrowwidth: 2,
                    arrowcolor: event.color.replace('0.2', '0.8'),
                    ax: 0,
                    ay: -30,
                    yanchor: 'middle',
                    xanchor: 'left',
                    bgcolor: 'rgba(255,255,255,0.95)',
                    bordercolor: event.color.replace('0.2', '0.8'),
                    borderwidth: 2,
                    borderpad: 6,
                    font: {
                        size: 11,
                        family: 'Arial, sans-serif',
                        color: '#333'
                    }
                };
            }
            
            // For regular stock data, try to position relative to data
            let foundData = false;
            let yPosition = 0;
            
            for (const ticker of this.selectedTickers) {
                const tickerData = this.dataMap[ticker] || [];
                
                let eventData = tickerData.filter(d => d.date >= event.start && d.date <= event.end);
                
                if (eventData.length === 0) {
                    const eventStartDate = new Date(event.start);
                    const eventEndDate = new Date(event.end);
                    const fiveWeeksMs = 5 * 7 * 24 * 60 * 60 * 1000;
                    
                    const extendedStartDate = new Date(eventStartDate.getTime() - fiveWeeksMs);
                    const extendedEndDate = new Date(eventEndDate.getTime() + fiveWeeksMs);
                    
                    eventData = tickerData.filter(d => {
                        const dataDate = new Date(d.date);
                        return dataDate >= extendedStartDate && dataDate <= extendedEndDate;
                    });
                }
                
                if (eventData.length > 0) {
                    const maxPrice = Math.max(...eventData.map(d => d.close));
                    const minPrice = Math.min(...eventData.map(d => d.close));
                    const range = maxPrice - minPrice;
                    
                    const staggerMultipliers = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3];
                    const staggerMultiplier = staggerMultipliers[index % staggerMultipliers.length];
                    yPosition = minPrice + (range * staggerMultiplier);
                    foundData = true;
                    break;
                }
            }
            
            if (!foundData) {
                return {
                    x: event.start,
                    y: this.getStaggeredPosition(index, enabledEventsArray.length),
                    xref: 'x',
                    yref: 'paper',
                    text: this.formatEventText(event),
                    showarrow: true,
                    arrowhead: 2,
                    arrowsize: 1,
                    arrowwidth: 2,
                    arrowcolor: event.color.replace('0.2', '0.8'),
                    ax: 0,
                    ay: -30,
                    yanchor: 'middle',
                    xanchor: 'left',
                    bgcolor: 'rgba(255,255,255,0.95)',
                    bordercolor: event.color.replace('0.2', '0.8'),
                    borderwidth: 2,
                    borderpad: 6,
                    font: {
                        size: 11,
                        family: 'Arial, sans-serif',
                        color: '#333'
                    }
                };
            }
            
            return {
                x: event.start,
                y: yPosition,
                xref: 'x',
                yref: 'y',
                text: this.formatEventText(event),
                showarrow: true,
                arrowhead: 2,
                arrowsize: 1,
                arrowwidth: 2,
                arrowcolor: event.color.replace('0.2', '0.8'),
                ax: 0,
                ay: -20,
                yanchor: 'middle',
                xanchor: 'left',
                bgcolor: 'rgba(255,255,255,0.95)',
                bordercolor: event.color.replace('0.2', '0.8'),
                borderwidth: 2,
                borderpad: 6,
                font: {
                    size: 11,
                    family: 'Arial, sans-serif',
                    color: '#333'
                }
            };
        });
    }

    getEarliestDate() {
        return this.selectedTickers.reduce((earliest, ticker) => {
            const data = this.dataMap[ticker] || [];
            if (data.length === 0) return earliest;
            const tickerEarliest = new Date(data[0].date);
            return earliest ? new Date(Math.min(earliest.getTime(), tickerEarliest.getTime())) : tickerEarliest;
        }, null);
    }

    updateChart() {
        const traces = this.createTraces();
        const shapes = this.showEventOverlays ? this.createShapes() : [];
        const annotations = this.showEventOverlays ? this.createAnnotations() : [];
        const earliestDate = this.getEarliestDate();
        const themeColors = this.getThemeColors();

        const layout = {
            title: '',
            plot_bgcolor: themeColors.background,
            paper_bgcolor: themeColors.paper,
            font: {
                color: themeColors.text
            },
            xaxis: {
                title: {
                    text: 'Date',
                    font: { color: themeColors.text }
                },
                tickformat: '%Y',
                tickmode: 'auto',
                nticks: 20,
                showgrid: this.showGridLines,
                gridcolor: themeColors.gridColor,
                linecolor: themeColors.lineColor,
                tickcolor: themeColors.lineColor,
                tickfont: { color: themeColors.text },
                type: 'date',
                range: this.getXAxisRange()
            },
            yaxis: {
                title: {
                    text: 'Price (USD)',
                    font: { color: themeColors.text }
                },
                showgrid: this.showGridLines,
                gridcolor: themeColors.gridColor,
                linecolor: themeColors.lineColor,
                tickcolor: themeColors.lineColor,
                tickfont: { color: themeColors.text },
            automargin: true,
            rangemode: 'normal',
        },
        dragmode: this.isMobile ? 'pan' : 'zoom',
        hovermode: 'closest',
            autosize: true,
            shapes: shapes,
            annotations: annotations,
            margin: { t: 40, b: 40, l: 50, r: 30 },
        };

        const config = { 
            responsive: true, 
            displaylogo: false, 
            scrollZoom: this.isMobile ? false : true,
            modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'autoScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian'],
            displayModeBar: window.innerWidth > 768 ? true : 'hover',
            doubleClick: 'reset+autosize',
            showTips: false
        };

        Plotly.newPlot('chart', traces, layout, config).then(() => {
            // Add click event listener
            document.getElementById('chart').on('plotly_click', (data) => {
                if (data.points && data.points[0] && data.points[0].x) {
                    this.referenceDate = data.points[0].x;
                    this.updateReferenceDisplay();
                    this.updateChart();
                }
            });

            // Add zoom/pan sync listener
            document.getElementById('chart').on('plotly_relayout', (eventData) => {
                if (eventData['xaxis.range[0]'] && eventData['xaxis.range[1]']) {
                    this.syncMacroChartRange(eventData['xaxis.range[0]'], eventData['xaxis.range[1]']);
                }
            });
        });
    }

    updateMacroChartVisibility() {
        const macroPanel = document.getElementById('macroChartPanel');
        if (this.selectedMacroIndicators.length > 0) {
            macroPanel.style.display = 'block';
        } else {
            macroPanel.style.display = 'none';
        }
    }

    updateMacroChart() {
        if (this.selectedMacroIndicators.length === 0) return;

        const traces = this.createMacroTraces();
        const shapes = this.showMacroEventOverlays ? this.createShapes() : [];
        const annotations = this.showMacroEventOverlays ? this.createMacroAnnotations() : [];
        const themeColors = this.getThemeColors();

        // Use synchronized range if available, otherwise use default range
        const xAxisRange = this.getXAxisRange();

        const layout = {
            title: '',
            plot_bgcolor: themeColors.background,
            paper_bgcolor: themeColors.paper,
            font: {
                color: themeColors.text
            },
            xaxis: {
                title: {
                    text: 'Date',
                    font: { color: themeColors.text }
                },
                tickformat: '%Y',
                tickmode: 'auto',
                nticks: 20,
                showgrid: this.showMacroGridLines,
                gridcolor: themeColors.gridColor,
                linecolor: themeColors.lineColor,
                tickcolor: themeColors.lineColor,
                tickfont: { color: themeColors.text },
                type: 'date',
                range: xAxisRange
            },
            yaxis: {
                title: {
                    text: 'Value',
                    font: { color: themeColors.text }
                },
                showgrid: this.showMacroGridLines,
                gridcolor: themeColors.gridColor,
                linecolor: themeColors.lineColor,
                tickcolor: themeColors.lineColor,
                tickfont: { color: themeColors.text },
                automargin: true,
            autorange: true,  // Always auto-scale Y-axis for macro data
            rangemode: 'normal',
        },
        dragmode: this.isMobile ? 'pan' : 'zoom',
        hovermode: 'closest',
            autosize: true,
            shapes: shapes,
            annotations: annotations,
            margin: { t: 40, b: 40, l: 50, r: 30 },
        };

        const config = { 
            responsive: true, 
            displaylogo: false, 
            scrollZoom: this.isMobile ? false : true,
            modeBarButtonsToRemove: ['pan2d', 'select2d', 'lasso2d', 'autoScale2d', 'hoverClosestCartesian', 'hoverCompareCartesian'],
            displayModeBar: window.innerWidth > 768 ? true : 'hover',
            doubleClick: 'reset+autosize',
            showTips: false
        };

        Plotly.newPlot('macroChart', traces, layout, config);
    }

    syncMacroChartRange(startDate, endDate) {
        // Store the current range for synchronization (X-axis only)
        this.currentXAxisRange = [startDate, endDate];
        
        // Update macro chart if it exists - only sync X-axis, let Y-axis auto-scale
        if (this.selectedMacroIndicators.length > 0) {
            const update = {
                'xaxis.range': [startDate, endDate],
                'yaxis.autorange': true  // Force Y-axis to auto-scale to macro data
            };
            Plotly.relayout('macroChart', update);
        }
    }

    initializeMacroChartSync() {
        // Get current range from main chart if it exists
        const mainChart = document.getElementById('chart');
        if (mainChart && mainChart.layout && mainChart.layout.xaxis && mainChart.layout.xaxis.range) {
            const currentRange = mainChart.layout.xaxis.range;
            this.currentXAxisRange = currentRange;
        }
    }

    getXAxisRange() {
        // Return synchronized range if available, otherwise calculate default range
        if (this.currentXAxisRange) {
            return this.currentXAxisRange;
        }
        
        // Default range calculation
        const earliestDate = this.getEarliestDate();
        const earliestMacroDate = this.getEarliestMacroDate();
        const overallEarliest = earliestDate && earliestMacroDate ? 
            new Date(Math.min(earliestDate.getTime(), earliestMacroDate.getTime())) :
            (earliestDate || earliestMacroDate);
            
        return overallEarliest ? 
            [overallEarliest.toISOString().split('T')[0], new Date().toISOString().split('T')[0]] : 
            undefined;
    }

    createMacroTraces() {
        return this.selectedMacroIndicators.map(indicator => {
            const data = this.dataMap[indicator] || [];
            console.log(`Creating macro trace for ${indicator}, data length:`, data.length);
            console.log(`Sample data for ${indicator}:`, data.slice(0, 3));

            return {
                x: data.map(d => d.date),
                y: data.map(d => d.close || d.value),
                type: 'scatter',
                mode: 'lines',
                name: tickerShortNames[indicator] || indicator,
                line: {
                    color: tickerColors[indicator] || '#1f77b4',
                    width: 2
                },
                hovertemplate: 
                    '%{x|%b %d, %Y}<br>' +
                    '%{y:.2f}<br>' +
                    '<extra>%{fullData.name}</extra>'
            };
        });
    }

    getEarliestMacroDate() {
        return this.selectedMacroIndicators.reduce((earliest, indicator) => {
            const data = this.dataMap[indicator] || [];
            if (data.length === 0) return earliest;
            const indicatorEarliest = new Date(data[0].date);
            return earliest ? new Date(Math.min(earliest.getTime(), indicatorEarliest.getTime())) : indicatorEarliest;
        }, null);
    }

    createMacroAnnotations() {
        const enabledEventsArray = events.filter(event => this.enabledEvents.has(event.label));
        const themeColors = this.getThemeColors();
        const annotationBg = this.isDarkMode ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255,255,255,0.95)';
        const annotationTextColor = this.isDarkMode ? '#f1f5f9' : '#333';
        
        return enabledEventsArray.map((event, index) => {
            // For macro chart, always use paper coordinates to avoid Y-axis interference
            return {
                x: event.start,
                y: this.getStaggeredPosition(index, enabledEventsArray.length),
                xref: 'x',
                yref: 'paper',  // Use paper coordinates for Y positioning
                text: this.formatEventText(event),
                showarrow: true,
                arrowhead: 2,
                arrowsize: 1,
                arrowwidth: 2,
                arrowcolor: event.color.replace('0.2', '0.8'),
                ax: 0,
                ay: -30,
                yanchor: 'middle',
                xanchor: 'left',
                bgcolor: annotationBg,
                bordercolor: event.color.replace('0.2', '0.8'),
                borderwidth: 2,
                borderpad: 6,
                font: {
                    size: 11,
                    family: 'Arial, sans-serif',
                    color: annotationTextColor
                }
            };
        });
    }

    resetZoom() {
        this.resetZoomTrigger++;
        this.updateChart();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MarketNavigator();
});
