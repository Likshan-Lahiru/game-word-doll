/*
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
export function BottomNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const navigateToGames = () => {
    // If not on home page, navigate to home page first
    if (location.pathname !== '/') {
      navigate('/')
      // Add a small delay to ensure navigation completes before scrolling
      setTimeout(() => {
        const gameSection = document.querySelector('.game-card-grid')
        if (gameSection) {
          gameSection.scrollIntoView({
            behavior: 'smooth',
          })
        }
      }, 100)
    } else {
      // Already on home page, just scroll to games section
      const gameSection = document.querySelector('.game-card-grid')
      if (gameSection) {
        gameSection.scrollIntoView({
          behavior: 'smooth',
        })
      }
    }
  }
  const navigateToProfile = () => {
    navigate('/profile')
  }
  const navigateToStore = () => {
    navigate('/store')
  }
  // Check current path to determine which icon is active
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
      <div className="bg-[#1F2937]  mb-8 flex justify-center">
        <div className="flex justify-between w-full max-w-xs">
          <div className="flex flex-col items-center">
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/5TYpcFyrcJzsUYy6fN4qGy/cart.png"
                alt="Store"
                className="w-8 h-8 cursor-pointer"
                onClick={navigateToStore}
            />
            {isStorePage && (
                <div className="h-1 w-6 bg-white mt-0.5 rounded-full"></div>
            )}
          </div>
          <div className="flex flex-col items-center">
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/u2SMKm6BLewCDq32THirmz/console.png"
                alt="Games"
                className="w-8 h-8 cursor-pointer"
                onClick={navigateToGames}
            />
            {isGamesPage && (
                <div className="h-1 w-6 bg-white mt-0.5 rounded-full"></div>
            )}
          </div>
          <div className="flex flex-col items-center">
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/aJbWV6wgBpeJUuKUnTAtPB/user.png"
                alt="Profile"
                className="w-8 h-8 cursor-pointer"
                onClick={navigateToProfile}
            />
            {isProfilePage && (
                <div className="h-1 w-6 bg-white mt-0.5 rounded-full"></div>
            )}
          </div>
        </div>
      </div>
  )
}
*/
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
export function BottomNavigation() {
  const navigate = useNavigate()
  const location = useLocation()
  const isMobile = window.innerWidth <= 768
  const navigateToGames = () => {
    // If not on home page, navigate to home page first
    if (location.pathname !== '/') {
      navigate('/')
      // Add a small delay to ensure navigation completes before scrolling
      setTimeout(() => {
        const gameSection = document.querySelector('.game-card-grid')
        if (gameSection) {
          gameSection.scrollIntoView({
            behavior: 'smooth',
          })
        }
      }, 100)
    } else {
      // Already on home page, just scroll to games section
      const gameSection = document.querySelector('.game-card-grid')
      if (gameSection) {
        gameSection.scrollIntoView({
          behavior: 'smooth',
        })
      }
    }
  }
  const navigateToProfile = () => {
    navigate('/profile')
  }
  const navigateToStore = () => {
    navigate('/store')
  }
  // Check current path to determine which icon is active
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
          className={` ${isMobile ? 'py-1' : 'py-2 px-4'} flex justify-center fixed bottom-0 left-0 right-0 z-50`}
      >
        <div
            className={`flex justify-between ${isMobile ? 'w-full max-w-[180px]' : 'w-full max-w-xs'}`}
        >
          <div className="flex flex-col items-center">
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/5TYpcFyrcJzsUYy6fN4qGy/cart.png"
                alt="Store"
                className={`${isMobile ? 'w-8 h-8' : 'w-8 h-8'} cursor-pointer`}
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
                className={`${isMobile ? 'w-8 h-8' : 'w-8 h-8'} cursor-pointer`}
                onClick={navigateToGames}
            />
            {isGamesPage && (
                <div
                    className={`h-0.5 w-5 bg-white ${isMobile ? 'mt-0.5' : 'mt-1.5'} rounded-full`}
                ></div>
            )}
          </div>
          <div className="flex flex-col items-center">
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/aJbWV6wgBpeJUuKUnTAtPB/user.png"
                alt="Profile"
                className={`${isMobile ? 'w-8 h-8' : 'w-8 h-8'} cursor-pointer`}
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
