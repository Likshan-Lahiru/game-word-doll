import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BottomNavigation } from '../components/BottomNavigation'
import { StatusBar } from '../components/StatusBar'
import { useGlobalContext } from '../context/GlobalContext'
import { PrizeCard, PrizeData } from '../components/PrizeCard'
import { fetchGoldCoinPackages, apiRequest } from '../services/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
export function GoldGiveawayGame() {
    const navigate = useNavigate()
    const location = useLocation()
    const {
        coinBalance,
        setCoinBalance,
        selectedBalanceType,
        ticketBalance,
        temporaryTicketBalance,
        temporaryVoucherBalance,
        temporaryCoinBalance,
        setTemporaryTicketBalance,
        setTemporaryVoucherBalance,
        setTemporaryCoinBalance,
    } = useGlobalContext()
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    // Get the selected game from location state
    const { selectedGame = 'wordoll' } =
    (location.state as {
        selectedGame?: string
    }) || {}
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [prizes, setPrizes] = useState<PrizeData[]>([])
    const [entries, setEntries] = useState<PrizeData[]>([])
    const [isJoining, setIsJoining] = useState(false)
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    // Fetch prize packages from API
    useEffect(() => {
        const fetchPrizes = async () => {
            try {
                setIsLoading(true)
                const data = await fetchGoldCoinPackages()
                if (Array.isArray(data)) {
                    // Transform API response to match PrizeData interface
                    const transformedPrizes = data.map((item) => ({
                        id:
                            parseInt(item.id.split('-')[0], 16) ||
                            Math.floor(Math.random() * 1000),
                        coinAmount: item.goldCoins,
                        spinAmount: item.spinCount,
                        cost: isMobile ? item.goldCoinCost : Math.round(item.goldCoinCost),
                        image: item.imageLink,
                        originalId: item.id, // Store the original ID for API calls
                    }))
                    setPrizes(transformedPrizes)
                    // Create entries data with the same values but with cost field using goldCoinCost directly
                    const transformedEntries = data.map((item) => ({
                        id:
                            parseInt(item.id.split('-')[0], 16) ||
                            Math.floor(Math.random() * 1000),
                        coinAmount: item.goldCoins,
                        spinAmount: item.spinCount,
                        cost: item.goldCoinCost,
                        image: item.imageLink,
                        originalId: item.id, // Store the original ID for API calls
                    }))
                    setEntries(transformedEntries)
                } else {
                    setError('Invalid response format')
                    // Use fallback data
                    setPrizes(getFallbackPrizes())
                    setEntries(getFallbackEntries())
                }
            } catch (error) {
                console.error('Error fetching gold coin packages:', error)
                setError('Failed to load prize packages')
                // Use fallback data
                setPrizes(getFallbackPrizes())
                setEntries(getFallbackEntries())
            } finally {
                setIsLoading(false)
            }
        }
        fetchPrizes()
    }, [isMobile])
    const handleEnterGame = async (prize: PrizeData) => {
        // Check if user has enough coins
        if (coinBalance < prize.cost) {
            alert("You don't have enough coins to play for this prize!")
            return
        }
        try {
            setIsJoining(true)
            // Deduct the cost from user's coin balance
            setCoinBalance(coinBalance - prize.cost)
            // Get userId from localStorage
            const userId = localStorage.getItem('userId')
            if (!userId) {
                setError('User ID not found. Please log in again.')
                setCoinBalance(coinBalance) // Restore coins if error
                setIsJoining(false)
                return
            }
            // Prepare the join data for the giveaway API
            const gameType = selectedGame === 'wordoll' ? 'WORDALL' : 'LOCKPICKER'
            const joinData = {
                userId: userId,
                gameType: gameType,
                googleSessionId: 'google-session-123',
                gameTimeLimit: 15,
            }
            console.log('Joining giveaway with data:', joinData)
            // Call the giveaway/join API endpoint
            const response = await apiRequest('/giveaway/join', 'POST', joinData)
            console.log('Giveaway join response:', response)
            // Store the session data in localStorage
            localStorage.setItem(
                'authGameSession',
                JSON.stringify({
                    sessionId: response.sessionId,
                    gameType: gameType,
                    wordOrNumberLength: response.wordOrNumberLength || 5,
                }),
            )
            // Store the selected prize in session storage with detailed logging
            console.log('Storing prize in session storage:', prize)
            sessionStorage.setItem('selectedPrize', JSON.stringify(prize))
            // Double-check that prize was stored correctly
            const storedPrize = sessionStorage.getItem('selectedPrize')
            console.log('Verified stored prize:', storedPrize)
            // Navigate to the appropriate gold game
            if (selectedGame === 'wordoll') {
                navigate('/giveaway-gold-wordoll-game')
            } else {
                navigate('/giveaway-gold-lockpickr-game')
            }
        } catch (error) {
            console.error('Error joining giveaway:', error)
            setError('Failed to join the game. Please try again.')
            setCoinBalance(coinBalance) // Restore coins if error
            setIsJoining(false)
        }
    }
    const handleEnterGameEntries = async (entries: PrizeData) => {
        // Check if user has enough entries
        if (ticketBalance < entries.cost) {
            toast.info("You don't have enough entries to play for this prize!")
            return
        }
        try {
            setIsJoining(true)
            // Update temporary balances
            setTemporaryVoucherBalance(temporaryVoucherBalance + entries.spinAmount)
            setTemporaryCoinBalance(temporaryCoinBalance + entries.coinAmount)
            setTemporaryTicketBalance(entries.cost - temporaryTicketBalance)
            // Get userId from localStorage
            const userId = localStorage.getItem('userId')
            if (!userId) {
                setError('User ID not found. Please log in again.')
                setIsJoining(false)
                return
            }
            // Prepare the join data for the giveaway API
            const gameType = selectedGame === 'wordoll' ? 'WORDALL' : 'LOCKPICKER'
            const joinData = {
                userId: userId,
                gameType: gameType,
                googleSessionId: 'google-session-123',
                gameTimeLimit: 15,
            }
            console.log('Joining giveaway with entries data:', joinData)
            // Call the giveaway/join API endpoint
            const response = await apiRequest('/giveaway/join', 'POST', joinData)
            console.log('Giveaway join response:', response)
            // Store the session data in localStorage
            localStorage.setItem(
                'authGameSession',
                JSON.stringify({
                    sessionId: response.sessionId,
                    gameType: gameType,
                    wordOrNumberLength: response.wordOrNumberLength || 5,
                }),
            )
            // Store the selected prize in session storage with detailed logging
            console.log('Storing prize in session storage:', entries)
            sessionStorage.setItem('selectedPrize', JSON.stringify(entries))
            // Double-check that prize was stored correctly
            const storedPrize = sessionStorage.getItem('selectedPrize')
            console.log('Verified stored prize:', storedPrize)
            // Navigate to the appropriate game
            if (selectedGame === 'wordoll') {
                navigate('/giveaway-wordoll-game')
            } else {
                navigate('/giveaway-lockpickr-game')
            }
        } catch (error) {
            console.error('Error joining giveaway with entries:', error)
            setError('Failed to join the game. Please try again.')
            // Restore temporary balances
            setTemporaryVoucherBalance(temporaryVoucherBalance)
            setTemporaryCoinBalance(temporaryCoinBalance)
            setTemporaryTicketBalance(temporaryTicketBalance)
            setIsJoining(false)
        }
    }
    // Fallback prize data
    const getFallbackPrizes = (): PrizeData[] => {
        if (isMobile) {
            return [
                {
                    id: 1,
                    coinAmount: 50000,
                    spinAmount: 2,
                    cost: 2000,
                    image:
                        'https://uploadthingy.s3.us-west-1.amazonaws.com/5sNDV16zKDrZv4WE8wxPR4/prizez-coins-1.png',
                    originalId: '4793be8f-fea0-4541-b06e-328581b1ecf2',
                },
                {
                    id: 2,
                    coinAmount: 300000,
                    spinAmount: 5,
                    cost: 5000,
                    image:
                        'https://uploadthingy.s3.us-west-1.amazonaws.com/xhwr6vr8mJJCTeAgmtWgrD/prizez-coins-2.png',
                    originalId: '645c1125-6fd1-4e89-9acd-00b78899ad40',
                },
                {
                    id: 3,
                    coinAmount: 1500000,
                    spinAmount: 16,
                    cost: 15000,
                    image:
                        'https://uploadthingy.s3.us-west-1.amazonaws.com/6vJnKJ8AUVGEnXgBRiWAH9/prizez-coins-3.png',
                    originalId: '68e25702-cbb4-4d86-919b-7855180c0ff1',
                },
                {
                    id: 4,
                    coinAmount: 8000000,
                    spinAmount: 75,
                    cost: 73000,
                    image:
                        'https://uploadthingy.s3.us-west-1.amazonaws.com/ofQaY3MrbupDhcPiD5MFSJ/prizez-coins-4.png',
                    originalId: 'f1a9544f-a19a-43c6-b4af-ba2f45496c09',
                },
            ]
        } else {
            return [
                {
                    id: 1,
                    coinAmount: 50000,
                    spinAmount: 2,
                    cost: 2000,
                    image:
                        'https://uploadthingy.s3.us-west-1.amazonaws.com/5sNDV16zKDrZv4WE8wxPR4/prizez-coins-1.png',
                    originalId: '4793be8f-fea0-4541-b06e-328581b1ecf2',
                },
                {
                    id: 2,
                    coinAmount: 300000,
                    spinAmount: 5,
                    cost: 5000,
                    image:
                        'https://uploadthingy.s3.us-west-1.amazonaws.com/xhwr6vr8mJJCTeAgmtWgrD/prizez-coins-2.png',
                    originalId: '645c1125-6fd1-4e89-9acd-00b78899ad40',
                },
                {
                    id: 3,
                    coinAmount: 1500000,
                    spinAmount: 16,
                    cost: 15000,
                    image:
                        'https://uploadthingy.s3.us-west-1.amazonaws.com/6vJnKJ8AUVGEnXgBRiWAH9/prizez-coins-3.png',
                    originalId: '68e25702-cbb4-4d86-919b-7855180c0ff1',
                },
                {
                    id: 4,
                    coinAmount: 8000000,
                    spinAmount: 75,
                    cost: 73000,
                    image:
                        'https://uploadthingy.s3.us-west-1.amazonaws.com/ofQaY3MrbupDhcPiD5MFSJ/prizez-coins-4.png',
                    originalId: 'f1a9544f-a19a-43c6-b4af-ba2f45496c09',
                },
            ]
        }
    }
    // Fallback entries data
    const getFallbackEntries = (): PrizeData[] => {
        return [
            {
                id: 1,
                coinAmount: 50000,
                spinAmount: 2,
                cost: 2,
                image:
                    'https://uploadthingy.s3.us-west-1.amazonaws.com/5sNDV16zKDrZv4WE8wxPR4/prizez-coins-1.png',
                originalId: '4793be8f-fea0-4541-b06e-328581b1ecf2',
            },
            {
                id: 2,
                coinAmount: 300000,
                spinAmount: 5,
                cost: 5,
                image:
                    'https://uploadthingy.s3.us-west-1.amazonaws.com/xhwr6vr8mJJCTeAgmtWgrD/prizez-coins-2.png',
                originalId: '645c1125-6fd1-4e89-9acd-00b78899ad40',
            },
            {
                id: 3,
                coinAmount: 1500000,
                spinAmount: 16,
                cost: 15,
                image:
                    'https://uploadthingy.s3.us-west-1.amazonaws.com/6vJnKJ8AUVGEnXgBRiWAH9/prizez-coins-3.png',
                originalId: '68e25702-cbb4-4d86-919b-7855180c0ff1',
            },
            {
                id: 4,
                coinAmount: 8000000,
                spinAmount: 75,
                cost: 73,
                image:
                    'https://uploadthingy.s3.us-west-1.amazonaws.com/ofQaY3MrbupDhcPiD5MFSJ/prizez-coins-4.png',
                originalId: 'f1a9544f-a19a-43c6-b4af-ba2f45496c09',
            },
        ]
    }


    if (isMobile) {
        return (
            <div className="fixed inset-0 mb-16 flex flex-col bg-[#1F2937] text-white overscroll-none select-none">
                {/* Back */}
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
                <div>
                    <StatusBar isMobile={isMobile} hideOnlineCount />
                </div>

                {/* Title */}
                <div className="px-3 pt-1">
                    <h2 className="text-base font-medium text-center mb-1">
                        Select a prize to win !
                    </h2>
                    {error && (
                        <div className="bg-red-500 text-white p-2 rounded-md mb-2 text-center">
                            {error}
                        </div>
                    )}
                </div>

                {/* Scroll-free sheet with a fixed-size grid (2x2) */}
                <div className={`px-3 flex-1 min-h-0 ${S.sheetH} overflow-hidden`}>
                    <div className={`grid grid-cols-2 grid-rows-2 ${S.gridGap} h-full place-items-center`}>
                        {isLoading || isJoining ? (
                            <div className="text-center py-4 col-span-2">
                                {isLoading ? 'Loading prizes...' : 'Joining game...'}
                            </div>
                        ) : (
                            prizes.slice(0, 4).map((prize) => (
                                <PrizeCardMobile key={prize.id} prize={prize} onEnter={() => handleEnterGame(prize)} />
                            ))
                        )}
                    </div>
                </div>

                {/* Bottom Nav */}
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
                <StatusBar isMobile={isMobile} hideOnlineCount={true} />
            </div>
            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-start px-4 pt-2">
                <div className={'w-full max-w-5xl pl-7'}>
                    <h2 className="text-xl font-['DM_Sans'] font-medium text-left mb-2">
                        {selectedBalanceType === 'coin'
                            ? 'Select a prize to win!'
                            : 'Select a prize to win!'}
                    </h2>
                    {/* Error message */}
                    {error && (
                        <div className="bg-red-500 text-white p-2 rounded-md mb-3">
                            {error}
                        </div>
                    )}
                </div>
                {/* Prize Cards Row */}
                <div className="flex flex-wrap justify-center gap-4 w-full max-w-5xl mb-8">
                    {isLoading || isJoining ? (
                        <div className="text-center py-4 w-full">
                            {isLoading ? 'Loading prizes...' : 'Joining game...'}
                        </div>
                    ) : selectedBalanceType === 'coin' ? (
                        prizes.map((prize) => (
                            <PrizeCard
                                key={prize.id}
                                prize={prize}
                                isMobile={false}
                                onEnter={() => handleEnterGame(prize)}
                            />
                        ))
                    ) : (
                        entries.map((entry) => (
                            <PrizeCard
                                key={entry.id}
                                prize={entry}
                                isMobile={false}
                                onEnter={() => handleEnterGameEntries(entry)}
                            />
                        ))
                    )}
                </div>
            </div>
            {/* Bottom Navigation */}
            <BottomNavigation />
        </div>
    )
}
const S = {
    // sheet = the scroll-free area that holds the grid between StatusBar & BottomNav
    sheetH: 'h-[calc(100dvh-200px)]', // adjust 190–220px if your StatusBar/BottomNav differ
    gridGap: 'gap-[10px]',
    cardW: 'w-[min(44vw,160px)]',     // narrower than 170px
    img: 'w-14 h-14',                 // 56px
    title: 'text-[13px]',
    sub: 'text-[12px]',
    cost: 'text-[15px]',
    btn: 'text-[13px] py-2',
};

// Add this new component for mobile cards
function PrizeCardMobile({ prize, onEnter }: { prize: PrizeData; onEnter: () => void }) {
    const { selectedBalanceType } = useGlobalContext()
    return (
        <div className={`bg-white rounded-xl overflow-hidden flex flex-col ${S.cardW} text-black`}>
            <div className="p-3 flex flex-col items-center">
                <img src={prize.image} alt={`${prize.coinAmount} Coins`} className={`${S.img} object-contain mb-1.5`} />

                <p className={`text-center font-medium ${S.title}`}>GC {prize.coinAmount.toLocaleString()}</p>
                <p className={`text-center ${S.sub} mb-0.5`}>+</p>
                <p className={`text-center ${S.title} mb-1.5`}>{prize.spinAmount} x Flip</p>

                <div className="flex items-center justify-center mb-2">
                    <img
                        src={
                            selectedBalanceType === 'coin'
                                ? 'https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png'
                                : 'https://uploadthingy.s3.us-west-1.amazonaws.com/65WCbcmf6dyyeqvjSAJHyp/fire.png'
                        }
                        alt="Coins"
                        className={`${selectedBalanceType === 'ticket' && 'bg-[#0CC242]'} w-6 h-6 mr-1 rounded-full p-[2px]`}
                    />
                    <span className="text-[#170F49] font-semibold">{prize.cost.toLocaleString()}</span>
                </div>

                <button
                    className={`bg-[#56CA5A] hover:bg-green-600 text-white rounded-full w-full ${S.btn}`}
                    onClick={onEnter}
                >
                    Let's Go!
                </button>
            </div>
        </div>
    )
}
