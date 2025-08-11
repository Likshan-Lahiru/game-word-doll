import React, { useCallback, useEffect, useState, Component } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGlobalContext } from '../context/GlobalContext'
import { StatusBar } from '../components/StatusBar'
import { TicketSelector } from '../components/TicketSelector'
import { apiRequest } from '../services/api'
export function GemGameModePage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { ticketBalance, gemBalance, addGems, setTicketBalance } =
        useGlobalContext()
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    const [gameStarted, setGameStarted] = useState(false)
    const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
    const [playersJoined, setPlayersJoined] = useState(0)
    const [gemPool, setGemPool] = useState(0)
    const [countdown, setCountdown] = useState(300) // Default value until API response
    const [selectedTicketAmount, setSelectedTicketAmount] = useState(1)
    const [ticketOptions, setTicketOptions] = useState([
        {
            value: 0.2,
            label: '0.20',
            id: '',
        },
        {
            value: 1,
            id: '',
        },
        {
            value: 9,
            id: '',
        },
    ])
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [groupSessionId, setGroupSessionId] = useState<string | null>(null)
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null)
    const [isLoadingCountdown, setIsLoadingCountdown] = useState(false)
    const [countdownActive, setCountdownActive] = useState(false)
    const [hasJoined, setHasJoined] = useState(false)
    const [isJoining, setIsJoining] = useState(false)
    const [isLeaving, setIsLeaving] = useState(false)
    const [showNavigationWarning, setShowNavigationWarning] = useState(false)
    // New state for word/number length
    const [wordOrNumberLength, setWordOrNumberLength] = useState(5) // Default to 5
    // Get game type from location state
    const { gameType } = (location.state as {
        gameType: string
    }) || {
        gameType: 'wordoll',
    }
    // Format game type for API
    const getFormattedGameType = () => {
        return gameType === 'wordoll' ? 'WORDALL' : 'LOCKPICKER'
    }
    // Prevent navigation if user has joined a session
    const handleBeforeUnload = useCallback(
        (e: BeforeUnloadEvent) => {
            if (hasJoined) {
                const message =
                    "You have joined a game session. If you leave now, you'll lose your ticket. Please cancel the game first if you want to leave."
                e.preventDefault()
                e.returnValue = message
                return message
            }
        },
        [hasJoined],
    )
    // Add beforeunload event listener to prevent refresh when joined
    useEffect(() => {
        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload)
        }
    }, [hasJoined, handleBeforeUnload])
    // Fetch room types from API
    useEffect(() => {
        const fetchRoomTypes = async () => {
            try {
                setIsLoading(true)
                const response = await apiRequest('/room-types', 'GET')
                if (response && Array.isArray(response)) {
                    const formattedOptions = response.map((room) => ({
                        value: room.costPerEntry,
                        label:
                            room.costPerEntry === 0.2 ? '0.20' : room.costPerEntry.toString(),
                        id: room.id,
                    }))
                    setTicketOptions(formattedOptions)
                    // Set default selected value to the first option
                    if (formattedOptions.length > 0) {
                        setSelectedTicketAmount(formattedOptions[0].value)
                        setSelectedRoomId(formattedOptions[0].id)
                    }
                }
                setIsLoading(false)
            } catch (err) {
                console.error('Error fetching room types:', err)
                setError('Failed to load ticket options')
                setIsLoading(false)
            }
        }
        fetchRoomTypes()
    }, [])
    // Fetch session data (player count and gem pool) separately
    const fetchSessionData = async () => {
        if (!selectedRoomId) return
        try {
            const formattedGameType = getFormattedGameType()
            // Fetch session data (player count and gem pool)
            const sessionEndpoint = `/user-group-session/latest-session-user-count?roomTypeId=${selectedRoomId}&gameType=${formattedGameType}`
            const sessionResponse = await apiRequest(sessionEndpoint, 'GET')
            if (sessionResponse) {
                setPlayersJoined(sessionResponse.userCount || 0)
                setGemPool(sessionResponse.gemPool || 0)
                setGroupSessionId(sessionResponse.groupSessionId || null)
            }
        } catch (err) {
            console.error('Error fetching session data:', err)
        }
    }
    // Fetch countdown time separately
    const fetchCountdownTime = async () => {
        if (!selectedRoomId) return
        try {
            setIsLoadingCountdown(true)
            setCountdownActive(false) // Stop any existing countdown
            const formattedGameType = getFormattedGameType()
            // Fetch countdown time
            const countdownEndpoint = `/group-session/latest-session-time-diff?roomTypeId=${selectedRoomId}&gameType=${formattedGameType}`
            const countdownResponse = await apiRequest(countdownEndpoint, 'GET')
            if (countdownResponse && countdownResponse.countdownSeconds) {
                const seconds = parseInt(countdownResponse.countdownSeconds, 10)
                if (!isNaN(seconds)) {
                    setCountdown(seconds)
                    setCountdownActive(true) // Start the countdown
                }
            }
            setIsLoadingCountdown(false)
        } catch (err) {
            console.error('Error fetching countdown time:', err)
            setIsLoadingCountdown(false)
        }
    }
    // Replace the old fetchGameData function with separate fetch functions
    // This function is kept for initial data load only
    const fetchInitialData = async () => {
        await fetchSessionData()
        await fetchCountdownTime()
    }
    // Set up different intervals for session data and countdown
    useEffect(() => {
        // Initial data fetch
        fetchInitialData()
        // Set up interval to fetch session data every 5 seconds
        const sessionDataIntervalId = setInterval(fetchSessionData, 5000)
        // Set up interval to fetch countdown time every 30 seconds
        const countdownIntervalId = setInterval(fetchCountdownTime, 30000)
        // Clean up intervals on unmount or when dependencies change
        return () => {
            clearInterval(sessionDataIntervalId)
            clearInterval(countdownIntervalId)
        }
    }, [selectedRoomId, gameType])
    // New function to fetch word or number info
    const fetchWordOrNumberInfo = async (sessionId: string) => {
        try {
            const endpoint = `/group-session/word-or-number-info/${sessionId}`
            const response = await apiRequest(endpoint, 'GET')
            if (response && response.length) {
                setWordOrNumberLength(response.length)
                return response.length
            }
            return 5 // Default length if not found
        } catch (err) {
            console.error('Error fetching word or number info:', err)
            return 5 // Default length on error
        }
    }
    // Fetch countdown time initially when room ID or game type changes
    /*
    useEffect(() => {
      fetchCountdownTime()
      // Set up interval to fetch countdown time every 3 seconds
      const countdownIntervalId = setInterval(fetchCountdownTime, 3000)
      // Clean up interval on unmount or when dependencies change
      return () => clearInterval(countdownIntervalId)
    }, [selectedRoomId, gameType])
    */
    // Active countdown timer
    useEffect(() => {
        // Only start countdown if it's active and not loading
        if (!countdownActive || isLoadingCountdown) return
        // Set up the interval to decrement the countdown every second
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    clearInterval(timer)
                    // When countdown reaches zero, navigate to game if user has joined
                    if (hasJoined && groupSessionId) {
                        handleCountdownComplete()
                    } else {
                        // Otherwise, fetch a new countdown time
                        fetchCountdownTime()
                    }
                    return 0
                }
                return prevCountdown - 1
            })
        }, 1000)
        // Clean up the interval when component unmounts or dependencies change
        return () => clearInterval(timer)
    }, [countdownActive, isLoadingCountdown, hasJoined, groupSessionId])
    // Handle countdown completion - fetch word/number info before navigating
    const handleCountdownComplete = async () => {
        if (!groupSessionId) return
        try {
            // Fetch word or number length before navigating
            const length = await fetchWordOrNumberInfo(groupSessionId)
            navigateToGame(length)
        } catch (error) {
            console.error('Error preparing game:', error)
            // Navigate with default length if there's an error
            navigateToGame(5)
        }
    }
    // Navigate to the appropriate game with the word/number length
    const navigateToGame = (length: number = 5) => {
        if (gameType === 'wordoll') {
            navigate('/gem-wordoll-game', {
                state: {
                    ticketAmount: selectedTicketAmount,
                    gemPool: gemPool,
                    roomId: selectedRoomId,
                    groupSessionId: groupSessionId,
                    wordLength: length, // Pass the dynamic length
                },
            })
        } else {
            navigate('/gem-lockpickr-game', {
                state: {
                    ticketAmount: selectedTicketAmount,
                    gemPool: gemPool,
                    roomId: selectedRoomId,
                    groupSessionId: groupSessionId,
                    numberLength: length, // Pass the dynamic length
                },
            })
        }
    }
    // Update selected room ID when ticket option changes
    useEffect(() => {
        const selectedOption = ticketOptions.find(
            (option) => option.value === selectedTicketAmount,
        )
        if (selectedOption) {
            setSelectedRoomId(selectedOption.id)
            // Reset join status when room changes
            setHasJoined(false)
        }
    }, [selectedTicketAmount, ticketOptions])
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    useEffect(() => {
        if (gameStarted) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [gameStarted])
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    // Prevent navigation when user has joined
    const handleNavigateBack = () => {
        if (hasJoined) {
            setShowNavigationWarning(true)
        } else {
            navigate('/')
        }
    }
    const handleJoinGame = async () => {
        if (ticketBalance < selectedTicketAmount) {
            alert('Not enough tickets to play!')
            navigate('/')
            return
        }
        try {
            setIsJoining(true)
            const userId = localStorage.getItem('userId')
            if (!userId) {
                setError('User ID not found. Please log in again.')
                setIsJoining(false)
                return
            }
            const formattedGameType = getFormattedGameType()
            const joinData = {
                userId: userId,
                roomType: selectedRoomId,
                gameType: formattedGameType,
            }
            const response = await apiRequest(
                '/user-group-session/join',
                'POST',
                joinData,
            )
            if (response) {
                setTicketBalance(ticketBalance - selectedTicketAmount)
                setGroupSessionId(response.groupSessionId)
                // Update gemPool with the value from the response
                setGemPool(response.gemPool)
                setHasJoined(true)
                // Refresh player count
                setPlayersJoined((prev) => prev + 1)
            }
        } catch (err) {
            console.error('Error joining game:', err)
            setError('Failed to join the game. Please try again.')
        } finally {
            setIsJoining(false)
        }
    }
    const handleLeaveGame = async () => {
        try {
            setIsLeaving(true)
            const userId = localStorage.getItem('userId')
            if (!userId || !groupSessionId) {
                setError('User ID or session ID not found.')
                setIsLeaving(false)
                return
            }
            const leaveEndpoint = `/user-group-session/leave?userId=${userId}&groupSessionId=${groupSessionId}`
            await apiRequest(leaveEndpoint, 'DELETE')
            // Reset join status
            setHasJoined(false)
            setShowNavigationWarning(false)
            // Refresh player count
            setPlayersJoined((prev) => Math.max(0, prev - 1))
            // Return the ticket to the user
            setTicketBalance(ticketBalance + selectedTicketAmount)
        } catch (err) {
            console.error('Error leaving game:', err)
            setError('Failed to leave the game. Please try again.')
        } finally {
            setIsLeaving(false)
        }
    }
    // Loading state
    if (isLoading) {
        return (
            <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white items-center justify-center">
                <p className="text-xl">Loading...</p>
            </div>
        )
    }
    // Error state
    if (error) {
        return (
            <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white items-center justify-center">
                <p className="text-xl text-red-500">{error}</p>
                <button
                    className="mt-4 bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg"
                    onClick={() => navigate('/')}
                >
                    Return Home
                </button>
            </div>
        )
    }
    if (isMobile) {
        return (
            <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white">
                {/* Back button */}
                <div className="absolute top-12 left-4 z-10">
                    <button
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        onClick={handleNavigateBack}
                    >
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/5dZY2vpVSVwYT3dUEHNYN5/back-icons.png"
                            alt="Back"
                            className="w-8 h-8"
                        />
                    </button>
                </div>
                {/* Status Bar */}
                <StatusBar isMobile={isMobile} hideOnlineCount={true} />
                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-start pt-5 px-4">
                    {/* Navigation Warning Modal */}
                    {showNavigationWarning && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                            <div className="bg-[#374151] rounded-xl p-6 m-4 max-w-sm">
                                <h3 className="text-xl font-bold mb-4 text-center">
                                    Cannot Leave Game
                                </h3>
                                <p className="mb-6 text-center">
                                    You have joined a game session. Please cancel the game first
                                    if you want to leave.
                                </p>
                                <div className="flex justify-center space-x-4">
                                    <button
                                        className="bg-[#FE5C5C] hover:bg-red-500 text-white font-semibold px-4 py-2 rounded-lg"
                                        onClick={handleLeaveGame}
                                        disabled={isLeaving}
                                    >
                                        {isLeaving ? 'Cancelling...' : 'Cancel Game'}
                                    </button>
                                    <button
                                        className="bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg"
                                        onClick={() => setShowNavigationWarning(false)}
                                    >
                                        Stay
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Ticket Selector Component */}
                    <TicketSelector
                        options={ticketOptions}
                        selectedValue={selectedTicketAmount}
                        onChange={setSelectedTicketAmount}
                        disabled={hasJoined}
                    />
                    {/* Main Game Card */}
                    <div className="w-full max-w-md bg-[#374151] rounded-2xl overflow-hidden mb-3">
                        <div className="p-6 text-center">
                            <h2 className="text-xl font-bold mb-6">
                                {gameType === 'wordoll' ? 'Wordoll' : 'Lock Pickr'}
                            </h2>
                            <div className="grid grid-cols-2 gap-2 mb-6">
                                <div className="bg-[#1F2937] p-2 rounded-2xl">
                                    <p className="text-sm mb-1 font-[Inter]">Players Joined</p>
                                    <p className="text-xl font-bold font-[Inter]">
                                        {playersJoined}
                                    </p>
                                </div>
                                <div className="bg-[#1F2937] p-2 rounded-2xl">
                                    <p className="text-sm mb-1 font-[Inter]">Gem Pool</p>
                                    <div className="flex items-center justify-center">
                                        <img
                                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                                            alt="Diamond"
                                            className="w-5 h-5 mr-2"
                                        />
                                        <p className="text-xl font-semibold font-[Inter]">
                                            {gemPool.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <p className="text-xs mb-1 font-[Inter]">Starts In:</p>
                                <p className="text-2xl font-bold font-[Inter]">
                                    {isLoadingCountdown ? 'Loading...' : formatTime(countdown)}
                                </p>
                            </div>
                            {hasJoined ? (
                                <button
                                    className="bg-[#FE5C5C] hover:bg-red-500 text-white font-semibold px-16 py-2 rounded-2xl text-lg font-[Inter]"
                                    onClick={handleLeaveGame}
                                    disabled={isLeaving}
                                >
                                    {isLeaving ? 'Cancelling...' : 'Cancel'}
                                </button>
                            ) : (
                                <button
                                    className="bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold px-16 py-2 rounded-2xl text-lg font-[Inter]"
                                    onClick={handleJoinGame}
                                    disabled={isJoining}
                                >
                                    {isJoining ? 'Entering...' : 'Enter'}
                                </button>
                            )}
                        </div>
                    </div>
                    {/* Legendary Card */}
                    <div className="w-full max-w-md bg-[#374151] rounded-xl p-4 text-center mb-3">
                        <h3 className="text-lg font-semibold mb-2 font-[Inter]">
                            THE LEGENDARY
                        </h3>
                        <div className="flex items-center justify-center">
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                                alt="Diamond"
                                className="w-5 h-5 mr-2"
                            />
                            <p className="text-xl font-semibold font-[Inter]">
                                {gemPool.toFixed(2)}
                            </p>
                        </div>
                    </div>
                    {/* Invite Card */}
                    <div className="w-full max-w-md bg-[#374151] rounded-xl p-2 text-center mb-20">
                        <h3 className="text-base font-semibold mt-2 mb-2 font-[Inter]">
                            Invite players to increase Gem Pool
                        </h3>
                        <div className="flex items-center justify-between">
                            <p className="text-lg ml-20 text-[#006CB9] font-[Inter]">
                                www.xyz.com
                            </p>
                            <button
                                className="bg-[#2D7FF0] hover:bg-blue-600 px-3 py-1 mr-20 rounded-full text-xs font-[Inter]">                                Copy
                            </button>
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
                    onClick={handleNavigateBack}
                >
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/5dZY2vpVSVwYT3dUEHNYN5/back-icons.png"
                        alt="Back"
                        className="w-8 h-8"
                    />
                </button>
            </div>
            {/* Navigation Warning Modal */}
            {showNavigationWarning && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="bg-[#374151] rounded-xl p-8 max-w-md">
                        <h3 className="text-2xl font-bold mb-4 text-center">
                            Cannot Leave Game
                        </h3>
                        <p className="mb-6 text-center">
                            You have joined a game session. Please cancel the game first if
                            you want to leave.
                        </p>
                        <div className="flex justify-center space-x-6">
                            <button
                                className="bg-[#FE5C5C] hover:bg-red-500 text-white font-semibold px-16 py-2 rounded-2xl text-lg font-[Inter]"
                                onClick={handleLeaveGame}
                                disabled={isLeaving}
                            >
                                {isLeaving ? 'Cancelling...' : 'Cancel Game'}
                            </button>
                            <button
                                className="bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg"
                                onClick={() => setShowNavigationWarning(false)}
                            >
                                Stay
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* Status Bar */}
            <div className="">
                <StatusBar isMobile={isMobile} hideOnlineCount={true} />
            </div>
            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center pt-0 px-4">
                {/* Ticket Selector Component */}
                <TicketSelector
                    options={ticketOptions}
                    selectedValue={selectedTicketAmount}
                    onChange={setSelectedTicketAmount}
                    disabled={hasJoined}
                />
                {/* Main Game Card */}
                <div className="w-full max-w-md bg-[#374151] rounded-2xl overflow-hidden mb-3">
                    <div className="p-2 text-center">
                        <h2 className="text-xl font-bold mb-2">
                            {gameType === 'wordoll' ? 'Wordoll' : 'Lock Pickr'}
                        </h2>
                        <div className="grid grid-cols-2 gap-2 mb-4 pr-5 pl-5">
                            <div className="bg-[#1F2937] p-2 rounded-2xl">
                                <p className=" mb-1 font-[Inter]">Players Joined</p>
                                <p className="text-xl font-bold font-[Inter]">
                                    {playersJoined}
                                </p>
                            </div>
                            <div className="bg-[#1F2937] p-2 rounded-2xl">
                                <p className=" mb-1 font-[Inter]">Gem Pool</p>
                                <div className="flex items-center justify-center">
                                    <img
                                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                                        alt="Diamond"
                                        className="w-5 h-5 mr-2"
                                    />
                                    <p className="text-xl font-semibold font-[Inter]">
                                        {gemPool.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mb-3">
                            <p className="text-xs mb-0 font-[Inter]">Starts In:</p>
                            <p className="text-2xl font-bold font-[Inter]">
                                {isLoadingCountdown ? 'Loading...' : formatTime(countdown)}
                            </p>
                        </div>
                        {hasJoined ? (
                            <button
                                className="bg-[#FE5C5C] hover:bg-red-500 text-white font-semibold px-16 py-2 rounded-2xl text-lg font-[Inter]"
                                onClick={handleLeaveGame}
                                disabled={isLeaving}
                            >
                                {isLeaving ? 'Cancelling...' : 'Cancel'}
                            </button>
                        ) : (
                            <button
                                className="bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold px-16 py-1 rounded-xl text-lg font-[Inter]"
                                onClick={handleJoinGame}
                                disabled={isJoining}
                            >
                                {isJoining ? 'Entering...' : 'Enter'}
                            </button>
                        )}
                    </div>
                </div>
                {/* Legendary Card */}
                <div className="w-full max-w-md bg-[#374151] rounded-xl p-2 text-center mb-3">
                    <h3 className="text-xl font-semibold mb-2 font-[Inter]">
                        THE LEGENDARY
                    </h3>
                    <div className="flex items-center justify-center">
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                            alt="Diamond"
                            className="w-5 h-5 mr-2"
                        />
                        <p className="text-xl font-semibold font-[Inter]">
                            {gemPool.toFixed(2)}
                        </p>
                    </div>
                </div>
                {/* Invite Card */}
                <div className="w-full max-w-md bg-[#374151] rounded-xl p-1 text-center mb-0">
                    <h3 className="text-lg font-semibold mt-2 mb-1 font-[Inter]">
                        Invite players to increase Gem Pool
                    </h3>
                    <div className="flex items-center lr justify-between">
                        <div className={"flex p-1 pl-3 w-full justify-start bg-white ml-20 mr-5 rounded-full"}>
                            <p className="text-sm text-left text-black opacity-70 font-[Inter]">
                                www.xyz.com
                            </p>
                        </div>
                        <button className="bg-[#2D7FF0] hover:bg-blue-600 px-3 py-1 mr-24 rounded-full text-xs font-[Inter]">
                            Copy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
