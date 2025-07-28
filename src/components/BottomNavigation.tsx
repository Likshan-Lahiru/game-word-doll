import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export function BottomNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = window.innerWidth <= 768

  const navigateToGames = () => {
    if (location.pathname !== '/') {
      navigate('/')
      setTimeout(() => {
        const gameSection = document.querySelector('.game-card-grid')
        if (gameSection) {
          gameSection.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else {
      const gameSection = document.querySelector('.game-card-grid')
      if (gameSection) {
        gameSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const navigateToProfile = () => {
    navigate('/profile')
  }

  const navigateToStore = () => {
    navigate('/store')
  }

  const isStorePage =
      location.pathname.includes('/store') ||
      location.pathname.includes('/redeem')
  const isGamesPage =
      location.pathname === '/' ||
      location.pathname.includes('/wordoll') ||
      location.pathname.includes('/lock-pickr') ||
      location.pathname.includes('/giveaway')
  const isProfilePage =
      location.pathname.includes('/profile') ||
      location.pathname.includes('/login') ||
      location.pathname.includes('/signup')

  return (
      <div
          className={`${isMobile ? 'py-1' : 'py-2 px-4'} bg-[#1F2937] fixed bottom-0 left-0 w-full z-50 flex justify-center`}
      >
        <div
            className={`flex justify-between ${isMobile ? 'w-full max-w-[270px]' : 'w-full max-w-xs'}`}
        >
          <div className={`flex flex-col items-center`}>
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/5TYpcFyrcJzsUYy6fN4qGy/cart.png"
                alt="Store"
                className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'} cursor-pointer`}
                onClick={navigateToStore}
            />
            {isStorePage && (
                <div
                    className={`h-0.5 w-5 bg-white ${isMobile ? 'mt-0.5' : 'mt-1.5'} rounded-full`}
                ></div>
            )}
          </div>
          <div className="flex flex-col items-center">
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/u2SMKm6BLewCDq32THirmz/console.png"
                alt="Games"
                className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'} cursor-pointer`}
                onClick={navigateToGames}
            />
            {isGamesPage && (
                <div
                    className={`h-0.5 w-5 bg-white ${isMobile ? 'mt-0.5' : 'mt-1.5'} rounded-full`}
                ></div>
            )}
          </div>
          <div className={`flex flex-col items-center`}>
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/aJbWV6wgBpeJUuKUnTAtPB/user.png"
                alt="Profile"
                className={`${isMobile ? 'w-10 h-10' : 'w-8 h-8'} cursor-pointer`}
                onClick={navigateToProfile}
            />
            {isProfilePage && (
                <div
                    className={`h-0.5 w-5 bg-white ${isMobile ? 'mt-0.5' : 'mt-1.5'} rounded-full`}
                ></div>
            )}
          </div>
        </div>
      </div>
  )
}
