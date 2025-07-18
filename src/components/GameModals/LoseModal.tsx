import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../context/GlobalContext'
type LoseModalProps = {
    isOpen: boolean
    onClose: () => void
    penalty: number
    gameType: 'wordoll' | 'lockpickr'
}
export function LoseModal({
                              isOpen,
                              onClose,
                              penalty,
                          }: LoseModalProps) {
    const navigate = useNavigate()
    useGlobalContext()
    const isMobile = window.innerWidth <= 768
    if (!isOpen) return null
    const handleSignUp = () => {
        navigate('/signup')
    }
    const handleNoThanks = () => {
        // Apply the penalty (if implemented) before navigating
        // addCoins(-penalty) // Uncomment if you want to actually deduct coins
        onClose()
        navigate('/')
    }
    // Mobile view based on the provided image
    if (isMobile) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]/95">
                <div className="flex flex-col items-center">
                    <div className="bg-[#374151] rounded-2xl p-6 text-center text-white w-[320px]">
                        <h2 className="text-2xl font-bold mb-6">Timer Ended !</h2>
                        <div className="flex items-center justify-center text-4xl font-bold mb-6">
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                                alt="Coins"
                                className="w-8 h-8 mr-2"
                            />
                            <span className="text-[#FF6B6B]">
                -{penalty.toLocaleString()}
              </span>
                        </div>
                        <p className="text-2xl font-bold mb-8">Don't Worry</p>
                        <p className="text-2xl mb-4 font-bold">Sign Up to Get</p>
                        <div className="flex items-center justify-center text-4xl font-bold mb-2">
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                                alt="Coins"
                                className="w-8 h-8 mr-2"
                            />
                            <span>5,000,000</span>
                        </div>
                        <p className="text-2xl mb-6">FREE</p>
                        <button
                            className="w-full bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-2xl mb-6"
                            onClick={handleSignUp}
                        >
                            Sign Up Now
                        </button>
                        <p className="mb-4">and</p>
                        <p className="flex items-center justify-center mb-4">
                            <span className="mr-2">Win</span>
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                                alt="Coins"
                                className="w-6 h-6"
                            />
                            <span className="ml-2">Gems</span>
                        </p>

                    </div>
                    <div className="mt-6">
                        <button
                            className="bg-[#4A5568] hover:bg-[#2D3748] text-white font-bold py-3 px-12 rounded-2xl"
                            onClick={handleNoThanks}
                        >
                        No, Thanks
                        </button>
                    </div>
                </div>
            </div>
        )
    }
    // Desktop view - unchanged
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]/95">
            <div className="w-full max-w-md mx-auto">
                <div className="bg-[#374151] rounded-xl p-8 text-center text-white">
                    <h2 className="text-1xl font-bold mb-6">Timer Ended !</h2>
                    <div className="flex items-center justify-center text-3xl font-bold mb-6">
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                            alt="Coins"
                            className="w-8 h-8 mr-2"
                        />
                        <span className="text-[#F56565]">-{penalty.toLocaleString()}</span>
                    </div>
                    <p className="text-2xl font-bold mb-8">Don't Worry</p>
                    <p className="text-2xl mb-4 font-bold">Sign Up to Get</p>
                    <div className="flex items-center justify-center text-3xl font-bold mb-6">
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                            alt="Coins"
                            className="w-8 h-8 mr-2"
                        />
                        <span>5,000,000 FREE</span>
                    </div>
                    <button
                        className="w-60 bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-xl mb-6"
                        onClick={handleSignUp}
                    >
                        Sign Up Now
                    </button>
                    <p className="mb-4">and</p>
                    <p className="flex items-center justify-center mb-4">
                        <span className="mr-2">Win</span>
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                            alt="Coins"
                            className="w-6 h-6"
                        />
                        <span className="ml-2">Gems</span>
                    </p>
                </div>
                <div className="mt-4 flex justify-center">
                    <button
                        className="bg-[#4A5568] hover:bg-[#2D3748] text-white font-bold py-3 px-8 rounded-full"
                        onClick={handleNoThanks}
                    >
                        No, Thanks
                    </button>
                </div>
            </div>
        </div>
    )
}
