import React from 'react';
export function WinningStatus() {
  return <div className="mt-2 text-center">
      <p>You Won</p>
      <p className="flex items-center justify-center">
        <span className="font-bold mr-1">FREE</span>
        <img src="/point.png" alt="Coins" className="w-4 h-4 mr-1" />
        <span>50,000</span>
      </p>
    </div>;
}