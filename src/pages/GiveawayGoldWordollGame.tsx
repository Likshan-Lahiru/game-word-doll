import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { VirtualKeyboard } from '../components/VirtualKeyboard'
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
export function GiveawayGoldWordollGame() {
    const navigate = useNavigate()
    const { betAmount, winAmount, isAuthenticated, addCoins } = useGlobalContext()
    const [targetWord, setTargetWord] = useState('') // Keep for UI feedback only
    const [wordLength, setWordLength] = useState(5)
    const [, setSelectedLetters] = useState<string[]>([])
    const [lastAttempt, setLastAttempt] = useState<string[] | null>(null)
    const [currentAttempt, setCurrentAttempt] = useState<string[]>([])
    const [lockedPositions, setLockedPositions] = useState<boolean[]>([])
    const [timer, setTimer] = useState(900) // 15 minutes (900 seconds)
    const [feedback, setFeedback] = useState<string>('')
    const [showCountdown, setShowCountdown] = useState(true)
    const [gameStarted, setGameStarted] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const gameContainerRef = useRef<HTMLDivElement>(null)
    const [showWinModal, setShowWinModal] = useState(false)
    const [showWinPackageModal, setShowWinPackageModal] = useState(false)
    const [showLoseModal, setShowLoseModal] = useState(false)
    const [showNoAttemptsModal, setShowNoAttemptsModal] = useState(false)
    const [showClaimEntryModal, setShowClaimEntryModal] = useState(false)
    const { selectedBalanceType } = useGlobalContext()
    const [guestGameSession, setGuestGameSession] = useState<any>(null)
    const [showCooldownModal, setShowCooldownModal] = useState(false)
    const [cooldownTimeRemaining, setCooldownTimeRemaining] = useState('')
    const [lastAttemptStatuses, setLastAttemptStatuses] = useState<
        ('correct' | 'wrong-position' | 'incorrect')[]
    >([])
    const [selectedPrize, setSelectedPrize] = useState<any>(null)
    // Get letter status (correct, wrong position, incorrect)
    const getLetterStatus = (letter: string, index: number) => {
        // First, check if we have status information from the API response
        if (lastAttemptStatuses.length > 0) {
            return lastAttemptStatuses[index]
        }
        // Fallback to default logic if API response is not available
        if (
            targetWord &&
            index < targetWord.length &&
            letter === targetWord[index]
        ) {
            return 'correct'
        }
        if (targetWord && targetWord.includes(letter)) {
            return 'wrong-position'
        }
        return 'incorrect'
    }
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
                        const result = await checkLastWinTime(userId, 'WORDALL')
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
                // Set word length based on session data
                const length = parsedSession.wordOrNumberLength || 5
                setWordLength(length)
                // Initialize current attempt and locked positions with the correct length
                setCurrentAttempt(Array(length).fill(''))
                setLockedPositions(Array(length).fill(false))
                // If there's a target word in the session, use it for UI feedback
                if (parsedSession.targetWord) {
                    setTargetWord(parsedSession.targetWord)
                }
            } catch (e) {
                console.error('Error parsing auth session data:', e)
                // Default to 5 if there's an error
                setWordLength(5)
                setCurrentAttempt(Array(5).fill(''))
                setLockedPositions(Array(5).fill(false))
            }
        } else if (guestSessionData && !isAuthenticated) {
            try {
                const parsedSession = JSON.parse(guestSessionData)
                setGuestGameSession(parsedSession)
                // Set word length based on session data
                const length = parsedSession.wordOrNumberLength || 5
                setWordLength(length)
                // Initialize current attempt and locked positions with the correct length
                setCurrentAttempt(Array(length).fill(''))
                setLockedPositions(Array(length).fill(false))
                // If there's a target word in the session, use it for UI feedback
                if (parsedSession.targetWord) {
                    setTargetWord(parsedSession.targetWord)
                }
            } catch (e) {
                console.error('Error parsing guest session data:', e)
                // Default to 5 if there's an error
                setWordLength(5)
                setCurrentAttempt(Array(5).fill(''))
                setLockedPositions(Array(5).fill(false))
            }
        } else {
            // Default to 5 if no session data
            setWordLength(5)
            setCurrentAttempt(Array(5).fill(''))
            setLockedPositions(Array(5).fill(false))
        }
        // Always set timer to 15 minutes (900 seconds)
        setTimer(900)
        // Prevent scrolling
        document.body.style.overflow = 'hidden'
        return () => {
            document.body.style.overflow = ''
        }
    }, [isAuthenticated, selectedBalanceType])
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
    useEffect(() => {
        if (gameStarted && !showCountdown && inputRef.current) {
            setTimeout(() => inputRef.current?.focus(), 300)
        }
    }, [gameStarted, showCountdown])
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!gameStarted) return
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
    }, [currentAttempt, gameStarted, lockedPositions, wordLength])
    useEffect(() => {
        if (!gameStarted) return
        if (timer <= 0) {
            setShowClaimEntryModal(true)
            return
        }
        const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000)
        return () => clearInterval(countdown)
    }, [timer, gameStarted])
    const checkGuess = useCallback(async () => {
        const guess = currentAttempt.join('')
        if (guess.length < wordLength || currentAttempt.includes('')) {
            return
        }
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
                gameType: 'WORDALL',
                isGoldCoin: true, // Flag to indicate this is a gold coin game
            }
            const response = await apiRequest(
                '/giveaway/last-win-check',
                'POST',
                checkWinData,
            )
            console.log('Gold giveaway win check response:', response)
            // Check if word is not in word list
            if (response.message === 'Word not in word list!') {
                // Show feedback message when word is not in the list
                setFeedback('Not in word list')
                // Clear feedback after 2 seconds
                setTimeout(() => {
                    setFeedback('')
                }, 2000)
                // Don't update last attempt or decrease attempts count
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
            // Set the last attempt for valid words
            setLastAttempt([...currentAttempt])
            if (response.win) {
                // User won - call the handleWin function and show win modal
                await handleWin()
                // Show the win package modal with prize details
                setShowWinPackageModal(true)
            } else {
                // User didn't win - update UI based on API feedback
                updateUIFromApiResponse(response, currentAttempt)
            }
        } catch (error) {
            console.error('Error checking win status:', error)
            // Fallback handling
            setLastAttemptStatuses(Array(currentAttempt.length).fill('incorrect'))
        }
    }, [currentAttempt, wordLength, selectedPrize])
    // Helper function to update UI based on API response
    const updateUIFromApiResponse = (response: any, attempt: string[]) => {
        // Create a status array for the last attempt
        const statuses: ('correct' | 'wrong-position' | 'incorrect')[] = Array(
            attempt.length,
        ).fill('incorrect')
        // Mark correct positions
        if (response.correctPositions && Array.isArray(response.correctPositions)) {
            response.correctPositions.forEach((index: number) => {
                // Convert from 1-based to 0-based indexing
                const zeroBasedIndex = index - 1
                if (zeroBasedIndex >= 0 && zeroBasedIndex < attempt.length) {
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
                if (zeroBasedIndex >= 0 && zeroBasedIndex < attempt.length) {
                    statuses[zeroBasedIndex] = 'wrong-position'
                }
            })
        }
        // Show feedback message when word is incorrect
        setFeedback('Not in word list')
        // Clear feedback after 2 seconds
        setTimeout(() => {
            setFeedback('')
        }, 2000)
        // Update the last attempt statuses for rendering
        setLastAttemptStatuses(statuses)
        // Update locked positions and clear incorrect positions in current attempt
        const newLocks = [...lockedPositions]
        const newAttempt = Array(attempt.length).fill('')
        statuses.forEach((status, index) => {
            if (status === 'correct') {
                newLocks[index] = true
                newAttempt[index] = attempt[index]
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
        // Skip processing if the input is coming from the keyboard event listener
        // This prevents duplicate entries when typing on a physical keyboard
        if (e.nativeEvent.inputType === 'insertText') {
            return // Skip processing to prevent duplication
        }
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
        if (inputRef.current) {
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
        if (lastAttemptStatuses.length > 0 && lastAttempt) {
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
                className={`w-10 h-10 md:w-12 md:h-12 flex items-center justify-center ${bgColor} rounded-md text-white font-bold text-lg md:text-xl shadow-md`}
            >
                {letter}
            </div>
        )
    }
    const handleLetterClick = (index: number) => {
        if (!lockedPositions[index]) {
            const newAttempt = [...currentAttempt]
            newAttempt[index] = ''
            setCurrentAttempt(newAttempt)
        }
    }
    const handleKeyPress = (key: string) => {
        if (key === 'Enter' || key === 'ENTER') {
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
    return (
        <div
            className="flex flex-col w-full h-screen max-h-screen bg-[#1F2937] text-white overflow-hidden"
            ref={gameContainerRef}
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

                <div className="flex-none text-center pt-8 pb-2">
                    <p className="text-white text-xs">Timer</p>
                    <p className="text-2xl font-bold">{formatTime(timer)}</p>
                </div>
                {/* Feedback message */}
                {feedback && (
                    <div className="bg-[#374151] text-center py-2 px-4 rounded-lg mb-2 mx-auto max-w-md">
                        <p className="text-white text-lg">{feedback}</p>
                    </div>
                )}
                <div className="flex-1 flex flex-col justify-center items-center overflow-hidden px-4">
                    <input
                        ref={inputRef}
                        type="text"
                        value={currentAttempt.join('')}
                        onChange={handleInputChange}
                        className="opacity-0 h-0 w-0 absolute"
                        autoComplete="off"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck="false"
                    />
                    {/* Last attempt display */}
                    <div className="flex justify-center mt-2 mb-4">
                        <div
                            className="grid grid-cols-1 gap-2 text-2xl font-[Inter]"
                            style={{
                                gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))`,
                            }}
                        >
                            {lastAttempt
                                ? lastAttempt.map((letter, index) =>
                                    renderLetterTile(
                                        letter,
                                        index,
                                        lastAttemptStatuses.length > 0
                                            ? lastAttemptStatuses[index]
                                            : getLetterStatus(letter, index),
                                    ),
                                )
                                : Array(wordLength)
                                    .fill('')
                                    .map((_, index) => (
                                        <div
                                            key={index}
                                            className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-[#374151] rounded-md text-white font-bold text-lg md:text-xl shadow-md"
                                        >
                                            {/* Empty tile */}
                                        </div>
                                    ))}
                        </div>
                    </div>
                    {/* Current attempt */}
                    <div
                        className="flex justify-center mb-2"
                        onClick={() => inputRef.current?.focus()}
                    >
                        <div
                            className="grid grid-cols-1 gap-2"
                            style={{
                                gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))`,
                            }}
                        >
                            {Array.from({
                                length: wordLength,
                            }).map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-12 h-12 md:w-16 md:h-16 flex items-center justify-center ${currentAttempt[index] ? (lockedPositions[index] ? 'bg-[#22C55E]' : 'bg-gray-700') : 'bg-[#374151]'} rounded-md text-white font-bold text-2xl md:text-3xl shadow-md font-[Inter] ${!lockedPositions[index] ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                                    onClick={() => handleLetterClick(index)}
                                >
                                    {currentAttempt[index]}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                {/* Keyboard section - Responsive for all screen sizes */}
                <div className="flex-none pb-6 mb-24">
                    <div className="w-full max-w-md mx-auto">
                        {mobileKeyboard.map((row, rowIndex) => (
                            <div
                                key={rowIndex}
                                className={`flex justify-center mb-1 ${rowIndex === 1 ? 'px-4' : ''}`}
                            >
                                {row.map((key, keyIndex) => (
                                    <button
                                        key={`${rowIndex}-${keyIndex}`}
                                        className={`${key === 'ENTER' || key === 'Backspace' ? 'w-[60px] md:w-[80px]' : 'w-[32px] md:w-[45px]'} h-[45px] md:h-[55px] m-[1px] md:m-[2px] rounded-md bg-[#67768f] hover:bg-[#5a697f] text-white font-bold ${key === 'ENTER' ? 'text-xs md:text-sm' : 'text-md md:text-lg'} flex items-center justify-center shadow-md transition-colors`}
                                        onClick={() => handleKeyPress(key)}
                                    >
                                        {key === 'Backspace' ? (
                                            <img
                                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/cLoKd9Bc19xZnDL1tiCB5A/backspace.png"
                                                alt="Backspace"
                                                className="h-6 w-6 md:h-8 md:w-8"
                                            />
                                        ) : key === 'ENTER' ? (
                                            <span className="text-xs">ENTER</span>
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
            <CountdownModal
                isOpen={showCountdown}
                onCountdownComplete={handleCountdownComplete}
            />
            <CooldownModal
                isOpen={showCooldownModal}
                onClose={() => setShowCooldownModal(false)}
                remainingTime={cooldownTimeRemaining}
                gameType="Gold Wordoll"
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
                onClose={() => setShowWinPackageModal(false)}
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
                        gameType="wordoll"
                    />
                    <LoseModal
                        isOpen={showLoseModal}
                        onClose={() => setShowLoseModal(false)}
                        penalty={betAmount}
                        gameType="wordoll"
                    />
                    <NoAttemptsModal
                        isOpen={showNoAttemptsModal}
                        onClose={() => setShowNoAttemptsModal(false)}
                        penalty={betAmount}
                        gameType="wordoll"
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
