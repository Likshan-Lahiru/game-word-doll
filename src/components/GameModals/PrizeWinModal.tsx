import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../context/GlobalContext'
type PrizeWinModalProps = {
    isOpen: boolean
    onClose: () => void
    coinAmount: number
    spinAmount: number
}
export function PrizeWinModal({
                                  isOpen,
                                  onClose,
                                  coinAmount,
                                  spinAmount,
                              }: PrizeWinModalProps) {
    const navigate = useNavigate()
    const { addCoins, addSpins } = useGlobalContext()
    if (!isOpen) return null
    const handleCollect = () => {
        // Add the coins and spins to the user's balance
        addCoins(coinAmount)
        addSpins(spinAmount)
        // Close the modal
        onClose()
        // Navigate to the giveaway entry page
        navigate('/giveaway-entry')
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]">
            <div className="bg-[#374151] rounded-2xl p-6 text-center text-white w-[320px] flex flex-col items-center">
                <h2 className="text-3xl font-bold mt-8 mb-16">Congratulations !</h2>
                <p className="text-2xl font-medium mb-10">You Win</p>
                <div className="flex items-center justify-center text-5xl font-bold mb-6">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                        alt="Coins"
                        className="w-6 h-6 mr-4"
                    />
                    <span className="text-xl font-bold ">{coinAmount.toLocaleString()}</span>
                </div>
                <p className="text-2xl font-medium mb-6">+</p>
                <p className="text-2xl font-medium mb-32">{spinAmount} x Spin</p>
                <button
                    className=" bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold py-4 px-16 rounded-2xl text-3xl"
                    onClick={handleCollect}
                >
                    Collect
                </button>
            </div>
        </div>
    )
}
