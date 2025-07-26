import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../context/GlobalContext'
type AuthenticatedWinModalProps = {
    isOpen: boolean
    onClose: () => void
    reward: number
}
export function AuthenticatedWinModal({
                                          isOpen,
                                          onClose,
                                          reward,
                                      }: AuthenticatedWinModalProps) {
    const navigate = useNavigate()
    const { addCoins } = useGlobalContext()
    if (!isOpen) return null
    const handleCollect = () => {
        addCoins(reward)
        onClose()
        navigate('/')
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]">
            <div className="bg-[#374151] rounded-2xl p-6 text-center text-white w-[320px] flex flex-col items-center">
                <h2 className="text-3xl text-[#FFFFFF] font-semibold mt-10 mb-24 font-[Inter]">Congratulations !</h2>
                <p className="text-xl font-medium mb-10 font-[Inter] text-[#FFFFFF]">You Win</p>
                <div className="flex items-center justify-center text-5xl font-bold mb-36">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                        alt="Coins"
                        className="w-6 h-6 mr-4"
                    />
                    <span className="text-2xl font-medium font-[Inter] text-[#FFFFFF]">{reward.toLocaleString()}</span>
                </div>
                <button
                    className=" w-48 bg-[#4E80F1] hover:bg-blue-600 text-[#FFFFFF] font-semibold py-3 px-8 rounded-xl text-xl font-[Inter] "
                    onClick={handleCollect}
                >
                    Collect
                </button>
            </div>
        </div>
    )
}
