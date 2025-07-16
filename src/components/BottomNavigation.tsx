import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
export function BottomNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const navigateToGames = () => {
    // If not on home page, navigate to home page first
    if (location.pathname !== '/') {
      navigate('/');
      // Add a small delay to ensure navigation completes before scrolling
      setTimeout(() => {
        const gameSection = document.querySelector('.game-card-grid');
        if (gameSection) {
          gameSection.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }, 100);
    } else {
      // Already on home page, just scroll to games section
      const gameSection = document.querySelector('.game-card-grid');
      if (gameSection) {
        gameSection.scrollIntoView({
          behavior: 'smooth'
        });
      }
    }
  };
  const navigateToProfile = () => {
    navigate('/profile');
  };
  const navigateToStore = () => {
    navigate('/store');
  };
  // Check current path to determine which icon is active
  const isStorePage = location.pathname.includes('/store') || location.pathname.includes('/redeem');
  const isGamesPage = location.pathname === '/' || location.pathname.includes('/wordoll') || location.pathname.includes('/lock-pickr') || location.pathname.includes('/giveaway');
  const isProfilePage = location.pathname.includes('/profile') || location.pathname.includes('/login') || location.pathname.includes('/signup');
  return <div className="bg-[#1F2937] p-4 flex justify-center">
      <div className="flex justify-between w-full max-w-xs">
        <div className="flex flex-col items-center">
          <img src="/cart.png" alt="Store" className="w-6 h-6 cursor-pointer" onClick={navigateToStore} />
          {isStorePage && <div className="h-0.5 w-6 bg-white mt-1.5 rounded-full"></div>}
        </div>
        <div className="flex flex-col items-center">
          <img src="/console.png" alt="Games" className="w-6 h-6 cursor-pointer" onClick={navigateToGames} />
          {isGamesPage && <div className="h-0.5 w-6 bg-white mt-1.5 rounded-full"></div>}
        </div>
        <div className="flex flex-col items-center">
          <img src="/user.png" alt="Profile" className="w-6 h-6 cursor-pointer" onClick={navigateToProfile} />
          {isProfilePage && <div className="h-0.5 w-6 bg-white mt-1.5 rounded-full"></div>}
        </div>
      </div>
    </div>;
}