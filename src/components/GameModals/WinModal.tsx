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
            // Create fireworks effect with gold-themed colors
            const launchFireworks = () => {
                const duration = 5000
                const animationEnd = Date.now() + duration
                const defaults = {
                    startVelocity: 30,
                    spread: 360,
                    ticks: 60,
                    zIndex: 0,
                }
                // Gold-themed colors
                const goldColors = [
                    '#FFD700',
                    '#FFC107',
                    '#FFAB00',
                    '#FF8F00',
                    '#F57F17',
                    '#FFB300', // Light amber
                ]
                // Initial burst of gold confetti
                confetti({
                    particleCount: 150,
                    spread: 160,
                    origin: {
                        x: 0.5,
                        y: 0.3,
                    },
                    colors: goldColors,
                })
                const interval = setInterval(() => {
                    const timeLeft = animationEnd - Date.now()
                    if (timeLeft <= 0) {
                        return clearInterval(interval)
                    }
                    const particleCount = 50 * (timeLeft / duration)
                    // Gold-themed fireworks from different positions
                    confetti({
                        ...defaults,
                        particleCount,
                        origin: {
                            x: Math.random(),
                            y: Math.random() * 0.5,
                        },
                        colors: goldColors,
                    })
                    // Add occasional confetti bursts
                    if (Math.random() < 0.3) {
                        confetti({
                            particleCount: 40,
                            angle: Math.random() * 60 + 60,
                            spread: 80,
                            origin: {
                                x: 0,
                                y: 0.8,
                            },
                            colors: goldColors,
                        })
                        confetti({
                            particleCount: 40,
                            angle: Math.random() * 60 + 240,
                            spread: 80,
                            origin: {
                                x: 1,
                                y: 0.8,
                            },
                            colors: goldColors,
                        })
                    }
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
                <div className="flex flex-col items-center">
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
            <div className="w-full max-w-md mx-auto">
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
