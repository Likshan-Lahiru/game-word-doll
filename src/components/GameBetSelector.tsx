import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context/GlobalContext'
type GameBetSelectorProps = {
    gameType: 'wordoll' | 'lockpickr'
    onClose?: () => void
}
export function GameBetSelector({ gameType, onClose }: GameBetSelectorProps) {
    const navigate = useNavigate()
    const { setBetAmount, setWinAmount, isAuthenticated } = useGlobalContext()
    const [selectedBet, setSelectedBet] = useState<number>(1000)
    const betOptions = [
        {
            bet: 200,
            win: 5000,
        },
        {
            bet: 1000,
            win: 10000,
        },
        {
            bet: 9000,
            win: 120000,
        },
    ]
    const handleSelectBet = (bet: number, win: number) => {
        setSelectedBet(bet)
        setBetAmount(bet)
        setWinAmount(win)
    }
    const handlePlay = () => {
        const option = betOptions.find((opt) => opt.bet === selectedBet)
        if (option) {
            setBetAmount(option.bet)
            setWinAmount(option.win)
            if (gameType === 'wordoll') {
                navigate('/wordoll-game')
            } else {
                navigate('/lock-pickr-game')
            }
        }
        if (onClose) {
            onClose()
        }
    }
    if (!isAuthenticated) {
        navigate(gameType === 'wordoll' ? '/wordoll-game' : '/lock-pickr-game')
        return null
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90">
            <div className="bg-[#1F2937] rounded-lg p-6 shadow-xl w-full max-w-md text-center">
                <h2 className="text-white text-2xl font-bold mb-6">
                    {gameType === 'wordoll' ? 'Wordoll' : 'Lock Pickr'}
                </h2>
                <div className="flex justify-center space-x-4 mb-8">
                    {betOptions.map((option) => (
                        <div
                            key={option.bet}
                            className={`cursor-pointer p-3 rounded-xl ${selectedBet === option.bet ? 'bg-blue-500' : 'bg-[#374151]'}`}
                            onClick={() => handleSelectBet(option.bet, option.win)}
                        >
                            <div className="flex items-center justify-center mb-2">
                                <img
                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/2XiBYwBWgNJxytH6Z2jPWP/point.png"
                                    alt="Gold Coins"
                                    className="w-5 h-5 mr-1"
                                />
                                <span className="text-white text-lg font-bold">
                  {option.bet.toLocaleString()}
                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="bg-[#374151] rounded-xl p-4 mb-8">
                    <p className="text-white mb-2">Win</p>
                    <div className="flex items-center justify-center">
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/2XiBYwBWgNJxytH6Z2jPWP/point.png"
                            alt="Gold Coins"
                            className="w-6 h-6 mr-2"
                        />
                        <span className="text-white text-2xl font-bold">
              {betOptions
                  .find((opt) => opt.bet === selectedBet)
                  ?.win.toLocaleString() || '10,000'}
            </span>
                    </div>
                </div>
                <button
                    className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-16 rounded-full font-bold text-xl"
                    onClick={handlePlay}
                >
                    Play
                </button>
            </div>
        </div>
    )
}
