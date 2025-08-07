import React from 'react'
import { useNavigate } from 'react-router-dom'
interface CooldownModalProps {
    isOpen: boolean
    onClose: () => void
    remainingTime: string
    gameType: string
}
export function CooldownModal({
                                  isOpen,
                                  onClose,
                                  remainingTime,
                                  gameType,
                              }: CooldownModalProps) {
    const navigate = useNavigate()
    if (!isOpen) return null
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#374151] rounded-xl p-6 max-w-sm w-full mx-4">
                <h2 className="text-xl font-bold mb-4 text-center">Game Cooldown</h2>
                <div className="text-center mb-6">
                    <p className="mb-2">
                        You need to wait before playing {gameType} again.
                    </p>
                    <p className="text-xl font-bold">Time remaining: {remainingTime}</p>
                </div>
                <div className="flex justify-center">
                    <button
                        onClick={() => {
                            onClose()
                            navigate('/')
                        }}
                        className="bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    )
}
