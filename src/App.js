import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import PriceChart from './components/PriceChart';
import ConfigForm from './components/ConfigForm';
import TradeHistory from './components/TradeHistory';
import StrategyInfo from './components/StrategyInfo';
// No need for App.css import as we'll use Tailwind

// Get API URL from environment variable or use default
const API_URL = process.env.REACT_APP_API_URL || 'https://quantbot-backend.onrender.com';

function App() {
  const [activeTab, setActiveTab] = useState('backtest');
  const [backtestResults, setBacktestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode based on user preference
  useEffect(() => {
    if (localStorage.theme === 'dark' || 
       (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setDarkMode(false);
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
      setDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
      setDarkMode(true);
    }
  };

  const runBacktest = async (config) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_URL}/api/backtest`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to run backtest');
      }
      
      const data = await response.json();
      setBacktestResults({
        ...data,
        initialBalance: config.initial_balance,
      });
    } catch (err) {
      setError(err.message);
      console.error('Error running backtest:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen transition-colors duration-200 bg-gray-50 dark:bg-gray-900 dark:text-white">
      <header className="bg-white dark:bg-gray-800 shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">Stochastic Oscillator Trading Bot</h1>
          <div className="flex items-center space-x-4">
            <nav className="flex">
              <button 
                className={`px-4 py-2 rounded-l-md ${activeTab === 'backtest' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}
                onClick={() => setActiveTab('backtest')}
              >
                Backtest
              </button>
              <button 
                className={`px-4 py-2 rounded-r-md ${activeTab === 'strategy' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}
                onClick={() => setActiveTab('strategy')}
              >
                Strategy Info
              </button>
            </nav>
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            >
              {darkMode ? '🌞' : '🌙'}
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4">
        {activeTab === 'backtest' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
              <ConfigForm onRunBacktest={runBacktest} isLoading={isLoading} />
            </div>
            
            <div className="lg:col-span-3">
              {error && <div className="p-4 mb-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">{error}</div>}
              
              {backtestResults && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <Dashboard backtestResults={backtestResults} />
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                      Price Chart with Stochastic Oscillator 
                      <span className="text-sm ml-2 font-normal text-gray-500 dark:text-gray-400">
                        {backtestResults.trades.length > 0 && 
                          `${new Date(backtestResults.trades[0].entry_time).toLocaleDateString()} - 
                           ${new Date(backtestResults.trades[backtestResults.trades.length-1].exit_time).toLocaleDateString()}`
                        }
                      </span>
                    </h2>
                    <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                      <PriceChart 
                        chartData={backtestResults.chart_data} 
                        trades={backtestResults.trades} 
                      />
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
                    <TradeHistory trades={backtestResults.trades} />
                  </div>
                </div>
              )}
              
              {!backtestResults && !isLoading && !error && (
                <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
                  <h2 className="text-xl font-semibold mb-2">Welcome to the Stochastic Oscillator Trading Bot</h2>
                  <p className="text-gray-600 dark:text-gray-400">Configure your backtest parameters and click "Run Backtest" to see results</p>
                </div>
              )}
              
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p>Running backtest...</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'strategy' && (
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <StrategyInfo />
          </div>
        )}
      </main>
      
      <footer className="bg-white dark:bg-gray-800 p-4 mt-8 text-center text-gray-600 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Stochastic Oscillator Trading Bot</p>
      </footer>
    </div>
  );
}

export default App; 