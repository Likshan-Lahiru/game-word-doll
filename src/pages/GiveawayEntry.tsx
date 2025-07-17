import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BalanceSelector } from '../components/BalanceSelector'
import { WordollCard } from '../components/GameCards/WordollCard'
import { LockPickrCard } from '../components/GameCards/LockPickrCard'
import { BottomNavigation } from '../components/BottomNavigation'
import { useGlobalContext } from '../context/GlobalContext'
import {StatusBar} from "../components/StatusBar.tsx";
export function GiveawayEntry() {
  const navigate = useNavigate()
  const {spinBalance } = useGlobalContext()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  // Custom wrapper components to override the navigation behavior
  const CustomWordollCard = () => {
    return (
        <div className="h-full relative" onClick={(e) => e.stopPropagation()}>
          {isMobile ? (
              <div className="rounded-xl overflow-hidden flex flex-col h-full relative">
                {/* Full image background */}
                <div className="absolute inset-0">
                  <img
                      src="https://uploadthingy.s3.us-west-1.amazonaws.com/wEfJPtYkYsjSUwUG9ivnUR/wordoll.png"
                      alt="Wordoll"
                      className="w-full h-full object-cover"
                  />
                </div>
                {/* Title at the bottom */}
                <div className="mt-auto py-3 px-4 text-center  relative z-10">
                  <h3 className="text-2xl font-bold text-white">Wordoll</h3>
                </div>
                {/* Overlay to capture clicks */}
                <div
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => navigate('/giveaway-game')}
                />
              </div>
          ) : (
              <>
                <WordollCard />
                {/* Overlay to capture the play button click */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-24 cursor-pointer"
                    onClick={() => navigate('/giveaway-game')}
                />
              </>
          )}
        </div>
    )
  }
  const CustomLockPickrCard = () => {
    return (
        <div className="h-full relative" onClick={(e) => e.stopPropagation()}>
          {isMobile ? (
              <div className="rounded-xl overflow-hidden flex flex-col h-full relative">
                {/* Full image background */}
                <div className="absolute inset-0">
                  <img
                      src="https://uploadthingy.s3.us-west-1.amazonaws.com/i9wzJrxokDDqgwas4Cft5m/lockpickr.png"
                      alt="Lock Pickr"
                      className="w-full h-full object-cover"
                  />
                </div>
                {/* Title at the bottom */}
                <div className="mt-auto py-3 px-4 text-center relative z-10">
                  <h3 className="text-2xl font-bold text-white">Lock Pickr</h3>
                </div>
                {/* Overlay to capture clicks */}
                <div
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => navigate('/giveaway-game')}
                />
              </div>
          ) : (
              <>
                <LockPickrCard />
                {/* Overlay to capture the play button click */}
                <div
                    className="absolute bottom-0 left-0 right-0 h-24 cursor-pointer"
                    onClick={() => navigate('/giveaway-game')}
                />
              </>
          )}
        </div>
    )
  }
  return (
      <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white">
        <div className="relative p-4">
          <div className="flex items-center">
            <button
                className="w-10 h-10 rounded-full bg-[#2A3042] flex items-center justify-center mr-3"
                onClick={() => navigate('/')}
            >
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/5dZY2vpVSVwYT3dUEHNYN5/back-icons.png"
                  alt="Back"
                  className="w-5 h-5"
              />
            </button>
            <div className="flex-1">
              <StatusBar isMobile={true}/>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Title */}
          <h2 className="text-base sm:text-lg md:text-xl font-medium text-center my-4 sm:my-6 md:my-8 px-4">
            Play any game to enter the Fortune Spin
          </h2>
          {/* Game Cards Container */}
          <div className="px-4 mb-auto">
            <div
                className={`flex flex-wrap justify-center ${isMobile ? 'gap-3' : 'gap-4'} w-full max-w-2xl mx-auto`}
            >
              {/* Equal height cards with custom navigation */}
              <div
                  className={`${isMobile ? 'w-[48%]' : 'w-[220px]'} ${isMobile ? 'h-[250px]' : 'h-[380px]'}`}
              >
                <CustomWordollCard/>
              </div>
              <div
                  className={`${isMobile ? 'w-[48%]' : 'w-[220px]'} ${isMobile ? 'h-[250px]' : 'h-[380px]'}`}
              >
                <CustomLockPickrCard/>
              </div>
            </div>
          </div>
          {/* Spin Button */}
          <div className="w-full px-4 mb-8 mt-auto">
            <button
                className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-full w-full max-w-md mx-auto block"
                onClick={() => navigate('/giveaway-game')}
                disabled={spinBalance <= 0}
            >
              SPIN NOW ({spinBalance} x Spin)
            </button>
          </div>
        </div>
        {/* Bottom Navigation */}
        <BottomNavigation/>
      </div>
  )
}
