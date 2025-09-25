import React from 'react'
import {IMAGES} from "../constance/imagesLink.ts";

export const FlipCard = ({
                             logo,
                             items,
                             isSelected,
                             onSelect,
                             isFlipped,
                             isMobile,
                         }) => {
    const handleClickFlipCard = () => {
        onSelect()
    }
    // Format win amount to ensure it displays correctly
    const formatWinAmount = (amount) => {
        if (amount === undefined || amount === null) return '0.00'
        // If amount is already a string, return it
        if (typeof amount === 'string') return amount
        // Otherwise format the number
        return Number(amount).toFixed(2)
    }
    return (
        <>
            <div
                className={`${isMobile ? 'h-[35vh] w-[170px]' : 'h-[60vh] w-[230px]'} relative perspective-[1000px]`}
                onClick={handleClickFlipCard}
            >
                <div
                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d rounded-2xl 
                    ${isFlipped ? 'rotate-y-180' : ''} 
                    ${isSelected ? 'border-2 border-[#2CE0B8]' : 'border-0'}`}
                >
                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-[#374151] rounded-2xl">
                        <img
                            src={logo}
                            alt="Cooky Cream Logo"
                            className={`${isMobile ? 'w-32' : 'w-40'}`}
                        />
                    </div>
                    {/* Back */}
                    <div className="absolute w-full font-inter h-full backface-hidden rotate-y-180 flex items-center justify-center bg-[#374151] rounded-2xl">
                        <div className={'flex flex-col h-full justify-between'}>
                            {/* Header */}
                            <div className={'flex justify-center'}>
                                <p
                                    className={`${isMobile ? '' : ''} lg:text-[24px] md:text-[28px] text-[18px] font-inter font-bold mt-10 mb-0`}
                                >
                                    {items.name}
                                </p>
                            </div>
                            {/* Body */}

                            <div className={'flex items-center justify-center'}>
                                {items.image && items.image !== '' ? (
                                    <img
                                        src={items.image}
                                        alt="item"
                                        className={`
                                                ${items.image === 'flip-pic/gold-coin.png' ? 'lg:w-32 lg:h-32 d:w-32 md:h-32 sm:w-24 sm:h-24 w-24 h-24' : 'lg:w-48 lg:h-48 md:w-32 md:h-32 sm:w-28 sm:h-28 w-36 h-36'}
                                            object-contain
                                            ${items.image === '/flip-pic/free.png' ? 'pb-10' : ''}
                                            ${items.image === 'flip-pic/free.png' ? 'pb-10' : ''}
                                            ${items.image === '/flip-pic/Out-of-Stock.png' ? 'pb-6' : ''}
                                            ${items.image === '/flip-pic/Fortune-Cooky .png' ? 'lg:w-28 lg:h-28 md:w-28 md:h-28 sm:w-24 sm:h-24 w-24 h-24' : ''}
                                             ${items.image === 'flip-pic/gold-coin.png' ? '' : ''}
                                    `}
                                    />
                                ) : (
                                    <div className="flex-1"></div>
                                )}
                            </div>
                            {/* Footer */}
                            <div className={'mb-10'}>
                                {items.type === 'winImg' ? (
                                    <>
                                        <p className={'text-center font-inter font-bold'}>
                                            You Win
                                        </p>
                                        <div className={'flex gap-x-3 items-center justify-center'}>
                                            <img
                                                src={IMAGES.diamond}
                                                alt="Question Block"
                                                className="w-5 h-5"
                                            />
                                            <p
                                                className={
                                                    'text-[20px] lg:text-[22px] md:text-[22px] font-inter font-bold'
                                                }
                                            >
                                                {formatWinAmount(items.winCount)}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {items.desc.split('\n').map((line, index) => (
                                            <p key={index} className={'text-center font-inter'}>
                                                {line}
                                            </p>
                                        ))}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
