import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BottomNavigation } from '../components/BottomNavigation'
import { StatusBar } from '../components/StatusBar'
import { useGlobalContext } from '../context/GlobalContext'
import { PrizeCard, PrizeData} from '../components/PrizeCard'

export function GiveawayGame() {
  const navigate = useNavigate()
  const location = useLocation()
  const { coinBalance, setCoinBalance, selectedBalanceType, ticketBalance, temporaryTicketBalance, temporaryVoucherBalance, temporaryCoinBalance, setTemporaryTicketBalance, setTemporaryVoucherBalance, setTemporaryCoinBalance } = useGlobalContext()
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  // Get the selected game from location state
  const { selectedGame = 'wordoll' } = (location.state as {
    selectedGame?: string
  }) || {}

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const handleEnterGame = (prize: PrizeData) => {

    // Check if user has enough coins
    if (coinBalance < prize.cost) {
      alert("You don't have enough coins to play for this prize!")
      return
    }

    // Deduct the cost from user's coin balance
    setCoinBalance(coinBalance - prize.cost)
    // Store the selected prize in session storage
    sessionStorage.setItem('selectedPrize', JSON.stringify(prize))

    // Navigate to the appropriate game based on the selected game
    if (selectedGame === 'wordoll') {
      navigate('/giveaway-wordoll-game')
    } else {
      navigate('/giveaway-lockpickr-game')
    }
  }

  const handleEnterGameEntries = (entries: PrizeData) => {
    // Check if user has enough entries
    if (ticketBalance < entries.cost) {
      alert("You don't have enough entries to play for this prize!")
      return
    }

    setTemporaryVoucherBalance(temporaryVoucherBalance + entries.spinAmount)
    setTemporaryCoinBalance(temporaryCoinBalance + entries.coinAmount)

    // Deduct the cost from user's entries balance
    setTemporaryTicketBalance(temporaryTicketBalance - entries.cost)

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
      spinAmount: 2,
      cost: 1000,
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
      cost: 20000,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/6vJnKJ8AUVGEnXgBRiWAH9/prizez-coins-3.png',
    },
    {
      id: 4,
      coinAmount: 8000000,
      spinAmount: 75,
      cost: 90000,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/ofQaY3MrbupDhcPiD5MFSJ/prizez-coins-4.png',
    },
  ]

  // Buy Entries
  const entries : PrizeData[] = [
    {
      id: 1,
      coinAmount: 50000,
      spinAmount: 2,
      cost: 2,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/5sNDV16zKDrZv4WE8wxPR4/prizez-coins-1.png',
    },
    {
      id: 2,
      coinAmount: 300000,
      spinAmount: 5,
      cost: 5,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/xhwr6vr8mJJCTeAgmtWgrD/prizez-coins-2.png',
    },
    {
      id: 3,
      coinAmount: 1500000,
      spinAmount: 16,
      cost: 15,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/6vJnKJ8AUVGEnXgBRiWAH9/prizez-coins-3.png',
    },
    {
      id: 4,
      coinAmount: 8000000,
      spinAmount: 75,
      cost: 73,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/ofQaY3MrbupDhcPiD5MFSJ/prizez-coins-4.png',
    },
  ]

  if (isMobile) {
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white font-['DM_Sans']">
          <div className="absolute top-12 left-2 z-10">
            <button
                className="w-12 h-12 rounded-full flex items-center justify-center"
                onClick={() => navigate('/giveaway-entry')}
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
          <div className="flex-1 flex flex-col px-3 pt-1">
            <h2 className="text-xl font-medium text-center mb-6">
              Select a prize to win !
            </h2>

            {/* Prize Cards */}
            <div className="space-y-1 mb-8">
              {prizes.map((prize) => (
                  <PrizeCard
                      key={prize.id}
                      prize={prize}
                      isMobile={true}
                      onEnter={() => handleEnterGame(prize)}
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
      <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white font-['DM_Sans']">

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-10">
          <button
              className="w-12 h-12 rounded-full flex items-center justify-center"
              onClick={() => navigate('/giveaway-entry')}
          >
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/5dZY2vpVSVwYT3dUEHNYN5/back-icons.png"
                alt="Back"
                className="w-8 h-8"
            />
          </button>
        </div>

        {/* Status Bar */}
        <div className="">
          <StatusBar isMobile={isMobile} hideOnlineCount={true} switchableBalanceSelector={true}/>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col items-center justify-start px-4 pt-12">
          <div className={"w-full max-w-5xl pl-7"}>
            <h2 className="text-xl font-['DM_Sans'] font-medium text-left mb-8">
              { selectedBalanceType === 'coin' ? 'Select a prize to win!' : 'Select a prize to win! (One-time, single enter only per 24h)                                   '}
            </h2>
          </div>

          {/* Prize Cards Row */}
          <div className="flex flex-wrap justify-center gap-4 w-full max-w-5xl mb-8">
            { selectedBalanceType === 'coin' ? (
                  <>
                    {desktopPrizes.map((prize) => (
                        <PrizeCard
                            key={prize.id}
                            prize={prize}
                            isMobile={false}
                            onEnter={() => handleEnterGame(prize)}
                        />
                    ))}
                  </>
              ) : (
                  <>
                    {entries.map((entries) => (
                        <PrizeCard
                            key={entries.id}
                            prize={entries}
                            isMobile={false}
                            onEnter={() => handleEnterGameEntries(entries)}
                        />
                    ))}
                  </>
              )
            }
          </div>
        </div>

        {/* Bottom Navigation */}
        <BottomNavigation />
      </div>
  )
}
