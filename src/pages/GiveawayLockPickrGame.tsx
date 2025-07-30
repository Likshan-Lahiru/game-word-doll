import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { CountdownModal } from '../components/CountdownModal'
import { WinModal } from '../components/GameModals/WinModal'
import { LoseModal } from '../components/GameModals/LoseModal'
import { AuthenticatedWinModal } from '../components/GameModals/AuthenticatedWinModal'
import { AuthenticatedLoseModal } from '../components/GameModals/AuthenticatedLoseModal'
import { PrizeWinModal } from '../components/GameModals/PrizeWinModal'
import { useGlobalContext } from '../context/GlobalContext'
export function GiveawayLockPickrGame() {
    const navigate = useNavigate()
    const location = useLocation()
    const { spinBalance, setSpinBalance, isAuthenticated } = useGlobalContext()
    const [targetCode, setTargetCode] = useState<number[]>([])
    const [currentAttempt, setCurrentAttempt] = useState<number[]>([])
    const [lastAttempt, setLastAttempt] = useState<number[]>([]) // Initialize as empty array instead of null
    const [timer, setTimer] = useState(900) // 15 minutes in seconds
    const [feedback, setFeedback] = useState<string>('')
    const [isInputFocused, setIsInputFocused] = useState(false)
    const gameContainerRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const [isMobile, setIsMobile] = useState(false)
    const [showCountdown, setShowCountdown] = useState(true)
    const [gameStarted, setGameStarted] = useState(false)
    const [showWinModal, setShowWinModal] = useState(false)
    const [showLoseModal, setShowLoseModal] = useState(false)
    const [showPrizeWinModal, setShowPrizeWinModal] = useState(false)
    const [prizeCoinAmount, setPrizeCoinAmount] = useState(0)
    const [prizeSpinAmount, setPrizeSpinAmount] = useState(0)
    // Check if device is mobile
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])
    // Initialize the game
    useEffect(() => {
        // Generate a random 5-digit code
        const code = Array.from(
            {
                length: 5,
            },
            () => Math.floor(Math.random() * 10),
        )
        setTargetCode(code)
        // Auto-focus the input when the component mounts
        if (inputRef.current) {
            inputRef.current.focus()
            setIsInputFocused(true)
        }
    }, [])
    // Focus input when game starts
    useEffect(() => {
        if (gameStarted && !showCountdown && inputRef.current) {
            setTimeout(() => {
                inputRef.current?.focus()
            }, 300)
        }
    }, [gameStarted, showCountdown])
    // Keyboard input handler
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (!gameStarted) return
            // Handle number input (0-9)
            if (/^[0-9]$/.test(e.key)) {
                const number = parseInt(e.key, 10)
                if (currentAttempt.length < 5) {
                    setCurrentAttempt((prev) => [...prev, number])
                }
            }
            // Handle backspace
            else if (e.key === 'Backspace') {
                if (currentAttempt.length > 0) {
                    setCurrentAttempt((prev) => prev.slice(0, -1))
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
    }, [currentAttempt, gameStarted])
    // Timer countdown - only start after countdown completes
    useEffect(() => {
        if (!gameStarted) return
        if (timer <= 0) {
            setShowLoseModal(true)
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
        const value = e.target.value.replace(/[^0-9]/g, '')
        if (value.length <= 5) {
            setCurrentAttempt(value.split('').map((num) => parseInt(num, 10)))
        }
    }
    // Check if the guess is correct
    const checkGuess = useCallback(() => {
        if (currentAttempt.length < 5) {
            setFeedback('Invalid Number')
            return
        }
        // Store current attempt as the last attempt
        setLastAttempt([...currentAttempt])
        // Check if the guess matches the target code
        const isCorrect = currentAttempt.every(
            (num, index) => num === targetCode[index],
        )
        if (isCorrect) {
            // Get the selected prize from session storage
            const prizeString = sessionStorage.getItem('selectedPrize')
            if (prizeString) {
                const prize = JSON.parse(prizeString)
                setPrizeCoinAmount(prize.coinAmount)
                setPrizeSpinAmount(prize.spinAmount)
                setShowPrizeWinModal(true)
            } else {
                // Fallback if no prize is found (should not happen in normal flow)
                if (isAuthenticated) {
                    setSpinBalance((prev) => prev + 1)
                }
                setShowWinModal(true)
            }
            return
        }
        // Clear current attempt for next try
        setCurrentAttempt([])
        setFeedback('')
        // Focus the input for next attempt
        if (inputRef.current) {
            inputRef.current.focus()
        }
    }, [currentAttempt, targetCode, isAuthenticated, setSpinBalance])
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
        if (targetCode[index] === num) {
            return 'correct' // Correct number in correct position
        } else if (targetCode.includes(num)) {
            return 'wrong-position' // Correct number in wrong position
        } else {
            return 'incorrect' // Incorrect number
        }
    }
    // Handle mobile number pad key press
    const handleMobileKeyPress = (key: string) => {
        if (key === 'ENTER') {
            checkGuess()
        } else if (key === 'Backspace') {
            if (currentAttempt.length > 0) {
                setCurrentAttempt((prev) => prev.slice(0, -1))
            }
        } else if (/^[0-9]$/.test(key)) {
            const number = parseInt(key, 10)
            if (currentAttempt.length < 5) {
                setCurrentAttempt((prev) => [...prev, number])
            }
        }
    }
    // Handle desktop number pad key press
    const handleDesktopKeyPress = (key: string) => {
        if (key === 'ENTER') {
            checkGuess()
        } else if (key === 'Backspace') {
            if (currentAttempt.length > 0) {
                setCurrentAttempt((prev) => prev.slice(0, -1))
            }
        } else if (/^[0-9]$/.test(key)) {
            const number = parseInt(key, 10)
            if (currentAttempt.length < 5) {
                setCurrentAttempt((prev) => [...prev, number])
            }
        }
    }
    // Mobile view
    if (isMobile) {
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
                        onClick={() => navigate('/giveaway-entry')}
                    >
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/5dZY2vpVSVwYT3dUEHNYN5/back-icons.png"
                            alt="Back"
                            className="w-8 h-8"
                        />
                    </button>
                </div>
                {/* Timer */}
                <div className="text-center mb-24 mt-20">
                    <p className="text-gray-400">Timer</p>
                    <p className="text-4xl font-bold">{formatTime(timer)}</p>
                </div>
                {/* Feedback message */}
                {feedback && (
                    <div className="bg-[#374151] text-center py-2 px-4 rounded-lg mb-4">
                        {feedback}
                    </div>
                )}
                {/* Hidden input for keyboard */}
                <input
                    ref={inputRef}
                    type="tel"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={currentAttempt.join('')}
                    onChange={handleInputChange}
                    className="opacity-0 h-0 w-0 absolute"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                />
                {/* Last attempt display - Always shown */}
                <div className="flex justify-center mb-6">
                    <div className="grid grid-cols-5 gap-2">
                        {(lastAttempt.length > 0 ? lastAttempt : Array(5).fill('')).map(
                            (num, index) => {
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
                                        className={`w-10 h-10 flex items-center justify-center ${bgColor} rounded-md text-white font-bold text-xl`}
                                    >
                                        {typeof num === 'number' ? num : ''}
                                    </div>
                                )
                            },
                        )}
                    </div>
                </div>
                {/* Current attempt - Clickable to enable keyboard input - Now shown second */}
                <div
                    className="flex justify-center mb-6"
                    onClick={() => inputRef.current?.focus()}
                >
                    <div className="grid grid-cols-5 gap-2">
                        {Array.from({
                            length: 5,
                        }).map((_, index) => {
                            const status =
                                currentAttempt[index] !== undefined && lastAttempt
                                    ? getNumberStatus(currentAttempt[index], index)
                                    : null
                            let bgColor = 'bg-[#2A3141]'
                            if (currentAttempt[index] !== undefined) {
                                if (status === 'correct') {
                                    bgColor = 'bg-[#22C55E]'
                                } else if (status === 'wrong-position') {
                                    bgColor = 'bg-[#C5BD22]'
                                } else {
                                    bgColor = 'bg-[#374151]'
                                }
                            }
                            return (
                                <div
                                    key={index}
                                    className={`w-14 h-14 flex items-center justify-center ${bgColor} rounded-md text-white font-bold text-xl`}
                                >
                                    {currentAttempt[index] !== undefined
                                        ? currentAttempt[index]
                                        : ''}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Mobile number pad */}
                <div className="w-full max-w-md mx-auto">
                    {/* Row 1: 1-2-3 */}
                    <div className="flex justify-between mb-2">
                        {[1, 2, 3].map((num) => (
                            <button
                                key={num}
                                className="w-[32%] h-14 bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white text-3xl font-bold"
                                onClick={() => handleMobileKeyPress(num.toString())}
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
                                className="w-[32%] h-14 bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white text-3xl font-bold"
                                onClick={() => handleMobileKeyPress(num.toString())}
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
                                className="w-[32%] h-14 bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white text-3xl font-bold"
                                onClick={() => handleMobileKeyPress(num.toString())}
                            >
                                {num}
                            </button>
                        ))}
                    </div>
                    {/* Row 4: ENTER-0-Backspace */}
                    <div className="flex justify-between">
                        <button
                            className="w-[32%] h-14 bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white text-xl font-bold"
                            onClick={() => handleMobileKeyPress('ENTER')}
                        >
                            ENTER
                        </button>
                        <button
                            className="w-[32%] h-14 bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white text-3xl font-bold"
                            onClick={() => handleMobileKeyPress('0')}
                        >
                            0
                        </button>
                        <button
                            className="w-[32%] h-14 bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white flex items-center justify-center"
                            onClick={() => handleMobileKeyPress('Backspace')}
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
                {/* Prize Win Modal */}
                <PrizeWinModal
                    isOpen={showPrizeWinModal}
                    onClose={() => setShowPrizeWinModal(false)}
                    coinAmount={prizeCoinAmount}
                    spinAmount={prizeSpinAmount}
                />
                {/* Conditionally render different modals based on authentication status */}
                {isAuthenticated ? (
                    <>
                        <AuthenticatedWinModal
                            isOpen={showWinModal}
                            onClose={() => {
                                setShowWinModal(false)
                                navigate('/giveaway-entry')
                            }}
                            reward={1}
                            rewardType="spin"
                        />
                        <AuthenticatedLoseModal
                            isOpen={showLoseModal}
                            onClose={() => {
                                setShowLoseModal(false)
                                navigate('/giveaway-entry')
                            }}
                            penalty={0}
                        />
                    </>
                ) : (
                    <>
                        <WinModal
                            isOpen={showWinModal}
                            onClose={() => {
                                setShowWinModal(false)
                                navigate('/giveaway-entry')
                            }}
                            reward={1}
                            gameType="lockpickr"
                            rewardType="spin"
                        />
                        <LoseModal
                            isOpen={showLoseModal}
                            onClose={() => {
                                setShowLoseModal(false)
                                navigate('/giveaway-entry')
                            }}
                            penalty={0}
                            gameType="lockpickr"
                        />
                    </>
                )}
            </div>
        )
    }
    // Desktop view
    return (
        <div
            className="flex flex-col w-full min-h-screen bg-[#1E2532] text-white p-4"
            ref={gameContainerRef}
            tabIndex={0}
        >
            {/* Back button */}
            <div className="absolute top-12 left-4 z-10">
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
            {/* Timer */}
            <div className="text-center mb-16 mt-8">
                <p className="text-white">Timer</p>
                <p className="text-3xl font-bold">{formatTime(timer)}</p>
            </div>
            {/* Feedback message */}
            {feedback && (
                <div className="bg-[#374151] text-center py-2 px-4 rounded-lg mb-4">
                    <p className="text-white text-lg">{feedback}</p>
                </div>
            )}
            {/* Hidden input for keyboard */}
            <input
                ref={inputRef}
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                value={currentAttempt.join('')}
                onChange={handleInputChange}
                className="opacity-0 h-0 w-0 absolute"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
            />
            {/* Last attempt display - Always shown */}
            <div className="flex justify-center mb-10">
                <div className="grid grid-cols-5 gap-4">
                    {(lastAttempt.length > 0 ? lastAttempt : Array(5).fill('')).map(
                        (num, index) => {
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
                                    className={`w-12 h-12 flex items-center justify-center ${bgColor} rounded-md text-white font-bold text-3xl shadow-md`}
                                >
                                    {typeof num === 'number' ? num : ''}
                                </div>
                            )
                        },
                    )}
                </div>
            </div>
            {/* Current attempt - Clickable to enable keyboard input - Now shown second */}
            <div
                className="flex justify-center mb-12"
                onClick={() => inputRef.current?.focus()}
            >
                <div className="grid grid-cols-5 gap-4">
                    {Array.from({
                        length: 5,
                    }).map((_, index) => {
                        const status =
                            currentAttempt[index] !== undefined
                                ? getNumberStatus(currentAttempt[index], index)
                                : null
                        let bgColor = 'bg-[#2A3141]'
                        if (currentAttempt[index] !== undefined) {
                            if (status === 'correct') {
                                bgColor = 'bg-[#22C55E]'
                            } else if (status === 'wrong-position') {
                                bgColor = 'bg-[#C5BD22]'
                            } else {
                                bgColor = 'bg-[#374151]'
                            }
                        }
                        return (
                            <div
                                key={index}
                                className={`w-16 h-16 flex items-center justify-center ${bgColor} rounded-md text-white font-bold text-3xl shadow-md`}
                            >
                                {currentAttempt[index] !== undefined
                                    ? currentAttempt[index]
                                    : ''}
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* Desktop number pad */}
            <div className="w-full max-w-md mx-auto mb-10">
                {/* Row 1: 1-2-3 */}
                <div className="flex justify-center gap-2 mb-2">
                    {[1, 2, 3].map((num) => (
                        <button
                            key={num}
                            className="w-[140px] h-[65px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white text-3xl font-bold shadow-md"
                            onClick={() => handleDesktopKeyPress(num.toString())}
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
                            className="w-[140px] h-[65px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white text-3xl font-bold shadow-md"
                            onClick={() => handleDesktopKeyPress(num.toString())}
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
                            className="w-[140px] h-[65px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white text-3xl font-bold shadow-md"
                            onClick={() => handleDesktopKeyPress(num.toString())}
                        >
                            {num}
                        </button>
                    ))}
                </div>
                {/* Row 4: ENTER-0-Backspace */}
                <div className="flex justify-center gap-2">
                    <button
                        className="w-[140px] h-[65px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white text-lg font-bold shadow-md"
                        onClick={() => handleDesktopKeyPress('ENTER')}
                    >
                        ENTER
                    </button>
                    <button
                        className="w-[140px] h-[65px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white text-3xl font-bold shadow-md"
                        onClick={() => handleDesktopKeyPress('0')}
                    >
                        0
                    </button>
                    <button
                        className="w-[140px] h-[65px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white flex items-center justify-center shadow-md"
                        onClick={() => handleDesktopKeyPress('Backspace')}
                    >
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/cLoKd9Bc19xZnDL1tiCB5A/backspace.png"
                            alt="Backspace"
                            className="h-8 w-8"
                        />
                    </button>
                </div>
                <br />
            </div>
            {/* Countdown Modal */}
            <CountdownModal
                isOpen={showCountdown}
                onCountdownComplete={handleCountdownComplete}
            />
            {/* Conditionally render different modals based on authentication status */}
            {isAuthenticated ? (
                <>
                    <AuthenticatedWinModal
                        isOpen={showWinModal}
                        onClose={() => {
                            setShowWinModal(false)
                            navigate('/giveaway-entry')
                        }}
                        reward={1}
                        rewardType="spin"
                    />
                    <AuthenticatedLoseModal
                        isOpen={showLoseModal}
                        onClose={() => {
                            setShowLoseModal(false)
                            navigate('/giveaway-entry')
                        }}
                        penalty={0}
                    />
                </>
            ) : (
                <>
                    <WinModal
                        isOpen={showWinModal}
                        onClose={() => {
                            setShowWinModal(false)
                            navigate('/giveaway-entry')
                        }}
                        reward={1}
                        gameType="lockpickr"
                        rewardType="spin"
                    />
                    <LoseModal
                        isOpen={showLoseModal}
                        onClose={() => {
                            setShowLoseModal(false)
                            navigate('/giveaway-entry')
                        }}
                        penalty={0}
                        gameType="lockpickr"
                    />
                </>
            )}
        </div>
    )
}
