import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../context/GlobalContext'
import confetti from 'canvas-confetti'
type UserWinGemModalProps = {
    isOpen: boolean
    onClose: () => void
    gemAmount: number
}
export function UserWinGemModal({
                                    isOpen,
                                    onClose,
                                    gemAmount,
                                }: UserWinGemModalProps) {
    const navigate = useNavigate()
    const { addGems } = useGlobalContext()
    const fireworksRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        if (isOpen && fireworksRef.current) {
            // Create gem-themed fireworks effect
            const launchFireworks = () => {
                const duration = 5000
                const animationEnd = Date.now() + duration
                const defaults = {
                    startVelocity: 30,
                    spread: 360,
                    ticks: 60,
                    zIndex: 0,
                }
                // Gem-themed colors (purple, pink, etc.)
                const gemColors = [
                    '#FF1493',
                    '#DA70D6',
                    '#9370DB',
                    '#8A2BE2',
                    '#BA55D3',
                    '#9400D3',
                ]
                // Initial burst of gem-colored confetti
                confetti({
                    particleCount: 150,
                    spread: 160,
                    origin: {
                        x: 0.5,
                        y: 0.3,
                    },
                    colors: gemColors,
                })
                const interval = setInterval(() => {
                    const timeLeft = animationEnd - Date.now()
                    if (timeLeft <= 0) {
                        return clearInterval(interval)
                    }
                    const particleCount = 50 * (timeLeft / duration)
                    // Gem-themed fireworks from different positions
                    confetti({
                        ...defaults,
                        particleCount,
                        origin: {
                            x: Math.random(),
                            y: Math.random() * 0.5,
                        },
                        colors: gemColors,
                    })
                    // Heart-shaped confetti for gems
                    if (Math.random() < 0.3) {
                        confetti({
                            particleCount: 30,
                            angle: Math.random() * 60 + 60,
                            spread: 80,
                            shapes: ['circle'],
                            origin: {
                                x: 0,
                                y: 0.8,
                            },
                            colors: gemColors,
                            scalar: 1.2,
                        })
                        confetti({
                            particleCount: 30,
                            angle: Math.random() * 60 + 240,
                            spread: 80,
                            shapes: ['circle'],
                            origin: {
                                x: 1,
                                y: 0.8,
                            },
                            colors: gemColors,
                            scalar: 1.2,
                        })
                    }
                    // Center burst
                    if (Math.random() < 0.2) {
                        confetti({
                            particleCount: 80,
                            spread: 120,
                            origin: {
                                x: 0.5,
                                y: 0.5,
                            },
                            colors: gemColors,
                            disableForReducedMotion: true,
                        })
                    }
                }, 250)
            }
            launchFireworks()
        }
    }, [isOpen])
    if (!isOpen) return null
    const handleCollect = () => {
        // Add the gems to the user's balance
        addGems(gemAmount)
        onClose()
    }
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]"
            ref={fireworksRef}
        >
            <div className="bg-[#374151] rounded-2xl p-6 text-center text-white w-[320px] flex flex-col items-center">
                <h2 className="text-3xl font-bold mb-28 mt-10 font-[Inter]">
                    Congratulations !
                </h2>
                <p className="text-xl font-medium mb-1 font-[Inter]">You Win</p>
                <p className="text-xl font-medium mb-5 font-[Inter]">THE LEGENDARY</p>
                <div className="flex items-center justify-center text-5xl font-bold mb-36">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                        alt="Gem"
                        className="w-6 h-6 mr-2"
                    />
                    <span className="text-2xl font-medium font-[Inter]">
            {gemAmount.toFixed(2)}
          </span>
                </div>
                <button
                    className=" bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold py-3 px-16 rounded-2xl text-2xl font-[Inter]"
                    onClick={handleCollect}
                >
                    Collect
                </button>
            </div>
        </div>
    )
}
