import React from 'react'
import { useNavigate } from 'react-router-dom'
type NoAttemptsGemModalProps = {
    isOpen: boolean
    onClose: () => void
}
export function NoAttemptsGemModal({
                                       isOpen,
                                       onClose,
                                   }: NoAttemptsGemModalProps) {
    const navigate = useNavigate()
    if (!isOpen) return null
    const handleBackToLobby = () => {
        onClose()
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E2432]/90">
            <div className="bg-[#3A4050] rounded-3xl p-6 text-center text-white w-[320px] flex flex-col items-center">
                <h2 className="text-4xl font-bold mb-16">No attempts!</h2>
                <p className="text-3xl font-medium mb-10">You Lost</p>
                <div className="flex items-center justify-center text-5xl font-bold mb-20">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/65WCbcmf6dyyeqvjSAJHyp/fire.png"
                        alt="Tickets"
                        className="w-12 h-12 mr-4"
                    />
                    <span className="text-[#F15050]">-1</span>
                </div>
                <button
                    className="w-full bg-[#4E80F1] hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-3xl"
                    onClick={handleBackToLobby}
                >
                    Back to Lobby
                </button>
            </div>
        </div>
    )
}
