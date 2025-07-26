import React, {useEffect, useState} from 'react'
import { useGlobalContext } from '../context/GlobalContext'
type BalanceSelectorProps = {
    onSelect?: (type: 'coin' | 'ticket') => void
}
export function BalanceSelector({ onSelect }: BalanceSelectorProps) {
    const { coinBalance, ticketBalance } = useGlobalContext();
    const [selected, setSelected] = useState<'coin' | 'ticket'>('coin')

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
        setSelected(type)
        if (onSelect) {
            onSelect(type)
        }
    }
    return (
        <>
            <div className="w-full max-w-md mx-auto">
                {/* Main Bar */}
                <div className="relative h-10 sm:h-12 md:h-14 lg:h-16 bg-[#0A0E1A] rounded-full border-2 border-gray-800 overflow-hidden">

                    {/* Switch Coin Bar and Ticket Bar */}
                    <div className="w-full h-full flex items-center justify-center">
                        {/* Switch Coin Bar */}
                        <div className={`w-full h-full flex pr-20 items-center cursor-pointer ${isMobile ? 'pr-16' : 'pr-24'} ${selected === 'coin' ? 'border-2 border-[#FDF222] rounded-full' : ''}`}
                             onClick={() => handleSelect('coin')}
                        >
                            <p className={`w-full font-inter text-right cursor-pointer ${selected === 'coin' ? 'text-[#FDF222]' : 'text-white'}`}
                                onClick={() => handleSelect('coin')}
                            >50,000</p>
                        </div>

                        {/* Switch Ticket Bar */}
                        <div className={`w-full h-full flex items-center cursor-pointer ${isMobile ? 'pl-14' : 'pl-20'} ${selected === 'ticket' ? 'border-2 border-green-600 rounded-full' : ''}`}
                             onClick={() => handleSelect('ticket')}
                        >
                            <p className={`w-full font-inter text-left pl-2 cursor-pointer ${selected === 'ticket' ? 'text-[#22C55E]' : 'text-white'}`}
                               onClick={() => handleSelect('ticket')}
                            >0</p>
                        </div>
                    </div>

                    {/* Middle  Coin and Ticket Icons Bar */}
                    <div className={`flex justify-between h-full absolute top-0 bottom-0 left-1/2 transform -translate-x-1/2 rounded-full border-2 ${isMobile ? 'w-1/4' : 'w-2/1'} ${selected === 'coin' ? 'border-[#FDF222] bg-[#FFC000]' : 'border-[#22C55E] bg-green-600'}`}>

                        {/* Coin Icon */}
                        <div className="h-full w-full rounded-full">
                            <img src="https://uploadthingy.s3.us-west-1.amazonaws.com/2XiBYwBWgNJxytH6Z2jPWP/point.png"
                                 alt="coin"
                                 className={`h-full border-[#FDF222] bg-[#FDF222] rounded-full ${isMobile ? 'border-4' : 'border-8'}`}
                            />
                        </div>

                        {/* Tickets Icon */}
                        <div className={`flex justify-end h-full w-full rounded-full ${!isMobile && 'ml-7'}`}>
                            <img src="https://uploadthingy.s3.us-west-1.amazonaws.com/65WCbcmf6dyyeqvjSAJHyp/fire.png"
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
