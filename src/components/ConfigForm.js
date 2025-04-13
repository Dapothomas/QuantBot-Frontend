import React, { useState, useEffect } from 'react';
import PositionSizingInfo from './PositionSizingInfo';

// Get API URL from environment variable or use default
const API_URL = process.env.REACT_APP_API_URL || 'https://quantbot-backend.onrender.com';

// Average asset prices for estimation
const AVERAGE_PRICES = {
  'btc_2022': 30000,
  'btc_2023': 25000,
  'btc_2024': 50000,
  'eth_2023': 1800,
  'eth_2024': 2500,
  'sol_2023': 25,
  'sol_2024': 100
};

const ConfigForm = ({ onRunBacktest, isLoading }) => {
  const [dataOptions, setDataOptions] = useState([]);
  const [selectedContext, setSelectedContext] = useState('');
  const [showSizingInfo, setShowSizingInfo] = useState(false);
  const [showMarketContext, setShowMarketContext] = useState(false);
  const [estimatedValue, setEstimatedValue] = useState(0);
  const [positionSizeWarning, setPositionSizeWarning] = useState('');
  const [formData, setFormData] = useState({
    initial_balance: 10000,
    data_source: 'btc_2023',
    k_period: 15,
    d_period: 5,
    position_sizing: 'percentage', // Default to percentage-based sizing
    fixed_position_size: 0.005, // Default fixed position size in BTC/ETH/etc
    position_size_percentage: 90, // Default percentage of available balance (90%)
  });
  
  // Tooltip descriptions for each field
  const tooltips = {
    data_source: "Select the cryptocurrency and time period for backtesting. Different periods have unique market conditions that may affect strategy performance.",
    initial_balance: "The starting capital for your backtest, in USDT. This simulates how much money you would have invested.",
    k_period: "The number of periods used to calculate the %K line. Provides balance between responsiveness and stability. Recommended: 15",
    d_period: "The number of periods used to smooth the %K line to create the %D line. Provides optimal signal generation. Recommended: 5",
    position_sizing: "Method to determine how much to invest in each trade. Percentage-based sizing adapts to your account growth, using a portion of your current balance for each trade. Fixed sizing attempts to buy the same amount of cryptocurrency for each trade, regardless of your balance (limited by available funds).",
    fixed_position_size: "The exact amount of cryptocurrency to buy in each trade (e.g., 0.005 BTC). For a $1,000 account and $40,000 BTC price, a value of 0.005 BTC (~$200) is recommended. The bot will adjust if you don't have sufficient balance.",
    position_size_percentage: "Percentage of your available balance to use for each trade. At 90%, if you have $1,000, the bot will use $900 for trading. As your balance grows from profitable trades, your position sizes will also increase, allowing for compound growth."
  };
  
  useEffect(() => {
    // Fetch available data sources
    fetch(`${API_URL}/api/available-data`)
      .then(response => response.json())
      .then(data => {
        setDataOptions(data.data_options);
        // Set initial context
        const initialOption = data.data_options.find(option => option.id === formData.data_source);
        if (initialOption) {
          setSelectedContext(initialOption.context);
        }
      })
      .catch(error => {
        console.error('Error fetching data options:', error);
      });
  }, []);

  // Calculate estimated position value whenever relevant fields change
  useEffect(() => {
    if (formData.position_sizing === 'fixed') {
      const assetPrice = AVERAGE_PRICES[formData.data_source] || 25000;
      const estimatedCost = formData.fixed_position_size * assetPrice;
      setEstimatedValue(estimatedCost);
      
      // Set warning if position size exceeds balance
      if (estimatedCost > formData.initial_balance) {
        const maxAffordable = formData.initial_balance / assetPrice;
        setPositionSizeWarning(`This position (≈$${estimatedCost.toLocaleString()}) exceeds your initial balance. Max affordable: ${maxAffordable.toFixed(5)}`);
      } else {
        setPositionSizeWarning('');
      }
    } else {
      setEstimatedValue(0);
      setPositionSizeWarning('');
    }
  }, [formData.position_sizing, formData.fixed_position_size, formData.data_source, formData.initial_balance]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    
    // Update context when data source changes
    if (name === 'data_source') {
      const selectedOption = dataOptions.find(option => option.id === value);
      if (selectedOption) {
        setSelectedContext(selectedOption.context);
        // Hide the context when switching data sources
        setShowMarketContext(false);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate position size for fixed sizing strategy
    if (formData.position_sizing === 'fixed') {
      const assetPrice = AVERAGE_PRICES[formData.data_source] || 25000;
      const estimatedCost = formData.fixed_position_size * assetPrice;
      
      // Adjust fixed position size if it's too large
      if (estimatedCost > formData.initial_balance) {
        const maxAffordable = formData.initial_balance / assetPrice;
        const adjustedFormData = {
          ...formData,
          fixed_position_size: parseFloat(maxAffordable.toFixed(5))
        };
        
        // Alert the user that we're adjusting their position size
        alert(`Fixed position size was adjusted to ${adjustedFormData.fixed_position_size} to fit within your initial balance of $${formData.initial_balance}.`);
        
        // Process with adjusted data
        const processedData = {
          ...adjustedFormData,
          initial_balance: parseFloat(adjustedFormData.initial_balance),
          k_period: parseInt(adjustedFormData.k_period),
          d_period: parseInt(adjustedFormData.d_period),
          fixed_position_size: parseFloat(adjustedFormData.fixed_position_size),
          position_size_percentage: parseFloat(adjustedFormData.position_size_percentage),
        };
        
        // Update the form data with adjusted values
        setFormData(adjustedFormData);
        onRunBacktest(processedData);
        return;
      }
    }
    
    // Convert string values to appropriate types
    const processedData = {
      ...formData,
      initial_balance: parseFloat(formData.initial_balance),
      k_period: parseInt(formData.k_period),
      d_period: parseInt(formData.d_period),
      fixed_position_size: parseFloat(formData.fixed_position_size),
      position_size_percentage: parseFloat(formData.position_size_percentage),
    };
    onRunBacktest(processedData);
  };

  // Info icon component with tooltip
  const InfoTooltip = ({ text }) => (
    <div className="relative inline-block ml-1 group">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div style={{zIndex: 9999}} className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 p-2 w-56 bg-gray-800 text-white text-xs rounded shadow-lg">
        {text}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-2 h-2 -mt-1 rotate-45 bg-gray-800"></div>
      </div>
    </div>
  );

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Strategy Configuration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <label htmlFor="data_source" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Data Source
              </label>
              <InfoTooltip text={tooltips.data_source} />
            </div>
            {selectedContext && (
              <button
                type="button"
                onClick={() => setShowMarketContext(!showMarketContext)}
                className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-xs flex items-center transition-colors"
              >
                {showMarketContext ? 'Hide context' : 'View context'}
              </button>
            )}
          </div>
          <select
            id="data_source"
            name="data_source"
            value={formData.data_source}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white dark:bg-gray-800/60 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {dataOptions.map(option => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
          
          {/* Collapsible Context Information */}
          {selectedContext && showMarketContext && (
            <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md animate-fade-in">
              <p className="text-sm text-blue-800 dark:text-blue-300">{selectedContext}</p>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center">
            <label htmlFor="initial_balance" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Initial Balance (USDT)
            </label>
            <InfoTooltip text={tooltips.initial_balance} />
          </div>
          <input
            type="number"
            id="initial_balance"
            name="initial_balance"
            min="100"
            step="100"
            value={formData.initial_balance}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white dark:bg-gray-800/60 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Position Sizing Strategy */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <label htmlFor="position_sizing" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Position Sizing Strategy
              </label>
              <InfoTooltip text={tooltips.position_sizing} />
            </div>
            <button
              type="button"
              onClick={() => setShowSizingInfo(true)}
              className="text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300 text-xs flex items-center transition-colors"
            >
              View guide
            </button>
          </div>
          <select
            id="position_sizing"
            name="position_sizing"
            value={formData.position_sizing}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white dark:bg-gray-800/60 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="percentage">Percentage of Balance</option>
            <option value="fixed">Fixed Size</option>
          </select>
        </div>

        {/* Conditional fields based on position sizing strategy */}
        {formData.position_sizing === 'percentage' ? (
          <div className="space-y-2">
            <div className="flex items-center">
              <label htmlFor="position_size_percentage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Position Size (% of balance)
              </label>
              <InfoTooltip text={tooltips.position_size_percentage} />
            </div>
            <input
              type="number"
              id="position_size_percentage"
              name="position_size_percentage"
              min="1"
              max="100"
              step="1"
              value={formData.position_size_percentage}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white dark:bg-gray-800/60 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center">
              <label htmlFor="fixed_position_size" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Fixed Position Size (BTC/ETH/etc)
              </label>
              <InfoTooltip text={tooltips.fixed_position_size} />
            </div>
            <input
              type="number"
              id="fixed_position_size"
              name="fixed_position_size"
              min="0.001"
              step="0.001"
              value={formData.fixed_position_size}
              onChange={handleChange}
              required
              className={`w-full px-3 py-2 bg-white dark:bg-gray-800/60 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${positionSizeWarning ? 'border-yellow-500 dark:border-yellow-600' : ''}`}
            />
            
            {/* Display estimated value */}
            {estimatedValue > 0 && (
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                Estimated value: ~${estimatedValue.toLocaleString()} ({formData.fixed_position_size} × avg price)
              </div>
            )}
            
            {/* Display warning if position size exceeds balance */}
            {positionSizeWarning && (
              <div className="text-xs text-yellow-600 dark:text-yellow-500 mt-1 font-medium">
                ⚠️ {positionSizeWarning}
              </div>
            )}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center">
              <label htmlFor="k_period" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                K Period
              </label>
              <InfoTooltip text={tooltips.k_period} />
            </div>
            <input
              type="number"
              id="k_period"
              name="k_period"
              min="3"
              max="30"
              value={formData.k_period}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white dark:bg-gray-800/60 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center">
              <label htmlFor="d_period" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                D Period
              </label>
              <InfoTooltip text={tooltips.d_period} />
            </div>
            <input
              type="number"
              id="d_period"
              name="d_period"
              min="2"
              max="15"
              value={formData.d_period}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white dark:bg-gray-800/60 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="pt-4">
          <button 
            type="submit" 
            className={`w-full px-4 py-2 text-white font-medium rounded-md ${
              isLoading 
                ? 'bg-blue-400 dark:bg-blue-500 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600'
            } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
            disabled={isLoading}
          >
            {isLoading ? 'Running...' : 'Run Backtest'}
          </button>
        </div>
      </form>
      
      {/* Position Sizing Info Modal */}
      {showSizingInfo && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 transition-all duration-300">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl max-h-[90vh] overflow-auto animate-scale-in">
            <div className="sticky top-0 flex justify-end p-2 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowSizingInfo(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-2">
              <PositionSizingInfo />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConfigForm; 