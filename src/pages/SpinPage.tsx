import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatusBar } from '../components/StatusBar'
import { BottomNavigation } from '../components/BottomNavigation'
import { useGlobalContext } from '../context/GlobalContext'
import { CongratsModal } from '../components/CongratsModal'
export function SpinPage() {
    const navigate = useNavigate()
    const { spinBalance, addSpins, addCoins } = useGlobalContext()
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    const [isSpinning, setIsSpinning] = useState(false)
    const [rotationDegrees, setRotationDegrees] = useState(0)
    const [showCongratsModal, setShowCongratsModal] = useState(false)
    const [prize, setPrize] = useState({
        coins: 0,
        spins: 0,
    })
    const wheelRef = useRef<HTMLDivElement>(null)
    // Prizes configuration
    const prizes = [
        {
            name: 'GC 25M',
            coins: 25000000,
            spins: 0,
        },
        {
            name: 'Try again',
            coins: 0,
            spins: 1,
        },
        {
            name: 'GC 50,000',
            coins: 50000,
            spins: 0,
        },
        {
            name: 'GC 200,000',
            coins: 200000,
            spins: 0,
        },
        {
            name: '?',
            coins: 5000,
            spins: 2,
        },
        {
            name: 'GC 10,000',
            coins: 10000,
            spins: 0,
        },
        {
            name: 'GC 500,000',
            coins: 500000,
            spins: 0,
        },
        {
            name: 'GC 1,000,000',
            coins: 1000000,
            spins: 0,
        },
    ]
    // Add some spins for testing if none are available
    useEffect(() => {
        if (spinBalance <= 0) {
            // Add 5 spins for testing purposes
            addSpins(5)
            console.log('Added 5 spins for testing')
        }
    }, [])
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    const spinWheel = () => {
        console.log('Spin button clicked', {
            spinBalance,
            isSpinning,
        })
        if (isSpinning) {
            console.log('Already spinning, ignoring click')
            return
        }
        if (spinBalance <= 0) {
            console.log('No spins available')
            // Add spins for testing if needed
            addSpins(1)
            return
        }
        // Use one spin
        addSpins(-1)
        setIsSpinning(true)
        // Random number of full rotations (3-5) plus a random segment
        const fullRotations = 3 + Math.floor(Math.random() * 3)
        const randomPrizeIndex = Math.floor(Math.random() * 8)
        const segmentAngle = 45 // 360 degrees / 8 segments
        // Calculate final rotation (multiple full rotations + position to stop at the random prize)
        const finalRotation =
            fullRotations * 360 + (360 - randomPrizeIndex * segmentAngle)
        // Set the new absolute rotation value
        setRotationDegrees((prevRotation) => prevRotation + finalRotation)
        console.log(
            `Spinning to ${rotationDegrees + finalRotation} degrees (prize index: ${randomPrizeIndex})`,
        )
        // After animation completes, show the prize
        setTimeout(() => {
            setIsSpinning(false)
            const wonPrize = prizes[randomPrizeIndex]
            setPrize(wonPrize)
            // Add the coins to the user's balance
            if (wonPrize.coins > 0) {
                addCoins(wonPrize.coins)
            }
            // Add any spins won
            if (wonPrize.spins > 0) {
                addSpins(wonPrize.spins)
            }
            setShowCongratsModal(true)
        }, 4000) // Match this to the animation duration
    }
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white">
            {/* Back button and status bar */}
            <div className="relative p-4">
                <div className="flex items-center">
                    <button
                        className="w-10 h-10 rounded-full bg-[#2A3042] flex items-center justify-center mr-3"
                        onClick={() => navigate('/')}
                    >
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/5dZY2vpVSVwYT3dUEHNYN5/back-icons.png"
                            alt="Back"
                            className="w-5 h-5"
                        />
                    </button>
                    <div className="flex-1">
                        <StatusBar isMobile={isMobile} />
                    </div>
                </div>
            </div>
            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 relative">
                {/* Indicators in top right (on mobile they're already in StatusBar) */}
                {!isMobile && (
                    <div className="absolute top-4 right-4 flex flex-col space-y-2">
                        <div className="flex items-center bg-black/30 rounded-full px-3 py-1.5">
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/uwPYNNRiavmZZ285SkzD5Z/diaomnd.png"
                                alt="Diamond"
                                className="w-5 h-5 mr-2"
                            />
                            <span className="text-white">0</span>
                        </div>
                        <div className="flex items-center bg-black/30 rounded-full px-3 py-1.5">
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/tkU55SAwCg4xadU5QKCqJC/point-icons.png"
                                alt="Coins"
                                className="w-5 h-5 mr-2"
                            />
                            <span className="text-white">0</span>
                        </div>
                    </div>
                )}
                {/* Spin wheel container */}
                <div className="relative w-full max-w-md mx-auto">
                    {/* Red pointer */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <svg width="40" height="40" viewBox="0 0 40 40">
                            <path d="M20 0 L40 20 L20 40 L0 20 Z" fill="#E53E3E" />
                        </svg>
                    </div>
                    {/* Spinning wheel */}
                    <div
                        ref={wheelRef}
                        className="w-full aspect-square rounded-full"
                        style={{
                            transform: `rotate(${rotationDegrees}deg)`,
                            transformOrigin: 'center center',
                            backgroundImage: `url(${encodeURI('https://uploadthingy.s3.us-west-1.amazonaws.com/r8KpmrMg8baniBXvMd6QtE/Screenshot_2025-07-22_at_21.05.06.png')})`,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            transition: isSpinning
                                ? 'transform 4s cubic-bezier(0.17, 0.67, 0.83, 0.67)'
                                : 'none',
                            willChange: 'transform',
                        }}
                    />
                </div>
                {/* Spin count display */}
                <div className="mt-4 mb-2 text-center">
                    <p className="text-white">Available Spins: {spinBalance}</p>
                </div>
                {/* Spin buttons */}
                <div className="flex flex-col md:flex-row gap-4 mt-4 w-full max-w-md">
                    <button
                        className="flex-1 py-3 px-4 rounded-full bg-[#374151] text-white font-bold text-lg"
                        disabled={isSpinning || spinBalance < 25}
                        onClick={() =>
                            console.log('25x Spin button clicked (not implemented)')
                        }
                    >
                        25 x Spin
                    </button>
                    <button
                        className="flex-1 py-3 px-4 rounded-full bg-[#2D7FF0] hover:bg-blue-600 text-white font-bold text-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={spinWheel}
                        disabled={isSpinning || spinBalance <= 0}
                    >
                        Spin
                    </button>
                </div>
            </div>
            {/* Bottom Navigation */}
            <BottomNavigation />
            {/* Congrats Modal */}
            <CongratsModal
                isOpen={showCongratsModal}
                onClose={() => setShowCongratsModal(false)}
                coinAmount={prize.coins}
                spinAmount={prize.spins}
            />
        </div>
    )
}
