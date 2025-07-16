import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { BalanceSelector } from '../components/BalanceSelector';
import { BottomNavigation } from '../components/BottomNavigation';
import { useGlobalContext } from '../context/GlobalContext';
export function GiveawayGame() {
  const navigate = useNavigate();
  const {
    coinBalance,
    ticketBalance
  } = useGlobalContext();
  // Handler functions for the ENTER buttons
  const handleEnterWordoll = () => {
    navigate('/wordoll-game');
  };
  const handleEnterLockPickr = () => {
    navigate('/lock-pickr-game');
  };
  return <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white">
      {/* Status Bar */}
      <div className="p-4 flex justify-between items-center">
        <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center" onClick={() => navigate('/giveaway-entry')}>
          <img src="/back-icons.png" alt="Back" className="w-6 h-6" />
        </button>
        {/* Balance Selector */}
        <div className="flex-1 max-w-md mx-auto px-4">
          <BalanceSelector onSelect={type => console.log(`Selected: ${type}`)} />
        </div>
        {/* Heart and Diamond */}
        <div className="flex flex-col space-y-1">
          <div className="bg-black rounded-full px-3 py-1 flex items-center">
            <img src="/heart.png" alt="Heart" className="w-4 h-4" />
            <span className="ml-1">0</span>
          </div>
          <div className="bg-black rounded-full px-3 py-1 flex items-center">
            <img src="/diaomnd.png" alt="Diamond" className="w-4 h-4" />
            <span className="ml-1">0</span>
          </div>
        </div>
      </div>
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-start px-4 pt-8">
        <h2 className="text-xl font-medium text-center mb-8">
          Select any to start the game
        </h2>
        <p className="text-gray-400 mb-4">Prize card</p>
        {/* Prize Cards Row - Changed from grid-cols-2 to flex row with responsive adjustments */}
        <div className="flex flex-wrap justify-center gap-4 w-full max-w-5xl mb-8">
          {/* Card 1 - Navigate to Wordoll Game */}
          <div className="bg-white rounded-xl p-4 text-black flex flex-col items-center w-[190px] h-[400px]">
            <p className="font-bold text-lg mb-2">Win</p>
            <img src="/prizez-coins-1.png" alt="Coins" className="w-16 h-16 mb-3" />
            <p className="font-bold text-lg mb-1">GC 50,000</p>
            <p className="text-center mb-1">+</p>
            <p className="mb-4">1 x Spin</p>
            <div className="flex items-center mb-3">
              <img src="/point.png" alt="Coins" className="w-5 h-5 mr-2" />
              <span className="font-medium">1,000</span>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white py-2 w-full rounded-full font-medium mt-auto" onClick={handleEnterWordoll}>
              ENTER
            </button>
          </div>
          {/* Card 2 - Navigate to LockPickr Game */}
          <div className="bg-white rounded-xl p-4 text-black flex flex-col items-center w-[190px] h-[400px]">
            <p className="font-bold text-lg mb-2">Win</p>
            <img src="/prizez-coins-2.png" alt="Coins" className="w-16 h-16 mb-3" />
            <p className="font-bold text-lg mb-1">GC 300,000</p>
            <p className="text-center mb-1">+</p>
            <p className="mb-4">3 x Spin</p>
            <div className="flex items-center mb-3">
              <img src="/point.png" alt="Coins" className="w-5 h-5 mr-2" />
              <span className="font-medium">5,000</span>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white py-2 w-full rounded-full font-medium mt-auto" onClick={handleEnterLockPickr}>
              ENTER
            </button>
          </div>
          {/* Card 3 - Navigate to Wordoll Game */}
          <div className="bg-white rounded-xl p-4 text-black flex flex-col items-center w-[190px] h-[400px]">
            <p className="font-bold text-lg mb-2">Win</p>
            <img src="/prizez-coins-3.png" alt="Coins" className="w-16 h-16 mb-3" />
            <p className="font-bold text-lg mb-1">GC 1,500,000</p>
            <p className="text-center mb-1">+</p>
            <p className="mb-4">10 x Spin</p>
            <div className="flex items-center mb-3">
              <img src="/point.png" alt="Coins" className="w-5 h-5 mr-2" />
              <span className="font-medium">20,000</span>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white py-2 w-full rounded-full font-medium mt-auto" onClick={handleEnterWordoll}>
              ENTER
            </button>
          </div>
          {/* Card 4 - Navigate to LockPickr Game */}
          <div className="bg-white rounded-xl p-4 text-black flex flex-col items-center w-[190px] h-[400px]">
            <p className="font-bold text-lg mb-2">Win</p>
            <img src="/prizez-coins-4.png" alt="Coins" className="w-16 h-16 mb-3" />
            <p className="font-bold text-lg mb-1">GC 8,000,000</p>
            <p className="text-center mb-1">+</p>
            <p className="mb-4">25 x Spin</p>
            <div className="flex items-center mb-3">
              <img src="/point.png" alt="Coins" className="w-5 h-5 mr-2" />
              <span className="font-medium">90,000</span>
            </div>
            <button className="bg-green-500 hover:bg-green-600 text-white py-2 w-full rounded-full font-medium mt-auto" onClick={handleEnterLockPickr}>
              ENTER
            </button>
          </div>
        </div>
      </div>
      {/* Bottom Navigation */}
      <BottomNavigation />
    </div>;
}