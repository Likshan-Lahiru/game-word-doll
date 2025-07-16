import React, { useCallback, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon } from 'lucide-react';
import { VirtualKeyboard } from '../components/VirtualKeyboard';
import { BottomNavigation } from '../components/BottomNavigation';
import { CountdownModal } from '../components/CountdownModal';
// List of 5-letter words
const WORDS = ['HELLO', 'WORLD', 'REACT', 'GAMES', 'GUESS', 'BRAIN', 'SMART'];
// Function to evaluate letter statuses
function getLetterStatuses(guess: string[], target: string): ('correct' | 'wrong-position' | 'incorrect')[] {
  const statuses: ('correct' | 'wrong-position' | 'incorrect')[] = Array(5).fill('incorrect');
  const targetLetters = target.split('');
  const used = Array(5).fill(false);
  // First pass: mark correct
  guess.forEach((letter, i) => {
    if (letter === targetLetters[i]) {
      statuses[i] = 'correct';
      used[i] = true;
    }
  });
  // Second pass: mark wrong-position
  guess.forEach((letter, i) => {
    if (statuses[i] !== 'correct') {
      const index = targetLetters.findIndex((l, j) => l === letter && !used[j]);
      if (index !== -1) {
        statuses[i] = 'wrong-position';
        used[index] = true;
      }
    }
  });
  return statuses;
}
export function WordollGame() {
  const navigate = useNavigate();
  const [targetWord, setTargetWord] = useState('');
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  const [lastAttempt, setLastAttempt] = useState<string[] | null>(null);
  const [currentAttempt, setCurrentAttempt] = useState<string[]>([]);
  const [timer, setTimer] = useState(120);
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
  useEffect(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTargetWord(randomWord);
    const targetLetters = randomWord.split('');
    const allLetters = [...targetLetters];
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    while (allLetters.length < 10) {
      const randomLetter = alphabet[Math.floor(Math.random() * alphabet.length)];
      if (!allLetters.includes(randomLetter)) {
        allLetters.push(randomLetter);
      }
    }
    const shuffled = allLetters.sort(() => Math.random() - 0.5);
    setSelectedLetters(shuffled);
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
      setIsInputFocused(true);
    }
  }, []);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isInputFocused || !gameStarted) return;
      if (/^[A-Za-z]$/.test(e.key)) {
        const letter = e.key.toUpperCase();
        if (currentAttempt.length < 5) {
          setCurrentAttempt(prev => [...prev, letter]);
        }
      } else if (e.key === 'Backspace') {
        if (currentAttempt.length > 0) {
          setCurrentAttempt(prev => prev.slice(0, -1));
        }
      } else if (e.key === 'Enter') {
        checkGuess();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentAttempt, isInputFocused, gameStarted]);
  // Only start the timer after countdown completes
  useEffect(() => {
    if (!gameStarted) return;
    if (timer <= 0) {
      navigate('/wordoll-lose');
      return;
    }
    const countdown = setInterval(() => {
      setTimer(prev => prev - 1);
    }, 1000);
    return () => clearInterval(countdown);
  }, [timer, navigate, gameStarted]);
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remaining = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remaining.toString().padStart(2, '0')}`;
  };
  const handleClear = () => {
    setCurrentAttempt([]);
    setFeedback('');
  };
  const checkGuess = useCallback(() => {
    if (currentAttempt.length !== 5) {
      setFeedback('Please enter 5 letters');
      return;
    }
    // Store the current attempt as the last attempt
    setLastAttempt([...currentAttempt]);
    const guess = currentAttempt.join('');
    // Allow any 5-letter word, not just from the predefined list
    if (guess === targetWord) {
      navigate('/wordoll-win');
      return;
    }
    // Clear current attempt for next try
    setCurrentAttempt([]);
    setFeedback('');
  }, [currentAttempt, targetWord, navigate]);
  const focusGameInput = () => {
    setIsInputFocused(true);
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
    if (isMobile) {
      setShowKeyboard(true);
    }
  };
  const handleVirtualKeyPress = (key: string) => {
    if (!gameStarted) return;
    if (key === 'Enter') {
      checkGuess();
    } else if (key === 'Backspace') {
      if (currentAttempt.length > 0) {
        setCurrentAttempt(prev => prev.slice(0, -1));
      }
    } else if (currentAttempt.length < 5) {
      setCurrentAttempt(prev => [...prev, key]);
    }
  };
  const handleCountdownComplete = () => {
    setShowCountdown(false);
    setGameStarted(true);
    if (gameContainerRef.current) {
      gameContainerRef.current.focus();
    }
  };
  const renderLetterTile = (letter: string, index: number, status: 'correct' | 'wrong-position' | 'incorrect' | null) => {
    let bgColor = 'bg-gray-700';
    if (status === 'correct') bgColor = 'bg-green-500';else if (status === 'wrong-position') bgColor = 'bg-yellow-400';else if (status === 'incorrect') bgColor = 'bg-gray-700';
    return <div key={index} className={`w-14 h-14 flex items-center justify-center ${bgColor} rounded-md text-white font-bold text-2xl shadow-md`}>
        {letter}
      </div>;
  };
  return <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white p-4" ref={gameContainerRef} tabIndex={0} onBlur={() => setIsInputFocused(false)}>
      <button className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mb-4" onClick={() => navigate('/')}>
        <img src="/back-icons.png" alt="Back" className="w-6 h-6" />
      </button>
      <div className="text-center mb-8">
        <p className="text-gray-400">Timer:</p>
        <p className="text-3xl font-bold">{formatTime(timer)}</p>
      </div>
      {feedback && <div className="bg-gray-800 text-center py-2 px-4 rounded-lg mb-4">
          {feedback}
        </div>}
      <div className="flex justify-center mb-8" onClick={focusGameInput}>
        <div className={`grid grid-cols-5 gap-2 ${isInputFocused ? 'ring-2 ring-blue-500' : ''}`}>
          {Array.from({
          length: 5
        }).map((_, index) => <div key={index} className={`w-14 h-14 flex items-center justify-center ${currentAttempt[index] ? 'bg-gray-700' : 'bg-gray-800'} rounded-md text-white font-bold text-2xl`}>
              {currentAttempt[index] || ''}
            </div>)}
        </div>
      </div>
      <div className="text-center text-gray-400 mb-4">
        {isInputFocused ? 'Type any letter A-Z or use the keyboard below' : 'Click the boxes to start typing'}
      </div>
      {/* Only show the last attempt */}
      {lastAttempt && <div className="flex justify-center mb-8">
          <div>
            <h3 className="text-center text-gray-400 mb-2">Last Attempt:</h3>
            <div className="grid grid-cols-5 gap-2">
              {lastAttempt.map((letter, index) => renderLetterTile(letter, index, getLetterStatuses(lastAttempt, targetWord)[index]))}
            </div>
          </div>
        </div>}
      {/* Virtual Keyboard */}
      {(showKeyboard || !isMobile) && <div className="mt-4 mb-4">
          <VirtualKeyboard onKeyPress={handleVirtualKeyPress} keyboardType="qwerty" className="md:block" />
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
      {/* Reward info - Moved below the keyboard */}
      <div className="bg-gray-800 rounded-xl p-4 text-center mt-4 mb-4 mx-auto">
        <div className="flex items-center justify-center">
          <img src="/point.png" alt="Coins" className="w-6 h-6 mr-2" />
          <span className="text-xl">10,000</span>
        </div>
        <p>win</p>
      </div>
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