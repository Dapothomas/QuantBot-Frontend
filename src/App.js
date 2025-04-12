import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import PriceChart from './components/PriceChart';
import ConfigForm from './components/ConfigForm';
import TradeHistory from './components/TradeHistory';
import StrategyInfo from './components/StrategyInfo';
import MonthlyBalanceChart from './components/MonthlyBalanceChart';
// No need for App.css import as we'll use Tailwind

// Get API URL from environment variable or use default
const API_URL = process.env.REACT_APP_API_URL || 'https://quantbot-backend.onrender.com';

function App() {
  const [activeTab, setActiveTab] = useState('backtest');
  const [backtestResults, setBacktestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    <div 
      className="min-h-screen flex flex-col transition-colors duration-200 dark:text-white"
      style={{
        backgroundImage: darkMode 
          ? "url('/images/blackimg.jpg')" 
          : "url('/images/firstwhite2.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}
    >
      <header className="bg-white/80 dark:bg-gray-800/60 backdrop-blur-sm shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="md:text-2xl text-lg font-bold text-gray-800 dark:text-white">Stochastic Oscillator Trading Bot</h1>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
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
          
          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              {menuOpen 
                ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              }
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {menuOpen && (
          <div className="md:hidden mt-2 bg-white/90 dark:bg-gray-900/50 backdrop-blur-sm rounded-md shadow-lg">
            <div className="flex flex-col">
              <button 
                className={`px-4 py-3 text-left ${activeTab === 'backtest' 
                  ? 'text-blue-600 font-medium' 
                  : 'text-gray-700 dark:text-gray-200'}`}
                onClick={() => {
                  setActiveTab('backtest');
                  setMenuOpen(false);
                }}
              >
                Backtest
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700"></div>
              <button 
                className={`px-4 py-3 text-left ${activeTab === 'strategy' 
                  ? 'text-blue-600 font-medium' 
                  : 'text-gray-700 dark:text-gray-200'}`}
                onClick={() => {
                  setActiveTab('strategy');
                  setMenuOpen(false);
                }}
              >
                Strategy Info
              </button>
              <div className="border-t border-gray-200 dark:border-gray-700"></div>
              <button 
                onClick={() => {
                  toggleDarkMode();
                  setMenuOpen(false);
                }}
                className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-200"
              >
                <span className="mr-2">{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
                <span>{darkMode ? '🌞' : '🌙'}</span>
              </button>
            </div>
          </div>
        )}
      </header>
      
      <main className="container mx-auto p-4 flex-grow">
        {activeTab === 'backtest' && (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 bg-white/90 dark:bg-gray-800/30 backdrop-blur-lg p-4 rounded-lg shadow">
              <ConfigForm onRunBacktest={runBacktest} isLoading={isLoading} />
            </div>
            
            <div className="lg:col-span-3">
              {error && <div className="p-4 mb-4 bg-red-100/90 dark:bg-red-900/90 backdrop-blur-sm text-red-700 dark:text-red-200 rounded">{error}</div>}
              
              {backtestResults && (
                <div className="space-y-6">
                  <div className="bg-white/90 dark:bg-gray-800/30 backdrop-blur-lg p-4 rounded-lg shadow">
                    <Dashboard backtestResults={backtestResults} />
                  </div>
                  
                  <div className="bg-white/90 dark:bg-gray-800/30 backdrop-blur-lg p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                      Price Chart with Stochastic Oscillator 
                      <span className="text-sm ml-2 font-normal text-gray-500 dark:text-gray-400">
                        {backtestResults.trades.length > 0 && 
                          `${new Date(backtestResults.trades[0].entry_time).toLocaleDateString()} - 
                           ${new Date(backtestResults.trades[backtestResults.trades.length-1].exit_time).toLocaleDateString()}`
                        }
                      </span>
                    </h2>
                    <div className="bg-white/95 dark:bg-gray-800/55 backdrop-blur-md overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                      <PriceChart 
                        chartData={backtestResults.chart_data} 
                        trades={backtestResults.trades} 
                      />
                    </div>
                  </div>
                  
                  <div className="bg-white/90 dark:bg-gray-800/30 backdrop-blur-lg p-4 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">
                      Monthly Balance Progression
                    </h2>
                    <div className="bg-white/95 dark:bg-gray-800/55 backdrop-blur-md overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                      <MonthlyBalanceChart 
                        trades={backtestResults.trades} 
                        initialBalance={backtestResults.initialBalance} 
                      />
                    </div>
                  </div>
                  
                  <div className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-lg p-4 rounded-lg shadow">
                    <TradeHistory trades={backtestResults.trades} />
                  </div>
                </div>
              )}
              
              {!backtestResults && !isLoading && !error && (
                <div className="flex flex-col items-center justify-center h-64 bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg shadow text-center">
                  <h2 className="text-xl font-semibold mb-2">Welcome to the Stochastic Oscillator Trading Bot</h2>
                  <p className="text-gray-600 dark:text-gray-400">Configure your backtest parameters and click "Run Backtest" to see results</p>
                </div>
              )}
              
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-64 bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg shadow text-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p>Running backtest...</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'strategy' && (
          <div className="bg-white/90 dark:bg-gray-800/30 backdrop-blur-lg p-6 rounded-lg shadow">
            <StrategyInfo />
          </div>
        )}
      </main>
      
      <footer className="bg-white/80 dark:bg-gray-800/30 backdrop-blur-lg p-4 mt-auto text-center text-gray-600 dark:text-gray-400">
        <p>&copy; {new Date().getFullYear()} Stochastic Oscillator Trading Bot</p>
      </footer>
    </div>
  );
}

export default App; 