import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatusBar } from '../components/StatusBar'
import { useGlobalContext } from '../context/GlobalContext'
import { IMAGES } from '../constance/imagesLink.ts'
import { GoldFlipCard } from '../components/GameCards/GoldFlipCard'
import { apiRequest } from '../services/api'
import { toast, ToastContainer } from 'react-toastify'
// Updated interface for flip options from API
interface FlipOption {
    id: string
    costPerFlip: number
}
// --- GRAND WIN frequency control ---
const GRAND_WIN_SET_INDEX = 0;   // your GRAND WIN set is at index 0
const GRAND_WIN_RATE = 100;      // 1 in 100 chance
const allowGrandWin = () => Math.floor(Math.random() * GRAND_WIN_RATE) === 0;

// New interface for flip card data from API
interface ApiFlipCardData {
    id: string
    name: string
    imageLink: string
    desc: string
    type: string
    flipCardType: string
    selected: boolean
    winCount?: number
    createdAt: string
}
// API response interface
interface FlipGameResponse {
    flipCardType: string
    winAmount: number
    remainingGoldCoins: number
    remainingGoldCoinFlips: number
    flipGoldCardData: ApiFlipCardData
}
interface FlipCardData {
    id: number
    name: string
    image: string
    desc: string
    type: string
    selected?: boolean
    winCount?: number
}
const allFlipCardData: FlipCardData[][] = [
    [
        {
            id: 1,
            name: 'GRAND WIN',
            image: IMAGES.grandWinLogo,
            desc: '',
            winCount: 1000000,
            type: 'winImg',
            selected: false,
        },
        {
            id: 2,
            name: 'GRAND WIN',
            image: IMAGES.grandWinLogo,
            desc: '',
            winCount: 1000000,
            type: 'winImg',
            selected: false,
        },
        {
            id: 3,
            name: 'GRAND WIN',
            image: IMAGES.grandWinLogo,
            desc: '',
            winCount: 1000000,
            type: 'winImg',
            selected: false,
        },
    ],
    [
        {
            id: 1,
            name: 'Fortune Cooky',
            image: IMAGES.fortuneCooky,
            desc: '',
            winCount: Math.floor(Math.random() * (500000 - 100000 + 1)) + 100000,
            type: 'winImg',
            selected: false,
        },
        {
            id: 2,
            name: 'Fortune Cooky',
            image: IMAGES.fortuneCooky,
            desc: '',
            winCount: Math.floor(Math.random() * (500000 - 100000 + 1)) + 100000,
            type: 'winImg',
            selected: false,
        },
        {
            id: 3,
            name: 'Fortune Cooky',
            image: IMAGES.fortuneCooky,
            desc: '',
            winCount: Math.floor(Math.random() * (500000 - 100000 + 1)) + 100000,
            type: 'winImg',
            selected: false,
        },
    ],
    [
        {
            id: 1,
            name: 'Bad Cooky',
            image: IMAGES.badCooky,
            desc: 'Oops! \n' + 'You got a bad cooky',
            type: 'imgText',
            selected: false,
        },
        {
            id: 2,
            name: 'Bad Cooky',
            image: IMAGES.badCooky,
            desc: 'Oops! \n' + 'You got a bad cooky',
            type: 'imgText',
            selected: false,
        },
        {
            id: 3,
            name: 'Bad Cooky',
            image: IMAGES.badCooky,
            desc: 'Oops! \n' + 'You got a bad cooky',
            type: 'imgText',
            selected: false,
        },
    ],
    [
        {
            id: 1,
            name: 'Free Flip',
            image: IMAGES.freeFlip,
            desc: '',
            type: 'free',
            selected: false,
        },
        {
            id: 2,
            name: 'Free Flip',
            image: IMAGES.freeFlip,
            desc: '',
            type: 'free',
            selected: false,
        },
        {
            id: 3,
            name: 'Free Flip',
            image: IMAGES.freeFlip,
            desc: '',
            type: 'free',
            selected: false,
        },
    ],
    [
        {
            id: 1,
            name: 'Out of Stock',
            image: IMAGES.outOfStock,
            desc: "Today's stock ran out",
            selected: false,
            type: '',
        },
        {
            id: 2,
            name: 'Out of Stock',
            image: IMAGES.outOfStock,
            desc: "Today's stock ran out",
            selected: false,
            type: '',
        },
        {
            id: 3,
            name: 'Out of Stock',
            image: IMAGES.outOfStock,
            desc: "Today's stock ran out",
            selected: false,
            type: '',
        },
    ],
    [
        {
            id: 1,
            name: 'Cracked Cooky',
            image: IMAGES.crackedCooky,
            desc: 'Flipped too hard',
            type: 'imgText',
            selected: false,
        },
        {
            id: 2,
            name: 'Cracked Cooky',
            image: IMAGES.crackedCooky,
            desc: 'Flipped too hard',
            type: 'imgText',
            selected: false,
        },
        {
            id: 3,
            name: 'Cracked Cooky',
            image: IMAGES.crackedCooky,
            desc: 'Flipped too hard',
            type: 'imgText',
            selected: false,
        },
    ],
    [
        {
            id: 1,
            name: 'Ants in the Jar',
            image: IMAGES.antsInTheJar,
            desc: 'The ants \n' + 'took your reward.',
            type: 'imgTwoText',
            selected: false,
        },
        {
            id: 2,
            name: 'Ants in the Jar',
            image: IMAGES.antsInTheJar,
            desc: 'The ants \n' + 'took your reward.',
            type: 'imgTwoText',
            selected: false,
        },
        {
            id: 3,
            name: 'Ants in the Jar',
            image: IMAGES.antsInTheJar,
            desc: 'The ants \n' + 'took your reward.',
            type: 'imgTwoText',
            selected: false,
        },
    ],
]
export function GoldFlipPage() {
    const navigate = useNavigate()
    const {
        selectedBalanceType,
        setVoucherBalance,
        voucherBalance,
        isAuthenticated,
        setCoinBalance,
        setGoldCoinFlipCount,
        goldCoinFlipCount,
    } = useGlobalContext()
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    // Replace hardcoded spinVoucherCountData with API data
    const [flipOptions, setFlipOptions] = useState<FlipOption[]>([])
    const [isLoadingOptions, setIsLoadingOptions] = useState(true)
    const [optionsError, setOptionsError] = useState<string | null>(null)
    // State for selected option
    const [selectedFlipOptionIndex, setSelectedFlipOptionIndex] = useState(1) // Default to second option (0.40)
    const [spinVoucherCount, setSpinVoucherCount] = useState(0.4)
    const [spinVoucherId, setSpinVoucherId] = useState('')
    // State for API response
    const [apiResponse, setApiResponse] = useState<FlipGameResponse | null>(null)
    const [isFlipping, setIsFlipping] = useState(false)
    const [apiError, setApiError] = useState<string | null>(null)
    const [flippedCards, setFlippedCards] = useState<{
        [id: number]: boolean
    }>({})
    const [isFlippingSelectedCard, setIsFlippingSelectedCard] = useState(false)
    const [currentRowIndex, setCurrentRowIndex] = useState(0)
    const [hasFlipped, setHasFlipped] = useState(false) // To prevent multiple flips
    const [selectedFlipCards, setSelectedFlipCards] = useState(() => {
        // on page load, pick random
        const randomIndex = Math.floor(Math.random() * allFlipCardData.length)
        return allFlipCardData[randomIndex]
    })
    const [selectedCardId, setSelectedCardId] = useState(
        selectedFlipCards.find((card) => card.selected)?.id || 0,
    )
    const [slideInCards, setSlideInCards] = useState(false)
    const [isFreeCard, setIsFreeCard] = useState(false)
    useEffect(() => {
        // Default 1st Card Selected
        pickRandomSetWithFirstSelected()
    }, [])
    // mobile screen
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    const pickRandomSetWithFirstSelected = () => {
        // try choosing any set; only allow GRAND WIN if the gate passes
        let randomIndex = Math.floor(Math.random() * allFlipCardData.length);

        if (randomIndex === GRAND_WIN_SET_INDEX && !allowGrandWin()) {
            // re-pick from non-GRAND-WIN sets (1..end)
            randomIndex = 1 + Math.floor(Math.random() * (allFlipCardData.length - 1));
        }

        const selectedSet = allFlipCardData[randomIndex].map((card, index) => ({
            ...card,
            selected: index === 1, // keep your "middle card selected" rule
        }));

        setSelectedFlipCards(selectedSet);
        setSelectedCardId(selectedSet[1].id);
    };

    function getRandomCardFromOtherSets(
        excludeSet: typeof selectedFlipCards,
    ): FlipCardData {
        const canShowGrandWin = allowGrandWin();

        // Build candidate pool while remembering set index to filter GRAND WIN
        const otherCards: FlipCardData[] = [];
        allFlipCardData.forEach((set, setIdx) => {
            if (set !== excludeSet) {
                // if this is the GRAND WIN set and gate is closed, skip
                if (setIdx === GRAND_WIN_SET_INDEX && !canShowGrandWin) return;
                otherCards.push(...set);
            }
        });

        // Safety: if we somehow filtered all out, fall back to any non-GRAND set
        let pool = otherCards;
        if (pool.length === 0) {
            pool = allFlipCardData
                .filter((_, idx) => idx !== GRAND_WIN_SET_INDEX)
                .flat();
        }

        const randomIndex = Math.floor(Math.random() * pool.length);
        return pool[randomIndex];
    }

    // Fetch flip options from API
    useEffect(() => {
        const fetchFlipOptions = async () => {
            try {
                setIsLoadingOptions(true)
                const response = await apiRequest('/flip-options', 'GET')
                if (Array.isArray(response)) {
                    setFlipOptions(response)
                    // Set default selected option (0.40 or the second option if available)
                    if (response.length > 1) {
                        setSelectedFlipOptionIndex(1)
                        setSpinVoucherCount(response[1].costPerFlip)
                        setSpinVoucherId(response[1].id)
                    } else if (response.length > 0) {
                        setSelectedFlipOptionIndex(0)
                        setSpinVoucherCount(response[0].costPerFlip)
                        setSpinVoucherId(response[0].id)
                    }
                } else {
                    setOptionsError('Invalid response format')
                }
                setIsLoadingOptions(false)
            } catch (error) {
                console.error('Error fetching flip options:', error)
                setOptionsError('Failed to load flip options')
                setIsLoadingOptions(false)
                // Fallback to default values if API fails
                setSpinVoucherCount(0.4)
            }
        }
        fetchFlipOptions()
    }, [])
    const handleSpinPlusMark = () => {
        if (selectedFlipOptionIndex < flipOptions.length - 1) {
            const newIndex = selectedFlipOptionIndex + 1
            setSelectedFlipOptionIndex(newIndex)
            setSpinVoucherCount(flipOptions[newIndex].costPerFlip)
            setSpinVoucherId(flipOptions[newIndex].id)
        }
    }
    const handleSpinMinusMark = () => {
        if (selectedFlipOptionIndex > 0) {
            const newIndex = selectedFlipOptionIndex - 1
            setSelectedFlipOptionIndex(newIndex)
            setSpinVoucherCount(flipOptions[newIndex].costPerFlip)
            setSpinVoucherId(flipOptions[newIndex].id)
        }
    }
    // Cards Flip Logic
    const handleFlipAllCards = async () => {
        if (hasFlipped || currentRowIndex >= allFlipCardData.length) return
        // For gold coin flips, check if user has available flips
        if (selectedBalanceType === 'coin' && goldCoinFlipCount <= 0) {
            toast.info('You have no gold coin flips remaining!')
        }
        // For voucher flips, check voucher balance
        if (selectedBalanceType === 'ticket') {
            const vouchers = parseFloat(voucherBalance.toFixed(2))
            if (vouchers < spinVoucherCount) {
                return alert('Please recharge your voucher balance!')
            }
        }
        if (!selectedCardId) {
            return alert('Please select a card before flipping.')
        }
        setIsFlipping(true)
        setApiError(null)
        try {
            if (isAuthenticated) {
                // Get user ID from localStorage
                const userId = localStorage.getItem('userId')
                if (!userId) {
                    throw new Error('User ID not found. Please log in again.')
                }
                // Make API call to gold coin flip game
                const requestData = {
                    userId: userId,
                }
                const response = await apiRequest(
                    '/game/gold-coin-flip/play',
                    'POST',
                    requestData,
                )
                setApiResponse(response)
                // Update gold coin balance and flip count from API response
                if (response.remainingGoldCoins !== undefined) {
                    setCoinBalance(response.remainingGoldCoins)
                }
                if (response.remainingGoldCoinFlips !== undefined) {
                    setGoldCoinFlipCount(response.remainingGoldCoinFlips)
                }
                // Create a new card based on API response
                const apiCard = response.flipGoldCardData
                // Replace only selected card with API response card
                const updatedCards = selectedFlipCards.map((card) => {
                    if (card.id === selectedCardId) {
                        return {
                            ...card,
                            name: apiCard.name,
                            image: apiCard.imageLink,
                            desc: apiCard.desc,
                            type: apiCard.type || 'imgText',
                            winCount: response.winAmount,
                        }
                    } else {
                        const newCard = getRandomCardFromOtherSets(selectedFlipCards)
                        return {
                            ...newCard,
                            id: card.id,
                            selected: false,
                        }
                    }
                })
                setSelectedFlipCards(updatedCards)
                // Check if free card based on response
                setIsFreeCard(response.flipCardType === 'FREE')
            } else {
                // Fallback for non-authenticated users (use existing random logic)
                // Replace only unselected cards with random cards from other sets
                const updatedCards = selectedFlipCards.map((card) => {
                    if (card.id === selectedCardId) {
                        return card
                    } else {
                        const newCard = getRandomCardFromOtherSets(selectedFlipCards)
                        return {
                            ...newCard,
                            id: card.id,
                            selected: false,
                        }
                    }
                })
                setSelectedFlipCards(updatedCards)
                // Update voucher balance for non-authenticated users if using ticket balance
                if (selectedBalanceType === 'ticket') {
                    const vouchers = parseFloat(voucherBalance.toFixed(2))
                    setVoucherBalance(vouchers - spinVoucherCount)
                }
            }
            // Flip unselected cards immediately
            const immediateFlips: {
                [id: number]: boolean
            } = {}
            selectedFlipCards.forEach((card) => {
                if (card.id !== selectedCardId) {
                    immediateFlips[card.id] = true
                }
            })
            setFlippedCards(immediateFlips)
            setIsFlippingSelectedCard(true)
            // Flip selected card after delay
            await new Promise((resolve) => setTimeout(resolve, 2000))
            setFlippedCards((prev) => ({
                ...prev,
                [selectedCardId]: true,
            }))
            setHasFlipped(true)
            setIsFlippingSelectedCard(false)
        } catch (error) {
            console.error('Error flipping cards:', error)
            setApiError(
                error instanceof Error
                    ? error.message
                    : 'An error occurred while flipping cards',
            )
            // Fallback to existing behavior on error
            const updatedCards = selectedFlipCards.map((card) => {
                if (card.id === selectedCardId) {
                    return card
                } else {
                    const newCard = getRandomCardFromOtherSets(selectedFlipCards)
                    return {
                        ...newCard,
                        id: card.id,
                        selected: false,
                    }
                }
            })
            setSelectedFlipCards(updatedCards)
            // If using ticket balance, update voucher balance
            if (selectedBalanceType === 'ticket') {
                const vouchers = parseFloat(voucherBalance.toFixed(2))
                setVoucherBalance(vouchers - spinVoucherCount)
            }
        } finally {
            setIsFlipping(false)
        }
    }
    // Handle coming next cards
    const handleNextRow = async () => {
        // no reset here; let the server decide on the next play
        const flippedBack = selectedFlipCards.reduce((acc, card) => {
            acc[card.id] = false
            return acc
        }, {} as { [id: number]: boolean })
        setFlippedCards(flippedBack)
        // Wait for flip animation to complete (~500ms)
        await new Promise((resolve) => setTimeout(resolve, 500))
        // Start slide-in animation
        setSlideInCards(true)
        // Load new card set
        let newIndex = Math.floor(Math.random() * allFlipCardData.length);
        if (newIndex === GRAND_WIN_SET_INDEX && !allowGrandWin()) {
            newIndex = 1 + Math.floor(Math.random() * (allFlipCardData.length - 1));
        }
        const newSet = allFlipCardData[newIndex].map((card, index) => ({
            ...card,
            selected: index === 1, // Select the middle card (index 1) instead of first card
        }))
        setSelectedFlipCards(newSet)
        setSelectedCardId(newSet[1].id) // Set the middle card ID as selected
        setHasFlipped(false)
        // Reset flipped state (all front side)
        const resetFlips = newSet.reduce(
            (acc, card) => {
                acc[card.id] = false
                return acc
            },
            {} as {
                [id: number]: boolean
            },
        )
        setFlippedCards(resetFlips)
        // End animation
        setTimeout(() => {
            setSlideInCards(false)
        }, 400)
    }
    // Selected card handle
    const onSelect = (id: number) => {
        // Block selection during delay and after flip
        if (hasFlipped || isFlippingSelectedCard) return
        setSelectedCardId(id)
        setSelectedFlipCards((prev) =>
            prev.map((card) => ({
                ...card,
                selected: card.id === id,
            })),
        )
    }

    // you can keep your existing S object and add these
    const S = {
        tileBox:
            'size-[clamp(2.75rem,10vw,4rem)] text-[clamp(1.25rem,4.2vw,1.75rem)]',
        tileBoxLg:
            'size-[clamp(3.5rem,12vw,4.5rem)] text-[clamp(1.5rem,5vw,2rem)]',
        gridGap: 'gap-[clamp(0.25rem,1.6vw,0.5rem)]',
        key:
            'h-[clamp(3.3rem,8.8vw,3.6rem)] w-[clamp(2.5rem,8vw,3.2rem)] text-[clamp(0.9rem,3.2vw,1.1rem)]',
        wideKey: 'w-[clamp(3.9rem,13vw,5rem)]',
        panelW: 'w-[min(92vw,360px)]',
        coinImg: 'w-5 h-5',

        // flip-only tokens
        flipCard: 'w-[clamp(9.5rem,38vw,10.5rem)] h-[clamp(12.5rem,34vh,13.75rem)]',
        flipLogo: 'w-[clamp(5.5rem,22vw,6.5rem)]',
        rowGap: 'gap-[clamp(0.5rem,2.8vw,0.75rem)]',
        barH: 'h-[clamp(2.75rem,11.5vw,3.75rem)]',
        bigBtn:
            ' text-[clamp(1.125rem,4.8vw,1.375rem)] py-[clamp(0.75rem,3.4vw,1rem)]',
        smallSquare:
            'h-[clamp(2.75rem,11vw,3.2rem)] w-[clamp(2.75rem,11vw,3.2rem)] text-[clamp(1.25rem,6vw,1.6rem)]',
    }

    // Mobile view based on the provided image
    if (isMobile) {
        return (
            <div className="fixed inset-0 flex flex-col bg-[#1A202C] text-white overflow-hidden">
                <ToastContainer position="top-right" autoClose={3000} />

                {/* Back */}
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
                <div className="pt-[env(safe-area-inset-top)]">
                    <StatusBar isMobile={isMobile} hideOnlineCount />
                </div>

                {/* Cards area */}
                <div className={`flex-1 flex flex-col items-center ${S.rowGap} mt-3 mb-2 px-3`}>
                    {/* Row 1: single card */}
                    <div className="flex justify-center">
                        {selectedFlipCards.slice(0, 1).map((item) => (
                            <div
                                key={item.id}
                                className={`transition-all duration-500 transform ${
                                    slideInCards ? 'opacity-0 animate-slide-in-left-to-right' : ''
                                }`}
                            >
                                <GoldFlipCard
                                    logo={IMAGES.logo}
                                    items={item}
                                    isSelected={selectedCardId === item.id}
                                    onSelect={() => onSelect(item.id)}
                                    isFlipped={flippedCards[item.id]}
                                    isMobile
                                />
                            </div>
                        ))}
                    </div>

                    {/* Row 2: two cards */}
                    <div className={`flex justify-center ${S.rowGap}`}>
                        {selectedFlipCards.slice(1).map((item) => (
                            <div
                                key={item.id}
                                className={`transition-all duration-500 transform ${
                                    slideInCards ? 'opacity-0 animate-slide-in-left-to-right' : ''
                                }`}
                            >
                                <GoldFlipCard
                                    logo={IMAGES.logo}
                                    items={item}
                                    isSelected={selectedCardId === item.id}
                                    onSelect={() => onSelect(item.id)}
                                    isFlipped={flippedCards[item.id]}
                                    isMobile
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom controls (fixed) */}
                <div className="flex-none pb-[max(0.5rem,env(safe-area-inset-bottom))] px-4">
                    {/* Counter / price bar */}
                    {selectedBalanceType === 'coin' ? (
                        <div
                            className={`flex items-center justify-center w-full ${S.barH} rounded-xl bg-[#374151] mb-2`}
                        >
                            {isFreeCard ? (
                                <span className="font-bold text-[clamp(1rem,4.2vw,1.25rem)]">Free</span>
                            ) : (
                                <span className="font-bold text-[clamp(1rem,4.2vw,1.25rem)]">
                                  {goldCoinFlipCount} X Flip
                                </span>
                            )}
                        </div>
                    ) : (
                        <div className={`flex items-center justify-between w-full ${S.barH} rounded-2xl bg-[#374151] mb-2 px-2`}>
                            <button
                                className={`${S.smallSquare} bg-[#67768F] rounded-xl font-extrabold leading-none`}
                                onClick={handleSpinMinusMark}
                                disabled={isLoadingOptions || selectedFlipOptionIndex === 0}
                            >
                                –
                            </button>
                            <div className="flex items-center gap-2">
                                <img src={IMAGES.voucher} alt="voucher" className="h-full max-h-[90%] w-auto object-contain" />
                                {isFreeCard ? (
                                    <p className="font-bold text-[clamp(1rem,4.2vw,1.25rem)]">Free</p>
                                ) : isLoadingOptions ? (
                                    <p className="font-bold text-[clamp(1rem,4.2vw,1.25rem)] w-[60px] text-center">...</p>
                                ) : (
                                    <p className="font-bold text-[clamp(1rem,4.2vw,1.25rem)] w-[60px] text-center">
                                        {Number.isInteger(spinVoucherCount) ? spinVoucherCount : spinVoucherCount.toFixed(2)}
                                    </p>
                                )}
                            </div>
                            <button
                                className={`${S.smallSquare} bg-[#67768F]  rounded-xl font-extrabold leading-none`}
                                onClick={handleSpinPlusMark}
                                disabled={isLoadingOptions || selectedFlipOptionIndex === flipOptions.length - 1}
                            >
                                +
                            </button>
                        </div>
                    )}

                    {/* Flip / Next */}
                    {currentRowIndex === 0 && !hasFlipped ? (
                        <button
                            className={`w-full bg-[#2D7FF0] rounded-xl  hover:bg-blue-600 text-white font-bold ${S.bigBtn}`}
                            onClick={handleFlipAllCards}
                            disabled={isFlipping || (selectedBalanceType === 'coin' && goldCoinFlipCount <= 0)}
                        >
                            {isFlipping ? 'Flipping...' : 'Flip'}
                        </button>
                    ) : (
                        <button
                            className={`w-full bg-[#2D7FF0] rounded-xl  hover:bg-blue-600 text-white font-bold ${S.bigBtn}`}
                            onClick={handleNextRow}
                        >
                            Next
                        </button>
                    )}

                    {apiError && <div className="mt-2 text-red-500 text-center">{apiError}</div>}
                </div>
            </div>
        )
    }

    // Desktop view
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white">
            <ToastContainer position="top-right" autoClose={3000} />
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
                {/* Gold indicator */}
                {/*    <div className="absolute top-4 right-4 z-10 flex items-center bg-[#FFD700]/20 px-3 py-1 rounded-full">
                 <img
                 src="https://uploadthingy.s3.us-west-1.amazonaws.com/2XiBYwBWgNJxytH6Z2jPWP/point.png"
                 alt="Gold"
                 className="w-5 h-5 mr-1"
                 />
                 <span className="text-[#FFD700] font-medium">Gold Game</span>
                 </div>*/}
                {/* Status Bar */}
                <div className="">
                    <StatusBar isMobile={isMobile} hideOnlineCount={true} />
                </div>
            </div>
            {/* Flip Cards */}
            <div className={'flex justify-center items-center gap-x-3'}>
                {selectedFlipCards.map((item) => (
                    <div
                        key={item.id}
                        className={`transition-all duration-500 transform
                                    ${slideInCards ? 'opacity-0 animate-slide-in-left-to-right' : ''}`}
                    >
                        <GoldFlipCard
                            logo={IMAGES.logo}
                            items={item}
                            isSelected={selectedCardId === item.id}
                            onSelect={() => onSelect(item.id)}
                            isFlipped={flippedCards[item.id]}
                            isMobile={false}
                        />
                    </div>
                ))}
            </div>
            {/* Flip buttons */}
            <div className="flex justify-center items-center mb-0 px-4 py-[4vh]">
                <div className="flex items-center md:flex-row gap-4 mt-4 w-full max-w-3xl">
                    {/* Display remaining gold coin flips or Free */}
                    {selectedBalanceType === 'coin' && (
                        <div className="flex items-center justify-center w-full py-3 px-4 rounded-2xl bg-[#374151] text-white h-[60px]">
                            <div className="flex items-center">
                                {isFreeCard ? (
                                    <span className="text-white font-bold text-xl">Free</span>
                                ) : (
                                    <span className="text-yellow-50 font-bold text-xl">
                    {goldCoinFlipCount} x Flip
                  </span>
                                )}
                            </div>
                        </div>
                    )}
                    {selectedBalanceType === 'ticket' && (
                        <>
                            {isFreeCard ? (
                                <>
                                    <button
                                        className="w-full py-4 rounded-2xl bg-[#374151] text-white font-bold text-2xl font-inter transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                        disabled={isFreeCard}
                                    >
                                        Free
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="flex font-inter items-center justify-between w-full py-3 px-1 rounded-2xl bg-[#374151] text-white h-[60px]">
                                        <button
                                            className="font-extrabold px-4 text-[30px] leading-none h-[50px] w-[50px] flex items-center justify-center rounded-2xl bg-[#67768F]"
                                            onClick={handleSpinMinusMark}
                                            disabled={
                                                isLoadingOptions || selectedFlipOptionIndex === 0
                                            }
                                        >
                                            -
                                        </button>
                                        <div className="flex justify-center items-center pr-3 overflow-hidden">
                                            <img
                                                src={IMAGES.voucher}
                                                alt="voucher"
                                                className="h-full max-h-[90px] w-auto object-contain"
                                            />
                                            {isLoadingOptions ? (
                                                <p className="font-bold text-2xl cursor-default text-center w-[60px]">
                                                    ...
                                                </p>
                                            ) : (
                                                <p className="font-bold text-2xl cursor-default text-center w-[60px]">
                                                    {Number.isInteger(spinVoucherCount)
                                                        ? spinVoucherCount
                                                        : spinVoucherCount.toFixed(2)}
                                                </p>
                                            )}
                                        </div>
                                        <button
                                            className="font-extrabold px-4 text-[30px] leading-none h-[50px] w-[50px] flex items-center justify-center rounded-2xl bg-[#67768F]"
                                            onClick={handleSpinPlusMark}
                                            disabled={
                                                isLoadingOptions ||
                                                selectedFlipOptionIndex === flipOptions.length - 1
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                </>
                            )}
                        </>
                    )}
                    {currentRowIndex === 0 && !hasFlipped ? (
                        <button
                            className="w-full py-3 rounded-2xl bg-[#2D7FF0] hover:bg-blue-600 text-white font-bold text-2xl font-inter transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[60px]"
                            onClick={handleFlipAllCards}
                            disabled={
                                isFlipping ||
                                (selectedBalanceType === 'coin' && goldCoinFlipCount <= 0)
                            }
                        >
                            {isFlipping ? 'Flipping...' : 'Flip'}
                        </button>
                    ) : (
                        <button
                            className="w-full py-4 rounded-2xl bg-[#2D7FF0] hover:bg-blue-600 text-white font-bold text-2xl font-inter transition-colors h-[60px]"
                            onClick={handleNextRow}
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>
            {apiError && (
                <div className="mt-2 text-red-500 text-center">{apiError}</div>
            )}
        </div>
    )
}
