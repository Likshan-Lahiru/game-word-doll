import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../context/GlobalContext'
type NoWinnersGemModalProps = {
    isOpen: boolean
    onClose: () => void
    bonusAmount: number
}
export function NoWinnersGemModal({
                                      isOpen,
                                      onClose,
                                      bonusAmount,
                                  }: NoWinnersGemModalProps) {
    const navigate = useNavigate()
    const { addGems } = useGlobalContext()
    if (!isOpen) return null
    const handleCollect = () => {
        // Add the bonus gems to the user's balance
        addGems(bonusAmount)
        onClose()
        navigate('/gem-game-mode')
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]">
            <div className="bg-[#374151] rounded-2xl p-8 text-center text-white w-[340px] h-[590px] flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-8 text-[#FE5C5C] font-[Inter]">
                    Time Ended !
                </h2>
                <p className="text-xl font-medium mb-4 mt-4 font-[Inter]">
                    Thank you for playing
                </p>
                <p className="text-xl font-medium mb-12 mt-5 font-[Inter]">
                    No Winners this time
                </p>
                <p className="text-xl font-medium mt-10 mb-4 font-[Inter]">
                    Here is a bonus reward
                </p>
                <div className="flex items-center justify-center text-2xl mt-5 font-bold mb-8">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                        alt="Gems"
                        className="w-5 h-5 mr-2"
                    />
                    <span className="text-xl">{bonusAmount.toFixed(2)}</span>
                </div>
                <button
                    className="w-52 bg-[#4E80F1] hover:bg-blue-600 text-white font-semibold mt-16 py-4 px-8 rounded-2xl text-3xl"
                    onClick={handleCollect}
                >
                    Collect
                </button>
            </div>
        </div>
    )
}
