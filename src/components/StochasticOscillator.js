import React, { useEffect, useRef, useState } from 'react';
import { createChart } from 'lightweight-charts';

const StochasticOscillator = ({ chartData }) => {
  const chartContainerRef = useRef();
  const chartRef = useRef();
  const isDarkMode = document.documentElement.classList.contains('dark');
  const [chartRendered, setChartRendered] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!chartData || chartData.length === 0) return;
    
    // Clear any existing chart
    if (chartContainerRef.current) {
      chartContainerRef.current.innerHTML = '';
    }
    
    // Create new chart with theme based on dark mode
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 250, // Shorter height for the indicator
      layout: {
        backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.8)',
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
        tickMarkFormatter: (time) => {
          const date = new Date(time * 1000);
          return date.getDate() + '/' + (date.getMonth() + 1);
        },
      },
      rightPriceScale: {
        borderColor: isDarkMode ? '#374151' : '#e5e7eb',
        borderVisible: true,
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
    });
    
    // Add stochastic oscillator lines
    const kSeries = chart.addLineSeries({
      color: isDarkMode ? '#3b82f6' : '#2196F3',
      lineWidth: 2,
      title: '%K Line',
      lastValueVisible: true,
    });
    
    const dSeries = chart.addLineSeries({
      color: isDarkMode ? '#f97316' : '#FF5722',
      lineWidth: 2,
      title: '%D Line',
      lastValueVisible: true,
    });
    
    // Add overbought/oversold areas
    const overboughtArea = chart.addAreaSeries({
      lineColor: 'transparent',
      topColor: isDarkMode ? 'rgba(239, 68, 68, 0.2)' : 'rgba(239, 68, 68, 0.1)',
      bottomColor: 'transparent',
    });
    
    const oversoldArea = chart.addAreaSeries({
      lineColor: 'transparent',
      topColor: 'transparent',
      bottomColor: isDarkMode ? 'rgba(16, 185, 129, 0.2)' : 'rgba(16, 185, 129, 0.1)',
    });
    
    // Add overbought/oversold lines
    const overboughtLine = chart.addLineSeries({
      color: isDarkMode ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.5)',
      lineWidth: 1,
      lineStyle: 2, // Dashed line
    });
    
    const oversoldLine = chart.addLineSeries({
      color: isDarkMode ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.5)', 
      lineWidth: 1,
      lineStyle: 2, // Dashed line
    });
    
    // Format data for stochastic oscillator
    const kData = chartData
      .filter(d => d.k !== null && d.k !== undefined)
      .map(d => ({
        time: new Date(d.timestamp).getTime() / 1000,
        value: d.k,
      }));
    
    const dData = chartData
      .filter(d => d.d !== null && d.d !== undefined)
      .map(d => ({
        time: new Date(d.timestamp).getTime() / 1000,
        value: d.d,
      }));
    
    // Create overbought/oversold data
    const timeRange = kData.map(d => d.time);
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
    
    // Create area data for overbought/oversold regions
    const overboughtAreaData = [
      { time: minTime, value: 80 },
      { time: maxTime, value: 80 },
    ];
    
    const oversoldAreaData = [
      { time: minTime, value: 20 },
      { time: maxTime, value: 20 },
    ];
    
    kSeries.setData(kData);
    dSeries.setData(dData);
    overboughtLine.setData(overboughtData);
    oversoldLine.setData(oversoldData);
    overboughtArea.setData(overboughtAreaData);
    oversoldArea.setData(oversoldAreaData);
    
    // No longer append legend here
    
    // Make sure the initial view fits all the data
    chart.timeScale().fitContent();
    
    chartRef.current = chart;
    
    // Set visible range to match the K line
    chart.applyOptions({
      timeScale: {
        rightOffset: 0,
        barSpacing: 6,
        minBarSpacing: 5,
        fixLeftEdge: true,
        fixRightEdge: true,
      },
      rightPriceScale: {
        scaleMargins: {
          top: 0.1,
          bottom: 0.1,
        },
        minimumHeight: 0,
      },
    });
    
    setChartRendered(true);
    
    // Cleanup on unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.remove();
        chartRef.current = null;
      }
    };
  }, [chartData, isDarkMode]);
  
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
        
        setChartRendered(false);
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

  if (!chartData || chartData.length === 0) {
    return (
      <div className="flex justify-center items-center h-32 bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm text-center">
        <p className="text-gray-500 dark:text-gray-400">No data available to display Stochastic Oscillator</p>
      </div>
    );
  }
  
  return (
    <div 
      className={`w-full rounded-lg p-4 shadow-lg transition-all duration-500 ease-in-out
                  ${isHovered ? 'scale-[1.02] z-10 shadow-xl' : ''}
                  bg-white/90 dark:bg-gray-800/80 backdrop-blur-md border border-gray-100 dark:border-gray-700`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        boxShadow: isHovered ? 
          `0 20px 25px -5px ${isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'}, 
           0 8px 10px -6px ${isDarkMode ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.1)'}` 
          : '',
      }}
    >
      <div className="flex items-center space-x-2 mb-3">
        <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 20L15 12L7 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Stochastic Oscillator</h3>
      </div>
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        The Stochastic Oscillator is a momentum indicator comparing a particular closing price to a range of prices over a certain period of time.
        Buy signals occur when %K crosses above %D while below 20, and sell signals when %K crosses below %D while above 80. You can analyze this while 
        looking at the trade history to see where and why exactly the trade was made to get a better understanding of how the strategy works.
      </div>
      <div 
        ref={chartContainerRef} 
        className={`w-full h-[250px] transition-all duration-300 ease-in-out
                    ${isHovered ? 'transform scale-[1.02]' : ''}`}
      />
      
      {/* Legend - now part of the JSX */}
      <div className="chart-legend flex flex-wrap items-center justify-center gap-4 text-sm mt-3 py-2 border-t border-gray-100 dark:border-gray-700">
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 mr-1 rounded-full" style={{backgroundColor: isDarkMode ? '#3b82f6' : '#2196F3'}}></span>
          <span>%K (Fast)</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-3 h-3 mr-1 rounded-full" style={{backgroundColor: isDarkMode ? '#f97316' : '#FF5722'}}></span>
          <span>%D (Slow)</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-10 h-2 mr-1" style={{backgroundColor: isDarkMode ? 'rgba(239, 68, 68, 0.5)' : 'rgba(239, 68, 68, 0.5)', borderStyle: 'dashed', borderWidth: '1px'}}></span>
          <span>Overbought (&gt;80)</span>
        </div>
        <div className="flex items-center">
          <span className="inline-block w-10 h-2 mr-1" style={{backgroundColor: isDarkMode ? 'rgba(16, 185, 129, 0.5)' : 'rgba(16, 185, 129, 0.5)', borderStyle: 'dashed', borderWidth: '1px'}}></span>
          <span>Oversold (&lt;20)</span>
        </div>
      </div>
    </div>
  );
};

export default StochasticOscillator; 