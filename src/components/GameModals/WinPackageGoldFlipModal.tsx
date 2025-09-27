import React, { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import confetti from 'canvas-confetti'
type WinPackageModalProps = {
    isOpen: boolean
    onClose: () => void
    prize: {
        coinAmount: number
        spinAmount: number
    }
}
export function WinPackageGoldCoinModal({
                                            isOpen,
                                            onClose,
                                            prize,
                                        }: WinPackageModalProps) {
    const navigate = useNavigate()
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
                    '#FFB300',
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
                    confetti({
                        ...defaults,
                        particleCount,
                        origin: {
                            x: Math.random(),
                            y: Math.random() * 0.5,
                        },
                        colors: goldColors,
                    })
                    // Add spectacular gold bursts
                    if (Math.random() < 0.4) {
                        confetti({
                            particleCount: 60,
                            angle: Math.random() * 60 + 60,
                            spread: 100,
                            origin: {
                                x: 0,
                                y: 1,
                            },
                            colors: goldColors,
                            gravity: 0.8,
                            scalar: 1.5,
                        })
                        confetti({
                            particleCount: 60,
                            angle: Math.random() * 60 + 240,
                            spread: 100,
                            origin: {
                                x: 1,
                                y: 1,
                            },
                            colors: goldColors,
                            gravity: 0.8,
                            scalar: 1.5,
                        })
                    }
                }, 250)
            }
            launchFireworks()
        }
    }, [isOpen])
    if (!isOpen) return null
    const handleCollect = () => {
        onClose()
        navigate('/giveaway-entry')
    }
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]"
            ref={fireworksRef}
        >
            <div className="bg-[#374151] rounded-2xl p-8 text-center text-white w-[90%] max-w-[360px] flex flex-col items-center">
                <h2 className="text-4xl font-bold mb-16">Congratulations !</h2>
                <p className="text-2xl font-medium mb-12">You Win</p>
                <div className="flex items-center justify-center mb-6">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                        alt="Coins"
                        className="w-6 h-6 mr-3"
                    />
                    <span className="text-2xl font-medium">
            {prize.coinAmount.toLocaleString()}
          </span>
                </div>
                <div className="text-2xl font-medium mb-2">+</div>
                <div className="flex items-center justify-center mb-16">
          <span className="text-2xl font-medium">
            {prize.spinAmount} x Spin
          </span>
                </div>
                <button
                    className="bg-[#3B82F6] hover:bg-blue-600 text-white py-4 mt-16 px-16 rounded-2xl text-3xl font-medium w-full"
                    onClick={handleCollect}
                >
                    Collect
                </button>
            </div>
        </div>
    )
}
