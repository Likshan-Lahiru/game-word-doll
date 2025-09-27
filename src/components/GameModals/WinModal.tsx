import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../context/GlobalContext'
import confetti from 'canvas-confetti'
type WinModalProps = {
    isOpen: boolean
    onClose: () => void
    reward: number
    gameType: 'wordoll' | 'lockpickr'
}
export function WinModal({ isOpen, onClose, reward, gameType }: WinModalProps) {
    const navigate = useNavigate()
    const { addCoins } = useGlobalContext()
    const isMobile = window.innerWidth <= 768
    const fireworksRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (isOpen && fireworksRef.current) {
            // Create fireworks effect
            const launchFireworks = () => {
                const duration = 5000
                const animationEnd = Date.now() + duration
                const defaults = {
                    startVelocity: 30,
                    spread: 360,
                    ticks: 60,
                    zIndex: 0,
                }
                const interval = setInterval(() => {
                    const timeLeft = animationEnd - Date.now()
                    if (timeLeft <= 0) {
                        return clearInterval(interval)
                    }
                    const particleCount = 50 * (timeLeft / duration)
                    // Launch colorful fireworks from random positions
                    confetti({
                        ...defaults,
                        particleCount,
                        origin: {
                            x: Math.random(),
                            y: Math.random() * 0.5,
                        },
                        colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'],
                    })
                    confetti({
                        ...defaults,
                        particleCount,
                        origin: {
                            x: Math.random(),
                            y: Math.random() * 0.5,
                        },
                        colors: ['#ff9900', '#9900ff', '#00ffff', '#ff6600', '#00ff99'],
                    })
                }, 250)
            }
            launchFireworks()
        }
    }, [isOpen])
    if (!isOpen) return null
    const handleSignUp = () => {
        // Add the reward before navigating to signup
        addCoins(reward)
        navigate('/signup')
    }
    const handleNoThanks = () => {
        // Add the reward before navigating
        addCoins(reward)
        onClose()
        navigate('/')
    }
    // Mobile view based on the provided image
    if (isMobile) {
        return (
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937] font-['Inter']"
                ref={fireworksRef}
            >
                {/* Colorful background elements */}
                <div className="absolute inset-0 overflow-hidden">
                    <div className="absolute top-0 left-0 w-1/3 h-full bg-red-500/20"></div>
                    <div className="absolute top-0 left-1/3 w-1/3 h-full bg-green-500/20"></div>
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-yellow-500/20"></div>
                    <div className="absolute top-0 w-full h-1/3 bg-red-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 w-full h-1/3 bg-yellow-500/10 rounded-full blur-3xl"></div>
                </div>
                <div className="flex flex-col items-center relative z-10">
                    <div className="bg-[#3F4C5F] rounded-2xl p-6 text-center text-white w-[320px]">
                        <h2 className="ml-8 text-2xl font-bold mb-6">You Win</h2>
                        <div className="flex items-center justify-center text-4xl font-bold mb-6">
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                                alt="Coins"
                                className="w-8 h-8 mr-2"
                            />
                            <span>{reward.toLocaleString()}</span>
                        </div>
                        <p className="text-xl font-bold mb-8">GREAT !!!</p>
                        <p className="text-xl mb-4 font-bold">Sign Up to Get</p>
                        <div className="flex items-center justify-center text-4xl font-bold mb-2">
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                                alt="Coins"
                                className="w-8 h-8 mr-2"
                            />
                            <span>5,000,000</span>
                        </div>
                        <p className="text-2xl mb-6 font-bold">FREE</p>
                        <button
                            className="w-56 text-2xl bg-[#3B82F6] hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-2xl mb-6"
                            onClick={handleSignUp}
                        >
                            Sign Up Now
                        </button>
                        <p className="mb-4 text-xl font-bold">and</p>
                        <p className="flex items-center justify-center mb-4 font-bold text-xl">
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
                            className="bg-[#374151] hover:bg-[#2D3748] text-white font-bold py-3 px-12 rounded-2xl"
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
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937] font-['Inter']"
            ref={fireworksRef}
        >
            {/* Colorful background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-1/3 h-full bg-red-500/20"></div>
                <div className="absolute top-0 left-1/3 w-1/3 h-full bg-green-500/20"></div>
                <div className="absolute top-0 right-0 w-1/3 h-full bg-yellow-500/20"></div>
                <div className="absolute top-0 w-full h-1/3 bg-red-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 w-full h-1/3 bg-yellow-500/10 rounded-full blur-3xl"></div>
            </div>
            <div className="w-full max-w-md mx-auto relative z-10">
                <div className="bg-[#3F4C5F] rounded-xl p-8 text-center text-white">
                    <h2 className="text-1xl font-bold mb-6 font-['Inter']">You Win</h2>
                    <div className="flex items-center justify-center text-3xl font-bold mb-6 ">
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                            alt="Coins"
                            className="w-7 h-7 mr-2"
                        />
                        <span>{reward.toLocaleString()}</span>
                    </div>
                    <p className="text-xl font-bold mb-8 font-['Inter']">GREAT !!!</p>
                    <p className="text-xl mb-4 font-bold font-['Inter']">
                        Sign Up to Get
                    </p>
                    <div className="flex items-center justify-center text-3xl font-bold mb-6 font-['Inter']">
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                            alt="Coins"
                            className="w-7 h-7 mr-2"
                        />
                        <span>5,000,000 FREE</span>
                    </div>
                    <button
                        className="w-72 bg-[#3B82F6] font-['Inter'] text-2xl hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-2xl mb-6"
                        onClick={handleSignUp}
                    >
                        Sign Up Now
                    </button>
                    <p className="mb-4 font-bold font-['Inter']">and</p>
                    <p className="flex items-center justify-center mb-4">
                        <span className="mr-2 font-bold font-['Inter']">Win</span>
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                            alt="Coins"
                            className="w-6 h-6"
                        />
                        <span className="ml-2 font-bold font-['Inter']">Gems</span>
                    </p>
                </div>
                <div className="mt-4 flex justify-center">
                    <button
                        className="bg-[#374151] hover:bg-[#2D3748] text-white font-bold py-3 px-8 rounded-2xl font-['Inter']"
                        onClick={handleNoThanks}
                    >
                        No, Thanks
                    </button>
                </div>
            </div>
        </div>
    )
}
