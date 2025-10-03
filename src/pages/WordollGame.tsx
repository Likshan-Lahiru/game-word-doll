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
import { useGlobalContext } from '../context/GlobalContext'
import { apiRequest, checkLastWinTime } from '../services/api'
import { CooldownModal } from '../components/GameModals/CooldownModal.tsx'
export function WordollGame() {
  const navigate = useNavigate()
  const { betAmount, winAmount, isAuthenticated, addCoins } = useGlobalContext()
  const [targetWord, setTargetWord] = useState('') // Keep for UI feedback only
  const [wordLength, setWordLength] = useState(5)
  const [, setSelectedLetters] = useState<string[]>([])
  const [lastAttempt, setLastAttempt] = useState<string[] | null>(null)
  const [currentAttempt, setCurrentAttempt] = useState<string[]>([])
  const [lockedPositions, setLockedPositions] = useState<boolean[]>([])
  const [timer, setTimer] = useState(0)
  const [feedback, setFeedback] = useState<string>('')
  const [isMobile, setIsMobile] = useState(false)
  const [showCountdown, setShowCountdown] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const [attempts, setAttempts] = useState(12)
  const inputRef = useRef<HTMLInputElement>(null)
  const gameContainerRef = useRef<HTMLDivElement>(null)
  const [showWinModal, setShowWinModal] = useState(false)
  const [showLoseModal, setShowLoseModal] = useState(false)
  const [showNoAttemptsModal, setShowNoAttemptsModal] = useState(false)
  const { selectedBalanceType } = useGlobalContext()
  const [guestGameSession, setGuestGameSession] = useState<any>(null)
  const [showCooldownModal, setShowCooldownModal] = useState(false)
  const [cooldownTimeRemaining, setCooldownTimeRemaining] = useState('')
  const [lastAttemptStatuses, setLastAttemptStatuses] = useState<
      ('correct' | 'wrong-position' | 'incorrect')[]
  >([])
  // Get number status (correct, wrong position, incorrect)
  const getNumberStatus = (letter: string, index: number) => {
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
    console.log('lastAttemptStatuses updated:', lastAttemptStatuses)
  }, [lastAttemptStatuses])
  useEffect(() => {
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
    if (selectedBalanceType === 'ticket') {
      setTimer(900)
    } else {
      setTimer(300)
    }
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [isAuthenticated, selectedBalanceType])
  useEffect(() => {
    if (gameStarted && !showCountdown && isMobile && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [gameStarted, showCountdown, isMobile])
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
      setShowLoseModal(true)
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
    if (isAuthenticated) {
      // For authenticated users, use the solo/last-win-check endpoint
      try {
        const userId = localStorage.getItem('userId')
        const checkWinData = {
          userId: userId,
          wordOrNumber: guess,
          gameType: 'WORDALL',
        }
        await apiRequest('/solo/last-win-check', 'POST', checkWinData)
            .then((response) => {
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
              // Process the API response for valid words
              if (response.win) {
                // User won - DON'T add coins here, let the modal handle it
                setShowWinModal(true)
              } else {
                // Set the last attempt only for valid words
                setLastAttempt([...currentAttempt])
                // User didn't win - update UI based on API feedback
                updateUIFromApiResponse(response, currentAttempt)
                // Decrease attempts
                setAttempts((prev) => prev - 1)
                // Check if out of attempts
                if (attempts <= 1) {
                  setShowNoAttemptsModal(true)
                  return
                }
              }
            })
            .catch((error) => {
              console.error('Error checking win status:', error)
              // Fall back to default handling if API call fails
              setAttempts((prev) => prev - 1)
              if (attempts <= 1) {
                setShowNoAttemptsModal(true)
              }
            })
      } catch (error) {
        console.error('Error in API request:', error)
        // Fall back to default handling if API call fails
        setAttempts((prev) => prev - 1)
        if (attempts <= 1) {
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
              // Check for "Word not in word list!" message for guest users too
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
              // Process the API response
              if (response.win) {
                // User won - DON'T add coins here, let the modal handle it
                setShowWinModal(true)
              } else {
                // Set the last attempt only for valid words
                setLastAttempt([...currentAttempt])
                // User didn't win - update UI based on API feedback
                updateUIFromApiResponse(response, currentAttempt)
                // Decrease attempts
                setAttempts((prev) => prev - 1)
                // Check if out of attempts
                if (attempts <= 1) {
                  setShowNoAttemptsModal(true)
                  return
                }
              }
            })
            .catch((error) => {
              console.error('Error checking win status:', error)
              // Fall back to default handling if API call fails
              setAttempts((prev) => prev - 1)
              if (attempts <= 1) {
                setShowNoAttemptsModal(true)
              }
            })
      } catch (error) {
        console.error('Error in API request:', error)
        // Fall back to default handling if API call fails
        setAttempts((prev) => prev - 1)
        if (attempts <= 1) {
          setShowNoAttemptsModal(true)
        }
      }
    } else {
      // Fallback for when session data is missing
      setAttempts((prev) => prev - 1)
      if (attempts <= 1) {
        setShowNoAttemptsModal(true)
      }
    }
  }, [
    currentAttempt,
    wordLength,
    isAuthenticated,
    guestGameSession,
    attempts,
    addCoins,
    winAmount,
    lockedPositions,
  ])
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
            className={`w-10 h-10 flex items-center justify-center ${bgColor} rounded-md text-white font-bold text-lg shadow-md`}
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
  const handleMobileKeyPress = (key: string) => {
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
    tileBox:
        'size-[clamp(2.75rem,10vw,4rem)] text-[clamp(1.25rem,4.2vw,1.75rem)]',
    tileBoxLg: 'size-[clamp(3.5rem,12vw,4.5rem)] text-[clamp(1.5rem,5vw,2rem)]',
    gridGap: 'gap-[clamp(0.25rem,1.6vw,0.5rem)]',
    key: 'h-[clamp(3.3rem,8.8vw,3.6rem)] w-[clamp(2.5rem,8vw,3.2rem)] text-[clamp(0.9rem,3.2vw,1.1rem)]',
    wideKey: 'w-[clamp(3.9rem,13vw,5rem)]',
    panelW: 'w-[min(92vw,360px)]',
    coinImg: 'w-5 h-5',
  }

  if (isMobile) {
    return (
        <div
            className="fixed inset-0 bg-[#1F2937] text-white overscroll-none touch-pan-y select-none overflow-hidden"
            ref={gameContainerRef}
        >
          {/* Stable viewport with safe area */}
          <div className="flex flex-col h-dvh min-h-dvh pb-[env(safe-area-inset-bottom)]">
            {/* Mobile viewport size indicator */}
            <div className="absolute top-16 right-4 z-50 bg-gray-800/80 text-xs px-2 py-1 rounded-md pointer-events-none">
              {window.innerWidth}x{window.innerHeight}
            </div>

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

              {/* Header / Timer */}
              <div className="flex-none text-center pt-8 pb-2 shrink-0">
                <p className="text-white text-xs">Timer</p>
                <p className="text-2xl font-bold">{formatTime(timer)}</p>
              </div>

              {/* Feedback message (auto height, centered, no clipping) */}
              <div className="h-2">
                {feedback && (
                    <div className="bg-[#374151] text-xs text-center py-2 px-4 rounded-lg mb-4 mx-28">
                      {feedback}

                    </div>
                )}

              </div>

              {/* Game area */}
              <div className="flex-1 flex flex-col justify-center items-center overflow-hidden px-1 min-h-0">
                {/* Hidden input kept inert to avoid zoom/scroll */}
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
                />

                {/* Last attempt display */}
                <div className="flex justify-center mt-[clamp(0.5rem,6vh,2.5rem)] mb-4">
                  <div
                      className={`grid grid-cols-1 ${S.gridGap} font-[Inter]`}
                      style={{gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))`}}
                  >
                    {lastAttempt
                        ? lastAttempt.map((letter, index) =>
                            renderLetterTile(
                                letter,
                                index,
                                lastAttemptStatuses.length > 0
                                    ? lastAttemptStatuses[index]
                                    : getNumberStatus(letter, index),
                            ),
                        )
                        : Array(wordLength)
                            .fill('')
                            .map((_, index) => (
                                <div
                                    key={index}
                                    className={`${S.tileBox} flex items-center justify-center bg-[#374151] rounded-md text-white font-bold shadow-md`}
                                />
                            ))}
                  </div>
                </div>

                {/* Current attempt */}
                <div className="flex justify-center mb-2" onClick={() => inputRef.current?.focus()}>
                  <div
                      className={`grid grid-cols-1 ${S.gridGap}`}
                      style={{gridTemplateColumns: `repeat(${wordLength}, minmax(0, 1fr))`}}
                  >
                    {Array.from({length: wordLength}).map((_, index) => (
                        <div
                            key={index}
                            className={`${S.tileBoxLg} flex items-center justify-center ${
                                currentAttempt[index]
                                    ? (lockedPositions[index] ? 'bg-[#22C55E]' : 'bg-gray-700')
                                    : 'bg-[#374151]'
                            } rounded-md text-white font-bold shadow-md font-[Inter] text-center ${
                                !lockedPositions[index] ? 'cursor-pointer' : 'cursor-not-allowed'
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

              {/* Mobile keyboard & win panel */}
              <div className="flex-none mb-0 pb-0 shrink-0">
                {/* Win panel */}
                <div className={`bg-gray-700 rounded-2xl px-6 py-1 text-center mb-5 mx-auto ${S.panelW}`}>
                  <div className="flex items-center justify-center">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                        alt="Coins"
                        className="w-4 h-4 mr-2"
                    />
                    <span className="text-lg font-bold text-white">
                  {winAmount.toLocaleString()}
                </span>
                  </div>
                  <p className="text-white text-lg font-bold">win</p>
                </div>

                {/* Keyboard */}
                <div className="w-full max-w-md mx-auto px-3">
                  {mobileKeyboard.map((row, rowIndex) => (
                      <div
                          key={rowIndex}
                          className={`flex justify-center mb-[clamp(0.2rem,0.8vw,0.35rem)] ${
                              rowIndex === 1 ? 'px-4' : ''
                          }`}
                      >
                        {row.map((key, keyIndex) => (
                            <button
                                key={`${rowIndex}-${keyIndex}`}
                                className={`${key === 'ENTER' || key === 'Backspace' ? S.wideKey : ''} ${S.key} m-[clamp(0.10rem,0.10vw,0.3rem)] rounded-md bg-[#67768f] hover:bg-[#5a697f] text-white font-bold flex items-center justify-center shadow-md transition-colors`}
                                onClick={() => handleMobileKeyPress(key)}
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

            {/* Modals */}
            <CountdownModal
                isOpen={showCountdown}
                onCountdownComplete={handleCountdownComplete}
            />
            <CooldownModal
                isOpen={showCooldownModal}
                onClose={() => setShowCooldownModal(false)}
                remainingTime={cooldownTimeRemaining}
                gameType="Wordoll"
            />
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
                      gameType={'wordoll'}
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
                onClick={() => navigate('/')}
            >
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/5dZY2vpVSVwYT3dUEHNYN5/back-icons.png"
                  alt="Back"
                  className="w-8 h-8"
              />
            </button>
          </div>
          <div className="flex-none text-center pt-8 pb-2">
            <p className="text-white text-xs">Timer</p>
            <p className="text-2xl font-bold">{formatTime(timer)}</p>
          </div>
          {/* Feedback message */}
          <div className="h-2">
            {feedback && (
                <div className="bg-[#374151] text-center py-2 px-3 rounded-lg mb-2 mx-auto w-[270px]">
                  <p className="text-white text-lg">{feedback}</p>
                </div>
            )}
          </div>


          <div className="flex-1 flex flex-col justify-center items-center overflow-hidden mt-28 px-4">
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
          {/* Last attempt display */}
          <div className="flex justify-center mt-1 mb-4">
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
                              : getNumberStatus(letter, index),
                      ),
                  )
                  : Array(wordLength)
                      .fill('')
                      .map((_, index) => (
                          <div
                              key={index}
                              className="w-10 h-10 flex items-center justify-center bg-[#374151] rounded-md text-white font-bold text-lg shadow-md"
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
                      className={`w-16 h-16 flex items-center justify-center ${currentAttempt[index] ? (lockedPositions[index] ? 'bg-[#22C55E]' : 'bg-gray-700') : 'bg-[#374151]'} rounded-md text-white font-bold text-3xl shadow-md font-[Inter] ${!lockedPositions[index] ? 'cursor-pointer' : 'cursor-not-allowed'}`}
                      onClick={() => handleLetterClick(index)}
                  >
                    {currentAttempt[index]}
                  </div>
              ))}
            </div>
          </div>
          <div className="text-center mt-20">
            <p className="text-xl font-medium font-[Inter]">
              {attempts} x attempt
            </p>
          </div>
        </div>
        {/* Keyboard section */}
        <div className="flex-none mb-0 pb-0">
          {isMobile ? (
              <>
                <div className="bg-gray-700 rounded-2xl px-6 py-2 text-center mb-4 mx-auto w-[340px] h-[65px]">
                  <div className="flex items-center justify-center">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                        alt="Coins"
                        className="5 h-5 mr-1"
                    />
                    <span className="text-lg font-bold text-white">
                    {winAmount.toLocaleString()}
                  </span>
                  </div>
                  <p className="text-white text-lg font-bold">win</p>
                </div>
                <div className="w-full max-w-md mx-auto">
                  {mobileKeyboard.map((row, rowIndex) => (
                      <div
                          key={rowIndex}
                          className={`flex justify-center mb-0.5 ${rowIndex === 1 ? 'px-4' : ''}`}
                      >
                        {row.map((key, keyIndex) => (
                            <button
                                key={`${rowIndex}-${keyIndex}`}
                                className={`${key === 'ENTER' || key === 'Backspace' ? 'w-[65px]' : 'w-[45px]'} h-[55px] ${rowIndex === 1 ? 'm-[2px]' : 'm-[2px]'} rounded-md bg-[#67768f] hover:bg-[#5a697f] text-white font-bold text-lg flex items-center justify-center shadow-md transition-colors`}
                                onClick={() => handleMobileKeyPress(key)}
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
          ) : (
              <>
                <VirtualKeyboard
                    onKeyPress={(key) => {
                      if (key === 'Enter') {
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
                    }}
                    keyboardType="qwerty"
                    className="md:block"
                />
                <div className="bg-[#374151] rounded-2xl text-center mb-3 mx-auto w-[320px] h-[60px] space-y-0">
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
                  <p className="text-xl pl-6 text-white font-inter font-semibold">
                    win
                  </p>
                </div>
              </>
          )}
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
            gameType="Wordoll"
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
                  gameType={'wordoll'}
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
