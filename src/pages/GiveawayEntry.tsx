import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BottomNavigation } from '../components/BottomNavigation'
import { useGlobalContext } from '../context/GlobalContext'
import { StatusBar } from '../components/StatusBar'
export function GiveawayEntry() {
    const navigate = useNavigate()
    const location = useLocation()
    const { spinBalance } = useGlobalContext()
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    const [selectedGame, setSelectedGame] = useState<string | null>(null)

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleGameSelect = (gameType: string) => {
        setSelectedGame(gameType)
        navigate('/giveaway-game', {
            state: {
                selectedGame: gameType,
            },
        })
    }

    const CustomWordollCard = () => {
        if (isMobile) {
            return (
                <div
                    className="rounded-xl overflow-hidden flex flex-col h-[270px] relative cursor-pointer font-['DM Sans']"
                    onClick={() => handleGameSelect('wordoll')}
                >
                    <div className="absolute inset-0">
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/wEfJPtYkYsjSUwUG9ivnUR/wordoll.png"
                            alt="Wordoll"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="mt-auto pb-6 px-4 text-center relative z-10">
                        <h3 className="text-xl font-bold text-white">Wordoll</h3>
                    </div>
                </div>
            )
        }

        return (
            <div className="h-[450px] rounded-2xl overflow-hidden flex flex-col relative font-['DM Sans']">
                <div className="absolute inset-0">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/wEfJPtYkYsjSUwUG9ivnUR/wordoll.png"
                        alt="Wordoll"
                        className="w-full h-full object-cover"
                    />
                </div>
                <h3 className="text-3xl font-medium text-center text-white relative z-10 mt-6 pt-2 font-['DM_Sans']">
                    Wordoll
                </h3>
                <div className="flex-1"></div>
                <div className="p-4 flex justify-center mb-6 relative z-10">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 rounded-full py-1 px-16 text-white font-medium text-xl border border-white/60 font-['DM_Sans']"
                        onClick={() => handleGameSelect('wordoll')}
                    >
                        PLAY
                    </button>
                </div>
            </div>
        )
    }

    const CustomLockPickrCard = () => {
        if (isMobile) {
            return (
                <div
                    className="rounded-xl overflow-hidden flex flex-col h-[270px] relative cursor-pointer font-['DM Sans']"
                    onClick={() => handleGameSelect('lockpickr')}
                >
                    <div className="absolute inset-0">
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/i9wzJrxokDDqgwas4Cft5m/lockpickr.png"
                            alt="Lock Pickr"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="mt-auto pb-6 px-4 text-center relative z-10">
                        <h3 className="text-xl font-bold text-white">Lock Pickr</h3>
                    </div>
                </div>
            )
        }

        return (
            <div className="h-[450px] rounded-2xl overflow-hidden flex flex-col relative font-['DM Sans']">
                <div className="absolute inset-0">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/i9wzJrxokDDqgwas4Cft5m/lockpickr.png"
                        alt="Lock Pickr"
                        className="w-full h-full object-cover"
                    />
                </div>
                <h3 className="text-3xl font-medium text-center text-white relative z-10 mt-6 pt-2 font-['DM_Sans']">
                    Lock Pickr
                </h3>
                <div className="flex-1"></div>
                <div className="p-4 flex justify-center mb-6 relative z-10">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 rounded-full py-1 px-16 text-white font-medium text-xl border border-white/60 font-['DM_Sans']"
                        onClick={() => handleGameSelect('lockpickr')}
                    >
                        PLAY
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="relative font-['DM Sans']">
            {/* Back button */}
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
                <StatusBar  isMobile={isMobile} hideOnlineCount={true} />
            </div>
            {/* Main Content */}
            <div className="flex flex-col w-full bg-[#1F2937] text-white">
                <div className="flex flex-col pt-1">
                    {/* Title */}
                    <h2 className={`${isMobile ? 'pb-4' : 'pb-5'} text-base font-dmSans font-['DM_Sans'] sm:text-lg md:text-xl font-medium text-center my-10 sm:my-3 md:mb-10 px-4`}>
                        Play any game to enter the Fortune Spin
                    </h2>
                    {/* Game Cards */}
                    <div className="px-4">
                        <div
                            className={`flex flex-wrap justify-center ${isMobile ? 'gap-3' : 'gap-4'} w-full max-w-2xl mx-auto`}
                        >
                            <div
                                className={`${isMobile ? 'w-[48%]' : 'w-[240px]'} ${isMobile ? 'h-[265px]' : 'h-[320px]'}`}
                            >
                                <CustomWordollCard />
                            </div>
                            <div
                                className={`${isMobile ? 'w-[48%]' : 'w-[240px]'} ${isMobile ? 'h-[265px]' : 'h-[320px]'}`}
                            >
                                <CustomLockPickrCard />
                            </div>
                        </div>
                    </div>
                    {/* Spin Button */}
                    <div className="w-full px-4 mt-16 sm:mt-44 md:mt-8 lg:mt-24 xl:mt-44 mb-20">
                        <button
                            className={`${spinBalance > 0 ? 'bg-[#FFB302]' : 'bg-[#2D7FF0]'} hover:bg-opacity-90 text-white py-4 px-16 rounded-full mx-auto block`}
                            onClick={() => navigate('/spin')}
                            disabled={spinBalance <= 0}
                        >
                            SPIN NOW ({spinBalance} x Spin)
                        </button>
                    </div>
                </div>
                {/* Bottom Navigation */}
                <BottomNavigation />
            </div>
        </div>
    )
}
