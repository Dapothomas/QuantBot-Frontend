import React from 'react';

const Dashboard = ({ backtestResults }) => {
  if (!backtestResults) {
    return (
      <div className="text-center text-gray-500 dark:text-gray-400 p-8 rounded-xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-100 dark:border-gray-700 shadow-sm">
        <svg className="w-16 h-16 mx-auto mb-4 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 17V15m0 0V9m0 6H7m2 0h2m2-6h2m-4 0h4m-4 4h4m-11 4h2m-2 0V9"></path>
        </svg>
        <h3 className="text-lg font-medium mb-2">No Backtest Results</h3>
        <p>Configure your strategy parameters and run a backtest to see results here</p>
      </div>
    );
  }

  const { summary } = backtestResults;

  // Calculate percentage change for visual indicator
  const percentChange = summary.final_balance > backtestResults.initialBalance
    ? ((summary.final_balance - backtestResults.initialBalance) / backtestResults.initialBalance * 100).toFixed(2)
    : ((backtestResults.initialBalance - summary.final_balance) / backtestResults.initialBalance * 100).toFixed(2);

  // Format currency with commas for better readability
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="pb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-800 to-gray-600 dark:from-gray-200 dark:to-gray-500">
          Backtest Results
        </h2>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300 rounded-full text-xs font-medium">
            <time dateTime={new Date().toISOString()}>{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</time>
          </span>
          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 rounded-full text-xs font-medium whitespace-nowrap">
            {backtestResults.symbol || "Unknown Symbol"}
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Return Card */}
        <div className="bg-gradient-to-br from-indigo-500/95 to-purple-600/95 dark:from-indigo-700/95 dark:to-purple-800/95 rounded-xl shadow-xl relative overflow-hidden group transition-transform hover:scale-[1.02] duration-300">
          <div className="absolute right-0 top-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
            <svg width="140" height="140" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 16V8M9 11L12 8L15 11" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
            </svg>
          </div>
          <div className="p-6 text-white backdrop-blur-[2px]">
            <div className="text-sm font-medium opacity-90 mb-1">Total Return</div>
            <div className="flex items-baseline space-x-2">
              <div className="text-3xl font-extrabold tracking-tight">
                {summary.total_return.toFixed(2)}%
              </div>
              <div className={`text-sm px-2 py-0.5 rounded-md ${summary.total_return >= 0 ? 'bg-green-500/40' : 'bg-red-500/40'} flex items-center backdrop-blur-sm`}>
                {summary.total_return >= 0 ? '↑' : '↓'} {Math.abs(summary.total_return).toFixed(2)}%
              </div>
            </div>
            <div className="mt-4 text-sm opacity-90 font-medium">
              Initial: {formatCurrency(backtestResults.initialBalance)} → Final: {formatCurrency(summary.final_balance)}
            </div>
          </div>
        </div>

        {/* Balance Card */}
        <div className="bg-gradient-to-br from-blue-500/95 to-cyan-600/95 dark:from-blue-700/95 dark:to-cyan-800/95 rounded-xl shadow-xl relative overflow-hidden group transition-transform hover:scale-[1.02] duration-300">
          <div className="absolute right-0 top-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
            <svg width="140" height="140" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="p-6 text-white backdrop-blur-[2px]">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm">
                  <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 6v12M7.5 12h9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-white">Final Balance</h3>
              </div>
              <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${summary.final_balance >= backtestResults.initialBalance ? 'bg-green-500/40 text-white' : 'bg-red-500/40 text-white'} backdrop-blur-sm`}>
                {summary.final_balance >= backtestResults.initialBalance ? '+' : '-'}{percentChange}%
              </div>
            </div>
            <div className="text-3xl font-extrabold tracking-tight text-white">
              {formatCurrency(summary.final_balance)}
            </div>
            <div className="mt-4 text-sm opacity-90 font-medium">
              From initial: {formatCurrency(backtestResults.initialBalance)}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="bg-gradient-to-br from-green-500/95 to-emerald-600/95 dark:from-green-700/95 dark:to-emerald-800/95 rounded-xl shadow-xl relative overflow-hidden group transition-transform hover:scale-[1.02] duration-300">
          <div className="absolute right-0 top-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
            <svg width="140" height="140" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 13V17M16 11V17M12 7V17M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="p-6 text-white backdrop-blur-[2px]">
            <h3 className="text-lg font-medium mb-4">Trade Statistics</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <div className="text-sm opacity-90 font-medium">Win Rate</div>
                <div className="text-xl font-extrabold">{summary.win_rate.toFixed(2)}%</div>
              </div>
              <div>
                <div className="text-sm opacity-90 font-medium">Max Drawdown</div>
                <div className="text-xl font-extrabold">{summary.max_drawdown.toFixed(2)}%</div>
              </div>
              <div>
                <div className="text-sm opacity-90 font-medium">Total Trades</div>
                <div className="text-xl font-extrabold">{summary.total_trades}</div>
              </div>
              <div>
                <div className="text-sm opacity-90 font-medium">Winning Trades</div>
                <div className="text-xl font-extrabold">{summary.winning_trades}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 