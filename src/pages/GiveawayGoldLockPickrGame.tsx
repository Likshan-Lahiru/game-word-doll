import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CountdownModal } from '../components/CountdownModal'
import { WinModal } from '../components/GameModals/WinModal'
import { LoseModal } from '../components/GameModals/LoseModal'
import { NoAttemptsModal } from '../components/GameModals/NoAttemptsModal'
import { AuthenticatedWinModal } from '../components/GameModals/AuthenticatedWinModal'
import { AuthenticatedLoseModal } from '../components/GameModals/AuthenticatedLoseModal'
import { AuthenticatedNoAttemptsModal } from '../components/GameModals/AuthenticatedNoAttemptsModal'
import { ClaimEntryModal } from '../components/GameModals/ClaimEntryModal'
import { WinPackageModal } from '../components/GameModals/WinPackageModal'
import { useGlobalContext } from '../context/GlobalContext'
import { apiRequest, checkLastWinTime } from '../services/api'
import { CooldownModal } from '../components/GameModals/CooldownModal'
import { WinPackageGoldCoinModal } from '../components/GameModals/WinPackageGoldFlipModal.tsx'
export function GiveawayGoldLockPickrGame() {
    const navigate = useNavigate()
    const globalContext = useGlobalContext()
    const { betAmount, winAmount, isAuthenticated, addCoins } = globalContext
    const [targetCode, setTargetCode] = useState<number[]>([]) // Keep for UI feedback only
    const [codeLength, setCodeLength] = useState(5)
    const [currentAttempt, setCurrentAttempt] = useState<(number | undefined)[]>(
        [],
    )
    const [lastAttempt, setLastAttempt] = useState<number[]>([])
    const [timer, setTimer] = useState(900) // 15 minutes (900 seconds)
    const [feedback, setFeedback] = useState<string>('')
    const [isInputFocused, setIsInputFocused] = useState(false)
    const gameContainerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [showCountdown, setShowCountdown] = useState(true)
    const [gameStarted, setGameStarted] = useState(false)
    const [idleTime, setIdleTime] = useState(0)
    const lastActivityRef = useRef(Date.now())
    const [showWinModal, setShowWinModal] = useState(false)
    const [showWinPackageModal, setShowWinPackageModal] = useState(false)
    const [showLoseModal, setShowLoseModal] = useState(false)
    const [showNoAttemptsModal, setShowNoAttemptsModal] = useState(false)
    const [showClaimEntryModal, setShowClaimEntryModal] = useState(false)
    const [lockedPositions, setLockedPositions] = useState<boolean[]>([])
    const [guestGameSession, setGuestGameSession] = useState<any>(null)
    const [showCooldownModal, setShowCooldownModal] = useState(false)
    const [cooldownTimeRemaining, setCooldownTimeRemaining] = useState('')
    const [lastAttemptStatuses, setLastAttemptStatuses] = useState<
        ('correct' | 'wrong-position' | 'incorrect')[]
    >([])
    const [selectedPrize, setSelectedPrize] = useState<any>(null)
    // Initialize the game
    useEffect(() => {
        // Load selected prize from session storage
        const prizeSaved = sessionStorage.getItem('selectedPrize')
        if (prizeSaved) {
            try {
                const prize = JSON.parse(prizeSaved)
                setSelectedPrize(prize)
            } catch (e) {
                console.error('Error parsing selected prize:', e)
            }
        }
        // Check if authenticated user is on cooldown
        const checkCooldown = async () => {
            if (isAuthenticated) {
                try {
                    const userId = localStorage.getItem('userId')
                    if (userId) {
                        const result = await checkLastWinTime(userId, 'LOCKPICKER')
                        // If there's a cooldown time remaining
                        if (result.cooldownRemaining && result.cooldownRemaining > 0) {
                            // Format the cooldown time (assuming it's in seconds)
                            const minutes = Math.floor(result.cooldownRemaining / 60)
                            const seconds = result.cooldownRemaining % 60
                            setCooldownTimeRemaining(
                                `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
                            )
                            setShowCooldownModal(true)
                        }
                    }
                } catch (error) {
                    console.error('Error checking game cooldown:', error)
                    // Continue with the game if there's an error checking cooldown
                }
            }
        }
        checkCooldown()
        // Check for authenticated game session data
        const authSessionData = localStorage.getItem('authGameSession')
        // Check for guest game session data
        const guestSessionData = localStorage.getItem('guestGameSession')
        if (authSessionData && isAuthenticated) {
            try {
                const parsedSession = JSON.parse(authSessionData)
                // Set code length based on session data
                const length = parsedSession.wordOrNumberLength || 5
                setCodeLength(length)
                // Initialize current attempt and locked positions with the correct length
                setCurrentAttempt(Array(length).fill(undefined))
                setLockedPositions(Array(length).fill(false))
                // If there's a target code in the session, use it for UI feedback
                if (parsedSession.targetCode) {
                    setTargetCode(parsedSession.targetCode)
                } else {
                    // Placeholder for UI feedback
                    setTargetCode(Array(length).fill(0))
                }
            } catch (e) {
                console.error('Error parsing auth session data:', e)
                // Default to 5 if there's an error
                setCodeLength(5)
                setCurrentAttempt(Array(5).fill(undefined))
                setLockedPositions(Array(5).fill(false))
                setTargetCode(Array(5).fill(0)) // Placeholder
            }
        } else if (guestSessionData && !isAuthenticated) {
            try {
                const parsedSession = JSON.parse(guestSessionData)
                setGuestGameSession(parsedSession)
                // Set code length based on session data
                const length = parsedSession.wordOrNumberLength || 5
                setCodeLength(length)
                // Initialize current attempt and locked positions with the correct length
                setCurrentAttempt(Array(length).fill(undefined))
                setLockedPositions(Array(length).fill(false))
                // If there's a target code in the session, use it for UI feedback
                if (parsedSession.targetCode) {
                    setTargetCode(parsedSession.targetCode)
                } else {
                    // Placeholder for UI feedback
                    setTargetCode(Array(length).fill(0))
                }
            } catch (e) {
                console.error('Error parsing guest session data:', e)
                // Default to 5 if there's an error
                setCodeLength(5)
                setCurrentAttempt(Array(5).fill(undefined))
                setLockedPositions(Array(5).fill(false))
                setTargetCode(Array(5).fill(0)) // Placeholder
            }
        } else {
            // Default to 5 for if no session data
            setCodeLength(5)
            setCurrentAttempt(Array(5).fill(undefined))
            setLockedPositions(Array(5).fill(false))
            setTargetCode(Array(5).fill(0)) // Placeholder
        }
        // Auto-focus the input when the component mounts
        if (inputRef.current) {
            inputRef.current.focus()
            setIsInputFocused(true)
        }
        // Prevent scrolling
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = ''
        }
    }, [isAuthenticated])
    // Handle win and purchase the gold flip package
    const handleWin = async () => {
        try {
            const userId = localStorage.getItem('userId')
            // Get prize data from session storage
            const prizeSaved = sessionStorage.getItem('selectedPrize')
            let prizeData = null
            if (prizeSaved) {
                try {
                    prizeData = JSON.parse(prizeSaved)
                } catch (e) {
                    console.error('Error parsing selected prize:', e)
                }
            }
            console.log('User ID:', userId, 'Prize data:', prizeData)
            if (userId && prizeData && prizeData.originalId) {
                // Call the gold-flip API to buy the gold coin package
                console.log(
                    `Purchasing gold flip package: /gold-flip/${userId}/buy-gold-coin-flip-package/${prizeData.originalId}`,
                )
                await apiRequest(
                    `/gold-flip/${userId}/buy-gold-coin-flip-package/${prizeData.originalId}`,
                    'POST',
                )
                console.log(
                    'Successfully purchased gold flip package:',
                    prizeData.originalId,
                )
            } else {
                console.error(
                    'Missing data for purchasing gold flip package:',
                    'userId:',
                    userId,
                    'prizeData:',
                    prizeData,
                    'originalId:',
                    prizeData?.originalId,
                )
            }
        } catch (error) {
            console.error('Error purchasing gold flip package:', error)
        }
    }
    // Define checkGuess before any useEffect that depends on it
    const checkGuess = useCallback(async () => {
        // Check if we have a complete attempt (all positions filled)
        const hasEmptyPositions = currentAttempt.some((num) => num === undefined)
        if (hasEmptyPositions) {
            setFeedback('Invalid Number')
            return
        }
        // Store current attempt as the last attempt
        const guessArray = currentAttempt.map((n) => (n !== undefined ? n : 0))
        setLastAttempt(guessArray)
        // Convert number array to string
        const guess = guessArray.join('')
        // Get userId from localStorage
        const userId = localStorage.getItem('userId')
        if (!userId) {
            console.error('User ID not found')
            return
        }
        try {
            // Use the giveaway/last-win-check endpoint for gold coins
            const checkWinData = {
                userId: userId,
                wordOrNumber: guess,
                gameType: 'LOCKPICKER',
                isGoldCoin: true, // Flag to indicate this is a gold coin game
            }
            const response = await apiRequest(
                '/giveaway/last-win-check',
                'POST',
                checkWinData,
            )
            console.log('Gold giveaway win check response:', response)
            if (response.win) {
                // User won - call the handleWin function and show win modal
                await handleWin()
                // Show the win package modal with prize details
                setShowWinPackageModal(true)
            } else {
                // User didn't win - update UI based on API feedback
                updateUIFromApiResponse(response, guessArray)
                // Focus the input for next attempt
                if (inputRef.current) {
                    inputRef.current.focus()
                }
            }
        } catch (error) {
            console.error('Error checking win status:', error)
            // Fallback handling
            setLastAttemptStatuses(Array(currentAttempt.length).fill('incorrect'))
        }
    }, [currentAttempt, selectedPrize])
    // Helper function to update UI based on API response
    const updateUIFromApiResponse = (response: any, attempt: number[]) => {
        // Create a status array for the last attempt
        const statuses: ('correct' | 'wrong-position' | 'incorrect')[] = Array(
            attempt.length,
        ).fill('incorrect')
        // Mark correct positions
        if (response.correctPositions && Array.isArray(response.correctPositions)) {
            response.correctPositions.forEach((index: number) => {
                statuses[index - 1] = 'correct'
            })
        }
        // Mark correct but wrong positions
        if (
            response.correctButWrongPosition &&
            Array.isArray(response.correctButWrongPosition)
        ) {
            response.correctButWrongPosition.forEach((index: number) => {
                statuses[index - 1] = 'wrong-position'
            })
        }
        // Show feedback message when number is incorrect
        setFeedback('Invalid Number')
        // Clear feedback after 2 seconds
        setTimeout(() => {
            setFeedback('')
        }, 2000)
        // Update the last attempt statuses for rendering
        setLastAttemptStatuses(statuses)
        // Update locked positions and clear incorrect positions in current attempt
        const newLocks = [...lockedPositions]
        const newAttempt = [...currentAttempt]
        statuses.forEach((status, index) => {
            if (status === 'correct') {
                newLocks[index] = true
                // Keep the correct number in the new attempt
                newAttempt[index] = attempt[index]
            } else {
                // Clear incorrect positions
                newAttempt[index] = undefined
            }
        })
        setLockedPositions(newLocks)
        setCurrentAttempt(newAttempt)
    }
    // Focus input when game starts
    useEffect(() => {
        if (gameStarted && !showCountdown && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus()
            }, 300)
        }
    }, [gameStarted, showCountdown])
    // Reset idle timer on user activity
    useEffect(() => {
        const resetIdleTimer = () => {
            lastActivityRef.current = Date.now()
            setIdleTime(0)
        }
        // Listen for user activity events
        window.addEventListener('keydown', resetIdleTimer)
        window.addEventListener('mousedown', resetIdleTimer)
        window.addEventListener('touchstart', resetIdleTimer)
        return () => {
            window.removeEventListener('keydown', resetIdleTimer)
            window.removeEventListener('mousedown', resetIdleTimer)
            window.removeEventListener('touchstart', resetIdleTimer)
        }
    }, [])
    // Auto-timeout feature - check idle time and decrease timer
    useEffect(() => {
        if (!gameStarted) return
        const idleInterval = setInterval(() => {
            const now = Date.now()
            const idleSeconds = Math.floor((now - lastActivityRef.current) / 1000)
            // If idle for more than 10 seconds, start decreasing timer faster
            if (idleSeconds > 10) {
                setTimer((prevTimer) => Math.max(0, prevTimer - 2)) // Decrease by 2 seconds
                // If timer is very low, show lose modal
                if (timer <= 5) {
                    setShowClaimEntryModal(true)
                }
            }
        }, 1000)
        return () => clearInterval(idleInterval)
    }, [gameStarted, timer])
    // Keyboard input handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!gameStarted) return
            // Handle number input (0-9)
            if (/^[0-9]$/.test(e.key)) {
                const number = parseInt(e.key, 10)
                // Find the leftmost empty non-locked position
                let nextPos = -1
                for (let i = 0; i < codeLength; i++) {
                    if (!lockedPositions[i] && currentAttempt[i] === undefined) {
                        nextPos = i
                        break
                    }
                }
                if (nextPos !== -1) {
                    const newAttempt = [...currentAttempt]
                    newAttempt[nextPos] = number
                    setCurrentAttempt(newAttempt)
                }
            }
            // Handle backspace
            else if (e.key === 'Backspace') {
                // Find the rightmost filled non-locked position
                let lastFilled = -1
                for (let i = codeLength - 1; i >= 0; i--) {
                    if (!lockedPositions[i] && currentAttempt[i] !== undefined) {
                        lastFilled = i
                        break
                    }
                }
                if (lastFilled !== -1) {
                    const newAttempt = [...currentAttempt]
                    newAttempt[lastFilled] = undefined
                    setCurrentAttempt(newAttempt)
                }
            }
            // Handle enter key
            else if (e.key === 'Enter') {
                checkGuess()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [currentAttempt, gameStarted, lockedPositions, checkGuess, codeLength])
    // Timer countdown - only start after countdown completes
    useEffect(() => {
        if (!gameStarted) return
        if (timer <= 0) {
            setShowClaimEntryModal(true)
            return
        }
        const countdown = setInterval(() => {
            setTimer((prevTimer) => prevTimer - 1)
        }, 1000)
        return () => clearInterval(countdown)
    }, [timer, gameStarted])
    // Format time as MM:SS
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remainingSeconds = seconds % 60
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
    }
    // Handle input change for mobile keyboard
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Skip processing if the input is coming from the keyboard event listener
        // This prevents duplicate entries when typing on a physical keyboard
        if (e.nativeEvent.inputType === 'insertText') {
            const value = e.target.value.replace(/[^0-9]/g, '')
            if (value.length <= codeLength) {
                const newAttempt = [...currentAttempt]
                let valueIndex = 0
                // Fill in non-locked positions with input values
                for (let i = 0; i < codeLength && valueIndex < value.length; i++) {
                    if (!lockedPositions[i]) {
                        newAttempt[i] = parseInt(value[valueIndex], 10)
                        valueIndex++
                    }
                }
                setCurrentAttempt(newAttempt)
            }
        }
    }
    // Handle countdown completion
    const handleCountdownComplete = () => {
        setShowCountdown(false)
        setGameStarted(true)
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }
    // Get number status (correct, wrong position, incorrect)
    const getNumberStatus = (num: number, index: number) => {
        if (lastAttemptStatuses[index]) {
            return lastAttemptStatuses[index]
        }
        // Fallback to default logic if API response is not available
        if (targetCode[index] === num) {
            return 'correct'
        }
        if (targetCode.includes(num)) {
            return 'wrong-position'
        }
        return 'incorrect'
    }
    // Handle key press
    const handleKeyPress = (key: string) => {
        if (key === 'ENTER') {
            checkGuess()
        } else if (key === 'Backspace') {
            // Find the rightmost filled non-locked position
            let lastFilled = -1
            for (let i = codeLength - 1; i >= 0; i--) {
                if (!lockedPositions[i] && currentAttempt[i] !== undefined) {
                    lastFilled = i
                    break
                }
            }
            if (lastFilled !== -1) {
                const newAttempt = [...currentAttempt]
                newAttempt[lastFilled] = undefined
                setCurrentAttempt(newAttempt)
            }
        } else if (/^[0-9]$/.test(key)) {
            const number = parseInt(key, 10)
            // Find the leftmost empty non-locked position
            let nextPos = -1
            for (let i = 0; i < codeLength; i++) {
                if (!lockedPositions[i] && currentAttempt[i] === undefined) {
                    nextPos = i
                    break
                }
            }
            if (nextPos !== -1) {
                const newAttempt = [...currentAttempt]
                newAttempt[nextPos] = number
                setCurrentAttempt(newAttempt)
            }
        }
    }
    return (
        <div
            className="flex flex-col w-full h-screen max-h-screen bg-[#1F2937] text-white overflow-hidden"
            ref={gameContainerRef}
            tabIndex={0}
        >
            <div className="relative flex flex-col h-full">
                {/* Back button */}
                <div className="absolute top-4 left-4 z-10">
                    <button
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        onClick={() => navigate('/gold-giveaway-game')}
                    >
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/5dZY2vpVSVwYT3dUEHNYN5/back-icons.png"
                            alt="Back"
                            className="w-8 h-8"
                        />
                    </button>
                </div>
                {/* Gold coin indicator */}

                {/* Timer */}
                <div className="flex-none text-center pt-16 pb-4">
                    <p className="text-xs">Timer</p>
                    <p className="text-2xl font-bold">{formatTime(timer)}</p>
                </div>
                {/* Feedback message */}
                {feedback && (
                    <div className="bg-[#374151] text-center py-2 px-4 rounded-lg mb-4 mx-auto max-w-md">
                        <p className="text-white text-lg">{feedback}</p>
                    </div>
                )}
                <div className="flex-1 flex flex-col justify-center items-center overflow-hidden px-4">
                    {/* Hidden input for keyboard */}
                    <input
                        ref={inputRef}
                        type="tel"
                        inputMode="none"
                        pattern="[0-9]*"
                        value={currentAttempt.filter((n) => n !== undefined).join('')}
                        onChange={handleInputChange}
                        className="opacity-0 h-0 w-0 absolute"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        readOnly
                    />
                    {/* Last attempt display */}
                    <div className="flex justify-center mb-4">
                        <div
                            className="grid grid-cols-1 gap-2"
                            style={{
                                gridTemplateColumns: `repeat(${codeLength}, minmax(0, 1fr))`,
                            }}
                        >
                            {(lastAttempt.length > 0
                                    ? lastAttempt
                                    : Array(codeLength).fill('')
                            ).map((num, index) => {
                                const status =
                                    lastAttempt.length > 0
                                        ? getNumberStatus(num as number, index)
                                        : null
                                let bgColor = 'bg-[#374151]'
                                if (status === 'correct') {
                                    bgColor = 'bg-[#22C55E]'
                                } else if (status === 'wrong-position') {
                                    bgColor = 'bg-[#C5BD22]'
                                }
                                return (
                                    <div
                                        key={index}
                                        className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center ${bgColor} rounded-md text-white font-bold text-lg md:text-xl shadow-md`}
                                    >
                                        {typeof num === 'number' ? num : ''}
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    {/* Current attempt */}
                    <div
                        className="flex justify-center mb-6"
                        onClick={() => inputRef.current?.focus()}
                    >
                        <div
                            className="grid grid-cols-1 gap-2"
                            style={{
                                gridTemplateColumns: `repeat(${codeLength}, minmax(0, 1fr))`,
                            }}
                        >
                            {Array.from({
                                length: codeLength,
                            }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center ${lockedPositions[index] ? 'bg-[#22C55E]' : 'bg-[#374151]'} rounded-md text-white font-bold text-2xl md:text-3xl shadow-md`}
                                >
                                    {currentAttempt[index] !== undefined
                                        ? currentAttempt[index]
                                        : ''}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Number pad - Responsive for all screen sizes */}
                <div className="flex-none mb-36 pb-6">
                    <div className="w-full max-w-md mx-auto px-2">
                        {/* Row 1: 1-2-3 */}
                        <div className="flex justify-center gap-2 mb-2">
                            {[1, 2, 3].map((num) => (
                                <button
                                    key={num}
                                    className="w-[30%] h-[50px] md:h-[65px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white text-2xl md:text-3xl font-bold shadow-md"
                                    onClick={() => handleKeyPress(num.toString())}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        {/* Row 2: 4-5-6 */}
                        <div className="flex justify-center gap-2 mb-2">
                            {[4, 5, 6].map((num) => (
                                <button
                                    key={num}
                                    className="w-[30%] h-[50px] md:h-[65px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white text-2xl md:text-3xl font-bold shadow-md"
                                    onClick={() => handleKeyPress(num.toString())}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        {/* Row 3: 7-8-9 */}
                        <div className="flex justify-center gap-2 mb-2">
                            {[7, 8, 9].map((num) => (
                                <button
                                    key={num}
                                    className="w-[30%] h-[50px] md:h-[65px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white text-2xl md:text-3xl font-bold shadow-md"
                                    onClick={() => handleKeyPress(num.toString())}
                                >
                                    {num}
                                </button>
                            ))}
                        </div>
                        {/* Row 4: ENTER-0-Backspace */}
                        <div className="flex justify-center gap-2">
                            <button
                                className="w-[30%] h-[50px] md:h-[65px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white text-sm md:text-lg font-bold shadow-md"
                                onClick={() => handleKeyPress('ENTER')}
                            >
                                ENTER
                            </button>
                            <button
                                className="w-[30%] h-[50px] md:h-[65px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white text-2xl md:text-3xl font-bold shadow-md"
                                onClick={() => handleKeyPress('0')}
                            >
                                0
                            </button>
                            <button
                                className="w-[30%] h-[50px] md:h-[65px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white flex items-center justify-center shadow-md"
                                onClick={() => handleKeyPress('Backspace')}
                            >
                                <img
                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/cLoKd9Bc19xZnDL1tiCB5A/backspace.png"
                                    alt="Backspace"
                                    className="h-6 w-6 md:h-8 md:w-8"
                                />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Countdown Modal */}
            <CountdownModal
                isOpen={showCountdown}
                onCountdownComplete={handleCountdownComplete}
            />
            {/* Cooldown Modal */}
            <CooldownModal
                isOpen={showCooldownModal}
                onClose={() => setShowCooldownModal(false)}
                remainingTime={cooldownTimeRemaining}
                gameType="Gold Lock Pickr"
            />
            {/* Claim Entry Modal */}
            <ClaimEntryModal
                isOpen={showClaimEntryModal}
                onClose={() => setShowClaimEntryModal(false)}
                entryCost={selectedPrize?.cost || 5}
            />
            {/* Win Package Modal - Show this when user wins */}
            <WinPackageGoldCoinModal
                isOpen={showWinPackageModal}
                onClose={() => {
                    setShowWinPackageModal(false)
                    navigate('/giveaway-entry')
                }}
                prize={{
                    coinAmount: selectedPrize?.coinAmount || 300000,
                    spinAmount: selectedPrize?.spinAmount || 5,
                }}
            />
            {/* Show modals based on authentication status */}
            {!isAuthenticated ? (
                <>
                    <WinModal
                        isOpen={showWinModal}
                        onClose={() => setShowWinModal(false)}
                        reward={winAmount}
                        gameType="lockpickr"
                    />
                    <LoseModal
                        isOpen={showLoseModal}
                        onClose={() => setShowLoseModal(false)}
                        penalty={betAmount}
                        gameType="lockpickr"
                    />
                    <NoAttemptsModal
                        isOpen={showNoAttemptsModal}
                        onClose={() => setShowNoAttemptsModal(false)}
                        penalty={betAmount}
                    />
                </>
            ) : (
                <>
                    <AuthenticatedWinModal
                        isOpen={showWinModal}
                        onClose={() => setShowWinModal(false)}
                        reward={winAmount}
                    />
                    <AuthenticatedLoseModal
                        isOpen={showLoseModal}
                        onClose={() => setShowLoseModal(false)}
                        penalty={betAmount}
                    />
                    <AuthenticatedNoAttemptsModal
                        isOpen={showNoAttemptsModal}
                        onClose={() => setShowNoAttemptsModal(false)}
                        penalty={betAmount}
                    />
                </>
            )}
        </div>
    )
}
