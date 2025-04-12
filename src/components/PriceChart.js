import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

const PriceChart = ({ chartData, trades }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const isDarkMode = document.documentElement.classList.contains('dark');

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
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        textColor: isDarkMode ? '#d1d5db' : '#333',
        fontFamily: 'Poppins, sans-serif',
      },
      grid: {
        vertLines: {
          color: isDarkMode ? 'rgba(70, 70, 70, 0.2)' : 'rgba(197, 203, 206, 0.2)',
          style: 1,
        },
        horzLines: {
          color: isDarkMode ? 'rgba(70, 70, 70, 0.2)' : 'rgba(197, 203, 206, 0.2)',
          style: 1,
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
          color: isDarkMode ? 'rgba(107, 114, 128, 0.5)' : 'rgba(156, 163, 175, 0.5)',
          width: 1,
          style: 2,
          labelBackgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
        },
        horzLine: {
          color: isDarkMode ? 'rgba(107, 114, 128, 0.5)' : 'rgba(156, 163, 175, 0.5)',
          width: 1,
          style: 2,
          labelBackgroundColor: isDarkMode ? '#374151' : '#f3f4f6',
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
      color: isDarkMode ? '#3b82f6' : '#2196F3',
      lineWidth: 2,
      priceScaleId: 'stochastic',
      title: '%K Line',
      lastValueVisible: true,
    });
    
    const dSeries = chart.addLineSeries({
      color: isDarkMode ? '#f97316' : '#FF5722',
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
      color: isDarkMode ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.3)',
      lineWidth: 1,
      lineStyle: 2, // Dashed line
      priceScaleId: 'stochastic',
    });
    
    const oversoldSeries = chart.addLineSeries({
      color: isDarkMode ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.3)',
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
    
    // Mark trades on the chart
    if (trades && trades.length > 0) {
      // Buy markers
      const buyMarkers = trades.map(trade => ({
        time: new Date(trade.entry_time).getTime() / 1000,
        position: 'belowBar',
        color: isDarkMode ? '#3b82f6' : '#2196F3',
        shape: 'arrowUp',
        text: 'BUY',
        size: 2,
      }));
      
      // Sell markers
      const sellMarkers = trades.map(trade => ({
        time: new Date(trade.exit_time).getTime() / 1000,
        position: 'aboveBar',
        color: trade.trade_result === 'win' 
          ? (isDarkMode ? '#10b981' : '#4CAF50') 
          : (isDarkMode ? '#ef4444' : '#F44336'),
        shape: 'arrowDown',
        text: 'SELL',
        size: 2,
      }));
      
      priceSeries.setMarkers([...buyMarkers, ...sellMarkers]);
    }
    
    // Add legends
    const legend = document.createElement('div');
    legend.className = 'chart-legend flex items-center justify-center space-x-6 text-sm mt-2';
    legend.innerHTML = `
      <div class="flex items-center">
        <span class="inline-block w-3 h-3 mr-1 rounded-full" style="background-color: ${isDarkMode ? '#3b82f6' : '#2196F3'}"></span>
        <span>%K (Fast)</span>
      </div>
      <div class="flex items-center">
        <span class="inline-block w-3 h-3 mr-1 rounded-full" style="background-color: ${isDarkMode ? '#f97316' : '#FF5722'}"></span>
        <span>%D (Slow)</span>
      </div>
      <div class="flex items-center">
        <span class="inline-block w-3 h-3 mr-1 rounded-full" style="background-color: ${isDarkMode ? '#10b981' : '#4CAF50'}"></span>
        <span>Buy Signal</span>
      </div>
      <div class="flex items-center">
        <span class="inline-block w-3 h-3 mr-1 rounded-full" style="background-color: ${isDarkMode ? '#ef4444' : '#F44336'}"></span>
        <span>Sell Signal</span>
      </div>
    `;
    chartContainerRef.current.appendChild(legend);
    
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
  
  return (
    <div className="w-full">
      <div ref={chartContainerRef} className="w-full h-[600px]" />
    </div>
  );
};

export default PriceChart; 