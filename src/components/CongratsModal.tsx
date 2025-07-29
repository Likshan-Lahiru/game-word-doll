import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context/GlobalContext'
type CongratsModalProps = {
    isOpen: boolean
    onClose: () => void
    coinAmount: number
    spinAmount: number
}
export function CongratsModal({
                                  isOpen,
                                  onClose,
                                  coinAmount,
                                  spinAmount,
                              }: CongratsModalProps) {
    const navigate = useNavigate()
    const { addSpins, addCoins } = useGlobalContext()
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    if (!isOpen) return null
    const handleCollect = () => {
        // Add the coins and spins to the global context
        addCoins(coinAmount)
        addSpins(spinAmount)
        // Close the modal
        onClose()
        // Navigate to the giveaway entry page
        navigate('/giveaway-entry')
    }
    // Mobile view based on the provided image
    if (isMobile) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937E5]/90">
                <div className="bg-[#3F4C5F] rounded-2xl p-6 mb-20 ml-12 shadow-xl w-[320px] max-w-full mx-auto text-center flex flex-col items-center left-0 right-0">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/ihjCiF28Ck9C1VuWkrRhxL/block.png"
                        alt="Question Block"
                        className="w-36 h-36 mt-20 mb-8"
                    />
                    <h2 className="text-white text-xl font-medium mb-8">You Revealed</h2>
                    <div className="flex items-center justify-center mb-28">
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                            alt="Coins"
                            className="w-8 h-8 mr-3"
                        />
                        <span className="text-white text-4xl font-bold">
              {coinAmount.toLocaleString()}
            </span>
                    </div>
                    <button
                        className="bg-[#3B82F6] hover:bg-blue-600 text-white py-6 px-8 rounded-2xl font-medium text-3xl w-full mb-8"
                        onClick={handleCollect}
                    >
                        Collect
                    </button>
                </div>
            </div>
        )
    }
    // Desktop view - unchanged
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937E5]/90">
            <div className="bg-[#3F4C5F] ml-10 mt-8 rounded-3xl p-8 shadow-xl w-96 mb-32  text-center flex flex-col items-center">
                <img
                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/ihjCiF28Ck9C1VuWkrRhxL/block.png"
                    alt="Question Block"
                    className="w-36 h-36 mt-20 mb-12"
                />
                <h2 className="text-white text-2xl font-bold mb-14">You Revealed</h2>
                <div className="flex items-center justify-center mb-28">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                        alt="Coins"
                        className="w-8 h-8 mr-3"
                    />
                    <span className="text-white text-4xl font-bold">
            {coinAmount.toLocaleString()}
          </span>
                </div>
                <button
                    className="bg-[#3B82F6] hover:bg-blue-600 text-white py-4 px-12 rounded-2xl font-semibold text-3xl w-full"
                    onClick={handleCollect}
                >
                    Collect
                </button>
            </div>
        </div>
    )
}
