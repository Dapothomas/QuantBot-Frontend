import React, { useState, useEffect } from 'react';

// Get API URL from environment variable or use default
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ConfigForm = ({ onRunBacktest, isLoading }) => {
  const [dataOptions, setDataOptions] = useState([]);
  const [formData, setFormData] = useState({
    initial_balance: 10000,
    risk_percentage: 1,
    data_source: 'btc_2023',
    k_period: 15,
    d_period: 5,
  });
  
  useEffect(() => {
    // Fetch available data sources
    fetch(`${API_URL}/api/available-data`)
      .then(response => response.json())
      .then(data => {
        setDataOptions(data.data_options);
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

  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-4">Strategy Configuration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="data_source" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Data Source
          </label>
          <select
            id="data_source"
            name="data_source"
            value={formData.data_source}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {dataOptions.map(option => (
              <option key={option.id} value={option.id}>{option.name}</option>
            ))}
          </select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="initial_balance" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Initial Balance (USDT)
          </label>
          <input
            type="number"
            id="initial_balance"
            name="initial_balance"
            min="100"
            step="100"
            value={formData.initial_balance}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="risk_percentage" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Risk Percentage (%)
          </label>
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
            className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="k_period" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              K Period
            </label>
            <input
              type="number"
              id="k_period"
              name="k_period"
              min="3"
              max="30"
              value={formData.k_period}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="d_period" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              D Period
            </label>
            <input
              type="number"
              id="d_period"
              name="d_period"
              min="2"
              max="15"
              value={formData.d_period}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
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