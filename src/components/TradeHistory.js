import React, { useState } from 'react';

const TradeHistory = ({ trades }) => {
  const [sortField, setSortField] = useState('entry_time');
  const [sortDirection, setSortDirection] = useState('desc');
  
  if (!trades || trades.length === 0) {
    return <div className="text-center py-4 text-gray-500 dark:text-gray-400">No trades available</div>;
  }
  
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const sortedTrades = [...trades].sort((a, b) => {
    let aValue = a[sortField];
    let bValue = b[sortField];
    
    // Handle date conversion
    if (sortField.includes('time')) {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }
    
    if (aValue < bValue) {
      return sortDirection === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortDirection === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const downloadCSV = () => {
    // Create CSV header row
    const headers = Object.keys(trades[0]).join(',');
    
    // Create CSV content
    const csvContent = trades.map(trade => 
      Object.values(trade).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    ).join('\n');
    
    // Combine header and content
    const csv = `${headers}\n${csvContent}`;
    
    // Create download link
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'trade_history.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Trade History</h2>
        <button 
          className="px-4 py-2 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-md text-sm font-medium transition-colors duration-200"
          onClick={downloadCSV}
        >
          Download CSV
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800/70">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('entry_time')}
              >
                <div className="flex items-center">
                  Entry Time
                  {sortField === 'entry_time' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('exit_time')}
              >
                <div className="flex items-center">
                  Exit Time
                  {sortField === 'exit_time' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('entry_price')}
              >
                <div className="flex items-center">
                  Entry Price
                  {sortField === 'entry_price' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('exit_price')}
              >
                <div className="flex items-center">
                  Exit Price
                  {sortField === 'exit_price' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('profit')}
              >
                <div className="flex items-center">
                  Profit
                  {sortField === 'profit' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('trade_result')}
              >
                <div className="flex items-center">
                  Result
                  {sortField === 'trade_result' && (
                    <span className="ml-1">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-700/60 divide-y divide-gray-200 dark:divide-gray-800">
            {sortedTrades.map((trade, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(trade.entry_time)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">{formatDate(trade.exit_time)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">${trade.entry_price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">${trade.exit_price.toFixed(2)}</td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  trade.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  ${trade.profit.toFixed(2)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  trade.trade_result === 'win' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  {trade.trade_result.toUpperCase()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TradeHistory; 