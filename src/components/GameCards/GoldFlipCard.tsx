import React from 'react'
import { IMAGES } from '../../constance/imagesLink.ts'

export const GoldFlipCard = ({
                                 logo,
                                 items,
                                 isSelected,
                                 onSelect,
                                 isFlipped,
                                 isMobile,
                             }) => {
    const handleClickFlipCard = () => onSelect()

    const formatWinAmount = (amount: number | string | undefined | null) => {
        if (amount === undefined || amount === null) return '0'
        if (typeof amount === 'string') return amount
        return Number.isInteger(amount)
            ? (amount as number).toLocaleString()
            : parseFloat((amount as number).toFixed(2)).toLocaleString()
    }

    // sizing tokens (mobile)
// sizing tokens (mobile)
    const S = {
        tileBox: 'size-[clamp(2.75rem,10vw,4rem)] text-[clamp(1rem,4.2vw,1.75rem)]',
        tileBoxLg: 'size-[clamp(3.5rem,12vw,4.5rem)] text-[clamp(1.5rem,5vw,2rem)]',
        gridGap: 'gap-[clamp(0.25rem,1.6vw,0.5rem)]',
        key: 'h-[clamp(3.3rem,8.8vw,3.6rem)] w-[clamp(2.5rem,8vw,3.2rem)] text-[clamp(0.9rem,3.2vw,1.1rem)]',
        wideKey: 'w-[clamp(3.9rem,13vw,5rem)]',
        panelW: 'w-[min(92vw,360px)]',
        coinImg: 'w-5 h-5',

        // flip-only tokens
        flipCard: 'w-[clamp(7.5rem,38vw,10.5rem)] h-[clamp(11.5rem,32vh,13rem)]',

        flipLogo: 'w-[clamp(5rem,21vw,6.25rem)]',
        rowGap: 'gap-[clamp(0.5rem,2.8vw,0.75rem)]',
        barH: 'h-[clamp(2.75rem,11.5vw,3.75rem)]',
        bigBtn: 'rounded-[22px] text-[clamp(1.125rem,4.8vw,1.375rem)] py-[clamp(0.75rem,3.4vw,1rem)]',
        smallSquare: 'h-[clamp(2.75rem,11vw,3.2rem)] w-[clamp(2.75rem,11vw,3.2rem)] text-[clamp(1.25rem,6vw,1.6rem)]',
        prizeImg: 'w-[clamp(5.25rem,22vw,6.75rem)] h-[clamp(5.25rem,22vw,6.75rem)]', // fits within 13rem card
    }


    /* ======== MOBILE VIEW ======== */
    if (isMobile) {
        return (
            <div
                className={`${S.flipCard} relative perspective-[1000px]`}
                onClick={handleClickFlipCard}
            >
                <div
                    className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d rounded-2xl
          ${isFlipped ? 'rotate-y-180' : ''} ${isSelected ? 'border-2 border-[#2CE0B8]' : 'border-0'}`}
                >
                    {/* Front */}
                    <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-[#374151] rounded-2xl">
                        <img src={logo} alt="Cooky Cream Logo" className={S.flipLogo} />
                    </div>

                    {/* Back */}
                    <div className="absolute w-full h-full backface-hidden rotate-y-180 flex items-center justify-center bg-[#374151] rounded-2xl font-inter">
                        <div className="flex flex-col h-full w-full justify-between">
                            {/* Header */}
                            <div className="flex justify-center">
                                <p className="font-bold mt-[clamp(0.25rem,2.2vw,0.75rem)] mb-0 text-[clamp(0.90rem,4.2vw,0.98rem)]">
                                    {items.name}
                                </p>
                            </div>

                            {/* Body */}
                            <div className="flex items-center justify-center">
                                {items.image ? (
                                    <img
                                        src={items.image}
                                        alt="item"
                                        className={`object-contain
    ${
                                            items.image === 'flip-pic/gold-coin.png' ||
                                            items.image === '/flip-pic/Fortune-Cooky .png'
                                                ? 'w-[clamp(2rem,22vw,4rem)] h-[clamp(2rem,22vw,5rem)]'
                                                : 'w-[clamp(6.5rem,26vw,9.5rem)] h-[clamp(6.5rem,26vw,9.5rem)]'
                                        }
  `}
                                    />

                                ) : (
                                    <div className="flex-1"/>
                                )}
                            </div>

                            {/* Footer */}
                            <div className="mb-[clamp(0.75rem,3.2vw,1.25rem)]">
                                {items.type === 'winImg' ? (
                                    <>
                                        <p className="text-center font-bold text-[clamp(0.95rem,3.8vw,1.15rem)]">
                                            You Win
                                        </p>
                                        <div className="flex gap-x-2 items-center justify-center">
                                            <img
                                                src={IMAGES.coin}
                                                alt="coin"
                                                className="w-[clamp(1rem,4.2vw,1.25rem)] h-[clamp(1rem,4.2vw,1.25rem)]"
                                            />
                                            <p className="font-bold  text-[clamp(0.90rem,4.5vw,0.90rem)]">
                                                {formatWinAmount(items.winCount)}
                                            </p>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {items.desc?.split('\n').map((line: string, i: number) => (
                                            <p key={i} className="text-center text-xs text-[clamp(0.9rem,3.6vw,0.95rem)]">
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
        )
    }

    /* ======== DESKTOP VIEW (UNCHANGED) ======== */
    return (
        <div
            className="h-[60vh] w-[230px] relative perspective-[1000px]"
            onClick={handleClickFlipCard}
        >
            <div
                className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d rounded-2xl 
        ${isFlipped ? 'rotate-y-180' : ''} ${isSelected ? 'border-2 border-[#2CE0B8]' : 'border-0'}`}
            >
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden flex items-center justify-center bg-[#374151] rounded-2xl">
                    <img src={logo} alt="Cooky Cream Logo" className="w-40" />
                </div>

                {/* Back */}
                <div className="absolute w-full font-inter h-full backface-hidden rotate-y-180 flex items-center justify-center bg-[#374151] rounded-2xl">
                    <div className="flex flex-col h-full justify-between">
                        {/* Header */}
                        <div className="flex justify-center">
                            <p className="lg:text-[24px] md:text-[28px] text-[18px] font-inter font-bold mt-10 mb-0">
                                {items.name}
                            </p>
                        </div>

                        {/* Body */}
                        <div className="flex items-center justify-center">
                            {items.image && items.image !== '' ? (
                                <img
                                    src={items.image}
                                    alt="item"
                                    className={`
        ${
                                        items.image === 'flip-pic/gold-coin.png' ||
                                        items.image === '/flip-pic/Fortune-Cooky .png'
                                            ? 'lg:w-32 lg:h-32 md:w-32 md:h-32 sm:w-24 sm:h-24 w-24 h-24'
                                            : 'lg:w-48 lg:h-48 md:w-32 md:h-32 sm:w-28 sm:h-28 w-36 h-36'
                                    }
        object-contain
        ${items.image === 'flip-pic/free.png' ? 'pb-10' : ''}
        ${items.image === 'flip-pic/Out-of-Stock.png' ? 'pb-6' : ''}
      `}
                                />
                            ) : (
                                <div className="flex-1"></div>
                            )}
                        </div>


                        {/* Footer */}
                        <div className="mb-10">
                            {items.type === 'winImg' ? (
                                <>
                                    <p className="text-center font-inter font-bold">You Win</p>
                                    <div className="flex gap-x-3 items-center justify-center">
                                        <img src={IMAGES.coin} alt="coin" className="w-5 h-5"/>
                                        <p className="text-[20px] lg:text-[22px] md:text-[22px] font-inter font-bold">
                                            {formatWinAmount(items.winCount)}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <>
                                    {items.desc?.split('\n').map((line: string, i: number) => (
                                        <p key={i} className="text-center font-inter">
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
    )
}
