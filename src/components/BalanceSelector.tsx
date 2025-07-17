import  { useState } from 'react'
import { useGlobalContext } from '../context/GlobalContext'
type BalanceSelectorProps = {
  onSelect?: (type: 'coin' | 'ticket') => void
}
export function BalanceSelector({ onSelect }: BalanceSelectorProps) {
  const { coinBalance, ticketBalance } = useGlobalContext()
  const [selected, setSelected] = useState<'coin' | 'ticket'>('coin')
  const handleSelect = (type: 'coin' | 'ticket') => {
    setSelected(type)
    if (onSelect) {
      onSelect(type)
    }
  }
  return (
      <div className="w-full max-w-md mx-auto">
        <div className="relative h-12 sm:h-14 md:h-16 lg:h-18 bg-gray-900 rounded-full border-2 border-gray-800 overflow-hidden">
          {/* Highlight for selected side */}
          <div
              className={`absolute top-0 bottom-0 w-1/2 transition-all duration-300 ease-in-out rounded-full ${selected === 'coin' ? 'left-0' : 'left-1/2 bg-green-500/20'}`}
              style={
                selected === 'coin'
                    ? {
                      border: '2px solid #FDF222',
                    }
                    : {
                      border: '2px solid #42E242',
                    }
              }
          />
          {/* Container for both sides */}
          <div className="absolute inset-0 flex">
            {/* Coin side */}
            <div
                className={`flex-1 flex items-center justify-between px-3 sm:px-4 md:px-6 cursor-pointer ${selected === 'coin' ? 'opacity-100' : 'opacity-70'}`}
                onClick={() => handleSelect('coin')}
            >
            <span className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl">
              {coinBalance.toLocaleString()}
            </span>
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/2XiBYwBWgNJxytH6Z2jPWP/point.png"
                  alt="Coins"
                  className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ${selected === 'coin' ? 'rounded-full' : ''}`}
                  style={
                    selected === 'coin'
                        ? {
                          boxShadow: '0 0 0 4px #FDF222',
                          borderRadius: '9999px',
                        }
                        : {}
                  }
              />
            </div>
            {/* Ticket side */}
            <div
                className={`flex-1 flex items-center justify-between px-3 sm:px-4 md:px-6 cursor-pointer ${selected === 'ticket' ? 'opacity-100' : 'opacity-70'}`}
                onClick={() => handleSelect('ticket')}
            >
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/65WCbcmf6dyyeqvjSAJHyp/fire.png"
                  alt="Fire"
                  className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10"
                  style={
                    selected === 'ticket'
                        ? {
                          boxShadow: '0 0 0 4px #42E242',
                          borderRadius: '9999px',
                        }
                        : {}
                  }
              />
              <span className="text-white font-bold text-sm sm:text-base md:text-lg lg:text-xl">
              {ticketBalance}
            </span>
            </div>
          </div>
        </div>
      </div>
  )
}
