import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BottomNavigation } from '../components/BottomNavigation'
import { useGlobalContext } from '../context/GlobalContext'
import { StatusBar } from '../components/StatusBar'
import { InfoModal } from '../components/infoModal/InfoModal.tsx'
import { IMAGES } from '../constance/imagesLink.ts'
export function GiveawayEntry() {
    const navigate = useNavigate()
    const location = useLocation()
    const {
        isAuthenticated,
        spinBalance,
        selectedBalanceType,
        voucherBalance,
        goldCoinFlipCount,
        updateGoldCoinFlipCount,
        setSelectedBalanceType,
    } = useGlobalContext()
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    const [selectedGame, setSelectedGame] = useState<string | null>(null)
    const [openInfoModal, setOpenInfoModal] = useState(false)
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    // Fetch gold coin flip count when balance type changes to 'coin'
    useEffect(() => {
        if (selectedBalanceType === 'coin' && isAuthenticated) {
            updateGoldCoinFlipCount()
        }
    }, [selectedBalanceType, isAuthenticated, updateGoldCoinFlipCount])
    const handleGameSelect = (gameType: string) => {
        setSelectedGame(gameType)
        // Check if user is authenticated
        if (!isAuthenticated) {
            // Redirect to login page if not authenticated
            navigate('/login')
            return
        }
        // Check if using gold coin balance type
        if (selectedBalanceType === 'coin') {
            // Navigate to gold-giveaway-game for gold coin balance type
            navigate('/gold-giveaway-game', {
                state: {
                    selectedGame: gameType,
                },
            })
        } else {
            // Navigate to regular giveaway-game for ticket balance type
            navigate('/giveaway-game', {
                state: {
                    selectedGame: gameType,
                },
            })
        }
    }
    const handleSpin = () => {
        // Check if using gold coin balance type
        if (selectedBalanceType === 'coin') {
            // Navigate to gold spin page for gold coin balance
            navigate('/gold-spin')
        } else {
            // For ticket balance, check for vouchers
            if (voucherBalance === 0) {
                setOpenInfoModal(true)
            } else {
                setOpenInfoModal(false)
                navigate('/cookyflip')
            }
        }
    }
    // Replace your current GrandWin with this:
    const GrandWin = () => {
        if (isMobile) {
            // ---- Mobile view ----
            return (
                <div className="w-full px-4 mt-3 font-['DM Sans']">
                    <div className="mx-auto w-full max-w-md rounded-2xl  to-[#FFB302] ">
                        <div className="rounded-2xl bg-[#1F2937] py-4 px-5 text-center">
                            <p className="text-xs font-semibold tracking-wide text-white/90">
                                GRAND WIN
                            </p>
                            <div className="mt-2 flex items-center justify-center gap-2">
                                <span className="text-lg font-semibold">Win</span>
                                <img
                                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                                    alt="Heart"
                                    className="w-5 h-5 object-contain"
                                />
                                <span className="text-lg font-semibold">1,000 Daily</span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }

        // ---- Desktop view (unchanged) ----
        return (
            <>
                <div
                    className={`flex-col flex items-center justify-center gap-y-5
                    ${isMobile && 'mt-10'}
                    `}
                >
                    <p className={'font-semibold text-[20px] font-[\'DM Sans\']'}>
                        GRAND WIN
                    </p>
                    <div className={'flex items-center'}>
                        <p className={'font-semibold pr-2 text-[20px] font-[\'DM Sans\']'}>
                            Win
                        </p>
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                            alt="Heart"
                            className="w-6 h-6 pt-[2px] object-contain"
                        />
                        <p className={'font-semibold pl-2 text-[20px] font-[\'DM Sans\']'}>
                            1,000 Daily
                        </p>
                    </div>
                </div>
            </>
        )
    }

    const CustomWordollCard = () => {
        if (isMobile) {
            return (
                <div
                    className="rounded-xl overflow-hidden flex flex-col h-[230px] relative cursor-pointer font-['DM Sans']"
                    onClick={() => handleGameSelect('wordoll')}
                >
                    <div className="absolute inset-0">
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/wEfJPtYkYsjSUwUG9ivnUR/wordoll.png"
                            alt="Wordoll"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="mt-auto pb-6 px-4 text-center relative z-10">
                        <h3 className="text-xl font-bold text-white">Wordoll</h3>
                    </div>
                </div>
            )
        }
        return (
            <div className="h-[54vh] rounded-2xl overflow-hidden flex flex-col relative font-['DM Sans']">
                <div className="absolute inset-0">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/wEfJPtYkYsjSUwUG9ivnUR/wordoll.png"
                        alt="Wordoll"
                        className="w-full h-full object-cover"
                    />
                </div>
                <h3 className="text-2xl font-medium text-center text-white relative z-10 mt-6 pt-2 font-['DM_Sans']">
                    Wordoll
                </h3>
                <div className="flex-1"></div>
                <div className="p-4 flex justify-center mb-6 relative z-10">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 rounded-full py-1 px-[4vw] text-white font-medium text-xl border border-white/60 font-['DM_Sans']"
                        onClick={() => handleGameSelect('wordoll')}
                    >
                        PLAY
                    </button>
                </div>
            </div>
        )
    }
    const CustomLockPickrCard = () => {
        if (isMobile) {
            return (
                <div
                    className="rounded-xl overflow-hidden flex flex-col h-[230px] relative cursor-pointer font-['DM Sans']"
                    onClick={() => handleGameSelect('lockpickr')}
                >
                    <div className="absolute inset-0">
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/i9wzJrxokDDqgwas4Cft5m/lockpickr.png"
                            alt="Lock Pickr"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="mt-auto pb-6 px-4 text-center relative z-10">
                        <h3 className="text-xl font-bold text-white">Lock Pickr</h3>
                    </div>
                </div>
            )
        }
        return (
            <div className="h-[54vh] rounded-2xl overflow-hidden flex flex-col relative font-['DM Sans']">
                <div className="absolute inset-0">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/i9wzJrxokDDqgwas4Cft5m/lockpickr.png"
                        alt="Lock Pickr"
                        className="w-full h-full object-cover"
                    />
                </div>
                <h3 className="text-2xl font-medium text-center text-white relative z-10 mt-6 pt-2 font-['DM_Sans']">
                    Lock Pickr
                </h3>
                <div className="flex-1"></div>
                <div className="p-4 flex justify-center mb-6 relative z-10">
                    <button
                        className="bg-blue-500 hover:bg-blue-600 rounded-full py-1 px-[4vw] text-white font-medium text-xl border border-white/60 font-['DM_Sans']"
                        onClick={() => handleGameSelect('lockpickr')}
                    >
                        PLAY
                    </button>
                </div>
            </div>
        )
    }
// Inside your component:
    if (isMobile) {
        // --- MOBILE VIEW (desktop view unchanged below) ---
        return (
            <div className="fixed inset-0 flex flex-col bg-[#1F2937] text-white font-['DM Sans'] overflow-hidden">
                {/* Back button (pinned) */}
                <div className="absolute top-12 left-2 z-20 lg:top-4 md:top-4 md:left-4 sm:top-4">
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

                {/* Status Bar (pinned) */}
                <div className="sticky top-0 z-10 bg-[#1F2937]">
                    <StatusBar isMobile hideOnlineCount={true} />
                </div>

                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto mt-10 overscroll-contain">
                    {/* Title */}
                    <h2 className="pb-3 text-base sm:text-lg md:text-lg font-medium text-center mb-5 my-0 md:mb-5 px-4">
                        {selectedBalanceType === 'ticket'
                            ? 'Play any game to win vouchers'
                            : 'Play any game to enter the Cooky Flip'}
                    </h2>

                    {/* Cards + optional GrandWin (mobile) */}
                    <div className="flex flex-col items-center">


                        {/* Game Cards */}
                        <div className="w-full px-4">
                            <div className="flex justify-center gap-3 w-full max-w-2xl mx-auto">
                                {/* WordollCard */}
                                <div className="w-[60%]">
                                    <CustomWordollCard />
                                </div>
                                {/* LockPickerCard */}
                                <div className="w-[60%]">
                                    <CustomLockPickrCard />
                                </div>
                            </div>
                        </div>
                        {/* Mobile - Grand Win After Entries Select */}
                        {selectedBalanceType === 'ticket' && isAuthenticated && <GrandWin />}
                    </div>

                    {/* Spin Button */}
                    <div className="w-full px-4 mt-8 mb-[calc(env(safe-area-inset-bottom)+96px)]">
                        <button
                            className={`${
                                (voucherBalance >= 0.4 && selectedBalanceType === 'ticket') ||
                                (goldCoinFlipCount >= 0.4 && selectedBalanceType === 'coin')
                                    ? 'bg-[#FFB302]'
                                    : 'bg-[#2D7FF0]'
                            } hover:bg-opacity-90 text-white py-2 px-16 rounded-full mx-auto block`}
                            onClick={handleSpin}
                            disabled={selectedBalanceType === 'coin' && goldCoinFlipCount <= 0}
                        >
                            {selectedBalanceType === 'ticket' && isAuthenticated ? (
                                <div className="h-[18px] flex items-center justify-center">
                                    <p className="flex items-center">
                                        FLIP NOW
                                        {voucherBalance !== 0 && (
                                            <>
                                                (
                                                <img
                                                    src={IMAGES.voucher}
                                                    alt="voucher"
                                                    className="w-6 h-6 mr-2 ml-2"
                                                />
                                                <span>
                        x {Number.isInteger(voucherBalance) ? voucherBalance : voucherBalance.toFixed(2)} )
                      </span>
                                            </>
                                        )}
                                    </p>
                                </div>
                            ) : (
                                `FLIP NOW (${
                                    selectedBalanceType === 'coin'
                                        ? Number.isInteger(goldCoinFlipCount)
                                            ? goldCoinFlipCount
                                            : goldCoinFlipCount.toFixed(2)
                                        : Number.isInteger(spinBalance)
                                            ? spinBalance
                                            : spinBalance.toFixed(2)
                                } x Flip)`
                            )}
                        </button>
                    </div>


                </div>

                {/* Bottom Navigation (pinned) */}
                <div className="sticky bottom-0 z-10 bg-[#1F2937] pb-[env(safe-area-inset-bottom)]">
                    <BottomNavigation />
                </div>

                {/* Modals */}
                <InfoModal isOpen={openInfoModal} onClose={() => setOpenInfoModal(false)} />
            </div>
        )
    }

// --- DESKTOP VIEW (unchanged) ---
    return (
        <div className="relative font-['DM Sans']">
            {/* Back button */}
            <div className="absolute top-12 left-2 z-10 lg:top-4 md:top-4 md:left-4 sm:top-4">
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

            {/* Main Content */}
            <div className="flex flex-col w-full bg-[#1F2937] text-white">
                <div className="flex flex-col pt-0">
                    {/* Title */}
                    <h2
                        className={`${
                            isMobile ? 'pb-3' : 'pb-0'
                        } text-base font-dmSans font-['DM_Sans'] sm:text-lg md:text-lg font-medium text-center my-0 sm:my-0 md:mb-5 px-4`}
                    >
                        {selectedBalanceType === 'ticket'
                            ? 'Play any game to win vouchers'
                            : 'Play any game to enter the Cooky Flip'}
                    </h2>

                    <div className="flex justify-center">
                        {/* Left - GrandWin (desktop) */}
                        {selectedBalanceType === 'ticket' && !isMobile && isAuthenticated && <GrandWin />}

                        {/* Game Cards */}
                        <div className={`px-4 sm:h-[54vh] ${isMobile ? 'w-full' : 'mr-20 ml-20'}`}>
                            <div className={`flex justify-center ${isMobile ? 'gap-3' : 'gap-4'} w-full max-w-2xl mx-auto`}>
                                <div className={`${isMobile ? 'w-[60%]' : 'w-[16vw] min-w-[210px]'}`}>
                                    <CustomWordollCard />
                                </div>
                                <div className={`${isMobile ? 'w-[60%]' : 'w-[16vw] min-w-[210px]'}`}>
                                    <CustomLockPickrCard />
                                </div>
                            </div>
                        </div>

                        {/* Right - GrandWin (desktop) */}
                        {selectedBalanceType === 'ticket' && !isMobile && isAuthenticated && <GrandWin />}
                    </div>

                    {/* Mobile - GrandWin (desktop branch kept as-is) */}
                    {selectedBalanceType === 'ticket' && isMobile && isAuthenticated && <GrandWin />}

                    {/* Spin Button */}
                    <div className="w-full px-4 mt-10 sm:mt-5 md:mt-8 lg:mt-2 xl:mt-6 mb-16">
                        <button
                            className={`${
                                (voucherBalance >= 0.4 && selectedBalanceType === 'ticket') ||
                                (goldCoinFlipCount >= 0.4 && selectedBalanceType === 'coin')
                                    ? 'bg-[#FFB302]'
                                    : 'bg-[#2D7FF0]'
                            } hover:bg-opacity-90 text-white py-2 px-16 rounded-full mx-auto block`}
                            onClick={handleSpin}
                            disabled={selectedBalanceType === 'coin' && goldCoinFlipCount <= 0}
                        >
                            {selectedBalanceType === 'ticket' && isAuthenticated ? (
                                <>
                                    <div className="h-[18px] flex items-center">
                                        <p className="flex items-center">
                                            FLIP NOW
                                            {voucherBalance !== 0 && (
                                                <>
                                                    (
                                                    <img
                                                        src={IMAGES.voucher}
                                                        alt="voucher"
                                                        className="w-6 h-6 mr-2 ml-2"
                                                    />
                                                    <p>
                                                        x {Number.isInteger(voucherBalance) ? voucherBalance : voucherBalance.toFixed(2)} )
                                                    </p>
                                                </>
                                            )}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                `FLIP NOW (${
                                    selectedBalanceType === 'coin'
                                        ? Number.isInteger(goldCoinFlipCount)
                                            ? goldCoinFlipCount
                                            : goldCoinFlipCount.toFixed(2)
                                        : Number.isInteger(spinBalance)
                                            ? spinBalance
                                            : spinBalance.toFixed(2)
                                } x Flip)`
                            )}
                        </button>
                    </div>
                </div>

                {/* Bottom Navigation */}
                <BottomNavigation />
            </div>

            <InfoModal isOpen={openInfoModal} onClose={() => setOpenInfoModal(false)} />
        </div>
    )

}
