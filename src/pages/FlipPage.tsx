import React, { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatusBar } from '../components/StatusBar'
import { useGlobalContext } from '../context/GlobalContext'
import {IMAGES} from "../constance/imagesLink.ts";
import {FlipCard} from "../components/cards/flipCard/FlipCard.tsx";

const spinVoucherCountData = [
    {
        id: 1,
        count: 0.20
    },
    {
        id: 2,
        count: 0.40
    },
    {
        id: 3,
        count: 1
    },
    {
        id: 4,
        count: 2
    }
]

const flipCardsData = [
    {
        id: 1,
        images: '',
        type: 'fortuneCard',
        selected: true,
    },
    {
        id: 2,
        images: '',
        type: 'badCooky',
        selected: false,
    },
    {
        id: 3,
        images: '',
        type: 'freeFlip',
        selected: false,
    }
]

export function FlipPage() {
    const navigate = useNavigate()
    const { spinBalance, addSpins, addCoins, coinBalance, gemBalance, selectedBalanceType } = useGlobalContext()
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    let [spinVoucherId, setSpinVoucherId] = useState(2)
    const [spinVoucherCount, setSpinVoucherCount] = useState(0.40)
    const [selectedCardId, setSelectedCardId] = useState(
        flipCardsData.find((card) => card.selected)?.id || 0
    );

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    const handleSpinPlusMark = () => {
        if (spinVoucherId < spinVoucherCountData.length) {
            const newId = spinVoucherId + 1;
            const nextItem = spinVoucherCountData.find(item => item.id === newId);
            if (nextItem) {
                setSpinVoucherId(newId);
                setSpinVoucherCount(nextItem.count);
            }
        }
    }

    const handleSpinMinusMark = () => {
        if (spinVoucherId > 1) {
            const newId = spinVoucherId - 1;
            const prevItem = spinVoucherCountData.find(item => item.id === newId);
            if (prevItem) {
                setSpinVoucherId(newId);
                setSpinVoucherCount(prevItem.count);
            }
        }
    }

    // Mobile view based on the provided image
    if (isMobile) {
        return (
            <div className="flex flex-col w-full min-h-screen bg-[#1A202C] text-white">
                <div className="absolute top-12 left-3 z-10">
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

                {/* Spin buttons */}
                <div className="px-4 pb-24 space-y-2">
                    {selectedBalanceType === 'ticket' && (
                        <>
                            <div className="flex font-inter items-center justify-between w-full py-3 px-2 rounded-[22px] bg-[#374151] text-white h-[80px]">
                                <button
                                    className="font-extrabold px-4 text-[30px] leading-none h-[64px] w-[64px] flex items-center justify-center rounded-[22px] bg-[#67768F]"
                                    onClick={handleSpinMinusMark}
                                >
                                    -
                                </button>

                                <div className="flex justify-center items-center pr-3 overflow-hidden">
                                    <img
                                        src={IMAGES.voucher}
                                        alt="voucher"
                                        className="h-full max-h-[90px] w-auto object-contain"
                                    />
                                    <p className="font-bold text-2xl cursor-default text-center w-[60px]">
                                        {Number.isInteger(spinVoucherCount)
                                            ? spinVoucherCount
                                            : spinVoucherCount.toFixed(2)}
                                    </p>
                                </div>

                                <button
                                    className="font-extrabold px-4 text-[30px] leading-none h-[64px] w-[64px] flex items-center justify-center rounded-[22px] bg-[#67768F]"
                                    onClick={handleSpinPlusMark}
                                >
                                    +
                                </button>
                            </div>
                        </>
                    )}

                    {selectedBalanceType === 'coin' &&
                        <button
                            className="w-full py-4 rounded-[22px] bg-[#374151] text-white font-bold text-xl"
                        >
                            3 x Flip
                        </button>
                    }
                    <button
                        className="w-full py-4 rounded-[22px] bg-[#2D7FF0] hover:bg-blue-600 text-white font-bold text-2xl font-inter transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => console.log("")}
                    >
                        Flip
                    </button>
                </div>
            </div>
        )
    }

    // Desktop view - unchanged
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white">

            <div>
                {/* Back button */}
                <div className="absolute top-12 left-2 z-10 lg:top-4 md:top-4 md:left-4 sm:top-4">
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

                {/* Status Bar */}
                <div className="">
                    <StatusBar  isMobile={isMobile} hideOnlineCount={true} />
                </div>
            </div>

            {/* Flip Cards */}
            <div className={"flex justify-center items-center gap-x-3"}>
                {flipCardsData.map((item) => (
                    <>
                        <FlipCard
                            key={item.id}
                            logo={IMAGES.logo}
                            items={item}
                            isSelected={selectedCardId === item.id}
                            onSelect={() => setSelectedCardId(item.id)}
                        />
                    </>
                ))}
            </div>

            <div className="flex justify-center items-center mb-10 px-4 py-8">
                {/* Spin buttons */}
                <div className="flex items-center md:flex-row gap-4 mt-4 w-full max-w-3xl">
                    {selectedBalanceType === 'ticket' && (
                        <>
                            <div className="flex font-inter items-center justify-between w-full py-3 px-1 rounded-2xl bg-[#374151] text-white h-[60px]">
                                <button
                                    className="font-extrabold px-4 text-[30px] leading-none h-[50px] w-[50px] flex items-center justify-center rounded-2xl bg-[#67768F]"
                                    onClick={handleSpinMinusMark}
                                >
                                    -
                                </button>

                                <div className="flex justify-center items-center pr-3 overflow-hidden">
                                    <img
                                        src={IMAGES.voucher}
                                        alt="voucher"
                                        className="h-full max-h-[90px] w-auto object-contain"
                                    />
                                    <p className="font-bold text-2xl cursor-default text-center w-[60px]">
                                        {Number.isInteger(spinVoucherCount)
                                        ? spinVoucherCount
                                        : spinVoucherCount.toFixed(2)}
                                    </p>
                                </div>

                                <button
                                    className="font-extrabold px-4 text-[30px] leading-none h-[50px] w-[50px] flex items-center justify-center rounded-2xl bg-[#67768F]"
                                    onClick={handleSpinPlusMark}
                                >
                                    +
                                </button>
                            </div>
                        </>
                    )}

                    {selectedBalanceType === 'coin' && (
                        <>
                            <button
                                className="w-full py-3 px-4 rounded-2xl bg-[#374151] text-white font-semibold text-3xl"
                                onClick={() =>
                                    console.log('25x Spin button clicked (not implemented)')
                                }
                            >
                                25 x Flip
                            </button>
                        </>
                    )}

                    <button
                        className="w-full py-3 px-4 rounded-2xl bg-[#2D7FF0] hover:bg-blue-600 text-white font-semibold text-3xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => console.log("")}
                    >
                        Flip
                    </button>
                </div>
            </div>
        </div>
    )
}
