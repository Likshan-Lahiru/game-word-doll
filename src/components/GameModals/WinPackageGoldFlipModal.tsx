import React from 'react'
import { useNavigate } from 'react-router-dom'
type WinPackageModalProps = {
    isOpen: boolean
    onClose: () => void
    prize: {
        coinAmount: number
        spinAmount: number
    }
}
export function WinPackageGoldCoinModal({
                                            isOpen,
                                            onClose,
                                            prize,
                                        }: WinPackageModalProps) {
    const navigate = useNavigate()
    if (!isOpen) return null
    const handleCollect = () => {
        onClose()
        navigate('/giveaway-entry')
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]">
            <div className="bg-[#374151] rounded-2xl p-8 text-center text-white w-[90%] max-w-[360px] flex flex-col items-center">
                <h2 className="text-4xl font-bold mb-16">Congratulations !</h2>
                <p className="text-2xl font-medium mb-12">You Win</p>
                <div className="flex items-center justify-center mb-6">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                        alt="Coins"
                        className="w-6 h-6 mr-3"
                    />
                    <span className="text-2xl font-medium">
            {prize.coinAmount.toLocaleString()}
          </span>
                </div>
                <div className="text-2xl font-medium mb-2">+</div>
                <div className="flex items-center justify-center mb-16">

                    <span className="text-2xl font-medium">
            {prize.spinAmount}  x Spin
          </span>
                </div>
                <button
                    className="bg-[#3B82F6] hover:bg-blue-600 text-white py-4 mt-16 px-16 rounded-2xl text-3xl font-medium w-full"
                    onClick={handleCollect}
                >
                    Collect
                </button>
            </div>
        </div>
    )
}
