import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatusBar } from '../components/StatusBar'
import { BottomNavigation } from '../components/BottomNavigation'
import { useGlobalContext } from '../context/GlobalContext'
import { CongratsModal } from '../components/CongratsModal'
export function SpinPage() {
    const navigate = useNavigate()
    const { spinBalance, addSpins, addCoins, coinBalance, gemBalance } =
        useGlobalContext()
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
            name: 'GC 200,000',
            coins: 200000,
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
        }, 12000) // Match this to the new animation duration (7s + 5s)
    }
    // Mobile view based on the provided image
    if (isMobile) {
        return (
            <div className="flex flex-col w-full min-h-screen bg-[#1A202C] text-white">
                <div className="absolute top-4 left-4 z-10">
                    <button
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        onClick={() => navigate('/')}
                    >
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/5dZY2vpVSVwYT3dUEHNYN5/back-icons.png"
                            alt="Back"
                            className="w-8 h-8"
                        />
                    </button>
                </div>
                {/* Status Bar */}
                <div className="">
                    <StatusBar isMobile={isMobile} hideOnlineCount={true} />
                </div>
                {/* Spin wheel container */}
                <div className="flex-1 flex flex-col items-center justify-center mt-4 mb-4 px-4 relative">
                    {/* Red pointer at the top */}
                    <div className="absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/hm68DVWvSP7SgbiVN6srwX/pointer.png"
                            alt="Pointer"
                            className="w-14 h-14"
                        />
                    </div>
                    {/* Wheel */}
                    <div
                        ref={wheelRef}
                        className="w-full mt-0 aspect-square rounded-full"
                        style={{
                            transform: `rotate(${rotationDegrees}deg)`,
                            transformOrigin: 'center center',
                            backgroundImage: `url('https://uploadthingy.s3.us-west-1.amazonaws.com/9XLzM6kwQ7itrrRJ41WuGf/wheel.png')`,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            transition: isSpinning
                                ? 'transform 12s cubic-bezier(0.09, 0.25, 0.25, 1)'
                                : 'none',
                            willChange: 'transform',
                        }}
                    />
                </div>
                {/* Spin buttons */}
                <div className="px-4 pb-24 space-y-2">
                    <button
                        className="w-full py-4 rounded-xl bg-[#374151] text-white font-bold text-xl"
                        disabled={isSpinning || spinBalance < 3}
                    >
                        3 x Spin
                    </button>
                    <button
                        className="w-full py-4 rounded-xl bg-[#2D7FF0] hover:bg-blue-600 text-white font-bold text-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={spinWheel}
                        disabled={isSpinning || spinBalance <= 0}
                    >
                        Spin
                    </button>
                </div>
                <div>
                    <CongratsModal
                        isOpen={showCongratsModal}
                        onClose={() => setShowCongratsModal(false)}
                        coinAmount={prize.coins}
                        spinAmount={prize.spins}
                    />
                </div>
            </div>
        )
    }
    // Desktop view - unchanged
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white">
            {/* Back button and status bar */}
            <div className="relative p-4">
                <div className="flex items-center absolute top-4 left-4">
                    <button
                        className="w-12 h-12 rounded-full flex items-center justify-center"
                        onClick={() => navigate('/giveaway-entry')}
                    >
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/5dZY2vpVSVwYT3dUEHNYN5/back-icons.png"
                            alt="Back"
                            className="w-8 h-8"
                        />
                    </button>
                </div>
            </div>
            {/* Main content */}
            <div className="flex-1 flex flex-col items-center justify-center mb-32 px-4 py-8 relative">
                {/* Spin wheel container */}
                <div className="relative w-full max-w-2xl mx-auto">
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/hm68DVWvSP7SgbiVN6srwX/pointer.png"
                            alt="Pointer"
                            className="w-14 h-14"
                        />
                    </div>
                    <div
                        ref={wheelRef}
                        className="w-full aspect-square rounded-full"
                        style={{
                            transform: `rotate(${rotationDegrees}deg)`,
                            transformOrigin: 'center center',
                            backgroundImage: `url('https://uploadthingy.s3.us-west-1.amazonaws.com/9XLzM6kwQ7itrrRJ41WuGf/wheel.png')`,
                            backgroundSize: 'contain',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            transition: isSpinning
                                ? 'transform 12s cubic-bezier(0.09, 0.25, 0.25, 1)'
                                : 'none',
                            willChange: 'transform',
                        }}
                    />
                </div>
                {/* Spin buttons */}
                <div className="flex flex-col md:flex-row gap-4 mt-4 w-full max-w-2xl">
                    <button
                        className="w-full py-3 px-4 rounded-2xl bg-[#374151] text-white font-semibold text-3xl"
                        disabled={isSpinning || spinBalance < 25}
                        onClick={() =>
                            console.log('25x Spin button clicked (not implemented)')
                        }
                    >
                        25 x Spin
                    </button>
                    <button
                        className="w-full py-3 px-4 rounded-2xl bg-[#2D7FF0] hover:bg-blue-600 text-white font-semibold text-3xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={spinWheel}
                        disabled={isSpinning || spinBalance <= 0}
                    >
                        Spin
                    </button>
                </div>
            </div>
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
