import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CountdownModal } from '../components/CountdownModal'
import { useGlobalContext } from '../context/GlobalContext'
import { TimeEndedGemModal } from '../components/GameModals/TimeEndedGemModal'
import { NoAttemptsGemModal } from '../components/GameModals/NoAttemptsGemModal'
import { UserWinGemModal } from '../components/GameModals/UserWinGemModal'
import { RoomHasWinnerModal } from '../components/GameModals/RoomHasWinnerModal'
import { apiRequest } from '../services/api'
export function GemLockPickrGame() {
    const navigate = useNavigate()
    const location = useLocation()
    const { addGems } = useGlobalContext()
    // Get ticket amount, gem pool, and number length from location state
    const {
        ticketAmount = 1,
        gemPool = 55.0,
        numberLength = 5,
        groupSessionId = null,
    } = (location.state as {
        ticketAmount: number
        gemPool: number
        numberLength: number
        groupSessionId: string | null
    }) || {}
    const [targetCode, setTargetCode] = useState<number[]>([])
    const [currentAttempt, setCurrentAttempt] = useState<(number | undefined)[]>(
        [],
    )
    const [lastAttempt, setLastAttempt] = useState<number[]>([])
    const [timer, setTimer] = useState(300) // 5 minutes in seconds
    const [feedback, setFeedback] = useState<string>('')
    const [isInputFocused, setIsInputFocused] = useState(false)
    const gameContainerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [isMobile, setIsMobile] = useState(false)
    const [showCountdown, setShowCountdown] = useState(true)
    const [gameStarted, setGameStarted] = useState(false)
    const [attemptsLeft, setAttemptsLeft] = useState(6)
    const [gameCompleted, setGameCompleted] = useState(false)
    const [lockedPositions, setLockedPositions] = useState<boolean[]>([])
    // Last attempt statuses from API
    const [lastAttemptStatuses, setLastAttemptStatuses] = useState<
        ('correct' | 'wrong-position' | 'incorrect')[]
    >([])
    // Game status modals
    const [showUserWinModal, setShowUserWinModal] = useState(false)
    const [showTimeEndedModal, setShowTimeEndedModal] = useState(false)
    const [showNoAttemptsModal, setShowNoAttemptsModal] = useState(false)
    const [showRoomHasWinnerModal, setShowRoomHasWinnerModal] = useState(false)
    const [roomWinnerName, setRoomWinnerName] = useState('')
    const [legendaryAmount, setLegendaryAmount] = useState('0.00')
    // Define game outcome handlers first
    const handleUserWin = (winAmount: string) => {
        setGameCompleted(true)
        setLegendaryAmount(winAmount)
        setShowUserWinModal(true)
    }
    const handleRoomHasWinner = (winnerName: string, winAmount: string) => {
        setGameCompleted(true)
        setRoomWinnerName(winnerName)
        setLegendaryAmount(winAmount)
        setShowRoomHasWinnerModal(true)
    }
    const handleTimeEnded = () => {
        setGameCompleted(true)
        setShowTimeEndedModal(true)
    }
    const handleNoAttemptsLeft = () => {
        setGameCompleted(true)
        setShowNoAttemptsModal(true)
    }
    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])
    // Initialize the game with dynamic number length
    useEffect(() => {
        // Generate a random code with the specified length
        const code = Array.from(
            {
                length: numberLength,
            },
            () => Math.floor(Math.random() * 10),
        )
        setTargetCode(code)
        // Initialize arrays with the correct length
        setCurrentAttempt(Array(numberLength).fill(undefined))
        setLockedPositions(Array(numberLength).fill(false))
        // Auto-focus the input when the component mounts
        if (inputRef.current) {
            inputRef.current.focus()
            setIsInputFocused(true)
        }
    }, [numberLength])
    // Focus input when game starts
    useEffect(() => {
        if (gameStarted && !showCountdown && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus()
            }, 300)
        }
    }, [gameStarted, showCountdown])
    // Timer effect
    useEffect(() => {
        if (!gameStarted || gameCompleted) return
        if (timer <= 0) {
            handleTimeEnded()
            return
        }
        const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000)
        return () => clearInterval(countdown)
    }, [timer, gameStarted, gameCompleted])
    // Check if the guess is correct
    const checkGuess = useCallback(async () => {
        if (gameCompleted) return
        // Check if we have a complete attempt (all positions filled)
        const hasEmptyPositions = currentAttempt.some((num) => num === undefined)
        if (hasEmptyPositions) {
            setFeedback('Invalid Number')
            return
        }
        // Store current attempt as the last attempt
        setLastAttempt(currentAttempt.map((n) => (n !== undefined ? n : 0)))
        // Make API request to check if user has won
        if (groupSessionId) {
            try {
                const userId = localStorage.getItem('userId')
                if (!userId) {
                    setFeedback('User ID not found')
                    return
                }
                const guess = currentAttempt
                    .map((n) => (n !== undefined ? n : 0))
                    .join('')
                const checkWinData = {
                    userId: userId,
                    groupSessionId: groupSessionId,
                    wordOrNumber: guess,
                }
                const response = await apiRequest(
                    '/user-group-session/select-winner',
                    'POST',
                    checkWinData,
                )
                // Process API response
                if (response) {
                    // Check if user is the winner
                    if (response.win === true) {
                        // User won!
                        handleUserWin(response.legendaryWinCount || gemPool.toFixed(2))
                        return
                    } else if (response.win === false) {
                        // Show feedback message when number is incorrect
                        setFeedback('Invalid Number')
                        // Clear feedback after 2 seconds
                        setTimeout(() => {
                            setFeedback('')
                        }, 2000)
                    }
                    // Check if room has a winner
                    if (
                        response.message &&
                        response.message.includes('Room has a Winner')
                    ) {
                        // Extract winner name from message
                        const winnerName = response.message.replace(
                            'Room has a Winner! ',
                            '',
                        )
                        handleRoomHasWinner(
                            winnerName,
                            response.legendaryWinCount || gemPool.toFixed(2),
                        )
                        return
                    }
                    // User didn't win - update UI based on API feedback
                    updateUIFromApiResponse(response)
                    // Decrease attempts
                    setAttemptsLeft((prev) => prev - 1)
                    // Check if out of attempts
                    if (attemptsLeft <= 1) {
                        handleNoAttemptsLeft()
                        return
                    }
                }
            } catch (error) {
                console.error('Error checking win status:', error)
                // Fall back to default handling if API call fails
                setAttemptsLeft((prev) => prev - 1)
                if (attemptsLeft <= 1) {
                    handleNoAttemptsLeft()
                }
            }
        } else {
            // No groupSessionId - fallback to default behavior
            setAttemptsLeft((prev) => prev - 1)
            if (attemptsLeft <= 1) {
                handleNoAttemptsLeft()
            }
        }
        // Focus the input for next attempt
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [currentAttempt, attemptsLeft, groupSessionId, gameCompleted, gemPool])
    // Helper function to update UI based on API response
    const updateUIFromApiResponse = (response: any) => {
        // Create a status array for the last attempt
        const statuses: ('correct' | 'wrong-position' | 'incorrect')[] =
            Array(numberLength).fill('incorrect')
        // Mark correct positions
        if (response.correctPositions && Array.isArray(response.correctPositions)) {
            response.correctPositions.forEach((index: number) => {
                // Convert from 1-based to 0-based indexing
                const zeroBasedIndex = index - 1
                if (zeroBasedIndex >= 0 && zeroBasedIndex < numberLength) {
                    statuses[zeroBasedIndex] = 'correct'
                }
            })
        }
        // Mark correct but wrong positions
        if (
            response.correctButWrongPosition &&
            Array.isArray(response.correctButWrongPosition)
        ) {
            response.correctButWrongPosition.forEach((index: number) => {
                // Convert from 1-based to 0-based indexing
                const zeroBasedIndex = index - 1
                if (zeroBasedIndex >= 0 && zeroBasedIndex < numberLength) {
                    statuses[zeroBasedIndex] = 'wrong-position'
                }
            })
        }
        // Update the last attempt statuses for rendering
        setLastAttemptStatuses(statuses)
        // Update locked positions and clear incorrect positions in current attempt
        const newLocks = [...lockedPositions]
        const newAttempt = [...currentAttempt]
        statuses.forEach((status, index) => {
            if (status === 'correct') {
                newLocks[index] = true
            } else {
                // Clear incorrect positions
                newAttempt[index] = undefined
            }
        })
        setLockedPositions(newLocks)
        setCurrentAttempt(newAttempt)
    }
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
            if (value.length <= numberLength) {
                const newAttempt = [...currentAttempt]
                let valueIndex = 0
                // Fill in non-locked positions with input values
                for (let i = 0; i < numberLength && valueIndex < value.length; i++) {
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
        // If we have a status from the API response, use it
        if (lastAttemptStatuses.length > 0) {
            return lastAttemptStatuses[index]
        }
        // Otherwise use the default logic
        // If the number is in the correct position, always return 'correct'
        if (targetCode[index] === num) {
            return 'correct' // Correct number in correct position
        }
        // Check if the number exists elsewhere in the target code
        // But we need to count occurrences to avoid marking too many as 'wrong-position'
        const targetOccurrences = targetCode.filter((n) => n === num).length
        const correctPositions = lastAttempt.filter(
            (n, i) => n === num && targetCode[i] === num,
        ).length
        const previousOccurrences = lastAttempt
            .slice(0, index)
            .filter((n) => n === num).length
        if (
            targetOccurrences > correctPositions + previousOccurrences &&
            targetCode.includes(num)
        ) {
            return 'wrong-position' // Correct number in wrong position
        }
        return 'incorrect' // Incorrect number
    }
    // Handle mobile number pad key press
    const handleMobileKeyPress = (key: string) => {
        if (gameCompleted) return
        if (key === 'ENTER') {
            checkGuess()
        } else if (key === 'Backspace') {
            // Find the rightmost filled non-locked position
            let lastFilled = -1
            for (let i = numberLength - 1; i >= 0; i--) {
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
            for (let i = 0; i < numberLength; i++) {
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
    // Handle desktop number pad key press
    const handleDesktopKeyPress = (key: string) => {
        if (gameCompleted) return
        if (key === 'ENTER') {
            checkGuess()
        } else if (key === 'Backspace') {
            // Find the rightmost filled non-locked position
            let lastFilled = -1
            for (let i = numberLength - 1; i >= 0; i--) {
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
            for (let i = 0; i < numberLength; i++) {
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
            className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white p-4"
            ref={gameContainerRef}
            tabIndex={0}
        >
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

            {/* Timer */}
            <div className="text-center mb-2 mt-8">
                <p className="text-xs">Timer</p>
                <p className="text-2xl font-bold">{formatTime(timer)}</p>
            </div>

            {/* Feedback message */}
            {feedback && (
                <div className="bg-[#374151] text-center py-1 px-4 rounded-lg mb-2 mx-auto max-w-md">
                    <p className="text-white text-lg">{feedback}</p>
                </div>
            )}
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
                disabled={gameCompleted}
            />

            {/* Last attempt display - Always shown */}
            <div className="flex justify-center mb-4">
                <div
                    className="grid gap-2"
                    style={{
                        gridTemplateColumns: `repeat(${numberLength}, minmax(0, 1fr))`,
                    }}
                >
                    {(lastAttempt.length > 0
                            ? lastAttempt
                            : Array(numberLength).fill('')
                    ).map((num, index) => {
                        const status =
                            lastAttempt.length > 0 && lastAttemptStatuses.length === 0
                                ? getNumberStatus(num as number, index)
                                : lastAttemptStatuses[index] || null
                        let bgColor = 'bg-[#374151]'
                        if (status === 'correct') {
                            bgColor = 'bg-[#22C55E]'
                        } else if (status === 'wrong-position') {
                            bgColor = 'bg-[#C5BD22]'
                        }
                        return (
                            <div
                                key={index}
                                className={`w-10 h-10 flex items-center justify-center ${bgColor} rounded-md text-white font-bold text-xl`}
                            >
                                {typeof num === 'number' ? num : ''}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Current attempt - Clickable to enable keyboard input */}
            <div
                className="flex justify-center mb-4"
                onClick={() => !gameCompleted && inputRef.current?.focus()}
            >
                <div
                    className="grid gap-2"
                    style={{
                        gridTemplateColumns: `repeat(${numberLength}, minmax(0, 1fr))`,
                    }}
                >
                    {Array.from({
                        length: numberLength,
                    }).map((_, index) => (
                        <div
                            key={index}
                            className={`w-14 h-14 flex items-center justify-center ${lockedPositions[index] ? 'bg-[#22C55E]' : 'bg-[#374151]'} rounded-md text-white font-bold text-xl`}
                        >
                            {currentAttempt[index] !== undefined ? currentAttempt[index] : ''}
                        </div>
                    ))}
                </div>
            </div>

            {/* Attempts count */}
            <div className="text-center mb-4">
                <p className="text-xl font-medium font-[Inter]">
                    {attemptsLeft} x attempt
                </p>
            </div>

            {/* Mobile number pad */}
            <div className="w-full max-w-md mx-auto">
                {/* Row 1: 1-2-3 */}
                <div className="flex justify-between mb-2">
                    {[1, 2, 3].map((num) => (
                        <button
                            key={num}
                            className={`w-[32%] h-14 bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white text-3xl font-bold ${gameCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => handleMobileKeyPress(num.toString())}
                            disabled={gameCompleted}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                {/* Row 2: 4-5-6 */}
                <div className="flex justify-between mb-2">
                    {[4, 5, 6].map((num) => (
                        <button
                            key={num}
                            className={`w-[32%] h-14 bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white text-3xl font-bold ${gameCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => handleMobileKeyPress(num.toString())}
                            disabled={gameCompleted}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                {/* Row 3: 7-8-9 */}
                <div className="flex justify-between mb-2">
                    {[7, 8, 9].map((num) => (
                        <button
                            key={num}
                            className={`w-[32%] h-14 bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white text-3xl font-bold ${gameCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                            onClick={() => handleMobileKeyPress(num.toString())}
                            disabled={gameCompleted}
                        >
                            {num}
                        </button>
                    ))}
                </div>

                {/* Row 4: ENTER-0-Backspace */}
                <div className="flex justify-between">
                    <button
                        className={`w-[32%] h-14 bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white text-xl font-bold ${gameCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => handleMobileKeyPress('ENTER')}
                        disabled={gameCompleted}
                    >
                        ENTER
                    </button>
                    <button
                        className={`w-[32%] h-14 bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white text-3xl font-bold ${gameCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => handleMobileKeyPress('0')}
                        disabled={gameCompleted}
                    >
                        0
                    </button>
                    <button
                        className={`w-[32%] h-14 bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white flex items-center justify-center ${gameCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                        onClick={() => handleMobileKeyPress('Backspace')}
                        disabled={gameCompleted}
                    >
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/cLoKd9Bc19xZnDL1tiCB5A/backspace.png"
                            alt="Backspace"
                            className="h-8 w-8"
                        />
                    </button>
                </div>
            </div>

            {/* Countdown Modal */}
            <CountdownModal
                isOpen={showCountdown}
                onCountdownComplete={handleCountdownComplete}
            />

            {/* Game status modals */}
            <UserWinGemModal
                isOpen={showUserWinModal}
                onClose={() => {
                    setShowUserWinModal(false)
                    navigate('/gem-game-mode')
                }}
                gemAmount={parseFloat(legendaryAmount)}
            />
            <TimeEndedGemModal
                isOpen={showTimeEndedModal}
                onClose={() => {
                    setShowTimeEndedModal(false)
                    navigate('/gem-game-mode')
                }}
                ticketAmount={ticketAmount}
            />
            <NoAttemptsGemModal
                isOpen={showNoAttemptsModal}
                onClose={() => {
                    setShowNoAttemptsModal(false)
                    navigate('/gem-game-mode')
                }}
            />
            <RoomHasWinnerModal
                isOpen={showRoomHasWinnerModal}
                onClose={() => {
                    setShowRoomHasWinnerModal(false)
                    navigate('/gem-game-mode')
                }}
                winnerName={roomWinnerName}
                legendaryAmount={legendaryAmount}
                userReward={0.02}
            />
        </div>
    )
}
