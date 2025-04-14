import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://127.0.0.1:5000';

const StrategyInfo = () => {
  const [strategyInfo, setStrategyInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetch(`${API_URL}/api/strategy-info`)
      .then(response => response.json())
      .then(data => {
        setStrategyInfo(data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching strategy info:', error);
        setIsLoading(false);
      });
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="ml-3 text-gray-600 dark:text-gray-400">Loading strategy information...</p>
      </div>
    );
  }
  
  if (!strategyInfo) {
    return <div className="p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded">Failed to load strategy information</div>;
  }
  
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{strategyInfo.name}</h2>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Overview</h3>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{strategyInfo.description}</p>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">How It Works</h3>
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg overflow-hidden shadow">
          <img src="/images/stochastic-oscillator.svg" alt="Stochastic Oscillator Diagram" className="w-full h-auto" />
          <div className="p-4 text-sm text-gray-600 dark:text-gray-400">
            The Stochastic Oscillator consists of two lines, %K and %D, that oscillate between 0 and 100. 
            Values above 80 indicate overbought conditions, while values below 20 indicate oversold conditions.
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Trading Rules</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow">
            <h4 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-2">Entry Signal</h4>
            <p className="text-gray-700 dark:text-gray-300">{strategyInfo.entry_rules}</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow">
            <h4 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-2">Exit Signal</h4>
            <p className="text-gray-700 dark:text-gray-300">{strategyInfo.exit_rules}</p>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Parameters</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {strategyInfo.parameters.map((param, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow">
              <h4 className="text-lg font-medium text-blue-600 dark:text-blue-400 mb-2">{param.name}</h4>
              <p className="text-gray-700 dark:text-gray-300 mb-2">{param.description}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Default value: <span className="font-semibold">{param.default}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white">Pros and Cons</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow">
            <h4 className="text-lg font-medium text-green-600 dark:text-green-400 mb-2">Pros</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Easy to interpret and implement</li>
              <li>Works well in ranging markets</li>
              <li>Can generate high-probability trade signals</li>
              <li>Effective for identifying potential reversals</li>
              <li>Helps determine market momentum and trend strength</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow">
            <h4 className="text-lg font-medium text-red-600 dark:text-red-400 mb-2">Cons</h4>
            <ul className="list-disc pl-5 space-y-1 text-gray-700 dark:text-gray-300">
              <li>Requires proper parameter tuning for different assets</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StrategyInfo; 