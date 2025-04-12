import React from 'react';

const Dashboard = ({ backtestResults }) => {
  if (!backtestResults) {
    return <div className="text-center text-gray-500 dark:text-gray-400 p-4">Run a backtest to see results here</div>;
  }

  const { summary } = backtestResults;

  return (
    <div className="pb-4">
      <h2 className="text-xl font-semibold mb-4">Backtest Results</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800/60 rounded-lg dark:shadow-2xl shadow-md p-4">
          <h3 className="text-sm text-gray-500 dark:text-gray-300 font-medium">Total Return</h3>
          <p className={`text-xl font-bold ${summary.total_return >= 0 ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            {summary.total_return.toFixed(2)}%
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800/60 rounded-lg dark:shadow-2xl shadow-md p-4">
          <h3 className="text-sm text-gray-500 dark:text-gray-300 font-medium">Win Rate</h3>
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{summary.win_rate.toFixed(2)}%</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800/60 rounded-lg dark:shadow-2xl shadow-md p-4">
          <h3 className="text-sm text-gray-500 dark:text-gray-300 font-medium">Max Drawdown</h3>
          <p className="text-xl font-bold text-red-600 dark:text-red-400">{summary.max_drawdown.toFixed(2)}%</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800/60 rounded-lg dark:shadow-2xl shadow-md p-4">
          <h3 className="text-sm text-gray-500 dark:text-gray-300 font-medium">Total Trades</h3>
          <p className="text-xl font-bold">{summary.total_trades}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800/60 rounded-lg dark:shadow-2xl shadow-md p-4">
          <h3 className="text-sm text-gray-500 dark:text-gray-300 font-medium">Winning Trades</h3>
          <p className="text-xl font-bold">{summary.winning_trades}</p>
        </div>
        
        <div className="bg-white dark:bg-gray-800/60 rounded-lg dark:shadow-2xl shadow-md p-4">
          <h3 className="text-sm text-gray-500 dark:text-gray-300 font-medium">Final Balance</h3>
          <p className={`text-xl font-bold ${summary.final_balance >= backtestResults.initialBalance ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
            ${summary.final_balance.toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 