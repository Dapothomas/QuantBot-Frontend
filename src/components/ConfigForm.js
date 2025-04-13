import React, { useState, useEffect } from 'react';

// Get API URL from environment variable or use default
const API_URL = process.env.REACT_APP_API_URL || 'https://quantbot-backend.onrender.com';

const ConfigForm = ({ onRunBacktest, isLoading }) => {
  const [dataOptions, setDataOptions] = useState([]);
  const [selectedContext, setSelectedContext] = useState('');
  const [formData, setFormData] = useState({
    initial_balance: 10000,
    risk_percentage: 1,
    data_source: 'btc_2023',
    k_period: 15,
    d_period: 5,
  });
  
  // Tooltip descriptions for each field
  const tooltips = {
    data_source: "Select the cryptocurrency and time period for backtesting. Different periods have unique market conditions that may affect strategy performance.",
    initial_balance: "The starting capital for your backtest, in USDT. This simulates how much money you would have invested.",
    risk_percentage: "Percentage of your balance risked per trade. Lower values (1-2%) are recommended for more conservative trading. Recommended: 1%",
    k_period: "The number of periods used to calculate the %K line. Provides balance between responsiveness and stability. Recommended: 15",
    d_period: "The number of periods used to smooth the %K line to create the %D line. Provides optimal signal generation. Recommended: 5"
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
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Convert string values to appropriate types
    const processedData = {
      ...formData,
      initial_balance: parseFloat(formData.initial_balance),
      risk_percentage: parseFloat(formData.risk_percentage),
      k_period: parseInt(formData.k_period),
      d_period: parseInt(formData.d_period),
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
          <div className="flex items-center">
            <label htmlFor="data_source" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Data Source
            </label>
            <InfoTooltip text={tooltips.data_source} />
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
          
          {selectedContext && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md">
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
        
        <div className="space-y-2">
          <div className="flex items-center">
            <label htmlFor="risk_percentage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Risk Percentage (%)
            </label>
            <InfoTooltip text={tooltips.risk_percentage} />
          </div>
          <input
            type="number"
            id="risk_percentage"
            name="risk_percentage"
            min="0.1"
            max="10"
            step="0.1"
            value={formData.risk_percentage}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white dark:bg-gray-800/60 border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
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
    </div>
  );
};

export default ConfigForm; 