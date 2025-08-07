import React from 'react'
import { useNavigate } from 'react-router-dom'
type RoomHasWinnerModalProps = {
    isOpen: boolean
    onClose: () => void
    winnerName: string
    legendaryAmount: string
    userReward?: number
}
export function RoomHasWinnerModal({
                                       isOpen,
                                       onClose,
                                       winnerName,
                                       legendaryAmount,
                                       userReward = 0.02,
                                   }: RoomHasWinnerModalProps) {
    const navigate = useNavigate()
    if (!isOpen) return null
    const handleCollect = () => {
        onClose()
        navigate('/gem-game-mode')
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]">
            <div className="bg-[#374151] rounded-2xl p-6 text-center text-white w-[320px] flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-8 mt-6 font-[Inter]">
                    Room has a Winner !
                </h2>
                <div className="mb-4">
                    <p className="text-xl font-medium font-[Inter]">THE LEGENDARY</p>
                    <p className="text-xl font-medium mb-2 font-[Inter]">WINNER</p>
                </div>
                <p className="text-2xl font-medium mb-2 font-[Inter]">{winnerName}</p>
                <div className="flex items-center justify-center mb-8">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                        alt="Gem"
                        className="w-6 h-6 mr-2"
                    />
                    <span className="text-2xl font-medium font-[Inter]">
            {legendaryAmount}
          </span>
                </div>
                <p className="text-xl font-medium mb-4 font-[Inter]">You Win</p>
                <div className="flex items-center justify-center mb-8">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                        alt="Gem"
                        className="w-6 h-6 mr-2"
                    />
                    <span className="text-2xl font-medium font-[Inter]">
            {userReward}
          </span>
                </div>
                <p className="text-lg font-medium mb-8 font-[Inter]">
                    You could be the next one...
                </p>
                <button
                    className="bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold py-3 px-16 rounded-2xl text-2xl font-[Inter] w-full"
                    onClick={handleCollect}
                >
                    Collect
                </button>
            </div>
        </div>
    )
}
