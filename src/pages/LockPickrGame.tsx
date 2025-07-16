import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { BottomNavigation } from '../components/BottomNavigation';
import { CountdownModal } from '../components/CountdownModal';
export function LockPickrGame() {
  const navigate = useNavigate();
  const [targetCode, setTargetCode] = useState<number[]>([]);
  const [currentAttempt, setCurrentAttempt] = useState<number[]>([]);
  const [lastAttempt, setLastAttempt] = useState<number[] | null>(null);
  const [timer, setTimer] = useState(90); // 1.5 minutes in seconds
  const [feedback, setFeedback] = useState<string>('');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false); // Hide keyboard by default on mobile
  const gameContainerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [showCountdown, setShowCountdown] = useState(true);
  const [gameStarted, setGameStarted] = useState(false);
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  // Initialize the game
  useEffect(() => {
    // Generate a random 6-digit code
    const code = Array.from({
      length: 6
    }, () => Math.floor(Math.random() * 10));
    setTargetCode(code);
    // Auto-focus the game container when the component mounts
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
      setIsInputFocused(true);
    }
  }, []);
  // Keyboard input handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isInputFocused || !gameStarted) return;
      // Handle number input (0-9)
      if (/^[0-9]$/.test(e.key)) {
        const number = parseInt(e.key, 10);
        if (currentAttempt.length < 6) {
          setCurrentAttempt(prev => [...prev, number]);
        }
      }
      // Handle backspace
      else if (e.key === 'Backspace') {
        if (currentAttempt.length > 0) {
          setCurrentAttempt(prev => prev.slice(0, -1));
        }
      }
      // Handle enter key
      else if (e.key === 'Enter') {
        checkGuess();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentAttempt, isInputFocused, gameStarted]);
  // Timer countdown - only start after countdown completes
  useEffect(() => {
    if (!gameStarted) return;
    if (timer <= 0) {
      navigate('/lock-pickr-lose');
      return;
    }
    const countdown = setInterval(() => {
      setTimer(prevTimer => prevTimer - 1);
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer, navigate, gameStarted]);
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  // Clear current attempt
  const handleClear = () => {
    setCurrentAttempt([]);
    setFeedback('');
  };
  // Handle virtual keyboard input
  const handleVirtualKeyPress = (key: string) => {
    if (!gameStarted) return;
    if (key === 'Enter') {
      checkGuess();
    } else if (key === 'Backspace') {
      if (currentAttempt.length > 0) {
        setCurrentAttempt(prev => prev.slice(0, -1));
      }
    } else if (/^[0-9]$/.test(key)) {
      const number = parseInt(key, 10);
      if (currentAttempt.length < 6) {
        setCurrentAttempt(prev => [...prev, number]);
      }
    }
  };
  // Check if the guess is correct
  const checkGuess = useCallback(() => {
    if (currentAttempt.length !== 6) {
      setFeedback('Please enter 6 numbers');
      return;
    }
    // Store current attempt as the last attempt
    setLastAttempt([...currentAttempt]);
    // Check if the guess is correct (all numbers match)
    const isCorrect = currentAttempt.every((num, index) => num === targetCode[index]);
    if (isCorrect) {
      navigate('/lock-pickr-win');
      return;
    }
    // Clear current attempt for next try
    setCurrentAttempt([]);
    setFeedback('');
  }, [currentAttempt, targetCode, navigate]);
  // Handle countdown completion
  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setGameStarted(true);
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
  };
  // Focus the game container to enable keyboard input
  const focusGameInput = () => {
    setIsInputFocused(true);
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
    if (isMobile) {
      setShowKeyboard(true);
    }
  };
  // Get number status (correct, wrong position, incorrect)
  const getNumberStatus = (num: number, index: number) => {
    if (targetCode[index] === num) {
      return 'correct'; // Correct number in correct position
    } else if (targetCode.includes(num)) {
      return 'wrong-position'; // Correct number in wrong position
    } else {
      return 'incorrect'; // Incorrect number
    }
  };
  // Render number tiles with appropriate colors
  const renderNumberTile = (num: number, index: number) => {
    const status = getNumberStatus(num, index);
    let bgColor = 'bg-gray-700';
    if (status === 'correct') {
      bgColor = 'bg-green-500';
    } else if (status === 'wrong-position') {
      bgColor = 'bg-yellow-400';
    }
    return <div key={index} className={`w-12 h-12 flex items-center justify-center ${bgColor} rounded-md text-white font-bold text-xl shadow-md`}>
        {num}
      </div>;
  };
  return <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white p-4" ref={gameContainerRef} tabIndex={0} // Make div focusable
  onBlur={() => setIsInputFocused(false)}>
      {/* Back button */}
      <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mb-4" onClick={() => navigate('/')}>
        <img src="/back-icons.png" alt="Back" className="w-6 h-6" />
      </button>

      {/* Timer */}
      <div className="text-center mb-8">
        <p className="text-gray-400">Timer:</p>
        <p className="text-3xl font-bold">{formatTime(timer)}</p>
      </div>

      {/* Feedback message */}
      {feedback && <div className="bg-gray-800 text-center py-2 px-4 rounded-lg mb-4">
          {feedback}
        </div>}

      {/* Current attempt - Clickable to enable keyboard input */}
      <div className="flex justify-center mb-8" onClick={focusGameInput}>
        <div className={`grid grid-cols-6 gap-2 ${isInputFocused ? 'ring-2 ring-blue-500' : ''}`}>
          {Array.from({
          length: 6
        }).map((_, index) => <div key={index} className={`w-12 h-12 flex items-center justify-center ${currentAttempt[index] !== undefined ? 'bg-gray-700' : 'bg-gray-800'} rounded-md text-white font-bold text-xl`}>
              {currentAttempt[index] !== undefined ? currentAttempt[index] : ''}
            </div>)}
        </div>
      </div>

      {/* Keyboard input instruction */}
      <div className="text-center text-gray-400 mb-4">
        {isInputFocused ? 'Type any number 0-9 or use the keypad below' : 'Click the boxes to start typing'}
      </div>

      {/* Only show the last attempt */}
      {lastAttempt && <div className="flex justify-center mb-8">
          <div>
            <h3 className="text-center text-gray-400 mb-2">Last Attempt:</h3>
            <div className="grid grid-cols-6 gap-2">
              {lastAttempt.map((num, index) => renderNumberTile(num, index))}
            </div>
          </div>
        </div>}

      {/* Virtual Keyboard */}
      {(showKeyboard || !isMobile) && <div className="mt-12 mb-4">
          <VirtualKeyboard onKeyPress={handleVirtualKeyPress} keyboardType="numeric" className="md:block" attemptCount={10} reward={15000} />
        </div>}

      {/* Action buttons - show only when virtual keyboard is hidden on mobile */}
      {!showKeyboard && isMobile && <div className="space-y-4 mt-4">
          <button className="w-full bg-blue-500 hover:bg-blue-600 rounded-xl py-3 text-white font-bold text-xl" onClick={checkGuess}>
            Enter
          </button>
          <button className="w-full bg-gray-800 hover:bg-gray-700 rounded-xl py-3 text-white font-bold text-xl" onClick={handleClear}>
            Clear
          </button>
        </div>}

      {/* Toggle keyboard button on mobile */}
      {isMobile && <button className="w-full bg-gray-700 rounded-xl py-2 text-white font-medium mt-2 mb-4" onClick={() => setShowKeyboard(!showKeyboard)}>
          {showKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}
        </button>}

      {/* Countdown Modal */}
      <CountdownModal isOpen={showCountdown} onCountdownComplete={handleCountdownComplete} />

      {/* Add Bottom Navigation */}
      <BottomNavigation />
    </div>;
}