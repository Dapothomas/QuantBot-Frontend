import React, { useState } from 'react';

const TradeHistory = ({ trades }) => {
  const [sortField, setSortField] = useState('entry_time');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
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
  
  // Calculate pagination
  const totalPages = Math.ceil(sortedTrades.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedTrades.slice(indexOfFirstItem, indexOfLastItem);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  // Go to next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  // Go to previous page
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  // Handle items per page change
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  };
  
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
        <div className="flex items-center">
          <svg className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12H15M9 16H15M9 8H15M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Trade History</h2>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-600 dark:text-gray-400">Rows:</label>
            <select 
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
          <button 
            className="px-3 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 dark:bg-indigo-900/30 dark:hover:bg-indigo-800/40 dark:text-indigo-300 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
            onClick={downloadCSV}
          >
            <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 15L12 3M12 15L8 11M12 15L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M2 17L2 20C2 20.5523 2.44772 21 3 21L21 21C21.5523 21 22 20.5523 22 20L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            Download CSV
          </button>
        </div>
      </div>
      
      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('entry_time')}
              >
                <div className="flex items-center">
                  <span className="md:inline hidden">Entry Time</span>
                  <span className="md:hidden">Entry</span>
                  {sortField === 'entry_time' && (
                    <span className="ml-1 text-indigo-600 dark:text-indigo-400">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hidden sm:table-cell"
                onClick={() => handleSort('exit_time')}
              >
                <div className="flex items-center">
                  <span className="md:inline hidden">Exit Time</span>
                  <span className="md:hidden inline">Exit</span>
                  {sortField === 'exit_time' && (
                    <span className="ml-1 text-indigo-600 dark:text-indigo-400">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                onClick={() => handleSort('entry_price')}
              >
                <div className="flex items-center">
                  Entry Price
                  {sortField === 'entry_price' && (
                    <span className="ml-1 text-indigo-600 dark:text-indigo-400">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                onClick={() => handleSort('exit_price')}
              >
                <div className="flex items-center">
                  Exit Price
                  {sortField === 'exit_price' && (
                    <span className="ml-1 text-indigo-600 dark:text-indigo-400">
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
                    <span className="ml-1 text-indigo-600 dark:text-indigo-400">
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
                    <span className="ml-1 text-indigo-600 dark:text-indigo-400">
                      {sortDirection === 'asc' ? '▲' : '▼'}
                    </span>
                  )}
                </div>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-700">
            {currentItems.map((trade, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-600/30 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300">
                  <div className="md:hidden font-semibold text-xs text-gray-500 dark:text-gray-400">Entry:</div>
                  {formatDate(trade.entry_time)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 hidden sm:table-cell">
                  {formatDate(trade.exit_time)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">
                  ${trade.entry_price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-300 hidden md:table-cell">
                  ${trade.exit_price.toFixed(2)}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                  trade.profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                }`}>
                  <div className="md:hidden font-semibold text-xs text-gray-500 dark:text-gray-400">Profit:</div>
                  ${trade.profit.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  <div className="md:hidden font-semibold text-xs text-gray-500 dark:text-gray-400">Result:</div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    trade.trade_result === 'win' 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}>
                    {trade.trade_result.toUpperCase()}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Mobile trade details expand/collapse */}
      <div className="mt-4 md:hidden">
        <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
          <span className="font-medium">Note:</span> Swipe left to see more details or rotate device to landscape view
        </div>
      </div>
      
      {/* Pagination */}
      <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm gap-4 sm:gap-0">
        <div className="text-gray-600 dark:text-gray-400">
          Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, sortedTrades.length)} of {sortedTrades.length} trades
        </div>
        
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex items-center">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded-md"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          
          <div className="flex">
            {Array.from({ length: Math.min(7, totalPages) }, (_, i) => {
              let pageNum;
              // Logic to determine which page numbers to show
              if (totalPages <= 7) {
                pageNum = i + 1; // show all pages if 7 or fewer
              } else if (currentPage <= 4) {
                pageNum = i + 1; // show first 7 pages
              } else if (currentPage >= totalPages - 3) {
                pageNum = totalPages - 6 + i; // show last 7 pages
              } else {
                pageNum = currentPage - 3 + i; // show 3 pages before and 3 after current
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => paginate(pageNum)}
                  className={`w-8 h-8 flex items-center justify-center mx-0.5 rounded-md font-medium ${
                    currentPage === pageNum
                      ? 'bg-indigo-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded-md"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TradeHistory; 