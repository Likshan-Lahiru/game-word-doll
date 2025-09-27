import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CountdownModal } from '../components/CountdownModal'
import { WinModal } from '../components/GameModals/WinModal'
import { LoseModal } from '../components/GameModals/LoseModal'
import { NoAttemptsModal } from '../components/GameModals/NoAttemptsModal'
import { AuthenticatedWinModal } from '../components/GameModals/AuthenticatedWinModal'
import { AuthenticatedLoseModal } from '../components/GameModals/AuthenticatedLoseModal'
import { AuthenticatedNoAttemptsModal } from '../components/GameModals/AuthenticatedNoAttemptsModal'
import { useGlobalContext } from '../context/GlobalContext'
import { apiRequest, checkLastWinTime } from '../services/api'
import { CooldownModal } from '../components/GameModals/CooldownModal.tsx'
export function LockPickrGame() {
  const navigate = useNavigate()
  const globalContext = useGlobalContext()
  const { betAmount, winAmount, isAuthenticated, addCoins } = globalContext
  const [targetCode, setTargetCode] = useState<number[]>([]) // Keep for UI feedback only
  const [codeLength, setCodeLength] = useState(5)
  const [currentAttempt, setCurrentAttempt] = useState<(number | undefined)[]>(
      [],
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
  const [attemptsLeft, setAttemptsLeft] = useState(8)
  const [showNoAttemptsModal, setShowNoAttemptsModal] = useState(false)
  const [lockedPositions, setLockedPositions] = useState<boolean[]>([])
  const [guestGameSession, setGuestGameSession] = useState<any>(null)
  const [showCooldownModal, setShowCooldownModal] = useState(false)
  const [cooldownTimeRemaining, setCooldownTimeRemaining] = useState('')
  const [lastAttemptStatuses, setLastAttemptStatuses] = useState<
      ('correct' | 'wrong-position' | 'incorrect')[]
  >([])
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
  }, [isAuthenticated])
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
    if (isAuthenticated) {
      // For authenticated users, use the solo/last-win-check endpoint
      try {
        const userId = localStorage.getItem('userId')
        const checkWinData = {
          userId: userId,
          wordOrNumber: guess,
          gameType: 'LOCKPICKER',
        }
        await apiRequest('/solo/last-win-check', 'POST', checkWinData)
            .then((response) => {
              // Process the API response
              if (response.win) {
                // User won - DON'T add coins here, let the modal handle it
                // Remove: addCoins(winAmount)
                setShowWinModal(true)
              } else {
                // User didn't win - update UI based on API feedback
                updateUIFromApiResponse(response, guessArray)
                // Show feedback message when the guess is incorrect
                setFeedback('Invalid Number')
                // Clear feedback after 2 seconds
                setTimeout(() => {
                  setFeedback('')
                }, 2000)
                // Decrease attempts
                setAttemptsLeft((prev) => prev - 1)
                // Check if out of attempts
                if (attemptsLeft <= 1) {
                  setShowNoAttemptsModal(true)
                  return
                }
                // Focus the input for next attempt
                if (inputRef.current) {
                  inputRef.current.focus()
                }
              }
            })
            .catch((error) => {
              console.error('Error checking win status:', error)
              // Fall back to default handling if API call fails
              setAttemptsLeft((prev) => prev - 1)
              if (attemptsLeft <= 1) {
                setShowNoAttemptsModal(true)
              }
            })
      } catch (error) {
        console.error('Error in API request:', error)
        // Fall back to default handling if API call fails
        setAttemptsLeft((prev) => prev - 1)
        if (attemptsLeft <= 1) {
          setShowNoAttemptsModal(true)
        }
      }
    } else if (!isAuthenticated && guestGameSession) {
      // For non-authenticated users, use the guess/win-check endpoint
      try {
        const checkWinData = {
          googleSessionId: guestGameSession.googleSessionId,
          wordOrNumber: guess,
          gameType: guestGameSession.gameType,
        }
        await apiRequest('/guess/win-check', 'POST', checkWinData, false)
            .then((response) => {
              // Process the API response
              if (response.win) {
                // User won - DON'T add coins here, let the modal handle it
                // Remove: addCoins(winAmount)
                setShowWinModal(true)
              } else {
                // User didn't win - update UI based on API feedback
                updateUIFromApiResponse(response, guessArray)
                // Show feedback message when the guess is incorrect
                setFeedback('Invalid Number')
                // Clear feedback after 2 seconds
                setTimeout(() => {
                  setFeedback('')
                }, 2000)
                // Decrease attempts
                setAttemptsLeft((prev) => prev - 1)
                // Check if out of attempts
                if (attemptsLeft <= 1) {
                  setShowNoAttemptsModal(true)
                  return
                }
                // Focus the input for next attempt
                if (inputRef.current) {
                  inputRef.current.focus()
                }
              }
            })
            .catch((error) => {
              console.error('Error checking win status:', error)
              // Fall back to default handling if API call fails
              setAttemptsLeft((prev) => prev - 1)
              if (attemptsLeft <= 1) {
                setShowNoAttemptsModal(true)
              }
            })
      } catch (error) {
        console.error('Error in API request:', error)
        // Fall back to default handling if API call fails
        setAttemptsLeft((prev) => prev - 1)
        if (attemptsLeft <= 1) {
          setShowNoAttemptsModal(true)
        }
      }
    } else {
      // Fallback for when session data is missing
      setAttemptsLeft((prev) => prev - 1)
      if (attemptsLeft <= 1) {
        setShowNoAttemptsModal(true)
      }
    }
  }, [
    currentAttempt,
    isAuthenticated,
    guestGameSession,
    attemptsLeft,
    addCoins,
    winAmount,
  ])
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
  // Handle mobile number pad key press
  const handleMobileKeyPress = (key: string) => {
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
  // Handle desktop number pad key press
  const handleDesktopKeyPress = (key: string) => {
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


// ---- sizing tokens
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

// ---- mobile branch (drop-in) ----
  if (isMobile) {
    return (
        <div
            className="fixed inset-0 flex flex-col bg-[#1F2937] text-white overscroll-none touch-pan-y select-none"
            ref={gameContainerRef}
            tabIndex={0}
        >
          {/* Stable viewport wrapper + safe area */}
          <div className="flex flex-col h-dvh min-h-dvh pb-[env(safe-area-inset-bottom)]">
            <div className="relative flex flex-col h-full">
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

              {/* Mobile viewport size indicator (kept same) */}
              <div className="absolute top-16 right-4 z-50 bg-gray-800/80 text-xs px-2 py-1 rounded-md">
                {window.innerWidth}x{window.innerHeight}
              </div>

              {/* Timer (same spacing) */}
              <div className="flex-none text-center pt-16 pb-4">
                <p className="text-xs">Timer</p>
                <p className="text-2xl font-bold">{formatTime(timer)}</p>
              </div>

              {/* Feedback (unchanged) */}
              <div className="h-2">
                {feedback && (
                    <div className="bg-[#374151] text-xs text-center py-2 px-4 rounded-lg mb-4 mx-28">
                      {feedback}

                    </div>
                )}

              </div>


              {/* Game area */}
              <div className="flex-1 flex flex-col justify-center items-center overflow-hidden px-4">
                {/* Hidden input for keyboard (kept inert) */}
                <input
                    ref={inputRef}
                    type="tel"
                    inputMode="none"
                    pattern="[0-9]*"
                    value={currentAttempt.filter((n) => n !== undefined).join('')}
                    onChange={handleInputChange}
                    className="opacity-0 h-0 w-0 absolute pointer-events-none"
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    readOnly
                />

                {/* Last attempt display */}
                <div className="flex justify-center mt-[clamp(0.5rem,6vh,3rem)] mb-2">
                  <div
                      className={`grid grid-cols-1 ${S.gridGap}`}
                      style={{ gridTemplateColumns: `repeat(${codeLength}, minmax(0, 1fr))` }}
                  >
                    {(lastAttempt.length > 0 ? lastAttempt : Array(codeLength).fill('')).map((num, index) => {
                      const status = lastAttempt.length > 0 ? getNumberStatus(num as number, index) : null;
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
                <div className="flex justify-center mb-6" onClick={() => inputRef.current?.focus()}>
                  <div
                      className={`grid grid-cols-1 ${S.gridGap}`}
                      style={{ gridTemplateColumns: `repeat(${codeLength}, minmax(0, 1fr))` }}
                  >
                    {Array.from({ length: codeLength }).map((_, index) => (
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

                {/* Attempts count (unchanged) */}
                <div className="text-center mt-[clamp(0.5rem,2vh,1rem)]">
                  <p className="text-xl font-medium font-[Inter]">
                    {attemptsLeft} x attempt
                  </p>
                </div>
              </div>

              {/* Mobile number pad */}
              <div className="flex-none pb-4">
                {/* Win panel */}
                <div className={`bg-gray-700 rounded-2xl px-6 py-1 text-center mb-5 mx-auto ${S.panelW}`}>
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

                {/* Key rows (same layout, responsive height/font) */}
                <div className="w-full max-w-md mx-auto">
                  {/* Row 1: 1-2-3 */}
                  <div className="flex justify-between mb-2 px-4">
                    {[1, 2, 3].map((num) => (
                        <button
                            key={num}
                            className={`w-[32%] ${S.keyH} bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white ${S.keyText} font-bold`}
                            onClick={() => handleMobileKeyPress(num.toString())}
                        >
                          {num}
                        </button>
                    ))}
                  </div>
                  {/* Row 2: 4-5-6 */}
                  <div className="flex justify-between mb-2 px-4">
                    {[4, 5, 6].map((num) => (
                        <button
                            key={num}
                            className={`w-[32%] ${S.keyH} bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white ${S.keyText} font-bold`}
                            onClick={() => handleMobileKeyPress(num.toString())}
                        >
                          {num}
                        </button>
                    ))}
                  </div>
                  {/* Row 3: 7-8-9 */}
                  <div className="flex justify-between mb-2 px-4">
                    {[7, 8, 9].map((num) => (
                        <button
                            key={num}
                            className={`w-[32%] ${S.keyH} bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white ${S.keyText} font-bold`}
                            onClick={() => handleMobileKeyPress(num.toString())}
                        >
                          {num}
                        </button>
                    ))}
                  </div>
                  {/* Row 4: ENTER-0-Backspace */}
                  <div className="flex justify-between px-4">
                    <button
                        className={`w-[32%] ${S.keyH} bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white ${S.enterText} font-bold`}
                        onClick={() => handleMobileKeyPress('ENTER')}
                    >
                      ENTER
                    </button>
                    <button
                        className={`w-[32%] ${S.keyH} bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white ${S.keyText} font-bold`}
                        onClick={() => handleMobileKeyPress('0')}
                    >
                      0
                    </button>
                    <button
                        className={`w-[32%] ${S.keyH} bg-[#67768F] hover:bg-[#2A3141] rounded-md text-white flex items-center justify-center`}
                        onClick={() => handleMobileKeyPress('Backspace')}
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
            </div>

            {/* Modals (unchanged) */}
            <CountdownModal
                isOpen={showCountdown}
                onCountdownComplete={handleCountdownComplete}
            />
            <CooldownModal
                isOpen={showCooldownModal}
                onClose={() => setShowCooldownModal(false)}
                remainingTime={cooldownTimeRemaining}
                gameType="Lock Pickr"
            />
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
        </div>
    );
  }


  // Desktop view
  return (
      <div
          className="flex flex-col w-full h-screen max-h-screen bg-[#1E2532] text-white overflow-hidden"
          ref={gameContainerRef}
          tabIndex={0}
      >
        <div className="relative flex flex-col h-full">
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
          <div className="flex-none text-center pt-8 pb-4">
            <p className="text-white text-xs">Timer</p>
            <p className="text-2xl font-bold">{formatTime(timer)}</p>
          </div>
          {/* Feedback message */}
          {feedback && (
              <div className="bg-[#374151] text-center py-1 px-4 rounded-lg mb-2 mx-auto max-w-md">
                <p className="text-white text-md">{feedback}</p>
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
                          className={`w-12 h-12 flex items-center justify-center ${bgColor} rounded-md text-white font-bold text-3xl shadow-md`}
                      >
                        {typeof num === 'number' ? num : ''}
                      </div>
                  )
                })}
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
                    gridTemplateColumns: `repeat(${codeLength}, minmax(0, 1fr))`,
                  }}
              >
                {Array.from({
                  length: codeLength,
                }).map((_, index) => (
                    <div
                        key={index}
                        className={`w-16 h-16 flex items-center justify-center ${lockedPositions[index] ? 'bg-[#22C55E]' : 'bg-[#374151]'} rounded-md text-white font-bold text-3xl shadow-md`}
                    >
                      {currentAttempt[index] !== undefined
                          ? currentAttempt[index]
                          : ''}
                    </div>
                ))}
              </div>
            </div>
            {/* Attempts count */}
            <div className="text-center mb-2">
              <p className="text-xl font-medium">{attemptsLeft} x attempt</p>
            </div>
          </div>
          {/* Desktop number pad */}
          <div className="flex-none pb-0">
            <div className="w-full max-w-md mx-auto">
              {/* Row 1: 1-2-3 */}
              <div className="flex justify-center gap-2 mb-2">
                {[1, 2, 3].map((num) => (
                    <button
                        key={num}
                        className="w-[115px] h-[55px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white text-3xl font-bold shadow-md"
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
                        className="w-[115px] h-[50px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white text-3xl font-bold shadow-md"
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
                        className="w-[115px] h-[50px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white text-3xl font-bold shadow-md"
                        onClick={() => handleDesktopKeyPress(num.toString())}
                    >
                      {num}
                    </button>
                ))}
              </div>
              {/* Row 4: ENTER-0-Backspace */}
              <div className="flex justify-center gap-2">
                <button
                    className="w-[115px] h-[50px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white text-lg font-bold shadow-md"
                    onClick={() => handleDesktopKeyPress('ENTER')}
                >
                  ENTER
                </button>
                <button
                    className="w-[115px] h-[50px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white text-3xl font-bold shadow-md"
                    onClick={() => handleDesktopKeyPress('0')}
                >
                  0
                </button>
                <button
                    className="w-[115px] h-[50px] bg-[#67768F] hover:bg-[#374151] rounded-md text-white flex items-center justify-center shadow-md"
                    onClick={() => handleDesktopKeyPress('Backspace')}
                >
                  <img
                      src="https://uploadthingy.s3.us-west-1.amazonaws.com/cLoKd9Bc19xZnDL1tiCB5A/backspace.png"
                      alt="Backspace"
                      className="h-8 w-8"
                  />
                </button>
              </div>
              <div className="bg-[#374151] rounded-2xl text-center mt-2 mb-2 mx-auto w-[320px] h-[60px] space-y-0">
                <div className="flex items-center justify-center pt-2 h-8">
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
            gameType="Lock Pickr"
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
