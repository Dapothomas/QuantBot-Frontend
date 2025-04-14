import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyBalanceChart = ({ trades, initialBalance }) => {
  const [chartData, setChartData] = useState({ datasets: [] });
  const [options, setOptions] = useState({});
  const isDarkMode = document.documentElement.classList.contains('dark');
  const [isHovered, setIsHovered] = useState(false);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!trades || trades.length === 0) return;

    // Calculate monthly balances
    const monthlyBalances = calculateMonthlyBalances(trades, initialBalance);
    
    // Format data for Chart.js
    const data = {
      labels: monthlyBalances.labels,
      datasets: [
        {
          label: 'Monthly Balance',
          data: monthlyBalances.values,
          backgroundColor: monthlyBalances.values.map((value, index) => {
            // Green for gains, red for losses (compared to previous month)
            const prevValue = index > 0 ? monthlyBalances.values[index - 1] : initialBalance;
            return value >= prevValue 
              ? isDarkMode ? 'rgba(16, 185, 129, 0.6)' : 'rgba(75, 192, 192, 0.7)' 
              : isDarkMode ? 'rgba(239, 68, 68, 0.6)' : 'rgba(255, 99, 132, 0.7)';
          }),
          borderColor: monthlyBalances.values.map((value, index) => {
            const prevValue = index > 0 ? monthlyBalances.values[index - 1] : initialBalance;
            return value >= prevValue 
              ? isDarkMode ? 'rgb(16, 185, 129)' : 'rgb(75, 192, 192)' 
              : isDarkMode ? 'rgb(239, 68, 68)' : 'rgb(255, 99, 132)';
          }),
          borderWidth: 1,
          borderRadius: 6,
          hoverBackgroundColor: monthlyBalances.values.map((value, index) => {
            const prevValue = index > 0 ? monthlyBalances.values[index - 1] : initialBalance;
            return value >= prevValue 
              ? isDarkMode ? 'rgba(16, 185, 129, 0.8)' : 'rgba(75, 192, 192, 0.9)' 
              : isDarkMode ? 'rgba(239, 68, 68, 0.8)' : 'rgba(255, 99, 132, 0.9)';
          }),
        },
      ],
    };

    // Chart options
    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          },
          ticks: {
            color: isDarkMode ? '#d1d5db' : '#333',
            font: {
              family: 'Poppins, sans-serif',
            }
          }
        },
        y: {
          grid: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
          },
          ticks: {
            color: isDarkMode ? '#d1d5db' : '#333',
            font: {
              family: 'Poppins, sans-serif',
            },
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            color: isDarkMode ? '#d1d5db' : '#333',
            font: {
              family: 'Poppins, sans-serif',
              size: 12
            },
            boxWidth: 12,
            useBorderRadius: true,
            borderRadius: 4
          }
        },
        title: {
          display: false, // We'll use our own title in the JSX
        },
        tooltip: {
          backgroundColor: isDarkMode ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
          titleColor: isDarkMode ? '#fff' : '#333',
          bodyColor: isDarkMode ? '#d1d5db' : '#666',
          borderColor: isDarkMode ? 'rgba(75, 85, 99, 0.2)' : 'rgba(0, 0, 0, 0.1)',
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          titleFont: {
            family: 'Poppins, sans-serif',
            size: 14,
            weight: 'bold'
          },
          bodyFont: {
            family: 'Poppins, sans-serif',
            size: 13
          },
          callbacks: {
            label: function(context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += '$' + context.parsed.y.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                });
              }
              
              // Calculate change from previous month
              const index = context.dataIndex;
              const currentValue = context.parsed.y;
              const prevValue = index > 0 
                ? context.dataset.data[index - 1] 
                : initialBalance;
              
              const change = currentValue - prevValue;
              const percentChange = (change / prevValue) * 100;
              
              return [
                label,
                `Change: ${change >= 0 ? '+' : ''}$${change.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2
                })} (${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}%)`
              ];
            }
          }
        }
      },
      animation: {
        duration: 1500,
        easing: 'easeOutQuart'
      },
      elements: {
        bar: {
          borderWidth: 2,
        }
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
    };

    setChartData(data);
    setOptions(chartOptions);
  }, [trades, initialBalance, isDarkMode]);

  // Handle dark mode changes
  useEffect(() => {
    const handleDarkModeChange = () => {
      if (trades && trades.length > 0) {
        // Trigger a re-render to update chart colors
        setOptions(prevOptions => ({...prevOptions}));
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
  }, [trades]);

  // Calculate monthly balances from trade data
  const calculateMonthlyBalances = (trades, initialBalance) => {
    // Sort trades by date
    const sortedTrades = [...trades].sort((a, b) => 
      new Date(a.entry_time) - new Date(b.entry_time)
    );

    const monthlyData = {};
    let currentBalance = initialBalance;

    // Process each trade
    sortedTrades.forEach(trade => {
      const date = new Date(trade.exit_time);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      
      // Update balance
      currentBalance += trade.profit;
      
      // Store the latest balance for each month
      monthlyData[monthYear] = currentBalance;
    });

    // Convert to arrays for Chart.js
    const labels = Object.keys(monthlyData);
    const values = Object.values(monthlyData);

    return { labels, values };
  };
  
  // Handle hover effects
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  if (!trades || trades.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm text-center rounded-lg shadow-md">
        <p className="text-gray-500 dark:text-gray-400">No trade data available to display monthly balances</p>
      </div>
    );
  }

  // Calculate total growth
  const calculateGrowth = () => {
    if (!trades || trades.length === 0) return { value: 0, percent: 0 };
    
    const monthlyBalances = calculateMonthlyBalances(trades, initialBalance);
    const values = monthlyBalances.values;
    
    if (values.length === 0) return { value: 0, percent: 0 };
    
    const finalBalance = values[values.length - 1];
    const growthValue = finalBalance - initialBalance;
    const growthPercent = (growthValue / initialBalance) * 100;
    
    return { 
      value: growthValue,
      percent: growthPercent,
      finalBalance
    };
  };
  
  const growth = calculateGrowth();
  const isPositiveGrowth = growth.value >= 0;

  return (
    <div 
      className={`w-full rounded-lg shadow-lg transition-all duration-500 ease-in-out p-4
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Monthly Balance Progression</h3>
        </div>
        
        <div className="text-right">
          <div className={`text-sm font-medium ${isPositiveGrowth ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isPositiveGrowth ? '↑' : '↓'} {Math.abs(growth.percent).toFixed(2)}%
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            Initial: ${initialBalance.toLocaleString()} → Final: ${growth.finalBalance.toLocaleString()}
          </div>
        </div>
      </div>
      
      <div 
        className={`h-[400px] transition-all duration-300 ease-in-out
                    ${isHovered ? 'transform scale-[1.01]' : ''}`}
      >
        <Bar 
          ref={chartRef}
          data={chartData} 
          options={options} 
        />
      </div>
    </div>
  );
};

export default MonthlyBalanceChart; 