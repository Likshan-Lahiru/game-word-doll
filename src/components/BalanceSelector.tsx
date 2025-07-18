import React, { useState } from 'react'
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
            <div className="relative h-10 sm:h-12 md:h-14 lg:h-16 bg-gray-900 rounded-full border-2 border-gray-800 overflow-hidden">

                <div
                    className={`absolute top-0 bottom-0 w-1/2 transition-all duration-300 ease-in-out rounded-full ${selected === 'coin' ? 'left-0' : 'left-1/2 '}`}
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

                <div className="absolute inset-0 flex">

                    <div
                        className={`flex-1 flex items-center justify-between px-2 sm:px-3 md:px-4 lg:px-6 cursor-pointer ${selected === 'coin' ? 'opacity-100' : 'opacity-70'}`}
                        onClick={() => handleSelect('coin')}
                    >
            <span className="text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg">
              {coinBalance.toLocaleString()}
            </span>
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/2XiBYwBWgNJxytH6Z2jPWP/point.png"
                            alt="Coins"
                            className={`w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 ${selected === 'coin' ? 'rounded-full' : ''}`}
                            style={
                                selected === 'coin'
                                    ? {
                                        boxShadow: '0 0 0 3px #FDF222',
                                        borderRadius: '9999px',
                                    }
                                    : {}
                            }
                        />
                    </div>

                    <div
                        className={`flex-1 flex items-center justify-between px-2 sm:px-3 md:px-4 lg:px-6 cursor-pointer ${selected === 'ticket' ? 'opacity-100' : 'opacity-70'}`}
                        onClick={() => handleSelect('ticket')}
                    >
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/65WCbcmf6dyyeqvjSAJHyp/fire.png"
                            alt="Fire"
                            className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8"
                            style={
                                selected === 'ticket'
                                    ? {
                                        boxShadow: '0 0 0 3px #42E242',
                                        borderRadius: '9999px',
                                    }
                                    : {}
                            }
                        />
                        <span className="text-white font-bold text-xs sm:text-sm md:text-base lg:text-lg">
                         {ticketBalance}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}
