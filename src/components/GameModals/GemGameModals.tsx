import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../context/GlobalContext'
type UserWinModalProps = {
    isOpen: boolean
    onClose: () => void
    gemAmount: number
}
export function UserWinModal({
                                 isOpen,
                                 onClose,
                                 gemAmount,
                             }: UserWinModalProps) {
    const navigate = useNavigate()
    const { addGems } = useGlobalContext()
    if (!isOpen) return null
    const handleCollect = () => {
        // Add the gems to the user's balance
        addGems(gemAmount)
        onClose()
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E2432]/90">
            <div className="bg-[#3A4050] rounded-3xl p-6 text-center text-white w-[320px] flex flex-col items-center">
                <h2 className="text-4xl font-bold mb-16">Congratulations!</h2>
                <p className="text-3xl font-medium mb-10">You Win</p>
                <div className="flex items-center justify-center text-5xl font-bold mb-20">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                        alt="Gems"
                        className="w-12 h-12 mr-4"
                    />
                    <span>{gemAmount.toFixed(2)}</span>
                </div>
                <button
                    className="w-full bg-[#4E80F1] hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-3xl"
                    onClick={handleCollect}
                >
                    Collect
                </button>
            </div>
        </div>
    )
}
type TimeEndedModalProps = {
    isOpen: boolean
    onClose: () => void
    ticketAmount: number
}
export function TimeEndedModal({
                                   isOpen,
                                   onClose,
                                   ticketAmount,
                               }: TimeEndedModalProps) {
    const navigate = useNavigate()
    if (!isOpen) return null
    const handleBackToLobby = () => {
        onClose()
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1E2432]/90">
            <div className="bg-[#3A4050] rounded-3xl p-6 text-center text-white w-[320px] flex flex-col items-center">
                <h2 className="text-4xl font-bold mb-16">Time Ended!</h2>
                <p className="text-3xl font-medium mb-10">You Lost</p>
                <div className="flex items-center justify-center text-5xl font-bold mb-20">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/65WCbcmf6dyyeqvjSAJHyp/fire.png"
                        alt="Tickets"
                        className="w-12 h-12 mr-4"
                    />
                    <span className="text-[#F15050]">-{ticketAmount}</span>
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
type NoAttemptsModalProps = {
    isOpen: boolean
    onClose: () => void
}
export function NoAttemptsModal({ isOpen, onClose }: NoAttemptsModalProps) {
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
