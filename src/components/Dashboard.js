import React from 'react';

const Dashboard = ({ backtestResults }) => {
  if (!backtestResults) {
    return <div className="text-center text-gray-500 dark:text-gray-400 p-4">Run a backtest to see results here</div>;
  }

  const { summary } = backtestResults;

  // Calculate percentage change for visual indicator
  const percentChange = summary.final_balance > backtestResults.initialBalance
    ? ((summary.final_balance - backtestResults.initialBalance) / backtestResults.initialBalance * 100).toFixed(2)
    : ((backtestResults.initialBalance - summary.final_balance) / backtestResults.initialBalance * 100).toFixed(2);

  return (
    <div className="pb-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Backtest Results</h2>
        <div className="flex space-x-3">
          <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded-full text-xs font-medium">
            {new Date().toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Key Metrics Card */}
        <div className="bg-gradient-to-r from-indigo-500/90 to-purple-600/90 dark:from-indigo-700/90 dark:to-purple-800/90 rounded-xl shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 opacity-20">
            <svg width="120" height="120" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16V8M9 11L12 8L15 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <div className="p-6 text-white">
            <div className="text-sm font-medium opacity-80 mb-1">Total Return</div>
            <div className="flex items-baseline space-x-1">
              <div className="text-3xl font-bold">
                {summary.total_return.toFixed(2)}%
              </div>
              <div className={`text-sm px-2 py-0.5 rounded ${summary.total_return >= 0 ? 'bg-green-500/30' : 'bg-red-500/30'} flex items-center`}>
                {summary.total_return >= 0 ? '↑' : '↓'} {Math.abs(summary.total_return).toFixed(2)}%
              </div>
            </div>
            <div className="mt-4 text-sm opacity-80">
              Initial: ${backtestResults.initialBalance.toFixed(2)} → Final: ${summary.final_balance.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-white dark:bg-gray-900/20 backdrop-blur-lg rounded-xl shadow-lg">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 18.5C15.5899 18.5 18.5 15.5899 18.5 12C18.5 8.41015 15.5899 5.5 12 5.5C8.41015 5.5 5.5 8.41015 5.5 12C5.5 15.5899 8.41015 18.5 12 18.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 15V9M9 12H15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">Final Balance</h3>
              </div>
              <div className={`px-2 py-1 rounded-full text-xs font-medium ${summary.final_balance >= backtestResults.initialBalance ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}>
                {summary.final_balance >= backtestResults.initialBalance ? '+' : '-'}{percentChange}%
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-800 dark:text-gray-100">
              ${summary.final_balance.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="bg-white dark:bg-gray-900/20 backdrop-blur-lg rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200 mb-4">Trade Statistics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Win Rate</div>
              <div className="text-xl font-bold text-gray-800 dark:text-gray-200">{summary.win_rate.toFixed(2)}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Max Drawdown</div>
              <div className="text-xl font-bold text-red-600 dark:text-red-400">{summary.max_drawdown.toFixed(2)}%</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Total Trades</div>
              <div className="text-xl font-bold text-gray-800 dark:text-gray-200">{summary.total_trades}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 dark:text-gray-400">Winning Trades</div>
              <div className="text-xl font-bold text-green-600 dark:text-green-400">{summary.winning_trades}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 