import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { BottomNavigation } from '../components/BottomNavigation';
export function WordollLose() {
  const navigate = useNavigate();
  return <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white p-4">
      {/* Back button */}
      <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mb-4" onClick={() => navigate('/')}>
        <img src="/back-icons.png" alt="Back" className="w-6 h-6" />
      </button>
      {/* Lose content */}
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="bg-gray-800 rounded-3xl p-8 w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Timer Ended !</h2>
          {/* Lost points */}
          <div className="flex items-center justify-center text-4xl font-bold mb-4 text-red-500">
            <img src="/point.png" alt="Coins" className="w-8 h-8 mr-2" />
            <span>-1,000</span>
          </div>
          <p className="text-2xl text-center mb-8">Don't Worry</p>
          <p className="text-center mb-4">Sign Up to Get</p>
          {/* Bonus reward */}
          <div className="flex items-center justify-center text-4xl font-bold mb-6">
            <img src="/point.png" alt="Coins" className="w-8 h-8 mr-2" />
            <span>15,000,000 FREE</span>
          </div>
          {/* Sign up button */}
          <button className="w-full bg-blue-500 hover:bg-blue-600 rounded-full py-3 text-white font-bold text-xl mb-6">
            Sign Up Now
          </button>
          <p className="text-center mb-4">and</p>
          {/* Gems reward */}
          <p className="text-center mb-8 flex items-center justify-center">
            Win
            <span className="mx-2 text-red-500">💎</span>
            Gems
          </p>
          {/* No thanks button */}
          <button className="w-full bg-gray-700 hover:bg-gray-600 rounded-full py-3 text-white font-bold" onClick={() => navigate('/')}>
            No, Thanks
          </button>
        </div>
      </div>
      {/* Add Bottom Navigation */}
      <BottomNavigation />
    </div>;
}