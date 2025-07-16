import React from 'react';
import { BalanceSelector } from './BalanceSelector';
export function StatusBar() {
  return <div className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
      {/* Online status - Left side on desktop, bottom on mobile */}
      <div className="flex items-center space-x-3 justify-center sm:justify-start order-last sm:order-first mb-4 sm:mb-0">
        <div className="w-3 h-3 rounded-full bg-green-500"></div>
        <span className="text-sm">1,568 Online</span>
      </div>
      {/* Balance Selector - Full width on mobile */}
      <div className="w-full sm:w-auto sm:flex-1 sm:max-w-md sm:mx-auto sm:px-4 mb-4 sm:mb-0">
        <BalanceSelector onSelect={type => console.log(`Selected: ${type}`)} />
      </div>
      {/* Heart and Diamond - Row on mobile, column on desktop */}
      <div className="flex justify-center space-x-4 sm:space-x-0 sm:flex-col sm:space-y-1 mb-4 sm:mb-0">
        <div className="bg-black rounded-full px-3 py-1 flex items-center">
          <img src="/heart.png" alt="Heart" className="w-4 h-4" />
          <span className="ml-1">0</span>
        </div>
        <div className="bg-black rounded-full px-3 py-1 flex items-center">
          <img src="/diaomnd.png" alt="Diamond" className="w-4 h-4" />
          <span className="ml-1">0</span>
        </div>
      </div>
    </div>;
}