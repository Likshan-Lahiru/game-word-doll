import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useGlobalContext } from '../context/GlobalContext'
import { StatusBar } from '../components/StatusBar'
export function BetSelectorPage() {
    const navigate = useNavigate()
    const location = useLocation()
    const { setBetAmount, setWinAmount, isAuthenticated, coinBalance } =
        useGlobalContext()
    const [selectedBet, setSelectedBet] = useState<number>(1000)
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    // Extract gameType from the URL state
    const { gameType } = location.state as {
        gameType: 'wordoll' | 'lockpickr'
    }
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    const betOptions = [
        {
            bet: 200,
            win: 5000,
        },
        {
            bet: 1000,
            win: 10000,
        },
        {
            bet: 9000,
            win: 120000,
        },
    ]
    const handleSelectBet = (bet: number, win: number) => {
        setSelectedBet(bet)
        setBetAmount(bet)
        setWinAmount(win)
    }
    const handlePlay = () => {
        const option = betOptions.find((opt) => opt.bet === selectedBet)
        if (option) {
            setBetAmount(option.bet)
            setWinAmount(option.win)
            if (gameType === 'wordoll') {
                navigate('/wordoll-game')
            } else {
                navigate('/lock-pickr-game')
            }
        }
    }
    if (!isAuthenticated) {
        navigate(gameType === 'wordoll' ? '/wordoll-game' : '/lock-pickr-game')
        return null
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
                <StatusBar isMobile={true} hideOnlineCount={true} />
                {/* Main Content */}
                <div className="flex-1 flex flex-col items-center justify-center p-4 mb-96">
                    <div className="w-full max-w-md">
                        {/* Bet Options */}
                        <div className="flex justify-center space-x-4 mb-12 relative">
                            {betOptions.map((option) => (
                                <div key={option.bet} className="flex flex-col items-center">
                                    <div
                                        className="cursor-pointer p-4 rounded-2xl bg-[#374151] w-24 h-12 flex items-center justify-center mt-6 relative"
                                        onClick={() => handleSelectBet(option.bet, option.win)}
                                    >
                                        <img
                                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/2XiBYwBWgNJxytH6Z2jPWP/point.png"
                                            alt="Gold Coins"
                                            className="w-4 h-4 mr-2"
                                        />
                                        <span className="text-white text-lg font-semibold font-[Inter]">
                                            {option.bet.toLocaleString()}
                                        </span>
                                        {/* Underline for selected option */}
                                        {selectedBet === option.bet && (
                                            <div className="absolute -bottom-3 ml-4 mr-4 left-0 right-0 h-1 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {/* Game Title */}
                        <div className="bg-[#374151] rounded-xl p-6 mb-10 flex flex-col items-center justify-center text-center">
                            <h2 className="text-white text-2xl font-bold text-center mb-12 font-[Inter]">
                                {gameType === 'wordoll' ? 'Wordoll' : 'Lock Pickr'}
                            </h2>
                            {/* Win Amount */}
                            <div className="bg-[#1F2937] rounded-xl p-6 mb-2 pl-10 pr-10">
                                <p className="text-white text-2xl font-semibold mb-6 text-center font-[Inter]">
                                    Win
                                </p>
                                <div className="flex items-center justify-center">
                                    <img
                                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/2XiBYwBWgNJxytH6Z2jPWP/point.png"
                                        alt="Gold Coins"
                                        className="w-5 h-5 mr-3"
                                    />
                                    <span className="text-white text-2xl font-bold font-[Inter]">
                                         {betOptions
                                        .find((opt) => opt.bet === selectedBet)
                                        ?.win.toLocaleString() || '10,000'}
                                    </span>
                                </div>
                            </div>
                            {/* Play Button */}
                            <div className="flex justify-center mt-12 w-full">
                                <button
                                    className="bg-[#3B82F6] hover:bg-blue-600 text-white py-3 px-16 rounded-xl font-semibold text-2xl font-[Inter]"
                                    onClick={handlePlay}
                                >
                                    Play
                                </button>
                            </div>
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
            <div className="flex-1 flex flex-col items-center justify-center p-4 mb-96">
                <div className="w-full max-w-md">
                    {/* Bet Options */}
                    <div className="flex justify-center space-x-4 mb-6 relative ">
                        {betOptions.map((option, index) => (
                            <div key={option.bet} className="flex flex-col items-center">
                                <div
                                    className={`cursor-pointer p-4 rounded-2xl bg-[#374151] w-32 h-12  flex items-center justify-center mt-6 relative`}
                                    onClick={() => handleSelectBet(option.bet, option.win)}
                                >
                                    <img
                                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/2XiBYwBWgNJxytH6Z2jPWP/point.png"
                                        alt="Gold Coins"
                                        className="w-5 h-5 ml-2"
                                    />
                                    <span className="text-white text-lg font-bold text-center w-full m-1 font-[Inter]">
                    {option.bet.toLocaleString()}
                  </span>
                                    {/* Underline for selected option */}
                                    {selectedBet === option.bet && (
                                        <div className="absolute -bottom-3 ml-4 mr-4 left-0 right-0 h-1 bg-white rounded-full"></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                    {/* Game Title */}
                    <div className="bg-[#374151] rounded-xl p-6 mb-10 flex flex-col items-center justify-center text-center">
                        <h2 className="text-white text-2xl font-bold text-center mb-16 font-[Inter]">
                            {gameType === 'wordoll' ? 'Wordoll' : 'Lock Pickr'}
                        </h2>
                        {/* Win Amount */}
                        <div className="bg-[#1F2937] rounded-xl pb-5  px-10 mb-2">
                            <p className="text-white text-2xl font-semibold mt-2 mb-4 text-center font-[Inter]">
                                Win
                            </p>
                            <div className="flex items-center justify-center">
                                <img
                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/2XiBYwBWgNJxytH6Z2jPWP/point.png"
                                    alt="Gold Coins"
                                    className="w-6 h-6 mr-2"
                                />
                                <span className="text-white text-2xl font-bold font-[Inter]">
                                        {betOptions
                                            .find((opt) => opt.bet === selectedBet)
                                            ?.win.toLocaleString() || '10,000'}
                                </span>
                            </div>
                        </div>
                        {/* Play Button */}
                        <div className="flex justify-center mt-14">
                            <button
                                className="bg-[#3B82F6] hover:bg-blue-600 text-white py-3 px-16 rounded-xl font-semibold text-2xl font-[Inter] w-full"
                                onClick={handlePlay}
                            >
                                Play
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
