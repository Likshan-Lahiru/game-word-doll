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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]">
            <div className="bg-[#374151] rounded-2xl p-6 text-center text-white w-[300px] flex flex-col items-center">
                <h2 className="text-2xl font-bold mb-28 mt-10 text-[#FE5C5C] font-[Inter]">
                    No attempts !
                </h2>
                <p className="text-lg text-white font-medium mb-48 font-[Inter]">You used all attempts</p>
                <button
                    className="bg-[#3B82F6] hover:bg-blue-600 text-white font-bold mb-2 py-3 px-8 rounded-2xl text-lg font-[Inter]"
                    onClick={handleBackToLobby}
                >
                    Back to Lobby
                </button>
            </div>
        </div>
    )
}
