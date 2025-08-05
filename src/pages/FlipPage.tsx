import React, {useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {StatusBar} from '../components/StatusBar'
import {useGlobalContext} from '../context/GlobalContext'
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


interface FlipCardData {
    id: number;
    name: string;
    image: string;
    desc: string;
    type: string;
    selected?: boolean;
}

const allFlipCardData: FlipCardData[][] = [
    [
        {
            id: 1,
            name:'Fortune Cooky',
            image: IMAGES.fortuneCooky,
            desc: '',
            type: 'winImg',
            selected: false,
        },
        {
            id: 2,
            name:'Fortune Cooky',
            image: IMAGES.fortuneCooky,
            desc: '',
            type: 'winImg',
            selected: false,
        },
        {
            id: 3,
            name:'Fortune Cooky',
            image: IMAGES.fortuneCooky,
            desc: '',
            type: 'winImg',
            selected: false,
        },
    ],
    [
        {
            id: 1,
            name:'Bad Cooky',
            image: IMAGES.badCooky,
            desc: 'Oops! \n' + 'You got a bad cooky',
            type: 'imgText',
            selected: false,
        },
        {
            id: 2,
            name:'Bad Cooky',
            image: IMAGES.badCooky,
            desc: 'Oops! \n' + 'You got a bad cooky',
            type: 'imgText',
            selected: false,
        },
        {
            id: 3,
            name:'Bad Cooky',
            image: IMAGES.badCooky,
            desc: 'Oops! \n' + 'You got a bad cooky',
            type: 'imgText',
            selected: false,
        },
    ],
    [
        {
            id: 1,
            name:'Free Flip',
            image: IMAGES.freeFlip,
            desc: '',
            type: 'free',
            selected: false,
        },
        {
            id: 2,
            name:'Free Flip',
            image: IMAGES.freeFlip,
            desc: '',
            type: 'free',
            selected: false,
        },
        {
            id: 3,
            name:'Free Flip',
            image: IMAGES.freeFlip,
            desc: '',
            type: 'free',
            selected: false,
        },
    ],
    [
        {
            id: 1,
            name:'Out of Stock',
            image: IMAGES.outOfStock,
            desc: 'Today’s stock ran out',
            type: 'imgText',
            selected: false,
        },
        {
            id: 2,
            name:'Out of Stock',
            image: IMAGES.outOfStock,
            desc: 'Today’s stock ran out',
            type: 'imgText',
            selected: false,
        },
        {
            id: 3,
            name:'Out of Stock',
            image: IMAGES.outOfStock,
            desc: 'Today’s stock ran out',
            type: 'imgText',
            selected: false,
        },
    ],
    [
        {
            id: 1,
            name:'Cracked Cooky',
            image: IMAGES.crackedCooky,
            desc: 'Flipped too hard',
            type: 'imgText',
            selected: false,
        },
        {
            id: 2,
            name:'Cracked Cooky',
            image: IMAGES.crackedCooky,
            desc: 'Flipped too hard',
            type: 'imgText',
            selected: false,
        },
        {
            id: 3,
            name:'Cracked Cooky',
            image: IMAGES.crackedCooky,
            desc: 'Flipped too hard',
            type: 'imgText',
            selected: false,
        },
    ],
    [
        {
            id: 1,
            name:'Ants in the Jar',
            image: IMAGES.antsInTheJar,
            desc: 'The ants \n' + 'took your reward.',
            type: 'imgTwoText',
            selected: false,
        },
        {
            id: 2,
            name:'Ants in the Jar',
            image: IMAGES.antsInTheJar,
            desc: 'The ants \n' + 'took your reward.',
            type: 'imgTwoText',
            selected: false,
        },
        {
            id: 3,
            name:'Ants in the Jar',
            image: IMAGES.antsInTheJar,
            desc: 'The ants \n' + 'took your reward.',
            type: 'imgTwoText',
            selected: false,
        },
    ]
];

export function FlipPage() {
    const navigate = useNavigate()
    const { selectedBalanceType, setVoucherBalance, voucherBalance } = useGlobalContext()
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    let [spinVoucherId, setSpinVoucherId] = useState(2)
    const [spinVoucherCount, setSpinVoucherCount] = useState(0.40)
    const [flippedCards, setFlippedCards] = useState<{ [id: number]: boolean }>({});
    const [isFlippingSelectedCard, setIsFlippingSelectedCard] = useState(false);
    const [currentRowIndex, setCurrentRowIndex] = useState(0);
    const [hasFlipped, setHasFlipped] = useState(false); // To prevent multiple flips
    const [selectedFlipCards, setSelectedFlipCards] = useState(() => {
        // on page load, pick random
        const randomIndex = Math.floor(Math.random() * allFlipCardData.length);
        return allFlipCardData[randomIndex];
    });
    const [selectedCardId, setSelectedCardId] = useState(
        selectedFlipCards.find(card => card.selected)?.id || 0
    );
    const [slideInCards, setSlideInCards] = useState(false);

    useEffect(() => {
        // Default 1st Card Selected
        pickRandomSetWithFirstSelected();
    }, []);

    const pickRandomSetWithFirstSelected = () => {
        const randomIndex = Math.floor(Math.random() * allFlipCardData.length);
        const selectedSet = allFlipCardData[randomIndex].map((card, index) => ({
            ...card,
            selected: index === 0
        }));
        setSelectedFlipCards(selectedSet);
        setSelectedCardId(selectedSet[0].id);
    };

    function getRandomCardFromOtherSets(excludeSet: typeof selectedFlipCards): any {
        // Flatten all sets except the current one
        const otherCards = allFlipCardData
            .filter(set => set !== excludeSet)
            .flat();

        // Get a random card from other sets
        const randomIndex = Math.floor(Math.random() * otherCards.length);
        return otherCards[randomIndex];
    }

    // get random card of array
    // const getNewRandomSet = () => {
    //     let newIndex: number;
    //     let currentSet = selectedFlipCards;
    //
    //     // find new random that’s not same as current
    //     do {
    //         newIndex = Math.floor(Math.random() * allFlipCardData.length);
    //     } while (allFlipCardData[newIndex] === currentSet);
    //
    //     setSelectedFlipCards(allFlipCardData[newIndex]);
    // };

    // mobile screen
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

    // Cards Flip Logic
    const handleFlipAllCards = async () => {
        const vouchers = parseFloat(voucherBalance.toFixed(2));

        if (hasFlipped || currentRowIndex >= allFlipCardData.length) return;
        if (vouchers < spinVoucherCount) {
            return alert("Please recharge your voucher balance!" + voucherBalance + "  " + spinVoucherCount);
        }

        if (!selectedCardId) {
            return alert('Please select a card before flipping.');
        }

        // Replace only unselected cards with random cards from other sets
        const updatedCards = selectedFlipCards.map(card => {
            if (card.id === selectedCardId) {
                return card;
            } else {
                const newCard = getRandomCardFromOtherSets(selectedFlipCards);
                return {
                    ...newCard,
                    id: card.id, // Keep original card position
                    selected: false
                };
            }
        });

        setSelectedFlipCards(updatedCards);

        // Flip unselected cards immediately
        const immediateFlips: { [id: number]: boolean } = {};
        updatedCards.forEach(card => {
            if (card.id !== selectedCardId) {
                immediateFlips[card.id] = true;
            }
        });

        setFlippedCards(immediateFlips);
        setIsFlippingSelectedCard(true);

        // Flip selected card after delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        setFlippedCards(prev => ({
            ...prev,
            [selectedCardId]: true
        }));

        setHasFlipped(true);
        setIsFlippingSelectedCard(false);

        // Update Global Voucher Count
        setVoucherBalance(vouchers - spinVoucherCount);
    };

    // Handle coming next cards
    const handleNextRow = async () => {
        // Flip all cards back to front
        const flippedBack = selectedFlipCards.reduce((acc, card) => {
            acc[card.id] = false; // false = front side
            return acc;
        }, {} as { [id: number]: boolean });

        setFlippedCards(flippedBack);

        // Wait for flip animation to complete (~500ms)
        await new Promise(resolve => setTimeout(resolve, 500));

        // Start slide-in animation
        setSlideInCards(true);

        // Load new card set
        const newIndex = Math.floor(Math.random() * allFlipCardData.length);
        const newSet = allFlipCardData[newIndex].map((card, index) => ({
            ...card,
            selected: index === 0
        }));

        setSelectedFlipCards(newSet);
        setSelectedCardId(newSet[0].id);
        setHasFlipped(false);

        // Reset flipped state (all front side)
        const resetFlips = newSet.reduce((acc, card) => {
            acc[card.id] = false;
            return acc;
        }, {} as { [id: number]: boolean });

        setFlippedCards(resetFlips);

        // End animation
        setTimeout(() => {
            setSlideInCards(false);
        }, 400);
    };


    // Selected card handle
    const onSelect = (id: number) => {
        // Block selection during delay and after flip
        if (hasFlipped || isFlippingSelectedCard) return;

        setSelectedCardId(id);
        setSelectedFlipCards(prev =>
            prev.map(card => ({
                ...card,
                selected: card.id === id
            }))
        );
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
                {selectedFlipCards.map((item) => (
                    <div
                        key={item.id}
                        className={`transition-all duration-500 transform
                                    ${slideInCards ? 'opacity-0 animate-slide-in-left-to-right' : ''}`}
                    >
                        <FlipCard
                            logo={IMAGES.logo}
                            items={item}
                            isSelected={selectedCardId === item.id}
                            onSelect={() => onSelect(item.id)}
                            isFlipped={flippedCards[item.id]}
                        />
                    </div>
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
