import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomNavigation } from '../components/BottomNavigation'
import { StatusBar } from '../components/StatusBar'
import { BalanceSelector } from '../components/BalanceSelector'
import { useGlobalContext } from '../context/GlobalContext'
import { PrizeCard, PrizeData } from '../components/PrizeCard'
export function GiveawayGame() {
  const navigate = useNavigate()
  useGlobalContext()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  const handleEnterGame = () => {
    navigate('/wordoll-game')
  }
  // Prize data array
  const prizes: PrizeData[] = [
    {
      id: 1,
      coinAmount: 50000,
      spinAmount: 2,
      cost: 2000,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/5sNDV16zKDrZv4WE8wxPR4/prizez-coins-1.png',
    },
    {
      id: 2,
      coinAmount: 300000,
      spinAmount: 5,
      cost: 5000,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/xhwr6vr8mJJCTeAgmtWgrD/prizez-coins-2.png',
    },
    {
      id: 3,
      coinAmount: 1500000,
      spinAmount: 16,
      cost: 15000,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/6vJnKJ8AUVGEnXgBRiWAH9/prizez-coins-3.png',
    },
    {
      id: 4,
      coinAmount: 8000000,
      spinAmount: 75,
      cost: 73000,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/ofQaY3MrbupDhcPiD5MFSJ/prizez-coins-4.png',
    },
  ]
  // For desktop view, use slightly different values
  const desktopPrizes: PrizeData[] = [
    {
      id: 1,
      coinAmount: 50000,
      spinAmount: 1,
      cost: 1000,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/5sNDV16zKDrZv4WE8wxPR4/prizez-coins-1.png',
    },
    {
      id: 2,
      coinAmount: 300000,
      spinAmount: 3,
      cost: 5000,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/xhwr6vr8mJJCTeAgmtWgrD/prizez-coins-2.png',
    },
    {
      id: 3,
      coinAmount: 1500000,
      spinAmount: 10,
      cost: 20000,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/6vJnKJ8AUVGEnXgBRiWAH9/prizez-coins-3.png',
    },
    {
      id: 4,
      coinAmount: 8000000,
      spinAmount: 25,
      cost: 90000,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/ofQaY3MrbupDhcPiD5MFSJ/prizez-coins-4.png',
    },
  ]
  if (isMobile) {
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1E2532] text-white">
          {/* Top bar with status and back button side by side */}
          <div className="relative p-4">
            {/* Status bar with back button on the same line */}
            <div className="flex items-center">
              <button
                  className="w-10 h-10 rounded-full bg-[#2A3042] flex items-center justify-center mr-3"
                  onClick={() => navigate('/giveaway-entry')}
              >
                <img
                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/5dZY2vpVSVwYT3dUEHNYN5/back-icons.png"
                    alt="Back"
                    className="w-5 h-5"
                />
              </button>
              <div className="flex-1">
                <StatusBar isMobile={true} />
              </div>
            </div>
          </div>
          {/* Main Content */}
          <div className="flex-1 flex flex-col px-3 pt-1">
            <h2 className="text-xl font-medium text-center mb-6">
              Select a prize to win !
            </h2>
            {/* Prize Cards */}
            <div className="space-y-3 mb-8">
              {prizes.map((prize) => (
                  <PrizeCard
                      key={prize.id}
                      prize={prize}
                      isMobile={true}
                      onEnter={handleEnterGame}
                  />
              ))}
            </div>
          </div>
          {/* Bottom Navigation */}
          <BottomNavigation />
        </div>
    )
  }
  return (
      <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white">
        {/* Status Bar */}
        <div className="p-4 flex justify-between items-center">
          <button
              className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center"
              onClick={() => navigate('/giveaway-entry')}
          >
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/5dZY2vpVSVwYT3dUEHNYN5/back-icons.png"
                alt="Back"
                className="w-6 h-6"
            />
          </button>
          {/* Balance Selector */}
          <div className="flex-1 max-w-md mx-auto px-4">
            <BalanceSelector
                onSelect={(type) => console.log(`Selected: ${type}`)}
            />
          </div>
          {/* Heart and Diamond */}
          <div className="flex flex-col space-y-1">
            <div className="bg-black rounded-full px-3 py-1 flex items-center">
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                  alt="Heart"
                  className="w-4 h-4"
              />
              <span className="ml-1">0</span>
            </div>
            <div className="bg-black rounded-full px-3 py-1 flex items-center">
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/uwPYNNRiavmZZ285SkzD5Z/diaomnd.png"
                  alt="Diamond"
                  className="w-4 h-4"
              />
              <span className="ml-1">0</span>
            </div>
          </div>
        </div>
        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-start px-4 pt-8">
          <h2 className="text-xl font-medium text-center mb-8">
            Select any to start the game
          </h2>

          {/* Prize Cards Row */}
          <div className="flex flex-wrap justify-center gap-4 w-full max-w-5xl mb-8">
            {desktopPrizes.map((prize) => (
                <PrizeCard
                    key={prize.id}
                    prize={prize}
                    isMobile={false}
                    onEnter={handleEnterGame}
                />
            ))}
          </div>
        </div>
        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
  )
}
