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

const allCards = [
    {
        id: 1,
        label:'Fortune Cooky',
        image: IMAGES.fortuneCooky,
        desc: '',
        type: 'imgTextCards',
        selected: false,
    },
    {
        id: 2,
        label:'Bad Cooky',
        image: IMAGES.badCooky,
        desc: 'Oops! \n' + 'You got a bad cooky',
        type: 'imgTextCards',
        selected: false,
    },
    {
        id: 3,
        label:'Free Flip',
        image: IMAGES.freeFlip,
        desc: '',
        type: 'free',
        selected: false,
    },
    {
        id: 4,
        label:'Out of Stock',
        image: IMAGES.fortuneCooky,
        desc: 'Today’s stock ran out',
        type: 'imgTextCards',
        selected: false,
    },
    {
        id: 5,
        label:'Cracked Cooky',
        image: IMAGES.badCooky,
        desc: 'Flipped too hard',
        type: 'imgTextCards',
        selected: false,
    },
    {
        id: 6,
        label:'Ants in the Jar',
        image: IMAGES.freeFlip,
        desc: 'The ants \n' + 'took your reward.',
        type: 'imgTextCards',
        selected: false,
    },
]

const allFlipCardData = [
    [
        {
            id: 1,
            images: IMAGES.fortuneCooky,
            type: 'imgCard',
            selected: true,
        },
        {
            id: 2,
            images: IMAGES.badCooky,
            type: 'gem',
            selected: false,
        },
        {
            id: 3,
            images: '',
            type: 'coin',
            selected: false,
        }
    ],
    [
        {
            id: 1,
            images: '',
            type: 'coin',
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
            type: 'gem',
            selected: false,
        }
    ],
    [
        {
            id: 1,
            images: '',
            type: 'coin',
            selected: true,
        },
        {
            id: 2,
            images: '',
            type: 'freeFlip',
            selected: false,
        },
        {
            id: 3,
            images: '',
            type: 'gem',
            selected: false,
        }
    ]
];

export function FlipPage() {
    const navigate = useNavigate()
    const { spinBalance, addSpins, addCoins, coinBalance, gemBalance, selectedBalanceType } = useGlobalContext()
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    let [spinVoucherId, setSpinVoucherId] = useState(2)
    const [spinVoucherCount, setSpinVoucherCount] = useState(0.40)
    // const [selectedCardId, setSelectedCardId] = useState(
    //     flipCardsData.find((card) => card.selected)?.id || 0
    // );
    const [flippedCards, setFlippedCards] = useState<{ [id: number]: boolean }>({});


    const [currentRowIndex, setCurrentRowIndex] = useState(0);
    const [flipCardsData, setFlipCardsData] = useState(allFlipCardData[0]); // Start with row 0
    // const [flippedCards, setFlippedCards] = useState<{ [id: number]: boolean }>({});
    const [selectedCardId, setSelectedCardId] = useState(
        allFlipCardData[0].find(card => card.selected)?.id || 0
    );
    const [hasFlipped, setHasFlipped] = useState(false); // To prevent multiple flips



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

    // const handleFlipAllCards = () => {
    //     const updatedFlips: { [key: number]: boolean } = {};
    //
    //     // Flip all cards immediately except the selected one
    //     flipCardsData.forEach(item => {
    //         if (item.id !== selectedCardId) {
    //             updatedFlips[item.id] = true;
    //         }
    //     });
    //     setFlippedCards(updatedFlips);
    //
    //     // Flip the selected card after 2 seconds
    //     setTimeout(() => {
    //         setFlippedCards(prev => ({
    //             ...prev,
    //             [selectedCardId]: true
    //         }));
    //     }, 2000);
    // };

    const handleFlipAllCards = async () => {
        if (hasFlipped || currentRowIndex >= allFlipCardData.length) return;

        const rowData = allFlipCardData[currentRowIndex];
        setFlipCardsData(rowData);
        setFlippedCards({});

        await new Promise(resolve => setTimeout(resolve, 100));

        const selected = rowData.find(card => card.selected)?.id || 0;
        setSelectedCardId(selected);

        // Flip others immediately
        const initialFlips: { [id: number]: boolean } = {};
        rowData.forEach(item => {
            if (item.id !== selected) {
                initialFlips[item.id] = true;
            }
        });
        setFlippedCards(initialFlips);

        // Flip selected after 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        setFlippedCards(prev => ({
            ...prev,
            [selected]: true
        }));

        setHasFlipped(true); // Mark this row as flipped
    };

    const handleNextRow = () => {
        const nextIndex = currentRowIndex + 1;
        if (nextIndex < allFlipCardData.length) {
            const nextRow = allFlipCardData[nextIndex];

            setCurrentRowIndex(nextIndex);
            setFlipCardsData(nextRow);
            setSelectedCardId(nextRow.find(card => card.selected)?.id || 0);
            setHasFlipped(false);
            setFlippedCards({});

            // Wait a tick, then call handleFlipAllCards to flip the new row
            setTimeout(() => {
                handleFlipAllCards();
            }, 100);
        } else {
            console.log("No more rows to flip.");
        }
    };





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
                        onClick={handleFlipAllCards}
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
                    <FlipCard
                        key={item.id}
                        logo={IMAGES.logo}
                        items={allCards.find(card => card.id === item.id)}
                        isSelected={selectedCardId === item.id}
                        onSelect={() => setSelectedCardId(item.id)}
                        isFlipped={flippedCards[item.id]}
                    />
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

                    {currentRowIndex === 0 && !hasFlipped ? (
                        <button
                            className="w-full py-4 rounded-[22px] bg-[#2D7FF0] hover:bg-blue-600 text-white font-bold text-2xl font-inter transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handleFlipAllCards}
                        >
                            Flip
                        </button>
                    ) : (
                        <button
                            className="w-full py-4 rounded-[22px] bg-[#2D7FF0] hover:bg-blue-600 text-white font-bold text-2xl font-inter transition-colors"
                            onClick={handleNextRow}
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}
