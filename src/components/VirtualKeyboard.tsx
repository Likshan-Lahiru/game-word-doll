
type KeyboardKey = {
  value: string
  label?: string
  width?: string
  action?: 'enter' | 'backspace'
  bgColor?: string
}
type VirtualKeyboardProps = {
  onKeyPress: (key: string) => void
  keyboardType: 'qwerty' | 'numeric'
  className?: string
  attemptCount?: number
  reward?: number
}
export function VirtualKeyboard({
                                  onKeyPress,
                                  keyboardType,
                                  className = '',
                                  attemptCount = 10,
                                  reward = 10000,
                                }: VirtualKeyboardProps) {
  const qwertyLayout: KeyboardKey[][] = [
    [
      {
        value: 'Q',
      },
      {
        value: 'W',
      },
      {
        value: 'E',
      },
      {
        value: 'R',
      },
      {
        value: 'T',
      },
      {
        value: 'Y',
      },
      {
        value: 'U',
      },
      {
        value: 'I',
      },
      {
        value: 'O',
      },
      {
        value: 'P',
      },
    ],
    [
      {
        value: 'A',
      },
      {
        value: 'S',
      },
      {
        value: 'D',
      },
      {
        value: 'F',
      },
      {
        value: 'G',
      },
      {
        value: 'H',
      },
      {
        value: 'J',
      },
      {
        value: 'K',
      },
      {
        value: 'L',
      },
    ],
    [
      {
        value: 'ENTER',
        width: 'w-24',
        action: 'enter',
      },
      {
        value: 'Z',
      },
      {
        value: 'X',
      },
      {
        value: 'C',
      },
      {
        value: 'V',
      },
      {
        value: 'B',
      },
      {
        value: 'N',
      },
      {
        value: 'M',
      },
      {
        value: '⌫',
        width: 'w-24',
        action: 'backspace',
      },
    ],
  ]
  const numericLayout: KeyboardKey[][] = [
    [
      {
        value: '1',
      },
      {
        value: '2',
      },
      {
        value: '3',
      },
    ],
    [
      {
        value: '4',
      },
      {
        value: '5',
      },
      {
        value: '6',
      },
    ],
    [
      {
        value: '7',
      },
      {
        value: '8',
      },
      {
        value: '9',
      },
    ],
    [
      {
        value: 'ENTER',
        action: 'enter',
      },
      {
        value: '0',
      },
      {
        value: '⌫',
        action: 'backspace',
      },
    ],
  ]
  const layout = keyboardType === 'qwerty' ? qwertyLayout : numericLayout
  const handleKeyClick = (key: KeyboardKey) => {
    if (key.action === 'enter') {
      onKeyPress('Enter')
    } else if (key.action === 'backspace') {
      onKeyPress('Backspace')
    } else {
      onKeyPress(key.value)
    }
  }
  // Render QWERTY keyboard with original styling
  if (keyboardType === 'qwerty') {
    return (
        <div className={`w-full max-w-3xl mx-auto p-2 ${className}`}>
          {layout.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center mb-2">
                {row.map((key, keyIndex) => (
                    <button
                        key={`${rowIndex}-${keyIndex}`}
                        className={`${key.width || 'w-12'} h-14 m-1 rounded-md bg-[#67768f] hover:bg-gray-500 text-white font-bold text-lg flex items-center justify-center shadow-md transition-colors`}
                        onClick={() => handleKeyClick(key)}
                    >
                      {key.label || key.value}
                    </button>
                ))}
              </div>
          ))}
        </div>
    )
  }
  // Render numeric keyboard with new styling
  return (
      <div className={`w-full max-w-md mx-auto ${className}`}>
        {/* Attempt counter */}
        <div className="text-center mb-4 text-xl font-medium text-white">
          {attemptCount} x attempt
        </div>
        {/* Numeric keypad */}
        <div className="w-full max-w-md mx-auto">
          {layout.map((row, rowIndex) => (
              <div key={rowIndex} className="flex justify-center mb-3">
                {row.map((key, keyIndex) => (
                    <button
                        key={`${rowIndex}-${keyIndex}`}
                        className={`flex-1 h-16 mx-1.5 rounded-md bg-slate-600 hover:bg-slate-500 text-white font-bold text-2xl flex items-center justify-center shadow-md transition-colors`}
                        onClick={() => handleKeyClick(key)}
                    >
                      {key.action === 'backspace' ? (
                          <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-6 w-6"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                          >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                            />
                          </svg>
                      ) : (
                          key.label || key.value
                      )}
                    </button>
                ))}
              </div>
          ))}
        </div>
        {/* Reward display */}
        <div className="mt-6 bg-slate-700 rounded-xl p-4 text-center mx-auto">
          <div className="flex items-center justify-center">
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                alt="Coins"
                className="w-6 h-6 mr-2"
            />
            <span className="text-xl text-white font-bold">
            {reward.toLocaleString()}
          </span>
          </div>
          <p className="text-white">win</p>
        </div>
      </div>
  )
}
