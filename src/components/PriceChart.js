import React, { useEffect, useRef, useState } from 'react';
import { createChart, LineStyle } from 'lightweight-charts';

const PriceChart = ({ chartData, trades }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const isDarkMode = document.documentElement.classList.contains('dark');
  const [isHovered, setIsHovered] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState(null);

  useEffect(() => {
    if (!chartData || chartData.length === 0) return;
    
    // Clear any existing chart
    if (chartContainerRef.current) {
      chartContainerRef.current.innerHTML = '';
    }
    
    // Create new chart with theme based on dark mode
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 600, // Increased height
      layout: {
        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        textColor: isDarkMode ? '#d1d5db' : '#333',
        fontFamily: 'Poppins, sans-serif',
        fontSize: 13,
      },
      grid: {
        vertLines: {
          color: isDarkMode ? 'rgba(70, 70, 70, 0.2)' : 'rgba(197, 203, 206, 0.2)',
          style: LineStyle.Dotted,
        },
        horzLines: {
          color: isDarkMode ? 'rgba(70, 70, 70, 0.2)' : 'rgba(197, 203, 206, 0.2)',
          style: LineStyle.Dotted,
        },
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderVisible: true,
        tickMarkFormatter: (time) => {
          const date = new Date(time * 1000);
          return date.getDate() + '/' + (date.getMonth() + 1);
        },
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: isDarkMode ? 'rgba(107, 114, 128, 0.7)' : 'rgba(156, 163, 175, 0.7)',
          width: 1,
          style: 2,
          labelBackgroundColor: isDarkMode ? '#4f46e5' : '#4338ca',
          labelForegroundColor: 'white',
        },
        horzLine: {
          color: isDarkMode ? 'rgba(107, 114, 128, 0.7)' : 'rgba(156, 163, 175, 0.7)',
          width: 1,
          style: 2,
          labelBackgroundColor: isDarkMode ? '#4f46e5' : '#4338ca',
          labelForegroundColor: 'white',
        },
      },
      rightPriceScale: {
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderVisible: true,
        scaleMargins: {
          top: 0.1,
          bottom: 0.2,
        },
      },
      handleScroll: {
        vertTouchDrag: true,
      },
      handleScale: {
        axisPressedMouseMove: true,
        mouseWheel: true,
        pinch: true,
      },
      watermark: {
        visible: true,
        fontSize: 18,
        horzAlign: 'right',
        vertAlign: 'bottom',
        color: isDarkMode ? 'rgba(79, 70, 229, 0.1)' : 'rgba(79, 70, 229, 0.05)',
        text: 'Stochastic Strategy',
      },
    });
    
    // Add price series
    const priceSeries = chart.addCandlestickSeries({
      upColor: isDarkMode ? '#10b981' : '#26a69a',
      downColor: isDarkMode ? '#ef4444' : '#ef5350',
      borderUpColor: isDarkMode ? '#10b981' : '#26a69a',
      borderDownColor: isDarkMode ? '#ef4444' : '#ef5350',
      wickUpColor: isDarkMode ? '#10b981' : '#26a69a',
      wickDownColor: isDarkMode ? '#ef4444' : '#ef5350',
      priceFormat: {
        type: 'price',
        precision: 2,
        minMove: 0.01,
      },
    });
    
    // Format data for price chart - convert to OHLC format to show better candles
    const priceData = [];
    
    // If we have many data points, create proper OHLC candles by grouping
    if (chartData.length > 0) {
      // Group by day for better visualization
      const groupedData = {};
      
      chartData.forEach(d => {
        const timestamp = new Date(d.timestamp);
        const day = new Date(timestamp.getFullYear(), timestamp.getMonth(), timestamp.getDate()).getTime() / 1000;
        
        if (!groupedData[day]) {
          groupedData[day] = {
            time: day,
            open: d.close,
            high: d.close,
            low: d.close,
            close: d.close,
          };
        } else {
          groupedData[day].high = Math.max(groupedData[day].high, d.close);
          groupedData[day].low = Math.min(groupedData[day].low, d.close);
          groupedData[day].close = d.close;
        }
      });
      
      // Convert to array for the chart
      priceData.push(...Object.values(groupedData));
      
      // Sort by time
      priceData.sort((a, b) => a.time - b.time);
    }
    
    priceSeries.setData(priceData);
    
    // Add stochastic oscillator
    const kSeries = chart.addLineSeries({
      color: isDarkMode ? '#818cf8' : '#4f46e5',
      lineWidth: 2,
      priceScaleId: 'stochastic',
      title: '%K Line',
      lastValueVisible: true,
    });
    
    const dSeries = chart.addLineSeries({
      color: isDarkMode ? '#fb923c' : '#ea580c',
      lineWidth: 2,
      priceScaleId: 'stochastic',
      title: '%D Line',
      lastValueVisible: true,
    });
    
    // Create a separate price scale for the stochastic oscillator
    chart.priceScale('stochastic').applyOptions({
      scaleMargins: {
        top: 0.8,
        bottom: 0,
      },
      visible: true,
      borderColor: isDarkMode ? '#374151' : '#e5e7eb',
      borderVisible: true,
      entireTextOnly: true,
      autoScale: true,
    });
    
    // Add overbought/oversold lines
    const overboughtSeries = chart.addLineSeries({
      color: isDarkMode ? 'rgba(239, 68, 68, 0.6)' : 'rgba(239, 68, 68, 0.4)',
      lineWidth: 1,
      lineStyle: 2, // Dashed line
      priceScaleId: 'stochastic',
    });
    
    const oversoldSeries = chart.addLineSeries({
      color: isDarkMode ? 'rgba(16, 185, 129, 0.6)' : 'rgba(16, 185, 129, 0.4)',
      lineWidth: 1,
      lineStyle: 2, // Dashed line
      priceScaleId: 'stochastic',
    });
    
    // Format data for stochastic oscillator
    const kData = chartData
      .filter(d => d.k !== null)
      .map(d => ({
        time: new Date(d.timestamp).getTime() / 1000,
        value: d.k,
      }));
    
    const dData = chartData
      .filter(d => d.d !== null)
      .map(d => ({
        time: new Date(d.timestamp).getTime() / 1000,
        value: d.d,
      }));
    
    // Create overbought/oversold lines
    const timeRange = priceData.map(d => d.time);
    const minTime = Math.min(...timeRange);
    const maxTime = Math.max(...timeRange);
    
    const overboughtData = [
      { time: minTime, value: 80 },
      { time: maxTime, value: 80 },
    ];
    
    const oversoldData = [
      { time: minTime, value: 20 },
      { time: maxTime, value: 20 },
    ];
    
    kSeries.setData(kData);
    dSeries.setData(dData);
    overboughtSeries.setData(overboughtData);
    oversoldSeries.setData(oversoldData);
    
    // Mark trades on the chart with enhanced visibility
    if (trades && trades.length > 0) {
      // Buy markers - larger and more visible
      const buyMarkers = trades.map((trade, index) => ({
        time: new Date(trade.entry_time).getTime() / 1000,
        position: 'belowBar',
        color: isDarkMode ? '#818cf8' : '#4f46e5', // More vibrant indigo
        shape: 'circle',
        text: 'BUY',
        size: 3,
        id: `buy-${index}`,
      }));
      
      // Sell markers - with win/loss color coding
      const sellMarkers = trades.map((trade, index) => ({
        time: new Date(trade.exit_time).getTime() / 1000,
        position: 'aboveBar',
        color: trade.trade_result === 'win' 
          ? (isDarkMode ? '#34d399' : '#10b981') // Brighter green for wins
          : (isDarkMode ? '#f87171' : '#ef4444'), // Brighter red for losses
        shape: 'circle',
        text: trade.trade_result === 'win' ? 'PROFIT' : 'LOSS',
        size: 3,
        id: `sell-${index}`,
      }));
      
      // Add visual trade paths to connect entry and exit points
      const tradePaths = trades.map((trade, index) => {
        const entryTime = new Date(trade.entry_time).getTime() / 1000;
        const exitTime = new Date(trade.exit_time).getTime() / 1000;
        const color = trade.trade_result === 'win' 
          ? (isDarkMode ? 'rgba(52, 211, 153, 0.4)' : 'rgba(16, 185, 129, 0.3)') // Green
          : (isDarkMode ? 'rgba(248, 113, 113, 0.4)' : 'rgba(239, 68, 68, 0.3)'); // Red
        
        return chart.addLineSeries({
          color: color,
          lineWidth: 2,
          lineStyle: 1,
          lastValueVisible: false,
        }).setData([
          { time: entryTime, value: trade.entry_price },
          { time: exitTime, value: trade.exit_price }
        ]);
      });
      
      priceSeries.setMarkers([...buyMarkers, ...sellMarkers]);
      
      // Add tooltip functionality for markers
      chart.subscribeCrosshairMove((param) => {
        if (param.hoveredObjectId) {
          const id = param.hoveredObjectId;
          const type = id.startsWith('buy') ? 'buy' : 'sell';
          const index = parseInt(id.split('-')[1]);
          
          if (index >= 0 && index < trades.length) {
            setSelectedTrade({
              ...trades[index],
              type
            });
          }
        } else {
          setSelectedTrade(null);
        }
      });
    }

    // Add a volume series below the price chart
    const volumeSeries = chart.addHistogramSeries({
      color: isDarkMode ? 'rgba(129, 140, 248, 0.5)' : 'rgba(79, 70, 229, 0.3)',
      priceFormat: {
        type: 'volume',
      },
      priceScaleId: 'volume',
      scaleMargins: {
        top: 0.85, // Position it at the bottom of the chart
        bottom: 0,
      },
    });
    
    // Create dummy volume data based on price changes for demonstration
    if (priceData.length > 0) {
      const volumeData = priceData.map(d => {
        const baseVolume = Math.random() * 1000 + 500;
        const volumeMultiplier = Math.abs(d.close - d.open) / d.open * 10;
        return {
          time: d.time,
          value: baseVolume * (1 + volumeMultiplier),
          color: d.close >= d.open 
            ? (isDarkMode ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.3)') 
            : (isDarkMode ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.3)')
        };
      });
      volumeSeries.setData(volumeData);
    }
    
    // Make sure the initial view fits all the data
    chart.timeScale().fitContent();
    
    chartRef.current = chart;
    
    // Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [chartData, trades, isDarkMode]);
  
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (chartRef.current) {
        chartRef.current.applyOptions({
          width: chartContainerRef.current.clientWidth,
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Handle dark mode changes
  useEffect(() => {
    const handleDarkModeChange = () => {
      if (chartData && chartData.length > 0) {
        // Recreate chart with new theme
        if (chartRef.current) {
          chartRef.current.remove();
          chartRef.current = null;
        }
        
        if (chartContainerRef.current) {
          chartContainerRef.current.innerHTML = '';
        }
      }
    };

    // Use MutationObserver to detect changes to the classList of documentElement
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === 'attributes' &&
          mutation.attributeName === 'class'
        ) {
          handleDarkModeChange();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => {
      observer.disconnect();
    };
  }, [chartData]);
  
  // Handle hover effects
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  // Format date for trade details
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  return (
    <div 
      className={`w-full bg-white/95 dark:bg-gray-800/95 backdrop-blur-md rounded-xl shadow-lg 
                 transition-all duration-300 ease-in-out p-4 border border-gray-100 dark:border-gray-700
                 ${isHovered ? 'scale-[1.005] z-10 shadow-xl' : ''}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        boxShadow: isHovered ? 
          `0 20px 25px -5px ${isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'}, 
           0 8px 10px -6px ${isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'}` 
          : '',
      }}
    >
      <div className="mb-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
            <svg className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Price Chart with Stochastic Signals
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Visualizes price movements with trade entry and exit points.
          </p>
        </div>
        
        <div className="flex gap-2 mt-2 sm:mt-0">
          <button 
            className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/40 dark:text-indigo-300 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
            onClick={() => chartRef.current?.timeScale().fitContent()}
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 15L20 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M4 9L20 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10 3L10 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 3L14 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Fit View
          </button>
        </div>
      </div>
      
      <div className="relative">
        <div 
          ref={chartContainerRef} 
          className="w-full h-[600px] transition-all duration-300 ease-in-out rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700" 
        />
        
        {/* Trade Details Tooltip */}
        {selectedTrade && (
          <div className="absolute top-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20 max-w-xs">
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-800 dark:text-white">Trade Details</span>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                selectedTrade.trade_result === 'win' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}>
                {selectedTrade.trade_result.toUpperCase()}
              </span>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Type:</span> {selectedTrade.type === 'buy' ? 'Entry' : 'Exit'}</p>
              <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Time:</span> {formatDate(selectedTrade.type === 'buy' ? selectedTrade.entry_time : selectedTrade.exit_time)}</p>
              <p className="text-gray-600 dark:text-gray-300"><span className="font-medium">Price:</span> ${(selectedTrade.type === 'buy' ? selectedTrade.entry_price : selectedTrade.exit_price).toFixed(2)}</p>
              <p className={`font-medium ${selectedTrade.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                Profit: ${selectedTrade.profit.toFixed(2)}
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Chart Legend - Enhanced for better visibility */}
      <div className="chart-legend flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded">
          <span className="inline-block w-3 h-3 mr-1 rounded-full" style={{backgroundColor: isDarkMode ? '#818cf8' : '#4f46e5'}}></span>
          <span>%K (Fast)</span>
        </div>
        <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded">
          <span className="inline-block w-3 h-3 mr-1 rounded-full" style={{backgroundColor: isDarkMode ? '#fb923c' : '#ea580c'}}></span>
          <span>%D (Slow)</span>
        </div>
        <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded">
          <span className="inline-block w-3 h-3 mr-1 rounded-full" style={{backgroundColor: isDarkMode ? '#818cf8' : '#4f46e5'}}></span>
          <span>Entry</span>
        </div>
        <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded">
          <span className="inline-block w-3 h-3 mr-1 rounded-full" style={{backgroundColor: isDarkMode ? '#34d399' : '#10b981'}}></span>
          <span>Profit Exit</span>
        </div>
        <div className="flex items-center bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded">
          <span className="inline-block w-3 h-3 mr-1 rounded-full" style={{backgroundColor: isDarkMode ? '#f87171' : '#ef4444'}}></span>
          <span>Loss Exit</span>
        </div>
      </div>
      
      <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
        Hover over trade markers to see detailed information
      </div>
    </div>
  );
};

export default PriceChart; 