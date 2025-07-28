import React, { useEffect, useState, Component } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGlobalContext } from '../context/GlobalContext'
import { StatusBar } from '../components/StatusBar'
import { TicketSelector } from '../components/TicketSelector'
export function GemGameModePage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { ticketBalance, gemBalance, addGems, setTicketBalance } =
        useGlobalContext()
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    const [gameStarted, setGameStarted] = useState(false)
    const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
    const [playersJoined, setPlayersJoined] = useState(100)
    const [gemPool, setGemPool] = useState(55.0)
    const [countdown, setCountdown] = useState(300) // 5 minutes in seconds
    const [selectedTicketAmount, setSelectedTicketAmount] = useState(1)
    // Get game type from location state
    const { gameType } = (location.state as {
        gameType: string
    }) || {
        gameType: 'wordoll',
    }
    const ticketOptions = [
        {
            value: 0.2,
            label: '0.20',
        },
        {
            value: 1,
        },
        {
            value: 9,
        },
    ]
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    useEffect(() => {
        if (gameStarted) {
            const timer = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer)
                        return 0
                    }
                    return prev - 1
                })
            }, 1000)
            return () => clearInterval(timer)
        }
    }, [gameStarted])
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    const handleEnterGame = () => {
        if (ticketBalance >= selectedTicketAmount) {
            setTicketBalance(ticketBalance - selectedTicketAmount)
            setGameStarted(true)
            // Navigate to the appropriate gem game based on gameType
            if (gameType === 'wordoll') {
                navigate('/gem-wordoll-game', {
                    state: {
                        ticketAmount: selectedTicketAmount,
                        gemPool: gemPool,
                    },
                })
            } else {
                navigate('/gem-lockpickr-game', {
                    state: {
                        ticketAmount: selectedTicketAmount,
                        gemPool: gemPool,
                    },
                })
            }
        } else {
            alert('Not enough tickets to play!')
            navigate('/')
        }
    }
    if (isMobile) {
        return (
            <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white">
                {/* Back button */}
                <div className="absolute top-12 left-4 z-10">
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
                <StatusBar isMobile={isMobile} hideOnlineCount={true} />
                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-start pt-5 px-4">
                    {/* Ticket Selector Component */}
                    <TicketSelector
                        options={ticketOptions}
                        selectedValue={selectedTicketAmount}
                        onChange={setSelectedTicketAmount}
                    />
                    {/* Main Game Card */}
                    <div className="w-full max-w-md bg-[#374151] rounded-2xl overflow-hidden mb-3">
                        <div className="p-6 text-center">
                            <h2 className="text-xl font-bold mb-6">
                                {gameType === 'wordoll' ? 'Wordoll' : 'Lock Pickr'}
                            </h2>
                            <div className="grid grid-cols-2 gap-2 mb-6">
                                <div className="bg-[#1F2937] p-2 rounded-2xl">
                                    <p className="text-sm mb-1 font-[Inter]">Players Joined</p>
                                    <p className="text-xl font-bold font-[Inter]">
                                        {playersJoined}
                                    </p>
                                </div>
                                <div className="bg-[#1F2937] p-2 rounded-2xl">
                                    <p className="text-sm mb-1 font-[Inter]">Gem Pool</p>
                                    <div className="flex items-center justify-center">
                                        <img
                                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                                            alt="Diamond"
                                            className="w-5 h-5 mr-2"
                                        />
                                        <p className="text-xl font-semibold font-[Inter]">
                                            {gemPool.toFixed(2)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="mb-4">
                                <p className="text-xs mb-1 font-[Inter]">Starts In:</p>
                                <p className="text-2xl font-bold font-[Inter]">
                                    {formatTime(countdown)}
                                </p>
                            </div>
                            <button
                                className="bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold px-16 py-2 rounded-2xl text-lg font-[Inter]"
                                onClick={handleEnterGame}
                            >
                                Enter
                            </button>
                        </div>
                    </div>
                    {/* Legendary Card */}
                    <div className="w-full max-w-md bg-[#374151] rounded-xl p-4 text-center mb-3">
                        <h3 className="text-lg font-semibold mb-2 font-[Inter]">
                            THE LEGENDARY
                        </h3>
                        <div className="flex items-center justify-center">
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                                alt="Diamond"
                                className="w-5 h-5 mr-2"
                            />
                            <p className="text-xl font-semibold font-[Inter]">55.00</p>
                        </div>
                    </div>
                    {/* Invite Card */}
                    <div className="w-full max-w-md bg-[#374151] rounded-xl p-2 text-center mb-20">
                        <h3 className="text-base font-semibold mt-2 mb-2 font-[Inter]">
                            Invite players to increase Gem Pool
                        </h3>
                        <div className="flex items-center justify-between">
                            <p className="text-base ml-4 text-[#006CB9] font-[Inter]">
                                www.xyz.com
                            </p>
                            <button className="bg-[#2D7FF0] hover:bg-blue-600 px-3 py-1 mr-4 rounded-full text-xs font-[Inter]">
                                Copy
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white">
            {/* Back button */}
            <div className="absolute top-12 left-4 z-10">
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
            <div className="md:pl-52">
                <StatusBar isMobile={isMobile} hideOnlineCount={true} />
            </div>
            {/* Main Content */}
            <div className="flex-1 flex flex-col items-center justify-start pt-5 px-4">
                {/* Ticket Selector Component */}
                <TicketSelector
                    options={ticketOptions}
                    selectedValue={selectedTicketAmount}
                    onChange={setSelectedTicketAmount}
                />
                {/* Main Game Card */}
                <div className="w-full max-w-md bg-[#374151] rounded-2xl overflow-hidden mb-3">
                    <div className="p-6 text-center">
                        <h2 className="text-xl font-bold mb-6">
                            {gameType === 'wordoll' ? 'Wordoll' : 'Lock Pickr'}
                        </h2>
                        <div className="grid grid-cols-2 gap-2 mb-8">
                            <div className="bg-[#1F2937] p-2 rounded-2xl">
                                <p className=" mb-1 font-[Inter]">Players Joined</p>
                                <p className="text-xl font-bold font-[Inter]">
                                    {playersJoined}
                                </p>
                            </div>
                            <div className="bg-[#1F2937] p-2 rounded-2xl">
                                <p className=" mb-1 font-[Inter]">Gem Pool</p>
                                <div className="flex items-center justify-center">
                                    <img
                                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                                        alt="Diamond"
                                        className="w-5 h-5 mr-2"
                                    />
                                    <p className="text-xl font-semibold font-[Inter]">
                                        {gemPool.toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mb-8">
                            <p className="text-xs mb-2 font-[Inter]">Starts In:</p>
                            <p className="text-2xl font-bold font-[Inter]">
                                {formatTime(countdown)}
                            </p>
                        </div>
                        <button
                            className="bg-[#3B82F6] hover:bg-blue-600 text-white font-semibold px-16  py-2 rounded-2xl text-lg font-[Inter]"
                            onClick={handleEnterGame}
                        >
                            Enter
                        </button>
                    </div>
                </div>
                {/* Legendary Card */}
                <div className="w-full max-w-md bg-[#374151] rounded-xl p-6 text-center mb-3">
                    <h3 className="text-xl font-semibold mb-4 font-[Inter]">
                        THE LEGENDARY
                    </h3>
                    <div className="flex items-center justify-center">
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                            alt="Diamond"
                            className="w-5 h-5 mr-2"
                        />
                        <p className="text-xl font-semibold font-[Inter]">55.00</p>
                    </div>
                </div>
                {/* Invite Card */}
                <div className="w-full max-w-md bg-[#374151] rounded-xl p-2 text-center mb-20">
                    <h3 className="text-lg font-semibold mt-2 mb-2 font-[Inter]">
                        Invite players to increase Gem Pool
                    </h3>
                    <div className="flex items-center justify-between">
                        <p className="text-lg ml-44 text-[#006CB9] font-[Inter]">
                            www.xyz.com
                        </p>
                        <button className="bg-[#2D7FF0] hover:bg-blue-600 px-3 py-1 mr-16 rounded-full  text-xs font-[Inter]">
                            Copy
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
