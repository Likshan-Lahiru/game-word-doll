import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { VirtualKeyboard } from '../components/VirtualKeyboard'
import { BottomNavigation } from '../components/BottomNavigation'
import { CountdownModal } from '../components/CountdownModal'
import { WinModal } from '../components/GameModals/WinModal'
import { LoseModal } from '../components/GameModals/LoseModal'
import { NoAttemptsModal } from '../components/GameModals/NoAttemptsModal'
import { AuthenticatedWinModal } from '../components/GameModals/AuthenticatedWinModal'
import { AuthenticatedLoseModal } from '../components/GameModals/AuthenticatedLoseModal'
import { AuthenticatedNoAttemptsModal } from '../components/GameModals/AuthenticatedNoAttemptsModal'
import { useGlobalContext } from '../context/GlobalContext'
export function LockPickrGame() {
  const navigate = useNavigate()
  const globalContext = useGlobalContext()
  const { betAmount, winAmount, isAuthenticated, addCoins } = globalContext
  const [targetCode, setTargetCode] = useState<number[]>([])
  const [currentAttempt, setCurrentAttempt] = useState<(number | undefined)[]>(
      Array(5).fill(undefined),
  )
  const [lastAttempt, setLastAttempt] = useState<number[]>([])
  const [timer, setTimer] = useState(300)
  const [feedback, setFeedback] = useState<string>('')
  const [isInputFocused, setIsInputFocused] = useState(false)
  const gameContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showCountdown, setShowCountdown] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const [idleTime, setIdleTime] = useState(0)
  const lastActivityRef = useRef(Date.now())
  const [showWinModal, setShowWinModal] = useState(false)
  const [showLoseModal, setShowLoseModal] = useState(false)
  const [attemptsLeft, setAttemptsLeft] = useState(50)
  const [showNoAttemptsModal, setShowNoAttemptsModal] = useState(false)
  const [lockedPositions, setLockedPositions] = useState<boolean[]>(
      Array(5).fill(false),
  )
  // Define checkGuess before any useEffect that depends on it
  const checkGuess = useCallback(() => {
    // Check if we have a complete attempt (all 5 positions filled)
    const hasEmptyPositions = currentAttempt.some((num) => num === undefined)
    if (hasEmptyPositions) {
      setFeedback('Invalid Number')
      return
    }
    // Store current attempt as the last attempt
    setLastAttempt(currentAttempt.map((n) => (n !== undefined ? n : 0)))
    // Check if the guess matches the target code
    const isCorrect = currentAttempt.every(
        (num, index) => num === targetCode[index],
    )
    if (isCorrect) {
      if (isAuthenticated) {
        addCoins(winAmount) // Use the selected win amount
      }
      setShowWinModal(true)
      return
    }
    // Update locked positions for correct numbers
    const newLocks = [...lockedPositions]
    const newAttempt = [...currentAttempt]
    currentAttempt.forEach((num, index) => {
      if (num === targetCode[index]) {
        newLocks[index] = true
        // Keep the correct number in the new attempt
        newAttempt[index] = num
      } else {
        // Clear incorrect positions
        newAttempt[index] = undefined
      }
    })
    setLockedPositions(newLocks)
    setCurrentAttempt(newAttempt)
    // Decrease attempts
    setAttemptsLeft((prev) => prev - 1)
    // Check if out of attempts
    if (attemptsLeft <= 1) {
      setShowNoAttemptsModal(true)
      return
    }
    setFeedback('')
    // Focus the input for next attempt
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [
    currentAttempt,
    targetCode,
    attemptsLeft,
    isAuthenticated,
    winAmount,
    addCoins,
    lockedPositions,
  ])
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
          setShowLoseModal(true)
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
        for (let i = 0; i < 5; i++) {
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
        for (let i = 4; i >= 0; i--) {
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
  }, [currentAttempt, gameStarted, lockedPositions, checkGuess])
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
    // Skip processing if the input is coming from the keyboard event listener
    // This prevents duplicate entries when typing on a physical keyboard
    if (e.nativeEvent.inputType === 'insertText') {
      const value = e.target.value.replace(/[^0-9]/g, '')
      if (value.length <= 5) {
        const newAttempt = [...currentAttempt]
        let valueIndex = 0
        // Fill in non-locked positions with input values
        for (let i = 0; i < 5 && valueIndex < value.length; i++) {
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
    if (key === 'ENTER') {
      checkGuess()
    } else if (key === 'Backspace') {
      // Find the rightmost filled non-locked position
      let lastFilled = -1
      for (let i = 4; i >= 0; i--) {
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
      for (let i = 0; i < 5; i++) {
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
    if (key === 'ENTER') {
      checkGuess()
    } else if (key === 'Backspace') {
      // Find the rightmost filled non-locked position
      let lastFilled = -1
      for (let i = 4; i >= 0; i--) {
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
      for (let i = 0; i < 5; i++) {
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
  // Mobile view
  if (isMobile) {
    return (
        <div
            className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white p-4"
            ref={gameContainerRef}
            tabIndex={0}
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
          {/* Timer */}
          <div className="text-center mb-24 mt-20">
            <p className="text-xs">Timer</p>
            <p className="text-2xl font-bold">{formatTime(timer)}</p>
          </div>
          {/* Feedback message */}

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
              }).map((_, index) => (
                  <div
                      key={index}
                      className={`w-14 h-14 flex items-center justify-center ${lockedPositions[index] ? 'bg-[#22C55E]' : 'bg-[#374151]'} rounded-md text-white font-bold text-xl`}
                  >
                    {currentAttempt[index] !== undefined
                        ? currentAttempt[index]
                        : ''}
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
          {/* Win bar */}
          <div className="bg-gray-700 rounded-2xl px-6 py-2 text-center mb-8 mt-2 mx-auto  w-[320px] h-[65px]">
            <div className="flex items-center justify-center">
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                  alt="Coins"
                  className="w-6 h-6 mr-2"
              />
              <span className="text-lg font-bold text-white">
              {winAmount.toLocaleString()}
            </span>
            </div>
            <p className="text-white text-lg font-bold">win</p>
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
          {/* Conditionally render different modals based on authentication status */}
          {isAuthenticated ? (
              <>
                <AuthenticatedWinModal
                    isOpen={showWinModal}
                    onClose={() => setShowWinModal(false)}
                    reward={winAmount}
                />
                <AuthenticatedLoseModal
                    isOpen={showLoseModal}
                    onClose={() => setShowLoseModal(false)}
                    penalty={2000}
                />
                <AuthenticatedNoAttemptsModal
                    isOpen={showNoAttemptsModal}
                    onClose={() => setShowNoAttemptsModal(false)}
                    penalty={2000}
                />
              </>
          ) : (
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
                    penalty={2000}
                    gameType="lockpickr"
                />
                <NoAttemptsModal
                    isOpen={showNoAttemptsModal}
                    onClose={() => setShowNoAttemptsModal(false)}
                    penalty={2000}
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
        <div className="text-center mb-14 mt-16">
          <p className="text-white text-xs">Timer</p>
          <p className="text-2xl font-bold">{formatTime(timer)}</p>
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
        />
        {/* Last attempt display - Always shown */}
        <div className="flex justify-center mb-7 mt-16">
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
            className="flex justify-center mb-10"
            onClick={() => inputRef.current?.focus()}
        >
          <div className="grid grid-cols-5 gap-2">
            {Array.from({
              length: 5,
            }).map((_, index) => (
                <div
                    key={index}
                    className={`w-16 h-16 flex items-center justify-center ${lockedPositions[index] ? 'bg-[#22C55E]' : 'bg-[#374151]'} rounded-md text-white font-bold text-3xl shadow-md`}
                >
                  {currentAttempt[index] !== undefined ? currentAttempt[index] : ''}
                </div>
            ))}
          </div>
        </div>
        {/* Attempts count */}
        <div className="text-center mb-5">
          <p className="text-xl font-medium">{attemptsLeft} x attempt</p>
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
          <div className="bg-[#374151] rounded-2xl text-center mt-2 mb-4 mx-auto w-[320px] h-15 space-y-0">
            <div className="flex items-center justify-center pt-2 h-10">
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                  alt="Coins"
                  className="w-5 h-5 mr-2"
              />
              <span className="text-xl font-['Inter'] font-semibold text-white">
              {winAmount.toLocaleString()}
            </span>
            </div>
            <p className="text-xl pl-6 text-white font-semibold">win</p>
          </div>
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
                  onClose={() => setShowWinModal(false)}
                  reward={winAmount}
              />
              <AuthenticatedLoseModal
                  isOpen={showLoseModal}
                  onClose={() => setShowLoseModal(false)}
                  penalty={2000}
              />
              <AuthenticatedNoAttemptsModal
                  isOpen={showNoAttemptsModal}
                  onClose={() => setShowNoAttemptsModal(false)}
                  penalty={2000}
              />
            </>
        ) : (
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
                  penalty={2000}
                  gameType="lockpickr"
              />
              <NoAttemptsModal
                  isOpen={showNoAttemptsModal}
                  onClose={() => setShowNoAttemptsModal(false)}
                  penalty={2000}
              />
            </>
        )}
      </div>
  )
}
