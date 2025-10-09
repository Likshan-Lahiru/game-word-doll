import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGlobalContext } from '../context/GlobalContext'
import { StatusBar } from '../components/StatusBar'
import { apiRequest } from '../services/api'
export function BetSelectorPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const {
        setBetAmount,
        setWinAmount,
        isAuthenticated,
        coinBalance,
        setCoinBalance,
    } = useGlobalContext()
    let { limitPlay, setLimitPlay } = useGlobalContext()
    const [selectedBet, setSelectedBet] = useState<number>(1000)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    const [betOptions, setBetOptions] = useState([
        {
            id: '',
            title: '',
            cost: 200,
            earnAmount: 5000,
        },
        {
            id: '',
            title: '',
            cost: 1000,
            earnAmount: 10000,
        },
        {
            id: '',
            title: '',
            cost: 9000,
            earnAmount: 120000,
        },
    ])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [userId, setUserId] = useState<string>('')
    const [isJoining, setIsJoining] = useState(false)
    // Extract gameType from the URL state
    const { gameType } = location.state as {
        gameType: 'wordoll' | 'lockpickr'
    }
    useEffect(() => {
        const fetchBetOptions = async () => {
            try {
                setIsLoading(true)
                // Fetch bet options from API for both authenticated and guest users
                const data = await apiRequest(
                    '/gold-coin-game-modes',
                    'GET',
                    undefined,
                    false,
                )
                if (data && Array.isArray(data)) {
                    setBetOptions(data)
                    // Set default selected bet to the middle option if available
                    if (data.length > 0) {
                        const middleIndex = Math.floor(data.length / 2)
                        const middleOption = data[middleIndex]
                        setSelectedBet(middleOption.cost)
                        setBetAmount(middleOption.cost)
                        setWinAmount(middleOption.earnAmount)
                    }
                }
            } catch (err) {
                console.error('Failed to fetch select options:', err)
                setError('Failed to load select options')
            } finally {
                setIsLoading(false)
            }
        }
        // Fetch user ID if authenticated
        const fetchUserData = async () => {
            if (isAuthenticated) {
                const userId = localStorage.getItem('userId')
                setUserId(userId || '')
            }
        }
        fetchBetOptions()
        fetchUserData()
    }, [setBetAmount, setWinAmount, isAuthenticated])
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    const handleSelectBet = (bet: number, win: number) => {
        setSelectedBet(bet)
        setBetAmount(bet)
        setWinAmount(win)
    }
    const handlePlay = async () => {
        const option = betOptions.find((opt) => opt.cost === selectedBet)
        if (!option) {
            setError('Please select a valid option')
            return
        }
        // Check if user has enough coins for the selected bet
        if (coinBalance < option.cost) {
            setError(
                `Not enough coins. You need ${option.cost.toLocaleString()} coins to play.`,
            )
            return
        }
        setBetAmount(option.cost)
        setWinAmount(option.earnAmount)
        // Deduct the bet amount from user's coin balance
        setCoinBalance(coinBalance - option.cost)
        // Decrement limit play for unauthenticated users
        if (!isAuthenticated && gameType === 'wordoll' && limitPlay > 0) {
            setLimitPlay((prev) => prev - 1)
        }
        try {
            setIsJoining(true)
            if (isAuthenticated) {
                // For authenticated users, use the solo/join endpoint
                const joinGameData = {
                    userId: userId,
                    gameType: gameType === 'wordoll' ? 'WORDALL' : 'LOCKPICKER',
                    googleSessionId: 'google-session-id-abc123',
                    gameTimeLimit: 5,
                    goldCoinModeId: option.id,
                }
                console.log('Joining game with data (authenticated):', joinGameData)
                const response = await apiRequest('/solo/join', 'POST', joinGameData)
                console.log('Authenticated join response:', response)
                // Store the response in localStorage for later use in the game
                localStorage.setItem(
                    'authGameSession',
                    JSON.stringify({
                        sessionId: response.sessionId,
                        gameType: response.gameType,
                        wordOrNumberLength: response.wordOrNumberLength || 5,
                    }),
                )
            } else {
                // For non-authenticated users, use the guess/join endpoint
                const guestJoinData = {
                    googleSessionId: 'G1234',
                    goldCoinModeId: option.id,
                    gameType: gameType === 'wordoll' ? 'WORDALL' : 'LOCKPICKER',
                }
                console.log('Joining game with data (guest):', guestJoinData)
                const response = await apiRequest(
                    '/guess/join',
                    'POST',
                    guestJoinData,
                    false,
                )
                console.log('Guest join response:', response)
                // Store the response in localStorage for later use in the game
                localStorage.setItem(
                    'guestGameSession',
                    JSON.stringify({
                        googleSessionId: 'G1234',
                        gameType: gameType === 'wordoll' ? 'WORDALL' : 'LOCKPICKER',
                        wordOrNumberLength: response.wordOrNumberLength || 5,
                    }),
                )
            }
            // Navigate to the appropriate game page after successful join
            if (gameType === 'wordoll') {
                navigate('/wordoll')
            } else {
                navigate('/lockpickr')
            }
        } catch (err) {
            console.error('Failed to join game:', err)
            setError('Failed to start game. Please try again.')
            // Restore the coin balance if the API call fails
            setCoinBalance(coinBalance)
            setIsJoining(false)
        }
    }

    // Lock body scroll only on mobile
    useEffect(() => {
        if (!isMobile) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, [isMobile]);

// Mobile sizing tokens
    const S = {
        winW: 'w-full max-w-[170px]',          // ~300px cap
        railW:   'w-[min(92vw,360px)]',
        pill:    'w-[clamp(5.2rem,24vw,6.25rem)] h-[clamp(2.2rem,8vw,2.6rem)]',
        title:   'text-[clamp(1.25rem,5vw,1.5rem)]',
        winPad:  'px-[clamp(1rem,4vw,1.25rem)] py-[clamp(02rem,3.5vw,1rem)]',
        playBtn: 'px-[clamp(4rem,16vw,3.5rem)] py-[clamp(0.6rem,3vw,0.85rem)] text-[clamp(1rem,4.2vw,1.25rem)]',
    };

    if (isMobile) {
        return (
            <div
                className="fixed inset-0 flex flex-col bg-[#1F2937] text-white overscroll-none touch-pan-y select-none overflow-hidden"
            >
                {/* Stable viewport + iOS safe area */}
                <div className="flex flex-col h-dvh min-h-dvh pb-[env(safe-area-inset-bottom)]">
                    {/* Back + Status */}
                    <div className="relative">
                        <button
                            className="absolute top-12 left-4 z-10 w-12 h-12 rounded-full flex items-center justify-center"
                            onClick={() => navigate('/')}
                        >
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/5dZY2vpVSVwYT3dUEHNYN5/back-icons.png"
                                alt="Back"
                                className="w-8 h-8"
                            />
                        </button>
                        <StatusBar isMobile hideOnlineCount />
                    </div>

                    {/* Content rail */}
                    <div className="flex-1 mt-10 min-h-0 flex items-start justify-center">
                        <div className={`${S.railW} mx-auto px-3 pt-2`}>
                            {/* Bet options */}
                            <div className="flex justify-center gap-3 mb-8">
                                {isLoading ? (
                                    <div className="text-center py-2">Loading...</div>
                                ) : error ? (
                                    <div className="text-red-500 text-center py-2">{error}</div>
                                ) : (
                                    betOptions.map((option) => (
                                        <div key={option.id} className="flex flex-col items-center">
                                            <div
                                                className={`cursor-pointer  rounded-xl bg-[#374151] ${S.pill} flex items-center justify-center relative`}
                                                onClick={() => handleSelectBet(option.cost, option.earnAmount)}
                                            >
                                                <img
                                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/2XiBYwBWgNJxytH6Z2jPWP/point.png"
                                                    alt="Gold Coins"
                                                    className="w-4 h-4 mr-1.5"
                                                />
                                                <span className="text-white font-semibold font-[Inter]">
                                                         {option.cost.toLocaleString()}
                                                </span>
                                                {selectedBet === option.cost && (
                                                    <div className="absolute -bottom-2 left-2 right-2 h-[3px] bg-white rounded-full" />
                                                )}
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Card */}
                            <div className="bg-[#374151] rounded-2xl p-4">
                                <h2 className={`text-white font-bold text-center mb-6 font-[Inter] ${S.title}`}>
                                    {gameType === 'wordoll' ? 'Wordoll' : 'Lock Pickr'}
                                </h2>

                                {/* Win box */}
                                <div
                                    className={`bg-[#1F2937] rounded-xl ${S.winPad} mb-4 ${S.winW} mx-auto`}
                                >
                                    <p className="text-white text-lg font-semibold text-center font-[Inter] mb-3">Win</p>
                                    <div className="flex items-center justify-center">
                                        <img
                                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/2XiBYwBWgNJxytH6Z2jPWP/point.png"
                                            alt="Gold Coins"
                                            className="w-5 h-5 mr-2.5"
                                        />
                                        <span className="text-white text-xl font-bold font-[Inter]">
                                             {betOptions.find((opt) => opt.cost === selectedBet)?.earnAmount.toLocaleString() || '10,000'}
                                         </span>
                                    </div>
                                </div>


                                {/* Play */}
                                <div className="flex justify-center mt-6">
                                    <button
                                        className={`${coinBalance < selectedBet ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#3B82F6] hover:bg-blue-600'} text-white rounded-xl font-semibold font-[Inter] ${S.playBtn}`}
                                        onClick={handlePlay}
                                        disabled={
                                            (!isAuthenticated && limitPlay === 0) ||
                                            isLoading ||
                                            isJoining ||
                                            coinBalance < selectedBet
                                        }
                                    >
                                        {isLoading
                                            ? 'Loading...'
                                            : isJoining
                                                ? 'Starting...'
                                                : coinBalance < selectedBet
                                                    ? 'Not Enough Coins'
                                                    : 'Play'}
                                    </button>
                                </div>

                                {/* Error */}
                                {error && <div className="mt-3 text-red-500 text-sm text-center">{error}</div>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white">
            {/* Back button */}
            <div className="absolute top-4 left-4 z-10">
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
            <div className="ml-[15px]">
                <StatusBar isMobile={isMobile} hideOnlineCount={true} />
            </div>
            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-center p-2 mb-48">
                <div className="w-full max-w-md">
                    {/* Bet Options */}
                    <div className="flex justify-center space-x-4 mb-4 relative ">
                        {isLoading ? (
                            <div className="text-center py-4">Loading...</div>
                        ) : error ? (
                            <div className="text-red-500 text-center py-4">{error}</div>
                        ) : (
                            betOptions.map((option, index) => (
                                <div key={option.id} className="flex flex-col items-center">
                                    <div
                                        className={`cursor-pointer p-4 rounded-2xl bg-[#374151] w-32 h-12 flex items-center justify-center mt-6 relative`}
                                        onClick={() =>
                                            handleSelectBet(option.cost, option.earnAmount)
                                        }
                                    >
                                        <img
                                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/2XiBYwBWgNJxytH6Z2jPWP/point.png"
                                            alt="Gold Coins"
                                            className="w-5 h-5 ml-2"
                                        />
                                        <span className="text-white text-lg font-bold text-center w-full m-1 font-[Inter]">
                      {option.cost.toLocaleString()}
                    </span>
                                        {/* Underline for selected option */}
                                        {selectedBet === option.cost && (
                                            <div className="absolute -bottom-3 ml-4 mr-4 left-0 right-0 h-1 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    {/* Game Title */}
                    <div className="bg-[#374151] rounded-xl p-6 mb-5 flex flex-col items-center justify-center text-center">
                        <h2 className="text-white text-2xl font-bold text-center mb-8 font-[Inter]">
                            {gameType === 'wordoll' ? 'Wordoll' : 'Lock Pickr'}
                        </h2>
                        {/* Win Amount */}
                        <div className="bg-[#1F2937] rounded-xl pb-2 px-10 mb-2">
                            <p className="text-white text-2xl font-semibold mt-2 mb-4 text-center font-[Inter]">
                                Win
                            </p>
                            <div className="flex items-center justify-center">
                                <img
                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/2XiBYwBWgNJxytH6Z2jPWP/point.png"
                                    alt="Gold Coins"
                                    className="w-6 h-6 mr-2"
                                />
                                <span className="text-white text-2xl font-bold font-[Inter]">
                  {betOptions
                      .find((opt) => opt.cost === selectedBet)
                      ?.earnAmount.toLocaleString() || '10,000'}
                </span>
                            </div>
                        </div>


                        {/* Play Button */}
                        <div className="flex justify-center mt-14">
                            <button
                                className={`${coinBalance < selectedBet ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#3B82F6] hover:bg-blue-600'} text-white py-3 px-16 rounded-xl font-semibold text-2xl font-[Inter] w-full`}
                                onClick={handlePlay}
                                disabled={isLoading || isJoining || coinBalance < selectedBet}
                            >
                                {isLoading
                                    ? 'Loading...'
                                    : isJoining
                                        ? 'Starting...'
                                        : coinBalance < selectedBet
                                            ? 'Not Enough Coins'
                                            : 'Play'}
                            </button>
                        </div>
                        {/* Error message */}
                        {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
                    </div>
                </div>
            </div>
        </div>
    )
}
//in giveaway-entry page after
