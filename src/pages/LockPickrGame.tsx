import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { VirtualKeyboard } from '../components/VirtualKeyboard'
import { BottomNavigation } from '../components/BottomNavigation'
import { CountdownModal } from '../components/CountdownModal'
import { WinModal } from '../components/GameModals/WinModal'
import { LoseModal } from '../components/GameModals/LoseModal'
export function LockPickrGame() {
  const navigate = useNavigate()
  const [targetCode, setTargetCode] = useState<number[]>([])
  const [currentAttempt, setCurrentAttempt] = useState<number[]>([])
  const [lastAttempt, setLastAttempt] = useState<number[] | null>(null)
  const [timer, setTimer] = useState(300) // 5 minutes in seconds
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
      setShowWinModal(true)
      return
    }
    // Clear current attempt for next try
    setCurrentAttempt([])
    setFeedback('')
    // Focus the input for next attempt
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentAttempt, targetCode])
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
          {/* Last attempt display - Now shown first */}
          {lastAttempt && (
              <div className="flex justify-center mb-6">
                <div className="grid grid-cols-5 gap-2">
                  {lastAttempt.map((num, index) => {
                    const status = getNumberStatus(num, index)
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
                          {num}
                        </div>
                    )
                  })}
                </div>
              </div>
          )}
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
          {/* Attempts count */}
          <div className="text-center mb-4">
            <p className="text-xl font-medium font-[Inter]">50 x attempt</p>
          </div>
          {/* Win bar */}
          <div className="bg-gray-700 rounded-2xl px-6 py-2 text-center mb-8 mt-2 mx-auto  w-[320px] h-[65px]">
            <div className="flex items-center justify-center">
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                  alt="Coins"
                  className="w-6 h-6 mr-2"
              />
              <span className="text-lg font-bold text-white">10,000</span>
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
          {/* Win Modal */}
          <WinModal
              isOpen={showWinModal}
              onClose={() => setShowWinModal(false)}
              reward={15000}
              gameType="lockpickr"
          />
          {/* Lose Modal */}
          <LoseModal
              isOpen={showLoseModal}
              onClose={() => setShowLoseModal(false)}
              penalty={2000}
              gameType="lockpickr"
          />
        </div>
    )
  }
  // Desktop view - updated to match the screenshot
  return (
      <div
          className="flex flex-col w-full min-h-screen bg-[#1E2532] text-white p-4"
          ref={gameContainerRef}
          tabIndex={0}
      >
        {/* Timer */}
        <div className="text-center mb-12 mt-8">
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
        {/* Last attempt display - Now shown first */}
        {lastAttempt && (
            <div className="flex justify-center mb-10">
              <div className="grid grid-cols-5 gap-4">
                {lastAttempt.map((num, index) => {
                  const status = getNumberStatus(num, index)
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
                        {num}
                      </div>
                  )
                })}
              </div>
            </div>
        )}
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
        {/* Attempts count */}
        <div className="text-center mb-8">
          <p className="text-xl font-medium">50 x attempt</p>
        </div>
        {/* Desktop number pad */}
        <div className="w-full max-w-md mx-auto mb-10">
          {/* Row 1: 1-2-3 */}
          <div className="flex justify-center gap-4 mb-4">
            {[1, 2, 3].map((num) => (
                <button
                    key={num}
                    className="w-[140px] h-[70px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white text-3xl font-bold shadow-md"
                    onClick={() => handleDesktopKeyPress(num.toString())}
                >
                  {num}
                </button>
            ))}
          </div>
          {/* Row 2: 4-5-6 */}
          <div className="flex justify-center gap-4 mb-4">
            {[4, 5, 6].map((num) => (
                <button
                    key={num}
                    className="w-[140px] h-[70px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white text-3xl font-bold shadow-md"
                    onClick={() => handleDesktopKeyPress(num.toString())}
                >
                  {num}
                </button>
            ))}
          </div>
          {/* Row 3: 7-8-9 */}
          <div className="flex justify-center gap-4 mb-4">
            {[7, 8, 9].map((num) => (
                <button
                    key={num}
                    className="w-[140px] h-[70px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white text-3xl font-bold shadow-md"
                    onClick={() => handleDesktopKeyPress(num.toString())}
                >
                  {num}
                </button>
            ))}
          </div>
          {/* Row 4: ENTER-0-Backspace */}
          <div className="flex justify-center gap-4">
            <button
                className="w-[140px] h-[70px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white text-lg font-bold shadow-md"
                onClick={() => handleDesktopKeyPress('ENTER')}
            >
              ENTER
            </button>
            <button
                className="w-[140px] h-[70px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white text-3xl font-bold shadow-md"
                onClick={() => handleDesktopKeyPress('0')}
            >
              0
            </button>
            <button
                className="w-[140px] h-[70px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white flex items-center justify-center shadow-md"
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
          <div className="bg-gray-700 rounded-2xl px-6 py-2 text-center mb-8 mt-2 mx-auto  w-[320px] h-[65px]">
            <div className="flex items-center justify-center">
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                  alt="Coins"
                  className="w-6 h-6 mr-2"
              />
              <span className="text-lg font-bold text-white">10,000</span>
            </div>
            <p className="text-white text-lg font-bold">win</p>
          </div>
        </div>
        {/* Countdown Modal */}
        <CountdownModal
            isOpen={showCountdown}
            onCountdownComplete={handleCountdownComplete}
        />
        {/* Win Modal */}
        <WinModal
            isOpen={showWinModal}
            onClose={() => setShowWinModal(false)}
            reward={15000}
            gameType="lockpickr"
        />
        {/* Lose Modal */}
        <LoseModal
            isOpen={showLoseModal}
            onClose={() => setShowLoseModal(false)}
            penalty={2000}
            gameType="lockpickr"
        />
      </div>
  )
}
