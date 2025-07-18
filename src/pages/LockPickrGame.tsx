import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { VirtualKeyboard } from '../components/VirtualKeyboard'
import { CountdownModal } from '../components/CountdownModal'
import {WinModal} from "../components/GameModals/WinModal.tsx";
import {LoseModal} from "../components/GameModals/LoseModal.tsx";

export function LockPickrGame() {
  useNavigate();
  const [targetCode, setTargetCode] = useState<number[]>([])
  const [currentAttempt, setCurrentAttempt] = useState<number[]>([])
  const [lastAttempt, setLastAttempt] = useState<number[] | null>(null)
  const [timer, setTimer] = useState(300) // 5 minutes in seconds
  const [feedback, setFeedback] = useState<string>('')
  const [, setIsInputFocused] = useState(false)
  const gameContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showCountdown, setShowCountdown] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const [, setIdleTime] = useState(0)
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
    // Generate a random 6-digit code
    const code = Array.from(
        {
          length: 6,
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
        if (currentAttempt.length < 6) {
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
    if (value.length <= 6) {
      setCurrentAttempt(value.split('').map((num) => parseInt(num, 10)))
    }
  }
  // Check if the guess is correct
  const checkGuess = useCallback(() => {
    if (currentAttempt.length !== 6) {
      setFeedback('Please enter 6 numbers')
      return
    }
    // Store current attempt as the last attempt
    setLastAttempt([...currentAttempt])
    // Check if the guess is correct (all numbers match)
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
  // Render number tiles with appropriate colors
  return (
      <div
          className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white p-4"
          ref={gameContainerRef}
          tabIndex={0}
      >
        {/* Timer */}
        <div className="text-center mb-8">
          <p className="text-gray-400">Timer:</p>
          <p className="text-3xl font-bold">{formatTime(timer)}</p>
        </div>

        {/* Feedback message */}
        {feedback && (
            <div className="bg-gray-800 text-center py-2 px-4 rounded-lg mb-4">
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
            className={
              isMobile ? 'opacity-0 h-0 w-0 absolute' : 'opacity-0 h-0 w-0 absolute'
            }
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
        />

        {/* Current attempt - Clickable to enable keyboard input */}
        <div
            className="flex justify-center mb-8"
            onClick={() => inputRef.current?.focus()}
        >
          <div className="grid grid-cols-6 gap-2">
            {Array.from({
              length: 6,
            }).map((_, index) => (
                <div
                    key={index}
                    className={`w-10 h-10 flex items-center justify-center ${currentAttempt[index] !== undefined ? 'bg-gray-700' : 'bg-[#374151]'} rounded-md text-white font-bold text-xl`}
                >
                  {currentAttempt[index] !== undefined ? currentAttempt[index] : ''}
                </div>
            ))}
          </div>
        </div>

        {/* Only show the last attempt */}
        {lastAttempt && (
            <div className="flex justify-center mb-8">
              <div>
                <h3 className="text-center text-gray-400 mb-2">Last Attempt:</h3>
                <div className="grid grid-cols-6 gap-2">
                  {lastAttempt.map((num, index) => (
                      <div
                          key={index}
                          className={`w-14 h-14 flex items-center justify-center ${getNumberStatus(num, index) === 'correct' ? 'bg-green-500' : getNumberStatus(num, index) === 'wrong-position' ? 'bg-yellow-400' : 'bg-gray-700'} rounded-md text-white font-bold text-lg shadow-md`}
                      >
                        {num}
                      </div>
                  ))}
                </div>
              </div>
            </div>
        )}

        {/* Virtual Keyboard - Only on desktop */}
        {!isMobile && (
            <div className="mt-12 mb-4">
              <VirtualKeyboard
                  onKeyPress={(key) => {
                    if (key === 'Enter') {
                      checkGuess()
                    } else if (key === 'Backspace') {
                      if (currentAttempt.length > 0) {
                        setCurrentAttempt((prev) => prev.slice(0, -1))
                      }
                    } else if (/^[0-9]$/.test(key)) {
                      const number = parseInt(key, 10)
                      if (currentAttempt.length < 6) {
                        setCurrentAttempt((prev) => [...prev, number])
                      }
                    }
                  }}
                  keyboardType="numeric"
                  className="md:block"
                  attemptCount={50}
                  reward={15000}
              />
            </div>
        )}

        {/* Mobile reward display */}
        {isMobile && (
            <div className="text-center my-6">
              <p className="text-xl font-medium">50 x attempt</p>
            </div>
        )}

        {/* Mobile reward display */}
        {isMobile && (
            <div className="bg-gray-700 rounded-xl px-6 py-4 text-center mt-6 mb-4 mx-auto w-[320px]">
              <div className="flex items-center justify-center h-10">
                <img
                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                    alt="Coins"
                    className="w-6 h-6 mr-2"
                />
                <span className="text-xl font-semibold text-white">15,000</span>
              </div>
              <p className="text-sm text-gray-300">win</p>
            </div>
        )}

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
