import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { VirtualKeyboard } from '../components/VirtualKeyboard'
import { CountdownModal } from '../components/CountdownModal'
import { useGlobalContext } from '../context/GlobalContext'
import { UserWinGemModal } from '../components/GameModals/UserWinGemModal'
import { TimeEndedGemModal } from '../components/GameModals/TimeEndedGemModal'
import { NoAttemptsGemModal } from '../components/GameModals/NoAttemptsGemModal'
import { RoomHasWinnerModal } from '../components/GameModals/RoomHasWinnerModal'
import { apiRequest } from '../services/api'
const WORDS = ['HELLO', 'WORLD', 'REACT', 'GAMES', 'GUESS', 'BRAIN', 'SMART']
function getLetterStatuses(
    guess: string[],
    target: string,
): ('correct' | 'wrong-position' | 'incorrect')[] {
    const statuses: ('correct' | 'wrong-position' | 'incorrect')[] = Array(
        guess.length,
    ).fill('incorrect')
    const targetLetters = target.split('')
    const used = Array(targetLetters.length).fill(false)
    guess.forEach((letter, i) => {
        if (i < targetLetters.length && letter === targetLetters[i]) {
            statuses[i] = 'correct'
            used[i] = true
        }
    })
    guess.forEach((letter, i) => {
        if (statuses[i] !== 'correct') {
            const index = targetLetters.findIndex((l, j) => l === letter && !used[j])
            if (index !== -1) {
                statuses[i] = 'wrong-position'
                used[index] = true
            }
        }
    })
    return statuses
}
export function GemWordollGame() {
    const navigate = useNavigate()
    const location = useLocation()
    const { addGems } = useGlobalContext()
    // Get ticket amount, gem pool, and word length from location state
    const {
        ticketAmount = 1,
        gemPool = 55.0,
        wordLength = 5,
        groupSessionId = null,
    } = (location.state as {
        ticketAmount: number
        gemPool: number
        wordLength: number
        groupSessionId: string | null
    }) || {}
    const [targetWord, setTargetWord] = useState('')
    const [, setSelectedLetters] = useState<string[]>([])
    const [lastAttempt, setLastAttempt] = useState<string[]>([])
    const [currentAttempt, setCurrentAttempt] = useState<string[]>([])
    const [lockedPositions, setLockedPositions] = useState<boolean[]>([])
    const [timer, setTimer] = useState(300)
    const [feedback, setFeedback] = useState<string>('')
    const [isMobile, setIsMobile] = useState(false)
    const [showCountdown, setShowCountdown] = useState(true)
    const [gameStarted, setGameStarted] = useState(false)
    const [attempts, setAttempts] = useState(12)
    const inputRef = useRef<HTMLInputElement>(null)
    const gameContainerRef = useRef<HTMLDivElement>(null)
    // Game status modals
    const [showUserWinModal, setShowUserWinModal] = useState(false)
    const [showTimeEndedModal, setShowTimeEndedModal] = useState(false)
    const [showNoAttemptsModal, setShowNoAttemptsModal] = useState(false)
    const [showRoomHasWinnerModal, setShowRoomHasWinnerModal] = useState(false)
    const [roomWinnerName, setRoomWinnerName] = useState('')
    const [legendaryAmount, setLegendaryAmount] = useState('0.00')
    const [gameCompleted, setGameCompleted] = useState(false)
    const [timeEndedReward, setTimeEndedReward] = useState(0)
    // Last attempt statuses from API
    const [lastAttemptStatuses, setLastAttemptStatuses] = useState<
        ('correct' | 'wrong-position' | 'incorrect')[]
    >([])
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
                    setTimeEndedReward(response.reward) // Always use reward from API
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
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])
    // Initialize game with the dynamic word length
    useEffect(() => {
        // Generate a random word (this is just for demo - in real app would come from API)
        // In production, you'd fetch the actual word from the API
        let randomWord = WORDS[Math.floor(Math.random() * WORDS.length)]
        // Pad or truncate the word to match the required length
        if (randomWord.length < wordLength) {
            // Pad with random letters if too short
            const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
            while (randomWord.length < wordLength) {
                randomWord += alphabet[Math.floor(Math.random() * alphabet.length)]
            }
        } else if (randomWord.length > wordLength) {
            // Truncate if too long
            randomWord = randomWord.substring(0, wordLength)
        }
        setTargetWord(randomWord)
        const targetLetters = randomWord.split('')
        const allLetters = [...targetLetters]
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
        while (allLetters.length < 10) {
            const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)]
            if (!allLetters.includes(randomLetter)) {
                allLetters.push(randomLetter)
            }
        }
        setSelectedLetters(allLetters.sort(() => Math.random() - 0.5))
        // Initialize arrays with the correct length
        setLastAttempt(Array(wordLength).fill(''))
        setCurrentAttempt(Array(wordLength).fill(''))
        setLockedPositions(Array(wordLength).fill(false))
    }, [wordLength])
    useEffect(() => {
        if (gameStarted && !showCountdown && isMobile && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300)
        }
    }, [gameStarted, showCountdown, isMobile])
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!gameStarted || gameCompleted) return
            const key = e.key.toUpperCase()
            if (/^[A-Z]$/.test(key)) {
                let nextPos = -1
                for (let i = 0; i < wordLength; i++) {
                    if (!lockedPositions[i] && !currentAttempt[i]) {
                        nextPos = i
                        break
                    }
                }
                if (nextPos !== -1) {
                    const newAttempt = [...currentAttempt]
                    newAttempt[nextPos] = key
                    setCurrentAttempt(newAttempt)
                }
            } else if (e.key === 'Backspace') {
                let lastFilled = -1
                for (let i = wordLength - 1; i >= 0; i--) {
                    if (!lockedPositions[i] && currentAttempt[i]) {
                        lastFilled = i
                        break
                    }
                }
                if (lastFilled !== -1) {
                    const newAttempt = [...currentAttempt]
                    newAttempt[lastFilled] = ''
                    setCurrentAttempt(newAttempt)
                }
            } else if (e.key === 'Enter') {
                checkGuess()
            }
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [currentAttempt, gameStarted, lockedPositions, gameCompleted, wordLength])
    useEffect(() => {
        if (!gameStarted || gameCompleted) return
        if (timer <= 0) {
            handleTimeEnded()
            return
        }
        const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000)
        return () => clearInterval(countdown)
    }, [timer, gameStarted, gameCompleted])
    const checkGuess = useCallback(async () => {
        if (gameCompleted) return
        const guess = currentAttempt.join('')
        if (guess.length < wordLength || currentAttempt.includes('')) {
            setFeedback('Please enter all letters')
            return
        }
        // Removed setLastAttempt from here - we'll only set it after confirming the word is valid
        // Make API request to check if user has won
        if (groupSessionId) {
            try {
                const userId = localStorage.getItem('userId')
                if (!userId) {
                    setFeedback('User ID not found')
                    return
                }
                const checkWinData = {
                    userId: userId,
                    groupSessionId: groupSessionId,
                    wordOrNumber: guess.toLowerCase(), // API expects lowercase
                }
                const response = await apiRequest(
                    '/user-group-session/select-winner',
                    'POST',
                    checkWinData,
                )
                // Check for "Word not in word list!" message
                if (response.message === 'Word not in word list!') {
                    // Show feedback message when word is not in the list
                    setFeedback('Not in word list')
                    // Clear feedback after 2 seconds
                    setTimeout(() => {
                        setFeedback('')
                    }, 2000)
                    // Clear only non-locked positions in the current attempt
                    const newAttempt = [...currentAttempt]
                    for (let i = 0; i < newAttempt.length; i++) {
                        if (!lockedPositions[i]) {
                            newAttempt[i] = ''
                        }
                    }
                    setCurrentAttempt(newAttempt)
                    // Do not update last attempt or decrease attempts count
                    return
                }
                // Word is valid, now we can update the last attempt
                setLastAttempt([...currentAttempt])
                // Process API response
                if (response) {
                    // Check if user is the winner
                    if (response.win === true) {
                        // User won!
                        handleUserWin(response.legendaryWinCount || gemPool.toFixed(2))
                        return
                    }
                    // When win is false, show feedback first
                    if (response.win === false) {
                        // Process the rest of the response after a slight delay
                        setTimeout(() => {
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
                            setAttempts((prev) => prev - 1)
                            // Check if out of attempts
                            if (attempts <= 1) {
                                handleNoAttemptsLeft()
                                return
                            }
                            // Clear feedback after processing everything (3 seconds total)
                            setTimeout(() => {
                                setFeedback('')
                            }, 3000)
                        }, 100) // Small delay to ensure feedback is displayed first
                        return
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
                    setAttempts((prev) => prev - 1)
                    // Check if out of attempts
                    if (attempts <= 1) {
                        handleNoAttemptsLeft()
                        return
                    }
                }
            } catch (error) {
                console.error('Error checking win status:', error)
                // Fall back to default handling if API call fails
                setAttempts((prev) => prev - 1)
                if (attempts <= 1) {
                    handleNoAttemptsLeft()
                }
            }
        } else {
            // No groupSessionId - fallback to default behavior
            // Set last attempt in the fallback case too
            setLastAttempt([...currentAttempt])
            setAttempts((prev) => prev - 1)
            if (attempts <= 1) {
                handleNoAttemptsLeft()
            }
        }
    }, [
        currentAttempt,
        wordLength,
        attempts,
        groupSessionId,
        gameCompleted,
        gemPool,
        lockedPositions,
    ])
    // Helper function to update UI based on API response
    const updateUIFromApiResponse = (response: any) => {
        // Create a status array for the last attempt
        const statuses: ('correct' | 'wrong-position' | 'incorrect')[] =
            Array(wordLength).fill('incorrect')
        // Mark correct positions
        if (response.correctPositions && Array.isArray(response.correctPositions)) {
            response.correctPositions.forEach((index: number) => {
                // Convert from 1-based to 0-based indexing
                const zeroBasedIndex = index - 1
                if (zeroBasedIndex >= 0 && zeroBasedIndex < wordLength) {
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
                if (zeroBasedIndex >= 0 && zeroBasedIndex < wordLength) {
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
                newAttempt[index] = ''
            }
        })
        setLockedPositions(newLocks)
        setCurrentAttempt(newAttempt)
    }
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remaining = seconds % 60
        return `${minutes.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '')
        const newAttempt = [...currentAttempt]
        let inputIndex = 0
        for (let i = 0; i < wordLength && inputIndex < value.length; i++) {
            if (!lockedPositions[i]) {
                newAttempt[i] = value[inputIndex]
                inputIndex++
            }
        }
        setCurrentAttempt(newAttempt)
    }
    const handleCountdownComplete = () => {
        setShowCountdown(false)
        setGameStarted(true)
        if (isMobile && inputRef.current) {
            inputRef.current.focus()
        }
    }
    const renderLetterTile = (
        letter: string,
        index: number,
        status: 'correct' | 'wrong-position' | 'incorrect' | null,
    ) => {
        let bgColor = 'bg-gray-700'
        // If we have a status from the API response, use it
        if (lastAttemptStatuses.length > 0) {
            const apiStatus = lastAttemptStatuses[index]
            if (apiStatus === 'correct') bgColor = 'bg-[#22C55E]'
            else if (apiStatus === 'wrong-position') bgColor = 'bg-[#C5BD22]'
            else bgColor = 'bg-gray-700'
        }
        // Otherwise use the passed status
        else if (status === 'correct') bgColor = 'bg-[#22C55E]'
        else if (status === 'wrong-position') bgColor = 'bg-[#C5BD22]'
        return (
            <div
                key={index}
                className={`w-10 h-10 flex items-center justify-center ${bgColor} rounded-md text-white font-bold text-lg shadow-md`}
            >
                {letter}
            </div>
        )
    }
    const handleLetterClick = (index: number) => {
        if (!lockedPositions[index] && !gameCompleted) {
            const newAttempt = [...currentAttempt]
            newAttempt[index] = ''
            setCurrentAttempt(newAttempt)
        }
    }
    const handleMobileKeyPress = (key: string) => {
        if (gameCompleted) return
        if (key === 'ENTER') {
            checkGuess()
        } else if (key === 'Backspace') {
            let lastFilled = -1
            for (let i = wordLength - 1; i >= 0; i--) {
                if (!lockedPositions[i] && currentAttempt[i]) {
                    lastFilled = i
                    break
                }
            }
            if (lastFilled !== -1) {
                const newAttempt = [...currentAttempt]
                newAttempt[lastFilled] = ''
                setCurrentAttempt(newAttempt)
            }
        } else if (/^[A-Z]$/.test(key)) {
            let nextPos = -1
            for (let i = 0; i < wordLength; i++) {
                if (!lockedPositions[i] && !currentAttempt[i]) {
                    nextPos = i
                    break
                }
            }
            if (nextPos !== -1) {
                const newAttempt = [...currentAttempt]
                newAttempt[nextPos] = key
                setCurrentAttempt(newAttempt)
            }
        }
    }
    const mobileKeyboard = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'Backspace'],
    ]
    const S = {
        tileBox:   'size-[clamp(2.75rem,10vw,4rem)] text-[clamp(1.25rem,4.2vw,1.75rem)]',
        tileBoxLg: 'size-[clamp(3.5rem,12vw,4.5rem)] text-[clamp(1.5rem,5vw,2rem)]',
        gridGap:   'gap-[clamp(0.25rem,1.6vw,0.5rem)]',
        key:       'h-[clamp(3.3rem,8.8vw,3.6rem)] w-[clamp(2.5rem,8vw,3.2rem)] text-[clamp(0.9rem,3.2vw,1.1rem)]',
        wideKey:   'w-[clamp(3.9rem,13vw,5rem)]',
        panelW:    'w-[min(92vw,360px)]',
        coinImg:   'w-5 h-5',
    };

// --- RENDER ---
    if (isMobile) {
        return (
            <div
                className="fixed inset-0 bg-[#1F2937] text-white overscroll-none touch-pan-y select-none overflow-hidden"
                ref={gameContainerRef}
            >
                {/* Stable viewport + safe area */}
                <div className="flex flex-col h-dvh min-h-dvh pb-[env(safe-area-inset-bottom)]">

                    {/* Top: back + timer */}
                    <div className="relative flex flex-col h-full min-h-0">
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
                        <div className="flex-none text-center pt-8 pb-2 shrink-0">
                            <p className="text-white text-xs">Timer</p>
                            <p className="text-2xl font-bold">{formatTime(timer)}</p>
                        </div>

                        {/* Feedback (auto height, centered) */}
                        {/* Feedback message (auto height, centered, no clipping) */}
                        <div className="h-2">
                            {feedback && (
                                <div className="bg-[#374151] text-xs text-center py-2 px-4 rounded-lg mb-4 mx-28">
                                    {feedback}

                                </div>
                            )}

                        </div>

                        {/* Game area */}
                        <div className="flex-1 flex flex-col justify-center items-center overflow-hidden px-2 min-h-0">
                            {/* Hidden input (inert) */}
                            <input
                                ref={inputRef}
                                type="text"
                                inputMode="none"
                                value={currentAttempt.join('')}
                                onChange={handleInputChange}
                                className="absolute opacity-0 pointer-events-none h-0 w-0"
                                autoComplete="off"
                                autoCorrect="off"
                                autoCapitalize="off"
                                spellCheck="false"
                                readOnly
                            />

                            {/* Last attempt display (S.tileBox) */}
                            <div className="flex justify-center mt-[clamp(0.5rem,6vh,2.5rem)] mb-4">
                                <div
                                    className={`grid grid-cols-1 ${S.gridGap} font-[Inter]`}
                                    style={{ gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))` }}
                                >
                                    {lastAttempt.length
                                        ? lastAttempt.map((letter, index) => {
                                            // prefer API statuses if present
                                            const api = lastAttemptStatuses.length > 0 ? lastAttemptStatuses[index] : null;
                                            const computed = (!api && letter !== '')
                                                ? getLetterStatuses(lastAttempt, targetWord)[index]
                                                : null;

                                            const status = (api ?? computed) as ('correct'|'wrong-position'|'incorrect'|null);
                                            let bg = 'bg-gray-700';
                                            if (status === 'correct') bg = 'bg-[#22C55E]';
                                            else if (status === 'wrong-position') bg = 'bg-[#C5BD22]';

                                            return (
                                                <div
                                                    key={index}
                                                    className={`${S.tileBox} flex items-center justify-center ${bg} rounded-md text-white font-bold shadow-md`}
                                                >
                                                    {letter}
                                                </div>
                                            );
                                        })
                                        : Array(wordLength).fill('').map((_, i) => (
                                            <div
                                                key={i}
                                                className={`${S.tileBox} flex items-center justify-center bg-[#374151] rounded-md text-white font-bold shadow-md`}
                                            />
                                        ))}
                                </div>
                            </div>

                            {/* Current attempt (S.tileBoxLg) */}
                            <div className="flex justify-center mb-2" onClick={() => !gameCompleted && inputRef.current?.focus()}>
                                <div
                                    className={`grid grid-cols-1 ${S.gridGap}`}
                                    style={{ gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))` }}
                                >
                                    {Array.from({ length: wordLength }).map((_, index) => (
                                        <div
                                            key={index}
                                            className={`${S.tileBoxLg} flex items-center justify-center ${
                                                currentAttempt[index]
                                                    ? (lockedPositions[index] ? 'bg-[#22C55E]' : 'bg-gray-700')
                                                    : 'bg-[#374151]'
                                            } rounded-md text-white font-bold shadow-md font-[Inter] text-center ${
                                                !lockedPositions[index] && !gameCompleted ? 'cursor-pointer' : 'cursor-not-allowed'
                                            }`}
                                            onClick={() => handleLetterClick(index)}
                                        >
                                            {currentAttempt[index]}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Attempts label */}
                            <div className="text-center mt-[clamp(0.5rem,6vh,2.5rem)]">
                                <p className="text-xl font-medium font-[Inter]">
                                    {attempts} x attempt
                                </p>
                            </div>
                        </div>

                        {/* Mobile keyboard */}
                        <div className="flex-none mb-0 pb-[env(safe-area-inset-bottom)] shrink-0">
                            <div className="w-full max-w-md mx-auto px-3">
                                {mobileKeyboard.map((row, rowIndex) => (
                                    <div
                                        key={rowIndex}
                                        className={`flex justify-center mb-[clamp(0.2rem,0.8vw,0.35rem)] ${rowIndex === 1 ? 'px-4' : ''}`}
                                    >
                                        {row.map((key, keyIndex) => (
                                            <button
                                                key={`${rowIndex}-${keyIndex}`}
                                                className={`${(key === 'ENTER' || key === 'Backspace') ? S.wideKey : ''} ${S.key} m-[clamp(0.10rem,0.10vw,0.3rem)] rounded-md bg-[#67768f] hover:bg-[#5a697f] text-white font-bold flex items-center justify-center shadow-md transition-colors ${gameCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                onClick={() => handleMobileKeyPress(key)}
                                                disabled={gameCompleted}
                                            >
                                                {key === 'Backspace' ? (
                                                    <img
                                                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/cLoKd9Bc19xZnDL1tiCB5A/backspace.png"
                                                        alt="Backspace"
                                                        className="h-[clamp(1.25rem,4.2vw,2rem)] w-[clamp(1.25rem,4.2vw,2rem)]"
                                                    />
                                                ) : key === 'ENTER' ? (
                                                    <span className="text-[clamp(0.6rem,2.6vw,0.8rem)]">ENTER</span>
                                                ) : (
                                                    key
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Modals (same as your current) */}
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
            </div>
        );
    }

// --- DESKTOP: unchanged UI (your original) ---
    return (
        <div
            className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white p-4"
            ref={gameContainerRef}
        >
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

            <div className="text-center mb-5 mt-4">
                <p className="text-white text-xs">Timer</p>
                <p className="text-2xl font-bold">{formatTime(timer)}</p>
            </div>

            {/* Feedback message (auto height, centered, no clipping) */}
            <div className="h-2">
                {feedback && (
                    <div className="bg-[#374151] text-xs text-center py-2 px-4 rounded-lg mb-4 w-36 mx-auto">
                        {feedback}

                    </div>
                )}

            </div>

            {/* Last attempt display */}
            <div className="flex justify-center mt-10 mb-4">
                <div
                    className="grid gap-2 text-2xl font-[Inter]"
                    style={{gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))`}}
                >
                    {lastAttempt.map((letter, index) => {
                        const hasActualLetter = letter !== '';
                        const status =
                            hasActualLetter && lastAttemptStatuses.length === 0
                                ? getLetterStatuses(lastAttempt, targetWord)[index]
                                : null;
                        return renderLetterTile(letter, index, status);
                    })}
                </div>
            </div>

            {/* Current attempt */}
            <div
                className="flex justify-center mb-4"
                onClick={() => !gameCompleted && inputRef.current?.focus()}
            >
                <div
                    className="grid gap-2"
                    style={{gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))`}}
                >
                    {Array.from({length: wordLength}).map((_, index) => (
                        <div
                            key={index}
                            className={`w-16 h-16 flex items-center justify-center ${
                                currentAttempt[index]
                                    ? (lockedPositions[index] ? 'bg-[#22C55E]' : 'bg-gray-700')
                                    : 'bg-[#374151]'
                            } rounded-md text-white font-bold text-3xl shadow-md font-[Inter] ${
                                !lockedPositions[index] && !gameCompleted ? 'cursor-pointer' : 'cursor-not-allowed'
                            }`}
                            onClick={() => handleLetterClick(index)}
                        >
                            {currentAttempt[index]}
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center mb-10 my-1">
                <p className="text-xl font-medium font-[Inter]">{attempts} x attempt</p>
            </div>

            <div className="mt-2 mb-2">
                <VirtualKeyboard
                    onKeyPress={(key) => {
                        if (gameCompleted) return;
                        if (key === 'Enter') {
                            checkGuess();
                        } else if (key === 'Backspace') {
                            let lastFilled = -1;
                            for (let i = wordLength - 1; i >= 0; i--) {
                                if (!lockedPositions[i] && currentAttempt[i]) {
                                    lastFilled = i;
                                    break;
                                }
                            }
                            if (lastFilled !== -1) {
                                const newAttempt = [...currentAttempt];
                                newAttempt[lastFilled] = '';
                                setCurrentAttempt(newAttempt);
                            }
                        } else if (/^[A-Z]$/.test(key)) {
                            let nextPos = -1;
                            for (let i = 0; i < wordLength; i++) {
                                if (!lockedPositions[i] && !currentAttempt[i]) {
                                    nextPos = i;
                                    break;
                                }
                            }
                            if (nextPos !== -1) {
                                const newAttempt = [...currentAttempt];
                                newAttempt[nextPos] = key;
                                setCurrentAttempt(newAttempt);
                            }
                        }
                    }}
                    keyboardType="qwerty"
                    className="md:block"
                />
            </div>

            {/* Modals */}
            <CountdownModal
                isOpen={showCountdown}
                onCountdownComplete={handleCountdownComplete}
            />
            <UserWinGemModal
                isOpen={showUserWinModal}
                onClose={() => {
                    setShowUserWinModal(false);
                    navigate('/gem-game-mode');
                }}
                gemAmount={parseFloat(legendaryAmount)}
            />
            <TimeEndedGemModal
                isOpen={showTimeEndedModal}
                onClose={() => {
                    setShowTimeEndedModal(false);
                    navigate('/gem-game-mode');
                }}
                ticketAmount={timeEndedReward}
            />
            <NoAttemptsGemModal
                isOpen={showNoAttemptsModal}
                onClose={() => {
                    setShowNoAttemptsModal(false);
                    navigate('/gem-game-mode');
                }}
            />
            <RoomHasWinnerModal
                isOpen={showRoomHasWinnerModal}
                onClose={() => {
                    setShowRoomHasWinnerModal(false);
                    navigate('/gem-game-mode');
                }}
                winnerName={roomWinnerName}
                legendaryAmount={legendaryAmount}
                userReward={0.02}
            />
        </div>
    );

}
