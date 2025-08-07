import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../context/GlobalContext'
type BalanceSelectorProps = {
    onSelect?: (type: 'coin' | 'ticket') => void
    switchable?: boolean
}
export function BalanceSelector({
                                    onSelect,
                                    switchable = false,
                                }: BalanceSelectorProps) {
    const {
        coinBalance,
        ticketBalance,
        selectedBalanceType,
        setSelectedBalanceType,
    } = useGlobalContext()
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])
    const handleSelect = (type: 'coin' | 'ticket') => {
        if (!switchable) return
        setSelectedBalanceType(type)
        if (onSelect) {
            onSelect(type)
        }
    }
    return (
        <>
            <div className="w-full max-w-2xl mx-auto">
                {/* Main Bar */}
                <div
                    className={`relative ${isMobile ? 'h-10' : 'h-10'} h-10 sm:h-12 md:h-12 lg:h-12 bg-[#0A0E1A] rounded-full border-2 border-gray-800 overflow-hidden ${switchable ? 'cursor-pointer' : ''}`}
                >
                    {/* Switch Coin Bar and Ticket Bar */}
                    <div className="w-full h-full flex items-center justify-center">
                            {/* Switch Coin Bar */}
                        <div
                            className={`w-full h-full flex items-center justify-end border-2 ${switchable ? 'cursor-pointer' : ''} ${isMobile ? '' : 'lg:pr-[60px] md:pr-[48px] sm:pr-[68px]'} ${selectedBalanceType === 'coin' ? 'border-[#FDF222] rounded-full' : 'border-[#374151] rounded-full'}`}
                            onClick={() => handleSelect('coin')}
                        >
                            <p
                                className={`${isMobile && 'text-[11px] pr-10'} min-w-[139px] w-full font-inter pl-1 text-right ${switchable ? 'cursor-pointer' : ''} ${selectedBalanceType === 'coin' ? 'text-[#FDF222]' : 'text-white'}`}
                                onClick={() => handleSelect('coin')}
                            >
                                {coinBalance.toLocaleString()}
                                {/*500,000,000,000,0*/}
                            </p>
                        </div>
                        {/* Switch Ticket Bar */}
                        <div
                            className={`w-full h-full flex items-center justify-start border-2 ${switchable ? 'cursor-pointer' : ''} ${isMobile ? 'pl-5' : 'pl-16'} ${selectedBalanceType === 'ticket' ? 'border-green-600 rounded-full' : 'border-[#374151] rounded-full'}`}
                            onClick={() => handleSelect('ticket')}
                        >
                            <p
                                className={`${isMobile && 'text-[11px] pl-[35px]'} min-w-[110px] w-full font-inter text-left pl-2 ${switchable ? 'cursor-pointer' : ''} ${selectedBalanceType === 'ticket' ? 'text-[#22C55E]' : 'text-white'}`}
                                onClick={() => handleSelect('ticket')}
                            >
                                {ticketBalance.toFixed(2)}
                                {/*500,000,000,000,0*/}
                            </p>
                        </div>
                    </div>
                     {/*Middle Coin and Ticket Icons Bar*/}
                    <div
                        className={`flex justify-between h-full absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 rounded-full border-2 
                        ${isMobile ? 'w-[85px] ml-[2px]' : 'w-1/5 md:w-[110px] ml-[2px]'} 
                        ${selectedBalanceType === 'coin' ? 'border-[#FDF222] bg-[#FFC000]' : 'border-[#22C55E] bg-green-600'}`}
                    >
                    {/* Coin Icon */}
                        <div className="h-full w-full rounded-full">
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/2XiBYwBWgNJxytH6Z2jPWP/point.png"
                                alt="coin"
                                className={`h-full border-[#FDF222] bg-[#FDF222] rounded-full ${isMobile ? 'border-4' : 'border-8'}`}
                            />
                        </div>
                        {/* Tickets Icon */}
                        <div
                            className={`flex justify-end h-full w-full rounded-full ${!isMobile ? 'ml-2' : 'ml-2'}`}
                        >
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/65WCbcmf6dyyeqvjSAJHyp/fire.png"
                                alt="ticket"
                                className={`h-full border-green-500 bg-[#22C55E] rounded-full ${isMobile ? 'border-4' : 'border-8'}`}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
