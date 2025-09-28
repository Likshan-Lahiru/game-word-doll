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
    const [attemptsLeft, setAttemptsLeft] = useState(8)
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
    // NEW: reward amount to show when time ends (from API)
    const [timeEndedReward, setTimeEndedReward] = useState(0)
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
    // REPLACED with the async logic from code #2
    const handleTimeEnded = async () => {
        setGameCompleted(true)
        if (groupSessionId) {
            try {
                const userId = localStorage.getItem('userId')
                if (!userId) {
                    console.error('User ID not found')
                    setShowTimeEndedModal(true)
                    setTimeEndedReward(0)
                    return
                }
                const response = await apiRequest(
                    `/user-group-session/check?userId=${userId}&groupSessionId=${groupSessionId}`,
                    'GET',
                )
                if (response && typeof response.reward === 'number') {
                    setTimeEndedReward(response.reward) // Always take reward from API
                } else {
                    setTimeEndedReward(0)
                }
            } catch (error) {
                console.error('Error checking time ended status:', error)
                setTimeEndedReward(0)
            }
        } else {
            setTimeEndedReward(0)
        }
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
                        handleUserWin(response.legendaryWinCount || gemPool.toFixed(2))
                        return
                    } else if (response.win === false) {
                        setFeedback('Invalid Number')
                        setTimeout(() => setFeedback(''), 2000)
                    }
                    // Check if room has a winner
                    if (
                        response.message &&
                        response.message.includes('Room has a Winner')
                    ) {
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
                setAttemptsLeft((prev) => prev - 1)
                if (attemptsLeft <= 1) handleNoAttemptsLeft()
            }
        } else {
            // No groupSessionId - fallback to default behavior
            setAttemptsLeft((prev) => prev - 1)
            if (attemptsLeft <= 1) handleNoAttemptsLeft()
        }
        // Focus the input for next attempt
        if (inputRef.current) inputRef.current.focus()
    }, [currentAttempt, attemptsLeft, groupSessionId, gameCompleted, gemPool])
    // Helper function to update UI based on API response
    const updateUIFromApiResponse = (response: any) => {
        const statuses: ('correct' | 'wrong-position' | 'incorrect')[] =
            Array(numberLength).fill('incorrect')
        // Mark correct positions
        if (response.correctPositions && Array.isArray(response.correctPositions)) {
            response.correctPositions.forEach((index: number) => {
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
                const zeroBasedIndex = index - 1
                if (zeroBasedIndex >= 0 && zeroBasedIndex < numberLength) {
                    statuses[zeroBasedIndex] = 'wrong-position'
                }
            })
        }
        setLastAttemptStatuses(statuses)
        // Update locked positions and clear incorrect positions in current attempt
        const newLocks = [...lockedPositions]
        const newAttempt = [...currentAttempt]
        statuses.forEach((status, index) => {
            if (status === 'correct') newLocks[index] = true
            else newAttempt[index] = undefined
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
        if (gameCompleted) return
        // Skip processing if the input is coming from the keyboard event listener
        // This prevents duplicate entries when typing on a physical keyboard
        if (e.nativeEvent.inputType === 'insertText') {
            const value = e.target.value.replace(/[^0-9]/g, '')
            if (value.length <= numberLength) {
                const newAttempt = [...currentAttempt]
                let valueIndex = 0
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
        if (inputRef.current) inputRef.current.focus()
    }
    // Get number status (correct, wrong position, incorrect)
    const getNumberStatus = (num: number, index: number) => {
        if (lastAttemptStatuses.length > 0) return lastAttemptStatuses[index]
        if (targetCode[index] === num) return 'correct'
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
            return 'wrong-position'
        }
        return 'incorrect'
    }
    // Handle mobile number pad key press
    const handleMobileKeyPress = (key: string) => {
        if (gameCompleted) return
        if (key === 'ENTER') {
            checkGuess()
        } else if (key === 'Backspace') {
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
    // Keyboard input handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!gameStarted || gameCompleted) return
            // Handle number input (0-9)
            if (/^[0-9]$/.test(e.key)) {
                handleDesktopKeyPress(e.key)
            }
            // Handle backspace
            else if (e.key === 'Backspace') {
                handleDesktopKeyPress('Backspace')
            }
            // Handle enter key
            else if (e.key === 'Enter') {
                handleDesktopKeyPress('ENTER')
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [
        currentAttempt,
        gameStarted,
        gameCompleted,
        lockedPositions,
        numberLength,
    ])
    const S = {
        smallTile: 'size-[clamp(2.3rem,8.5vw,2.75rem)] text-[clamp(1rem,3.6vw,1.125rem)]',
        bigTile:   'size-[clamp(3.25rem,12vw,4rem)] text-[clamp(1.5rem,5vw,1.875rem)]',
        gridGap:   'gap-[clamp(0.25rem,1.6vw,0.5rem)]',
        panelW:    'w-[min(92vw,340px)] h-[clamp(3.8rem,10vw,4.1rem)]',
        keyH:      'h-[clamp(3rem,10vw,3.5rem)]',
        keyText:   'text-[clamp(1.4rem,5vw,1.875rem)]',
        enterText: 'text-[clamp(0.9rem,3.2vw,1.1rem)]',
        backIcon:  'h-[clamp(1.25rem,4.2vw,2rem)] w-[clamp(1.25rem,4.2vw,2rem)]',
    };


    return (
        <div
            ref={gameContainerRef}
            tabIndex={0}
            className={
                isMobile
                    ? "fixed inset-0 bg-[#1F2937] text-white overscroll-none touch-pan-y select-none overflow-hidden"
                    : "flex flex-col w-full min-h-screen bg-[#1F2937] text-white p-4"
            }
        >
            {isMobile ? (
                // ---------- MOBILE (responsive, no scrolling) ----------
                <div className="flex flex-col h-dvh min-h-dvh pb-[env(safe-area-inset-bottom)]">
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

                    {/* Timer */}
                    <div className="text-center pt-8 pb-2 shrink-0">
                        <p className="text-xs">Timer</p>
                        <p className="text-2xl font-bold">{formatTime(timer)}</p>
                    </div>

                    {/* Feedback */}
                    <div className="h-2">
                        {feedback && (
                            <div className="bg-[#374151] text-xs text-center py-2 px-4 rounded-lg mb-4 mx-28">
                                {feedback}

                            </div>
                        )}

                    </div>


                    {/* Hidden input for keyboard (inert) */}
                    <input
                        ref={inputRef}
                        type="tel"
                        inputMode="none"
                        pattern="[0-9]*"
                        value={currentAttempt.filter((n) => n !== undefined).join('')}
                        onChange={handleInputChange}
                        className="absolute opacity-0 h-0 w-0 pointer-events-none"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        readOnly
                        disabled={gameCompleted}
                    />

                    {/* Game area */}
                    <div className="flex-1 flex flex-col justify-center items-center overflow-hidden px-2 min-h-0">
                        {/* Last attempt */}
                        <div className="flex justify-center mt-[clamp(0.5rem,6vh,2.5rem)] mb-3">
                            <div
                                className={`grid grid-cols-1 ${S.gridGap}`}
                                style={{gridTemplateColumns: `repeat(${numberLength}, minmax(0, 1fr))`}}
                            >
                                {(lastAttempt.length > 0 ? lastAttempt : Array(numberLength).fill('')).map((num, index) => {
                                    const status =
                                        lastAttempt.length > 0 && lastAttemptStatuses.length === 0
                                            ? getNumberStatus(num as number, index)
                                            : lastAttemptStatuses[index] || null;

                                    let bgColor = 'bg-[#374151]';
                                    if (status === 'correct') bgColor = 'bg-[#22C55E]';
                                    else if (status === 'wrong-position') bgColor = 'bg-[#C5BD22]';

                                    return (
                                        <div
                                            key={index}
                                            className={`${S.smallTile} flex items-center justify-center ${bgColor} rounded-md text-white font-bold shadow-md`}
                                        >
                                            {typeof num === 'number' ? num : ''}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Current attempt */}
                        <div className="flex justify-center mb-2"
                             onClick={() => !gameCompleted && inputRef.current?.focus()}>
                            <div
                                className={`grid grid-cols-1 ${S.gridGap}`}
                                style={{gridTemplateColumns: `repeat(${numberLength}, minmax(0, 1fr))`}}
                            >
                                {Array.from({length: numberLength}).map((_, index) => (
                                    <div
                                        key={index}
                                        className={`${S.bigTile} flex items-center justify-center ${
                                            lockedPositions[index] ? 'bg-[#22C55E]' : 'bg-[#374151]'
                                        } rounded-md text-white font-bold shadow-md`}
                                    >
                                        {currentAttempt[index] !== undefined ? currentAttempt[index] : ''}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Attempts count */}
                        <div className="text-center mt-[clamp(0.5rem,6vh,2.5rem)] mb-1">
                            <p className="text-xl font-medium font-[Inter]">{attemptsLeft} x attempt</p>
                        </div>
                    </div>

                    {/* Mobile number pad */}
                    <div className="w-full max-w-md mx-auto px-3 pb-[env(safe-area-inset-bottom)]">
                        {/* Row 1: 1-2-3 */}
                        <div className="flex justify-between mb-2">
                            {[1, 2, 3].map((num) => (
                                <button
                                    key={num}
                                    className={`w-[32%] ${S.keyH} bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white ${S.keyText} font-bold ${gameCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                    className={`w-[32%] ${S.keyH} bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white ${S.keyText} font-bold ${gameCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                    className={`w-[32%] ${S.keyH} bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white ${S.keyText} font-bold ${gameCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                className={`w-[32%] ${S.keyH} bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white ${S.enterText} font-bold ${gameCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => handleMobileKeyPress('ENTER')}
                                disabled={gameCompleted}
                            >
                                ENTER
                            </button>
                            <button
                                className={`w-[32%] ${S.keyH} bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white ${S.keyText} font-bold ${gameCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => handleMobileKeyPress('0')}
                                disabled={gameCompleted}
                            >
                                0
                            </button>
                            <button
                                className={`w-[32%] ${S.keyH} bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white flex items-center justify-center ${gameCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => handleMobileKeyPress('Backspace')}
                                disabled={gameCompleted}
                            >
                                <img
                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/cLoKd9Bc19xZnDL1tiCB5A/backspace.png"
                                    alt="Backspace"
                                    className={S.backIcon}
                                />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                // ---------- DESKTOP (unchanged) ----------
                <>
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

                    {/* Timer */}
                    <div className="text-center mb-24 mt-8">
                        <p className="text-xs">Timer</p>
                        <p className="text-2xl font-bold">{formatTime(timer)}</p>
                    </div>

                    {/* Feedback message */}
                    <div className="h-2">
                        {feedback && (
                            <div className="bg-[#374151] text-xs text-center py-2 px-4 rounded-lg mb-4 w-36 mx-auto">
                                {feedback}

                            </div>
                        )}

                    </div>

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

                    {/* Last attempt display */}
                    <div className="flex justify-center mb-4">
                        <div
                            className="grid gap-2"
                            style={{gridTemplateColumns: `repeat(${numberLength}, minmax(0, 1fr))`}}
                        >
                            {(lastAttempt.length > 0 ? lastAttempt : Array(numberLength).fill('')).map((num, index) => {
                                const status =
                                    lastAttempt.length > 0 && lastAttemptStatuses.length === 0
                                        ? getNumberStatus(num as number, index)
                                        : lastAttemptStatuses[index] || null;

                                let bgColor = 'bg-[#374151]';
                                if (status === 'correct') bgColor = 'bg-[#22C55E]';
                                else if (status === 'wrong-position') bgColor = 'bg-[#C5BD22]';

                                return (
                                    <div
                                        key={index}
                                        className={`w-10 h-10 flex items-center justify-center ${bgColor} rounded-md text-white font-bold text-xl`}
                                    >
                                        {typeof num === 'number' ? num : ''}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Current attempt */}
                    <div className="flex justify-center mb-4"
                         onClick={() => !gameCompleted && inputRef.current?.focus()}>
                        <div
                            className="grid gap-2"
                            style={{gridTemplateColumns: `repeat(${numberLength}, minmax(0, 1fr))`}}
                        >
                            {Array.from({length: numberLength}).map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-14 h-14 flex items-center justify-center ${
                                        lockedPositions[index] ? 'bg-[#22C55E]' : 'bg-[#374151]'
                                    } rounded-md text-white font-bold text-xl`}
                                >
                                    {currentAttempt[index] !== undefined ? currentAttempt[index] : ''}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Attempts count */}
                    <div className="text-center mb-4">
                        <p className="text-xl font-medium font-[Inter]">{attemptsLeft} x attempt</p>
                    </div>

                    {/* Desktop numpad (kept from your mobile-styled buttons for consistency) */}
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
                </>
            )}

            {/* Modals (unchanged) */}
            <CountdownModal
                isOpen={showCountdown}
                onCountdownComplete={handleCountdownComplete}
            />
            <UserWinGemModal
                isOpen={showUserWinModal}
                onClose={() => { setShowUserWinModal(false); navigate('/gem-game-mode'); }}
                gemAmount={parseFloat(legendaryAmount)}
            />
            <TimeEndedGemModal
                isOpen={showTimeEndedModal}
                onClose={() => { setShowTimeEndedModal(false); navigate('/gem-game-mode'); }}
                ticketAmount={timeEndedReward}
            />
            <NoAttemptsGemModal
                isOpen={showNoAttemptsModal}
                onClose={() => { setShowNoAttemptsModal(false); navigate('/gem-game-mode'); }}
            />
            <RoomHasWinnerModal
                isOpen={showRoomHasWinnerModal}
                onClose={() => { setShowRoomHasWinnerModal(false); navigate('/gem-game-mode'); }}
                winnerName={roomWinnerName}
                legendaryAmount={legendaryAmount}
                userReward={0.02}
            />
        </div>
    );

}
