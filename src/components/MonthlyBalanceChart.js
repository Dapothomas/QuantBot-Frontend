import React, { useEffect, useState } from 'react';
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
              ? 'rgba(75, 192, 192, 0.6)' 
              : 'rgba(255, 99, 132, 0.6)';
          }),
          borderColor: monthlyBalances.values.map((value, index) => {
            const prevValue = index > 0 ? monthlyBalances.values[index - 1] : initialBalance;
            return value >= prevValue 
              ? 'rgb(75, 192, 192)' 
              : 'rgb(255, 99, 132)';
          }),
          borderWidth: 1,
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
            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          },
          ticks: {
            color: isDarkMode ? '#d1d5db' : '#333',
          }
        },
        y: {
          grid: {
            color: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
          },
          ticks: {
            color: isDarkMode ? '#d1d5db' : '#333',
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
          }
        },
        title: {
          display: true,
          text: 'Monthly Balance Progression',
          color: isDarkMode ? '#d1d5db' : '#333',
          font: {
            size: 16,
          }
        },
        tooltip: {
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
              return label;
            }
          }
        }
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

  if (!trades || trades.length === 0) {
    return (
      <div className="flex justify-center items-center h-64 bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm text-center">
        <p className="text-gray-500 dark:text-gray-400">No trade data available to display monthly balances</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="h-[400px]">
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default MonthlyBalanceChart; 