import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { StatusBar } from '../components/StatusBar'
import { useGlobalContext } from '../context/GlobalContext'
import { IMAGES } from '../constance/imagesLink.ts'
import { FlipCard } from '../components/FlipCard'
import { apiRequest } from '../services/api'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// Updated interface for flip options from API
interface FlipOption {
    id: string
    costPerFlip: number
}
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
    remainingVouchers: number
    remainingRTP: number
    flipCardData: ApiFlipCardData
}
interface FlipCardData {
    id: number
    name: string
    image: string
    desc: string
    type: string
    selected?: boolean
}
const allFlipCardData: FlipCardData[][] = [
    [
        {
            id: 1,
            name: 'Fortune Cooky',
            image: IMAGES.fortuneCooky,
            desc: '',
            winCount: Math.floor(Math.random() * (4 - 15 + 1)) + 15,
            type: 'winImg',
            selected: false,
        },
        {
            id: 2,
            name: 'Fortune Cooky',
            image: IMAGES.fortuneCooky,
            desc: '',
            winCount: Math.floor(Math.random() * (4 - 15 + 1)) + 15,
            type: 'winImg',
            selected: false,
        },
        {
            id: 3,
            name: 'Fortune Cooky',
            image: IMAGES.fortuneCooky,
            desc: '',
            winCount: Math.floor(Math.random() * (4 - 15 + 1)) + 15,
            type: 'winImg',
            selected: false,
        },
    ],
    [
        {
            id: 1,
            name: 'GRAND WIN',
            image: IMAGES.grandWinLogo,
            desc: '',
            winCount: 1000,
            type: 'winImg',
            selected: false,
        },
        {
            id: 2,
            name: 'GRAND WIN',
            image: IMAGES.grandWinLogo,
            desc: '',
            winCount: 1000,
            type: 'winImg',
            selected: false,
        },
        {
            id: 3,
            name: 'GRAND WIN',
            image: IMAGES.grandWinLogo,
            desc: '',
            winCount: 1000,
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
export function FlipPage() {
    const navigate = useNavigate()
    const {
        selectedBalanceType,
        setVoucherBalance,
        voucherBalance,
        isAuthenticated,
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
        // Create a weighted random selection that reduces GRAND WIN probability
        // GRAND WIN is at index 1, so we'll give it a lower weight
        const weights = allFlipCardData.map((_, index) => (index === 1 ? 0.1 : 1))
        const totalWeight = weights.reduce((sum, weight) => sum + weight, 0)
        let random = Math.random() * totalWeight
        let randomIndex = 0
        // Select an index based on weights
        for (let i = 0; i < weights.length; i++) {
            random -= weights[i]
            if (random <= 0) {
                randomIndex = i
                break
            }
        }
        const selectedSet = allFlipCardData[randomIndex].map((card, index) => ({
            ...card,
            selected: index === 1, // Select the middle card (index 1) instead of first card
        }))
        setSelectedFlipCards(selectedSet)
        setSelectedCardId(selectedSet[1].id) // Set the middle card ID as selected
    }
    function getRandomCardFromOtherSets(
        excludeSet: typeof selectedFlipCards,
    ): any {
        // Flatten all sets except the current one
        const otherCards = allFlipCardData
            .filter((set) => set !== excludeSet)
            .flat()
        // Get a random card from other sets
        const randomIndex = Math.floor(Math.random() * otherCards.length)
        return otherCards[randomIndex]
    }
    // Fetch flip options from API (0.20 / 0.40 / 0.60 / 1 / 2 )
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
        const vouchers = parseFloat(voucherBalance.toFixed(2))
        if (hasFlipped || currentRowIndex >= allFlipCardData.length) return
        if (vouchers < spinVoucherCount) {
            toast.info('not enough voucher balance!')
            return
        }
        if (!selectedCardId) {
            toast.info('Please select a card before flipping.')
            return
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
                // Make API call to flip game
                const requestData = {
                    userId: userId,
                    flipOptionId: spinVoucherId,
                }
                const response = await apiRequest(
                    '/game/flip/play',
                    'POST',
                    requestData,
                )
                setApiResponse(response)
                // Update voucher balance from API response
                setVoucherBalance(response.remainingVouchers)
                // Check if the response is a free card
                setIsFreeCard(response.flipCardType === 'FREE')
                // Create a new card based on API response
                const apiCard = response.flipCardData
                // Replace only unselected cards with random cards from other sets
                const updatedCards = selectedFlipCards.map((card) => {
                    if (card.id === selectedCardId) {
                        return {
                            ...card,
                            name: apiCard.name,
                            image: apiCard.imageLink,
                            desc: apiCard.desc,
                            type: apiCard.type || 'imgText',
                            ...(['WIN', 'GRAND', 'FORTUNE'].includes(
                                apiCard.flipCardType,
                            ) && {
                                winCount: apiCard.winCount,
                            }),
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
                // Update voucher balance for non-authenticated users
                setVoucherBalance(vouchers - spinVoucherCount)
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
            // Always deduct voucher balance unless it's a free card
            if (!isAuthenticated && !isFreeCard) {
                setVoucherBalance(vouchers - spinVoucherCount)
            }
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
            setVoucherBalance(vouchers - spinVoucherCount)
        } finally {
            setIsFlipping(false)
        }
    }
    // Handle coming next cards
    const handleNextRow = async () => {
        // Flip all cards back to front
        const flippedBack = selectedFlipCards.reduce(
            (acc, card) => {
                acc[card.id] = false // false = front side
                return acc
            },
            {} as {
                [id: number]: boolean
            },
        )
        setFlippedCards(flippedBack)
        // Wait for flip animation to complete (~500ms)
        await new Promise((resolve) => setTimeout(resolve, 500))
        // Start slide-in animation
        setSlideInCards(true)
        // Load new card set
        const newIndex = Math.floor(Math.random() * allFlipCardData.length)
        const newSet = allFlipCardData[newIndex].map((card, index) => ({
            ...card,
            selected: index === 1, //Default middle card select
        }))
        setSelectedFlipCards(newSet)
        // Default middle card select
        setSelectedCardId(newSet[1].id)
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
    // Mobile view based on the provided image
    if (isMobile) {
        return (
            <div className="flex flex-col w-full min-h-screen bg-[#1A202C] text-white">
                <ToastContainer position="top-right" autoClose={3000} />
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
                {/* Flip Cards */}
                <div className="flex flex-col items-center gap-y-3 mb-10 mt-5">
                    {/* Row 1: First card */}
                    <div className="flex justify-center">
                        {selectedFlipCards.slice(0, 1).map((item) => (
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
                                    isMobile={true}
                                />
                            </div>
                        ))}
                    </div>
                    {/* Row 2: Second and third cards */}
                    <div className="flex justify-center gap-x-3">
                        {selectedFlipCards.slice(1).map((item) => (
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
                                    isMobile={true}
                                />
                            </div>
                        ))}
                    </div>
                </div>
                {/* Spin buttons */}
                <div className="px-4 pb-24 space-y-2">
                    {selectedBalanceType === 'ticket' && (
                        <>
                            {isFreeCard ? (
                                <button className="w-full py-4 rounded-2xl bg-[#374151] text-white font-bold text-2xl font-inter transition-colors disabled:cursor-not-allowed">
                                    Free
                                </button>
                            ) : (
                                <div className="flex font-inter items-center justify-between w-full py-3 px-1 rounded-2xl bg-[#374151] text-white h-[60px]">
                                    <button
                                        className="font-extrabold px-4 text-[30px] leading-none h-[50px] w-[50px] flex items-center justify-center rounded-2xl bg-[#67768F]"
                                        onClick={handleSpinMinusMark}
                                        disabled={isLoadingOptions || selectedFlipOptionIndex === 0}
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
                            )}
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
                            disabled={isFlipping}
                        >
                            {isFlipping ? 'Flipping...' : 'Flip'}
                        </button>
                    ) : (
                        <button
                            className="w-full py-4 rounded-[22px] bg-[#2D7FF0] hover:bg-blue-600 text-white font-bold text-2xl font-inter transition-colors"
                            onClick={handleNextRow}
                        >
                            Next
                        </button>
                    )}
                    {apiError && (
                        <div className="mt-2 text-red-500 text-center">{apiError}</div>
                    )}
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
                        <FlipCard
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
                    {selectedBalanceType === 'ticket' && (
                        <>
                            {isFreeCard ? (
                                <button className="w-full py-4 rounded-2xl bg-[#374151] text-white font-bold text-2xl font-inter transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[60px]">
                                    Free
                                </button>
                            ) : (
                                <div className="flex font-inter items-center justify-between w-full py-3 px-1 rounded-2xl bg-[#374151] text-white h-[60px]">
                                    <button
                                        className="font-extrabold px-4 text-[30px] leading-none h-[50px] w-[50px] flex items-center justify-center rounded-2xl bg-[#67768F]"
                                        onClick={handleSpinMinusMark}
                                        disabled={isLoadingOptions || selectedFlipOptionIndex === 0}
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
                            )}
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
                            className="w-full py-3 rounded-2xl bg-[#2D7FF0] hover:bg-blue-600 text-white font-bold text-2xl font-inter transition-colors disabled:opacity-50 disabled:cursor-not-allowed h-[60px]"
                            onClick={handleFlipAllCards}
                            disabled={isFlipping}
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
