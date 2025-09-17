import React from 'react'
import { useNavigate } from 'react-router-dom'
type TimeEndedGemModalProps = {
    isOpen: boolean
    onClose: () => void
    ticketAmount: number
}
export function TimeEndedGemModal({
                                      isOpen,
                                      onClose,
                                      ticketAmount,
                                  }: TimeEndedGemModalProps) {
    const navigate = useNavigate()
    if (!isOpen) return null
    const handleClaim = () => {
        onClose()
        navigate('/gem-game-mode')
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]">
            <div className="bg-[#374151] rounded-2xl p-6 text-center text-white w-[320px] flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-10 text-[#FE5C5C] font-[Inter] mt-10">
                    Time Ended !
                </h2>
                <p className="text-xl font-medium mb-10 font-[Inter]">Thank you for playing </p>
                <p className="text-xl font-medium mb-20 font-[Inter]">No Winners this time</p>
                <p className="text-xl font-medium mb-5 font-[Inter]">Here is a bonus reward</p>
                <div className="flex items-center justify-center text-5xl font-bold mb-20">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                        alt="Tickets"
                        className="w-5 h-5 mr-3"
                    />
                    <span className="text-xl font-medium font-[Inter]">{ticketAmount}</span>
                </div>
                <button
                    className="bg-[#3B82F6] hover:bg-blue-600 text-white mb-2 font-semibold py-3 px-16 rounded-2xl text-2xl font-[Inter]"
                    onClick={handleClaim}
                >
                    Collect
                </button>
            </div>
        </div>
    )
}
