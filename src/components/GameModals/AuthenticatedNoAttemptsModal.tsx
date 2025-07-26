import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../context/GlobalContext'
type AuthenticatedNoAttemptsModalProps = {
    isOpen: boolean
    onClose: () => void
    penalty: number
}
export function AuthenticatedNoAttemptsModal({
                                                 isOpen,
                                                 onClose,
                                                 penalty,
                                             }: AuthenticatedNoAttemptsModalProps) {
    const navigate = useNavigate()
    const { addCoins } = useGlobalContext()
    if (!isOpen) return null
    const handleBackToLobby = () => {
        addCoins(-penalty)
        onClose()
        navigate('/')
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]">
            <div className="bg-[#374151] rounded-2xl p-6 text-center text-white w-[320px] flex flex-col items-center">
                <h2 className="text-2xl text-[#FFFFFF] font-semibold mt-10 mb-24 font-[Inter]">No attempts !</h2>
                <p className="text-xl font-medium mb-10 font-[Inter] text-[#FFFFFF]">You Lost</p>
                <div className="flex items-center justify-center text-5xl font-bold mb-36">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                        alt="Coins"
                        className="w-6 h-6 mr-4"
                    />
                    <span className="text-2xl font-medium font-[Inter] text-[#FE5C5C]">-{penalty.toLocaleString()}</span>
                </div>
                <button
                    className="w-48 bg-[#4E80F1] hover:bg-blue-600 text-[#FFFFFF] font-bold py-3 px-8 rounded-xl text-lg font-[Inter]"
                    onClick={handleBackToLobby}
                >
                    Back to Lobby
                </button>
            </div>
        </div>
    )
}
