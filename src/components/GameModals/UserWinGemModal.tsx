import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../context/GlobalContext'
type UserWinGemModalProps = {
    isOpen: boolean
    onClose: () => void
    gemAmount: number
}
export function UserWinGemModal({
                                    isOpen,
                                    onClose,
                                    gemAmount,
                                }: UserWinGemModalProps) {
    const navigate = useNavigate()
    const { addGems } = useGlobalContext()
    if (!isOpen) return null
    const handleCollect = () => {
        // Add the gems to the user's balance
        addGems(gemAmount)
        onClose()
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]">
            <div className="bg-[#374151] rounded-2xl p-6 text-center text-white w-[320px] flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-28 mt-10 font-[Inter]">Congratulations !</h2>
                <p className="text-xl font-medium mb-1 font-[Inter]">You Win</p>
                <p className="text-xl font-medium mb-5 font-[Inter]">THE LEGENDARY</p>
                <div className="flex items-center justify-center text-5xl font-bold mb-36">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                        alt="Gem"
                        className="w-6 h-6 mr-2"
                    />
                    <span className="text-2xl font-medium font-[Inter]">{gemAmount.toFixed(2)}</span>
                </div>
                <button
                    className=" bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold py-3 px-16 rounded-2xl text-2xl font-[Inter]"
                    onClick={handleCollect}
                >
                    Collect
                </button>
            </div>
        </div>
    )
}
