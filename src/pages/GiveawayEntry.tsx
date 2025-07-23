/*
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomNavigation } from '../components/BottomNavigation'
import { useGlobalContext } from '../context/GlobalContext'
import { StatusBar } from '../components/StatusBar'

export function GiveawayEntry() {
  const navigate = useNavigate()
  const { spinBalance } = useGlobalContext()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const CustomWordollCard = () => {
    /!*return (
        <div className="h-full relative" onClick={(e) => e.stopPropagation()}>
          {isMobile ? (
              <div className="rounded-xl overflow-hidden flex flex-col h-full relative">
                <div className="absolute inset-0">
                  <img
                      src="https://uploadthingy.s3.us-west-1.amazonaws.com/wEfJPtYkYsjSUwUG9ivnUR/wordoll.png"
                      alt="Wordoll"
                      className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-auto py-3 px-4 text-center relative z-10 mb-4">
                  <h3 className="text-2xl font-['DM_Sans'] font-bold text-white">Wordoll</h3>
                </div>
                <div
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => navigate('/giveaway-game')}
                />
              </div>
          ) : (
              <>
                <WordollCard />
                <div
                    className="absolute bottom-0 left-0 right-0 h-24 cursor-pointer"
                    onClick={() => navigate('/giveaway-game')}
                />
              </>
          )}
        </div>
    )*!/
    return (
        <div className="h-[450px] rounded-2xl overflow-hidden flex flex-col relative">
          {/!* Full image background *!/}
          <div className="absolute inset-0">
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/wEfJPtYkYsjSUwUG9ivnUR/wordoll.png"
                alt="Wordoll"
                className="w-full h-full object-cover"
            />
          </div>
          {/!* Dark overlay for better text readability *!/}
          {/!*<div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>*!/}
          {/!* x3 indicator in top right corner *!/}

          {/!* Title *!/}
          <h3 className="text-3xl font-medium text-center text-white relative z-10 mt-6 pt-2 font-['DM_Sans']">
            Wordoll
          </h3>
          {/!* Spacer to push button to bottom *!/}
          <div className="flex-1"></div>
          {/!* Play button *!/}
          <div className="p-4 flex justify-center mb-6 relative z-10">
            <button
                className="bg-blue-500 hover:bg-blue-600 rounded-full py-1 px-16 text-white font-medium text-xl border border-white/60 font-['DM_Sans']"
                onClick={() => navigate('/lock-pickr-game')}
            >
              PLAY
            </button>
          </div>
        </div>
    )
  }

  /!*const CustomLockPickrCard = () => {
    /!*return (
        <div className="h-full relative" onClick={(e) => e.stopPropagation()}>
          {isMobile ? (
              <div className="rounded-xl overflow-hidden flex flex-col h-full relative">
                <div className="absolute inset-0">
                  <img
                      src="https://uploadthingy.s3.us-west-1.amazonaws.com/i9wzJrxokDDqgwas4Cft5m/lockpickr.png"
                      alt="Lock Pickr"
                      className="w-full h-full object-cover"
                  />
                </div>
                <div className="mt-auto py-3 px-4 text-center relative z-10 mb-4">
                  <h3 className="text-2xl font-['DM_Sans'] font-bold text-white">Lock Pickr</h3>
                </div>
                <div
                    className="absolute inset-0 cursor-pointer"
                    onClick={() => navigate('/giveaway-game')}
                />
              </div>
          ) : (
              <>
                <LockPickrCard />
                <div
                    className="absolute bottom-0 left-0 right-0 h-24 cursor-pointer"
                    onClick={() => navigate('/giveaway-game')}
                />
              </>
          )}
        </div>
    )*!/
    return (
        <div className="h-[450px] rounded-2xl overflow-hidden flex flex-col relative">
          {/!* Full image background *!/}
          <div className="absolute inset-0">
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/i9wzJrxokDDqgwas4Cft5m/lockpickr.png"
                alt="Lock Pickr"
                className="w-full h-full object-cover"
            />
          </div>
          {/!* Dark overlay for better text readability *!/}
          {/!*<div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>*!/}
          {/!* Title *!/}
          <h3 className="text-3xl font-medium text-center text-white relative z-10 mt-6 pt-2 font-['DM_Sans']">
            Lock Pickr
          </h3>
          {/!* Spacer to push button to bottom *!/}
          <div className="flex-1"></div>
          {/!* Play button *!/}
          <div className="p-4 flex justify-center mb-6 relative z-10">
            <button
                className="bg-blue-500 hover:bg-blue-600 rounded-full py-1 px-16 text-white font-medium text-xl border border-white/60 font-['DM_Sans']"
                onClick={() => navigate('/lock-pickr-game')}
            >
              PLAY
            </button>


          </div>
        </div>
    )
  }*!/

  return (
      <div className="relative">
        {/!* Back button *!/}
        <div className="absolute top-12 left-4 z-10">
          <button
              className="w-12 h-12 rounded-full flex items-center justify-center"
              onClick={() => navigate('/')}
          >
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/5dZY2vpVSVwYT3dUEHNYN5/back-icons.png"
                alt="Back"
                className="w-8 h-8"
            />
          </button>
        </div>
        <div className=" md:pl-52">
          <StatusBar isMobile={isMobile} hideOnlineCount={true}/>
        </div>

        <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white">
          {/!* Main Content *!/}
          <div className="flex-1 flex flex-col pt-8">
            {/!* Title *!/}
            <h2 className="text-base font-dmSans font-['DM_Sans'] sm:text-lg md:text-xl font-medium text-center my-10 sm:my-3 md:mb-10 px-4">
              Play any game to enter the Fortune Spin
            </h2>


            {/!* Game Cards *!/}
            <div className="px-4">
              <div
                  className={`flex flex-wrap justify-center ${isMobile ? 'gap-3' : 'gap-4'} w-full max-w-2xl mx-auto`}
              >
                <div
                    className={`${isMobile ? 'w-[48%]' : 'w-[240px]'} ${isMobile ? 'h-[265px]' : 'h-[320px]'}`}
                >
                  <CustomWordollCard/>
                </div>
                <div
                    className={`${isMobile ? 'w-[48%]' : 'w-[240px]'} ${isMobile ? 'h-[265px]' : 'h-[320px]'}`}
                >
                  <CustomLockPickrCard/>
                </div>
              </div>
            </div>

            {/!* Spin Button - pushed more down on desktop only *!/}
            <div className="w-full px-4 mt-16 sm:mt-44 md:mt-8 lg:mt-24 xl:mt-44 mb-20">
              <button
                  className="bg-[#2D7FF0] hover:bg-blue-600 text-white py-3 px-16 rounded-full  mx-auto block"
                  onClick={() => navigate('/giveaway-game')}
                  disabled={spinBalance <= 0}
              >
                SPIN NOW ({spinBalance} x Spin)
              </button>
            </div>
          </div>

          {/!* Bottom Navigation *!/}
          <BottomNavigation/>
        </div>
      </div>
  )
}
*/

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomNavigation } from '../components/BottomNavigation'
import { useGlobalContext } from '../context/GlobalContext'
import { StatusBar } from '../components/StatusBar'

export function GiveawayEntry() {
  const navigate = useNavigate()
  const { spinBalance } = useGlobalContext()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const CustomWordollCard = () => {
    if (isMobile) {
      return (
          <div
              className="rounded-xl overflow-hidden flex flex-col h-[270px] relative cursor-pointer font-['DM Sans']"
              onClick={() => navigate('/giveaway-game')}
          >
            <div className="absolute inset-0">
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/wEfJPtYkYsjSUwUG9ivnUR/wordoll.png"
                  alt="Wordoll"
                  className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-auto pb-6 px-4 text-center relative z-10">
              <h3 className="text-xl font-bold text-white">Wordoll</h3>
            </div>
          </div>
      )
    }

    return (
        <div className="h-[450px] rounded-2xl overflow-hidden flex flex-col relative font-['DM Sans']">
          <div className="absolute inset-0">
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/wEfJPtYkYsjSUwUG9ivnUR/wordoll.png"
                alt="Wordoll"
                className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-3xl font-medium text-center text-white relative z-10 mt-6 pt-2 font-['DM_Sans']">
            Wordoll
          </h3>
          <div className="flex-1"></div>
          <div className="p-4 flex justify-center mb-6 relative z-10">
            <button
                className="bg-blue-500 hover:bg-blue-600 rounded-full py-1 px-16 text-white font-medium text-xl border border-white/60 font-['DM_Sans']"
                onClick={() => navigate('/giveaway-game')}
            >
              PLAY
            </button>
          </div>
        </div>
    )
  }

  const CustomLockPickrCard = () => {
    if (isMobile) {
      return (
          <div
              className="rounded-xl overflow-hidden flex flex-col h-[270px] relative cursor-pointer font-['DM Sans']"
              onClick={() => navigate('/giveaway-game')}
          >
            <div className="absolute inset-0">
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/i9wzJrxokDDqgwas4Cft5m/lockpickr.png"
                  alt="Lock Pickr"
                  className="w-full h-full object-cover"
              />
            </div>
            <div className="mt-auto pb-6 px-4 text-center relative z-10">
              <h3 className="text-xl font-bold text-white">Lock Pickr</h3>
            </div>
          </div>
      )
    }

    return (
        <div className="h-[450px] rounded-2xl overflow-hidden flex flex-col relative font-['DM Sans']">
          <div className="absolute inset-0">
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/i9wzJrxokDDqgwas4Cft5m/lockpickr.png"
                alt="Lock Pickr"
                className="w-full h-full object-cover"
            />
          </div>
          <h3 className="text-3xl font-medium text-center text-white relative z-10 mt-6 pt-2 font-['DM_Sans']">
            Lock Pickr
          </h3>
          <div className="flex-1"></div>
          <div className="p-4 flex justify-center mb-6 relative z-10">
            <button
                className="bg-blue-500 hover:bg-blue-600 rounded-full py-1 px-16 text-white font-medium text-xl border border-white/60 font-['DM_Sans']"
                onClick={() => navigate('/giveaway-game')}
            >
              PLAY
            </button>
          </div>
        </div>
    )
  }

  return (
      <div className="relative font-['DM Sans']">
        {/* Back button */}
        <div className="absolute top-12 left-4 z-10">
          <button
              className="w-12 h-12 rounded-full flex items-center justify-center"
              onClick={() => navigate('/')}
          >
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/5dZY2vpVSVwYT3dUEHNYN5/back-icons.png"
                alt="Back"
                className="w-8 h-8"
            />
          </button>
        </div>

        {/* Status Bar */}
        <div className="md:pl-52">
          <StatusBar isMobile={isMobile} hideOnlineCount={true} />
        </div>

        {/* Main Content */}
        <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white">
          <div className="flex-1 flex flex-col pt-8">
            {/* Title */}
            <h2 className="text-base font-dmSans font-['DM_Sans'] sm:text-lg md:text-xl font-medium text-center my-10 sm:my-3 md:mb-10 px-4">
              Play any game to enter the Fortune Spin
            </h2>

            {/* Game Cards */}
            <div className="px-4">
              <div
                  className={`flex flex-wrap justify-center ${isMobile ? 'gap-3' : 'gap-4'} w-full max-w-2xl mx-auto`}
              >
                <div className={`${isMobile ? 'w-[48%]' : 'w-[240px]'} ${isMobile ? 'h-[265px]' : 'h-[320px]'}`}>
                  <CustomWordollCard />
                </div>
                <div className={`${isMobile ? 'w-[48%]' : 'w-[240px]'} ${isMobile ? 'h-[265px]' : 'h-[320px]'}`}>
                  <CustomLockPickrCard />
                </div>
              </div>
            </div>

            {/* Spin Button */}
            <div className="w-full px-4 mt-16 sm:mt-44 md:mt-8 lg:mt-24 xl:mt-44 mb-20">
              <button
                  className="bg-[#2D7FF0] hover:bg-blue-600 text-white py-4 px-16 rounded-full mx-auto block"
                  onClick={() => navigate('/giveaway-game')}
                  disabled={spinBalance <= 0}
              >
                SPIN NOW ({spinBalance} x Spin)
              </button>
            </div>
          </div>

          {/* Bottom Navigation */}
          <BottomNavigation />
        </div>
      </div>
  )
}
