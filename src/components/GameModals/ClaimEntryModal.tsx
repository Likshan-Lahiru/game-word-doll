import React from 'react'
import { useNavigate } from 'react-router-dom'
type ClaimEntryModalProps = {
    isOpen: boolean
    onClose: () => void
    entryCost: number
}
export function ClaimEntryModal({
                                    isOpen,
                                    onClose,
                                    entryCost,
                                }: ClaimEntryModalProps) {
    const navigate = useNavigate()
    if (!isOpen) return null
    const handleClaim = () => {
        onClose()
        navigate('/giveaway-game')
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]">
            <div className="bg-[#374151] rounded-2xl p-6 text-center text-white w-[320px] h-[560px] flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-12 mt-10 text-[#FE5C5C]">
                    Time Ended !
                </h2>
                <p className="text-xl text-[Inter] font-medium mb-6 mt-16">Claim your entry</p>
                <div className="flex items-center justify-center mt-2 mb-12">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/65WCbcmf6dyyeqvjSAJHyp/fire.png"
                        alt="Ticket"
                        className="w-7 h-7 mr-2"
                    />
                    <span className="text-2xl font-medium">{entryCost}</span>
                </div>
                <button
                    className="bg-[#3B82F6] hover:bg-blue-600 text-white py-3 px-12 mt-28 rounded-2xl text-2xl font-medium w-full max-w-[200px]"
                    onClick={handleClaim}
                >
                    Claim
                </button>
            </div>
        </div>
    )
}
