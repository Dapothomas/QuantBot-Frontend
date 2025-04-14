import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import PriceChart from './components/PriceChart';
import ConfigForm from './components/ConfigForm';
import TradeHistory from './components/TradeHistory';
import StrategyInfo from './components/StrategyInfo';
import MonthlyBalanceChart from './components/MonthlyBalanceChart';
import StochasticOscillator from './components/StochasticOscillator';
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
          <div className="flex items-center">
            <svg className="w-8 h-8 mr-2 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 3L4 9V21H20V9L12 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M16 15C16 13.9391 15.5786 12.9217 14.8284 12.1716C14.0783 11.4214 13.0609 11 12 11C10.9391 11 9.92172 11.4214 9.17157 12.1716C8.42143 12.9217 8 13.9391 8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <h1 className="md:text-2xl text-lg font-bold text-gray-800 dark:text-white">DT's Quant<span className="text-indigo-600 dark:text-indigo-400">Trader</span></h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex rounded-lg overflow-hidden shadow-sm">
              <button 
                className={`px-4 py-2 ${activeTab === 'backtest' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}
                onClick={() => setActiveTab('backtest')}
              >
                Backtest
              </button>
              <button 
                className={`px-4 py-2 ${activeTab === 'strategy' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-gray-700 dark:bg-gray-700 dark:text-gray-200'}`}
                onClick={() => setActiveTab('strategy')}
              >
                Strategy Info
              </button>
            </nav>
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? 
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 3V4M12 20V21M4 12H3M21 12H20M6.31412 6.31412L5.5 5.5M18.5 18.5L17.6859 17.6859M6.31412 17.6859L5.5 18.5M18.5 5.5L17.6859 6.31412M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              : 
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.3542 15.3542C19.3176 15.7708 18.1856 16.0001 17.0001 16.0001C12.0294 16.0001 8.00006 11.9707 8.00006 7.00006C8.00006 5.81438 8.22931 4.68265 8.64581 3.64581C5.33666 4.9997 3 8.2939 3 12.0001C3 16.9707 7.02944 21.0001 12 21.0001C15.7062 21.0001 18.9997 18.6635 20.3542 15.3542Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              }
            </button>
          </div>
          
          {/* Mobile Hamburger Button */}
          <button 
            className="md:hidden p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200"
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
                  ? 'text-indigo-600 font-medium' 
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
                  ? 'text-indigo-600 font-medium' 
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
            <div className="lg:col-span-1">
              <div className="sticky top-4 bg-white dark:bg-gray-800/30 rounded-xl shadow-lg p-5">
                <ConfigForm onRunBacktest={runBacktest} isLoading={isLoading} />
              </div>
            </div>
            
            <div className="lg:col-span-3">
              {error && <div className="p-4 mb-4 bg-red-100 dark:bg-red-900/60 backdrop-blur-sm text-red-700 dark:text-red-200 rounded-xl">{error}</div>}
              
              {backtestResults && (
                <div className="space-y-6">
                  <div className="bg-white dark:bg-gray-800/30 backdrop-blur-lg p-5 rounded-xl shadow-lg">
                    <Dashboard backtestResults={backtestResults} />
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800/40 backdrop-blur-lg p-5 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 20L20 7M20 7H13M20 7V14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M17 20H4V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Price Chart with Stochastic Oscillator 
                      <span className="text-sm ml-2 font-normal text-gray-500 dark:text-gray-400">
                        {backtestResults.trades.length > 0 && 
                          `${new Date(backtestResults.trades[0].entry_time).toLocaleDateString()} - 
                           ${new Date(backtestResults.trades[backtestResults.trades.length-1].exit_time).toLocaleDateString()}`
                        }
                      </span>
                    </h2>
                    <div className="bg-white/98 dark:bg-gray-800/50 backdrop-blur-md overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                      <PriceChart 
                        chartData={backtestResults.chart_data} 
                        trades={backtestResults.trades} 
                      />
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800/40 backdrop-blur-lg p-5 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M7 20L15 12L7 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Stochastic Oscillator
                      <span className="text-sm ml-2 font-normal text-gray-500 dark:text-gray-400">
                        {backtestResults.trades.length > 0 && 
                          `${new Date(backtestResults.trades[0].entry_time).toLocaleDateString()} - 
                           ${new Date(backtestResults.trades[backtestResults.trades.length-1].exit_time).toLocaleDateString()}`
                        }
                      </span>
                    </h2>
                    <StochasticOscillator chartData={backtestResults.chart_data} />
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800/40 backdrop-blur-lg p-5 rounded-xl shadow-lg">
                    <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
                      <svg className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9H21M9 21V9M7 3H17L21 9H3L7 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Monthly Balance Progression
                    </h2>
                    <div className="bg-white/98 dark:bg-gray-800/50 backdrop-blur-md overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                      <MonthlyBalanceChart 
                        trades={backtestResults.trades} 
                        initialBalance={backtestResults.initialBalance} 
                      />
                    </div>
                  </div>
                  
                  <div className="bg-white dark:bg-gray-800/50 backdrop-blur-lg p-5 rounded-xl shadow-lg">
                    <TradeHistory trades={backtestResults.trades} />
                  </div>
                </div>
              )}
              
              {!backtestResults && !isLoading && !error && (
                <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800/50 backdrop-blur-lg p-8 rounded-xl shadow-lg text-center">
                  <svg className="w-16 h-16 text-indigo-500 dark:text-indigo-400 mb-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 13.2C3 12.1737 3 11.6605 3.10899 11.2195C3.37513 10.1175 4.1175 9.37513 5.21945 9.10899C5.66046 9 6.17372 9 7.2 9H16.8C17.8263 9 18.3395 9 18.7806 9.10899C19.8825 9.37513 20.6249 10.1175 20.891 11.2195C21 11.6605 21 12.1737 21 13.2V13.2C21 14.2263 21 14.7395 20.891 15.1806C20.6249 16.2825 19.8825 17.0249 18.7806 17.291C18.3395 17.4 17.8263 17.4 16.8 17.4H7.2C6.17372 17.4 5.66046 17.4 5.21945 17.291C4.1175 17.0249 3.37513 16.2825 3.10899 15.1806C3 14.7395 3 14.2263 3 13.2V13.2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 6L12 3L17 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 21L12 18L17 21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 17V9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <h2 className="text-xl font-semibold mb-2">Welcome to the Stochastic Oscillator Trading Bot</h2>
                  <p className="text-gray-600 dark:text-gray-400">Configure your backtest parameters and click "Run Backtest" to see results</p>
                </div>
              )}
              
              {isLoading && (
                <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-gray-800/40 backdrop-blur-lg p-8 rounded-xl shadow-lg text-center">
                  <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-700 dark:text-gray-300 text-lg">Running backtest...</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">This may take a few moments</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {activeTab === 'strategy' && (
          <div className="bg-white dark:bg-gray-800/30 backdrop-blur-lg p-6 rounded-xl shadow-lg">
            <StrategyInfo />
          </div>
        )}
      </main>
      
      <footer className="bg-white/80 dark:bg-gray-800/30 backdrop-blur-lg p-4 mt-auto text-center text-gray-600 dark:text-gray-400">
        <div className="container mx-auto flex justify-between items-center">
          <p>&copy; {new Date().getFullYear()} DT's Quant<span className="text-indigo-600 dark:text-indigo-400">Trader</span></p>
          <div className="flex space-x-4">
            <a 
              href="https://github.com/Dapothomas" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.477 2 2 6.477 2 12C2 16.418 4.865 20.166 8.84 21.49C9.34 21.58 9.52 21.27 9.52 21C9.52 20.77 9.51 20.14 9.51 19.31C7 19.91 6.35 18.57 6.15 18C6.037 17.702 5.537 17 5 17C4.56 17 4.06 17.39 5.1 17.4C6.1 17.41 6.7 18.1 6.9 18.41C7.938 19.927 9.4 18.04 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.5C5.62 10.39 6.01 9.5 6.91 8.81C6.81 8.56 6.46 7.61 7.01 6.21C7.01 6.21 7.98 5.94 9.51 7.09C10.3 6.85 11.15 6.74 12 6.74C12.85 6.74 13.7 6.85 14.49 7.09C16.01 5.94 16.98 6.21 16.98 6.21C17.53 7.61 17.18 8.56 17.08 8.81C17.98 9.5 18.37 10.39 18.37 11.5C18.37 15.32 16.04 16.16 13.82 16.41C14.17 16.72 14.5 17.33 14.5 18.26C14.5 19.6 14.49 20.68 14.49 21C14.49 21.27 14.67 21.58 15.17 21.49C19.135 20.16 22 16.419 22 12C22 6.477 17.523 2 12 2Z" fill="currentColor"/>
              </svg>
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App; 