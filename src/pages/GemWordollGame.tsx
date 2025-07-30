import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { VirtualKeyboard } from '../components/VirtualKeyboard'
import { CountdownModal } from '../components/CountdownModal'
import { useGlobalContext } from '../context/GlobalContext'
import { UserWinGemModal } from '../components/GameModals/UserWinGemModal'
import { TimeEndedGemModal } from '../components/GameModals/TimeEndedGemModal'
import { NoAttemptsGemModal } from '../components/GameModals/NoAttemptsGemModal'
const WORDS = ['HELLO', 'WORLD', 'REACT', 'GAMES', 'GUESS', 'BRAIN', 'SMART']
function getLetterStatuses(
    guess: string[],
    target: string,
): ('correct' | 'wrong-position' | 'incorrect')[] {
    const statuses: ('correct' | 'wrong-position' | 'incorrect')[] =
        Array(5).fill('incorrect')
    const targetLetters = target.split('')
    const used = Array(5).fill(false)
    guess.forEach((letter, i) => {
        if (letter === targetLetters[i]) {
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
    // Get ticket amount and gem pool from location state
    const { ticketAmount = 1, gemPool = 55.0 } =
    (location.state as {
        ticketAmount: number
        gemPool: number
    }) || {}
    const [targetWord, setTargetWord] = useState('')
    const [, setSelectedLetters] = useState<string[]>([])
    const [lastAttempt, setLastAttempt] = useState<string[]>(Array(5).fill(''))
    const [currentAttempt, setCurrentAttempt] = useState<string[]>(
        Array(5).fill(''),
    )
    const [lockedPositions, setLockedPositions] = useState<boolean[]>(
        Array(5).fill(false),
    )
    const [timer, setTimer] = useState(300)
    const [feedback, setFeedback] = useState<string>('')
    const [isMobile, setIsMobile] = useState(false)
    const [showCountdown, setShowCountdown] = useState(true)
    const [gameStarted, setGameStarted] = useState(false)
    const [attempts, setAttempts] = useState(20)
    const inputRef = useRef<HTMLInputElement>(null)
    const gameContainerRef = useRef<HTMLDivElement>(null)
    // Game status modals
    const [showUserWinModal, setShowUserWinModal] = useState(false)
    const [showTimeEndedModal, setShowTimeEndedModal] = useState(false)
    const [showNoAttemptsModal, setShowNoAttemptsModal] = useState(false)
    const [gameCompleted, setGameCompleted] = useState(false)
    // Define game outcome handlers first
    const handleUserWin = () => {
        setGameCompleted(true)
        setShowUserWinModal(true)
    }
    const handleTimeEnded = () => {
        setGameCompleted(true)
        setShowTimeEndedModal(true)
    }
    const handleNoAttemptsLeft = () => {
        setGameCompleted(true)
        setShowNoAttemptsModal(true)
    }
    const handleGameWon = () => {
        handleUserWin()
    }
    const handleGameLost = () => {
        if (timer <= 0) {
            handleTimeEnded()
        } else {
            handleNoAttemptsLeft()
        }
    }
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])
    useEffect(() => {
        const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)]
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
    }, [])
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
                for (let i = 0; i < 5; i++) {
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
                for (let i = 4; i >= 0; i--) {
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
    }, [currentAttempt, gameStarted, lockedPositions, gameCompleted])
    useEffect(() => {
        if (!gameStarted || gameCompleted) return
        if (timer <= 0) {
            handleTimeEnded()
            return
        }
        const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000)
        return () => clearInterval(countdown)
    }, [timer, gameStarted, gameCompleted])
    const checkGuess = useCallback(() => {
        const guess = currentAttempt.join('')
        if (guess.length < 5 || currentAttempt.includes('')) {
            setFeedback('Please enter 5 letters')
            return
        }
        setLastAttempt([...currentAttempt])
        if (guess === targetWord) {
            handleGameWon()
            return
        }
        const statuses = getLetterStatuses(currentAttempt, targetWord)
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
        setAttempts((prev) => prev - 1)
        if (attempts <= 1) {
            handleNoAttemptsLeft()
            return
        }
        setFeedback('')
    }, [currentAttempt, targetWord, lockedPositions, attempts])
    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const remaining = seconds % 60
        return `${minutes.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`
    }
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z]/g, '')
        const newAttempt = [...currentAttempt]
        let inputIndex = 0
        for (let i = 0; i < 5 && inputIndex < value.length; i++) {
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
        if (status === 'correct') bgColor = 'bg-[#22C55E]'
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
            for (let i = 4; i >= 0; i--) {
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
            for (let i = 0; i < 5; i++) {
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
            className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white p-4"
            ref={gameContainerRef}
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

            <div className="text-center mb-28 mt-20">
                <p className="text-white text-xs">Timer</p>
                <p className="text-2xl font-bold">{formatTime(timer)}</p>
            </div>

            {feedback && (
                <div className="bg-[#374151] text-center py-2 px-4 rounded-lg mb-4">
                    {feedback}
                </div>
            )}

            {isMobile && (
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
            )}

            {/* Last attempt display - Always shown */}
            <div className="flex justify-center mb-8">
                <div className="grid grid-cols-5 gap-2 text-2xl font-[Inter]">
                    {lastAttempt.map((letter, index) => {
                        // Only check status if there's an actual letter
                        const hasActualLetter = letter !== ''
                        const status = hasActualLetter
                            ? getLetterStatuses(lastAttempt, targetWord)[index]
                            : null
                        return renderLetterTile(letter, index, status)
                    })}
                </div>
            </div>

            <div
                className="flex justify-center mb-8 "
                onClick={() => inputRef.current?.focus()}
            >
                <div className="grid grid-cols-5 gap-2">
                    {Array.from({
                        length: 5,
                    }).map((_, index) => (
                        <div
                            key={index}
                            className={`w-16 h-16 flex items-center justify-center ${currentAttempt[index] ? (lockedPositions[index] ? 'bg-[#22C55E]' : 'bg-gray-700') : 'bg-[#374151]'} rounded-md text-white font-bold text-3xl shadow-md font-[Inter] ${!lockedPositions[index] && !gameCompleted ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                            onClick={() => handleLetterClick(index)}
                        >
                            {currentAttempt[index]}
                        </div>
                    ))}
                </div>
            </div>

            <div className="text-center my-1">
                <p className="text-xl font-medium font-[Inter]">{attempts} x attempt</p>
            </div>

            {isMobile && (
                <>
                    <div className="w-full max-w-md mx-auto">
                        {mobileKeyboard.map((row, rowIndex) => (
                            <div
                                key={rowIndex}
                                className={`flex justify-center mb-0.5 ${rowIndex === 1 ? 'px-4' : ''}`}
                            >
                                {row.map((key, keyIndex) => (
                                    <button
                                        key={`${rowIndex}-${keyIndex}`}
                                        className={`${key === 'ENTER' || key === 'Backspace' ? 'w-[70px]' : 'w-[45px]'} h-[55px] ${rowIndex === 1 ? 'm-[2px]' : 'm-[2px]'} rounded-md bg-[#67768f] hover:bg-[#5a697f] text-white font-bold text-lg flex items-center justify-center shadow-md transition-colors ${gameCompleted ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        onClick={() => handleMobileKeyPress(key)}
                                        disabled={gameCompleted}
                                    >
                                        {key === 'Backspace' ? (
                                            <img
                                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/cLoKd9Bc19xZnDL1tiCB5A/backspace.png"
                                                alt="Backspace"
                                                className="h-8 w-8"
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
                </>
            )}

            {!isMobile && (
                <>
                    <div className="mt-4 mb-4">
                        <VirtualKeyboard
                            onKeyPress={(key) => {
                                if (gameCompleted) return
                                if (key === 'Enter') {
                                    checkGuess()
                                } else if (key === 'Backspace') {
                                    let lastFilled = -1
                                    for (let i = 4; i >= 0; i--) {
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
                                    for (let i = 0; i < 5; i++) {
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
                            }}
                            keyboardType="qwerty"
                            className="md:block"
                        />
                    </div>
                </>
            )}

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
                gemAmount={gemPool}
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
        </div>
    )
}
