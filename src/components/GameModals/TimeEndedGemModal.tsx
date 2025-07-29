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
                <h2 className="text-3xl font-bold mb-28 text-[#FE5C5C] font-[Inter] mt-10">
                    Time Ended !
                </h2>
                <p className="text-xl font-medium mb-10 font-[Inter]">No Winner in the room</p>
                <p className="text-xl font-medium mb-10 font-[Inter]">Claim your entry</p>
                <div className="flex items-center justify-center text-5xl font-bold mb-20">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/65WCbcmf6dyyeqvjSAJHyp/fire.png"
                        alt="Tickets"
                        className="w-7 h-7 mr-3"
                    />
                    <span className="text-2xl font-medium font-[Inter]">{ticketAmount}</span>
                </div>
                <button
                    className="bg-[#3B82F6] hover:bg-blue-600 text-white mb-2 font-semibold py-3 px-16 rounded-2xl text-2xl font-[Inter]"
                    onClick={handleClaim}
                >
                    Claim
                </button>
            </div>
        </div>
    )
}
