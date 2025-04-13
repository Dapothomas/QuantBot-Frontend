import React from 'react';

const PositionSizingInfo = () => {
  return (
    <div className="backdrop-blur-md bg-white/60 dark:bg-gray-800/60 rounded-xl overflow-hidden border border-white/20 dark:border-gray-700/30">
      <div className="bg-gradient-to-r from-indigo-600/90 to-purple-600/90 backdrop-blur-md px-5 py-4">
        <h3 className="text-xl font-medium text-white flex items-center">
          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8V16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Understanding Position Sizing Options
        </h3>
      </div>
      
      <div className="p-5 space-y-7">
        <div className="bg-white/40 dark:bg-gray-700/30 backdrop-blur-sm p-5 rounded-xl shadow-sm">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Overview</h4>
          <p className="text-gray-600 dark:text-gray-300">
            The trading bot offers two position sizing methods that determine how much cryptocurrency to buy for each trade:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5 text-gray-600 dark:text-gray-300">
            <li><span className="font-medium text-indigo-600 dark:text-indigo-400">Percentage of Balance</span> - Invests a percentage of your available balance for each trade</li>
            <li><span className="font-medium text-indigo-600 dark:text-indigo-400">Fixed Position Size</span> - Uses a fixed quantity of the cryptocurrency for each trade</li>
          </ul>
        </div>
        
        <div className="bg-white/40 dark:bg-gray-700/30 backdrop-blur-sm p-5 rounded-xl shadow-sm">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
            <span className="flex items-center justify-center w-7 h-7 bg-indigo-500/80 text-white rounded-full mr-2 text-sm">1</span>
            Percentage-Based Position Sizing
          </h4>
          
          <div className="space-y-4">
            <h5 className="font-medium text-gray-700 dark:text-gray-200">Step-by-Step Example (with $1000 initial balance)</h5>
            
            <div className="bg-white/70 dark:bg-gray-800/40 p-3 rounded-lg border-l-4 border-indigo-400 dark:border-indigo-500">
              <p className="font-medium text-indigo-700 dark:text-indigo-300">Step 1: Configuration</p>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
                <li>User sets initial balance: $1000</li>
                <li>User sets position size percentage: 90% (default)</li>
                <li>User sets risk percentage: 1% (default risk management parameter)</li>
              </ul>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-800/40 p-3 rounded-lg border-l-4 border-indigo-400 dark:border-indigo-500">
              <p className="font-medium text-indigo-700 dark:text-indigo-300">Step 2: Trade Signal Generation</p>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
                <li>The bot detects a buy signal (e.g., %K line crosses above %D while in oversold territory)</li>
              </ul>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-800/40 p-3 rounded-lg border-l-4 border-indigo-400 dark:border-indigo-500">
              <p className="font-medium text-indigo-700 dark:text-indigo-300">Step 3: Position Size Calculation</p>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
                <li>The bot calculates how much to invest based on the current balance: $1000 × 90% = $900</li>
                <li>This means $900 worth of cryptocurrency will be purchased</li>
              </ul>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-800/40 p-3 rounded-lg border-l-4 border-indigo-400 dark:border-indigo-500">
              <p className="font-medium text-indigo-700 dark:text-indigo-300">Step 4: Trade Execution</p>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
                <li>If the current price is $40,000 per BTC, the bot would buy 0.0225 BTC ($900 ÷ $40,000)</li>
                <li>The remaining $100 stays as cash in the account</li>
              </ul>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-800/40 p-3 rounded-lg border-l-4 border-indigo-400 dark:border-indigo-500">
              <p className="font-medium text-indigo-700 dark:text-indigo-300">Step 5: Balance Update After Trade</p>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
                <li>If the trade is profitable and BTC price increases to $42,000:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Position value becomes 0.0225 BTC × $42,000 = $945</li>
                    <li>Profit = $945 - $900 = $45</li>
                    <li>New account balance = $1000 + $45 = $1045</li>
                  </ul>
                </li>
                <li>For the next trade, the position size would be 90% of $1045 = $940.50</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-900/20 dark:to-indigo-900/20 backdrop-blur-sm p-4 rounded-xl border border-blue-200/50 dark:border-blue-800/30">
              <p className="font-medium text-blue-800 dark:text-blue-300 flex items-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Key Advantage: Adaptive Growth
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm text-blue-700 dark:text-blue-200">
                <li>Position sizes grow as your account grows</li>
                <li>If you have a losing streak, position sizes automatically decrease to preserve capital</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="bg-white/40 dark:bg-gray-700/30 backdrop-blur-sm p-5 rounded-xl shadow-sm">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
            <span className="flex items-center justify-center w-7 h-7 bg-indigo-500/80 text-white rounded-full mr-2 text-sm">2</span>
            Fixed Position Size
          </h4>
          
          <div className="space-y-4">
            <h5 className="font-medium text-gray-700 dark:text-gray-200">Step-by-Step Example (with $1000 initial balance)</h5>
            
            <div className="bg-white/70 dark:bg-gray-800/40 p-3 rounded-lg border-l-4 border-purple-400 dark:border-purple-500">
              <p className="font-medium text-purple-700 dark:text-purple-300">Step 1: Configuration</p>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
                <li>User sets initial balance: $1000</li>
                <li>User sets fixed position size: 0.005 BTC (recommended default)</li>
                <li>User sets risk percentage: 1% (still used for risk management)</li>
              </ul>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-800/40 p-3 rounded-lg border-l-4 border-purple-400 dark:border-purple-500">
              <p className="font-medium text-purple-700 dark:text-purple-300">Step 2: Trade Signal Generation</p>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
                <li>The bot detects a buy signal as before</li>
              </ul>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-800/40 p-3 rounded-lg border-l-4 border-purple-400 dark:border-purple-500">
              <p className="font-medium text-purple-700 dark:text-purple-300">Step 3: Position Size Calculation</p>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
                <li>The bot will attempt to buy exactly 0.005 BTC</li>
                <li>If BTC price is $40,000, this would require $200 (0.005 × $40,000)</li>
                <li>Since this is within the $1000 balance, the bot can execute the full position</li>
              </ul>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-800/40 p-3 rounded-lg border-l-4 border-purple-400 dark:border-purple-500">
              <p className="font-medium text-purple-700 dark:text-purple-300">Step 4: Trade Execution</p>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
                <li>The bot purchases 0.005 BTC for $200</li>
                <li>Remaining balance: $800</li>
              </ul>
            </div>
            
            <div className="bg-white/70 dark:bg-gray-800/40 p-3 rounded-lg border-l-4 border-purple-400 dark:border-purple-500">
              <p className="font-medium text-purple-700 dark:text-purple-300">Step 5: Balance Update After Trade</p>
              <ul className="list-disc pl-5 text-sm text-gray-600 dark:text-gray-300">
                <li>If the price increases to $42,000:
                  <ul className="list-disc pl-5 mt-1">
                    <li>Position value becomes 0.005 BTC × $42,000 = $210</li>
                    <li>Profit = $210 - $200 = $10</li>
                    <li>New account balance = $1010 ($800 unused + $210 from sale)</li>
                  </ul>
                </li>
                <li>For the next trade, the bot would still attempt to buy 0.005 BTC</li>
              </ul>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50/80 to-pink-50/80 dark:from-purple-900/20 dark:to-pink-900/20 backdrop-blur-sm p-4 rounded-xl border border-purple-200/50 dark:border-purple-800/30">
              <p className="font-medium text-purple-800 dark:text-purple-300 flex items-center">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Key Advantage: Consistent Exposure
              </p>
              <ul className="list-disc pl-5 mt-2 text-sm text-purple-700 dark:text-purple-200">
                <li>Maintains consistent exposure to the market</li>
                <li>Better for traders who want a fixed amount of cryptocurrency in each position</li>
                <li>The amount is automatically adjusted if it would exceed available balance</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* <div className="bg-white/40 dark:bg-gray-700/30 backdrop-blur-sm p-5 rounded-xl shadow-sm">
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 9V11M12 15H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Risk Percentage - Safety Mechanism
          </h4>
          <p className="text-gray-600 dark:text-gray-300">
            The risk percentage (default 1%) serves as an additional safety mechanism that limits the maximum loss per trade:
          </p>
          <ul className="list-disc pl-5 mt-3 space-y-1.5 text-gray-600 dark:text-gray-300">
            <li>For a $1000 account, maximum risk per trade is $10</li>
            <li>This can lead to smaller position sizes in volatile markets where stop-loss distances need to be larger</li>
            <li>Risk management is applied regardless of position sizing method</li>
          </ul>
        </div> */}
        
        <div className="bg-gradient-to-r from-green-50/90 to-emerald-50/90 dark:from-green-900/30 dark:to-emerald-900/30 backdrop-blur-sm p-5 rounded-xl border border-green-200/50 dark:border-green-800/30 shadow-sm">
          <h4 className="text-base font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Recommendation
          </h4>
          <p className="text-green-700 dark:text-green-200">
            For beginners, the percentage-based method with 50-90% allocation is recommended as it automatically manages position sizing as your account grows or shrinks.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PositionSizingInfo; 