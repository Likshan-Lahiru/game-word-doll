import React, { useCallback, useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { VirtualKeyboard } from '../components/VirtualKeyboard'
import { CountdownModal } from '../components/CountdownModal'
// List of 5-letter words
const WORDS = ['HELLO', 'WORLD', 'REACT', 'GAMES', 'GUESS', 'BRAIN', 'SMART']
// Function to evaluate letter statuses
function getLetterStatuses(
    guess: string[],
    target: string,
): ('correct' | 'wrong-position' | 'incorrect')[] {
  const statuses: ('correct' | 'wrong-position' | 'incorrect')[] =
      Array(5).fill('incorrect')
  const targetLetters = target.split('')
  const used = Array(5).fill(false)
  // First pass: mark correct
  guess.forEach((letter, i) => {
    if (letter === targetLetters[i]) {
      statuses[i] = 'correct'
      used[i] = true
    }
  })
  // Second pass: mark wrong-position
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
export function WordollGame() {
  const navigate = useNavigate()
  const [targetWord, setTargetWord] = useState('')
  const [, setSelectedLetters] = useState<string[]>([])
  const [lastAttempt, setLastAttempt] = useState<string[] | null>(null)
  const [currentAttempt, setCurrentAttempt] = useState<string[]>([])
  const [timer, setTimer] = useState(300) // 5 minutes in seconds
  const [feedback, setFeedback] = useState<string>('')
  const gameContainerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [isMobile, setIsMobile] = useState(false)
  const [showCountdown, setShowCountdown] = useState(true)
  const [gameStarted, setGameStarted] = useState(false)
  const [attempts, setAttempts] = useState(20) // Number of attempts
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
    const shuffled = allLetters.sort(() => Math.random() - 0.5)
    setSelectedLetters(shuffled)
  }, [])
  // Focus input and open keyboard on mobile when game starts
  useEffect(() => {
    if (gameStarted && !showCountdown && isMobile && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 300)
    }
  }, [gameStarted, showCountdown, isMobile])
  // Keyboard input handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!gameStarted) return
      if (/^[A-Za-z]$/.test(e.key)) {
        const letter = e.key.toUpperCase()
        if (currentAttempt.length < 5) {
          setCurrentAttempt((prev) => [...prev, letter])
        }
      } else if (e.key === 'Backspace') {
        if (currentAttempt.length > 0) {
          setCurrentAttempt((prev) => prev.slice(0, -1))
        }
      } else if (e.key === 'Enter') {
        checkGuess()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentAttempt, gameStarted])
  // Timer countdown - only start after countdown completes
  useEffect(() => {
    if (!gameStarted) return
    if (timer <= 0) {
      navigate('/wordoll-lose')
      return
    }
    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(countdown)
  }, [timer, navigate, gameStarted])
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remaining = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`
  }
  const checkGuess = useCallback(() => {
    if (currentAttempt.length !== 5) {
      setFeedback('Please enter 5 letters')
      return
    }
    // Store the current attempt as the last attempt
    setLastAttempt([...currentAttempt])
    const guess = currentAttempt.join('')
    // Allow any 5-letter word, not just from the predefined list
    if (guess === targetWord) {
      navigate('/wordoll-win')
      return
    }
    // Decrement attempts
    setAttempts((prev) => prev - 1)
    // Clear current attempt for next try
    setCurrentAttempt([])
    setFeedback('')
  }, [currentAttempt, targetWord, navigate])
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase()
    if (value.length <= 5) {
      setCurrentAttempt(value.split(''))
    }
  }
  const handleCountdownComplete = () => {
    setShowCountdown(false)
    setGameStarted(true)
    // Focus the input to open keyboard on mobile
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
    if (status === 'correct') bgColor = 'bg-green-500'
    else if (status === 'wrong-position') bgColor = 'bg-yellow-400'
    else if (status === 'incorrect') bgColor = 'bg-gray-700'
    return (
        <div
            key={index}
            className={`w-14 h-14 flex items-center justify-center ${bgColor} rounded-md text-white font-bold text-xl shadow-md`}
        >
          {letter}
        </div>
    )
  }
  return (
      <div
          className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white p-4"
          ref={gameContainerRef}
      >
        <br />
        <br />
        <br />
        <br />
        <br />
        {/* Timer */}
        <div className="text-center mb-8">
          <p className="text-gray-400">Timer</p>
          <p className="text-3xl font-bold">{formatTime(timer)}</p>
        </div>
        {/* Feedback message */}
        {feedback && (
            <div className="bg-[#374151] text-center py-2 px-4 rounded-lg mb-4">
              {feedback}
            </div>
        )}
        {/* Hidden input for mobile keyboard */}
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
        {/* Current attempt */}
        <div
            className="flex justify-center mb-8"
            onClick={() => inputRef.current?.focus()}
        >
          <div className="grid grid-cols-5 gap-2">
            {Array.from({
              length: 5,
            }).map((_, index) => (
                <div
                    key={index}
                    className={`w-10 h-10 flex items-center justify-center ${currentAttempt[index] ? 'bg-gray-700' : 'bg-[#374151]'} rounded-md text-white font-bold text-lg shadow-md`}
                >
                  {currentAttempt[index] || ''}
                </div>
            ))}
          </div>
        </div>
        {/* Only show the last attempt */}
        {lastAttempt && (
            <div className="flex justify-center mb-8">
              <div className="grid grid-cols-5 gap-2">
                {lastAttempt.map((letter, index) =>
                    renderLetterTile(
                        letter,
                        index,
                        getLetterStatuses(lastAttempt, targetWord)[index],
                    ),
                )}
              </div>
            </div>
        )}
        {/* Attempts counter */}
        <div className="text-center my-6">
          <p className="text-xl font-medium">{attempts} x attempt</p>
        </div>
        {/* Reward info - Only show on mobile */}
        {isMobile && (
            <div className="bg-gray-700 rounded-xl px-6 py-2 text-center mt-2 mb-4 mx-auto w-[300px]">
              <div className="flex items-center justify-center h-10">
                <img
                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                    alt="Coins"
                    className="w-5 h-5 mr-2"
                />
                <span className="text-lg font-semibold text-white">10,000</span>
              </div>
              <p className="text-sm text-gray-300">win</p>
            </div>
        )}
        {/* Virtual Keyboard - Only on desktop */}
        {!isMobile && (
            <div className="mt-4 mb-4">
              <VirtualKeyboard
                  onKeyPress={(key) => {
                    if (key === 'Enter') {
                      checkGuess()
                    } else if (key === 'Backspace') {
                      if (currentAttempt.length > 0) {
                        setCurrentAttempt((prev) => prev.slice(0, -1))
                      }
                    } else if (currentAttempt.length < 5) {
                      setCurrentAttempt((prev) => [...prev, key])
                    }
                  }}
                  keyboardType="qwerty"
                  className="md:block"
              />
            </div>
        )}
        {/* Reward info - Only show on desktop, positioned under keyboard */}
        {!isMobile && (
            <div className="bg-gray-700 rounded-xl px-6 py-4 text-center mt-6 mb-4 mx-auto w-[320px]">
              <div className="flex items-center justify-center h-10">
                <img
                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                    alt="Coins"
                    className="w-6 h-6 mr-2"
                />
                <span className="text-xl font-semibold text-white">10,000</span>
              </div>
              <p className="text-sm text-gray-300">win</p>
            </div>
        )}
        {/* Countdown Modal */}
        <CountdownModal
            isOpen={showCountdown}
            onCountdownComplete={handleCountdownComplete}
        />
      </div>
  )
}
