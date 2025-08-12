import React, { useEffect, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { BottomNavigation } from '../components/BottomNavigation'
import { useGlobalContext } from '../context/GlobalContext'
import { StatusBar } from '../components/StatusBar'
import {InfoModal} from "../components/infoModal/InfoModal.tsx";
import {IMAGES} from "../constance/imagesLink.ts";

export function GiveawayEntry() {
    const navigate = useNavigate()
    const location = useLocation()
    const { isAuthenticated, spinBalance, selectedBalanceType, voucherBalance } = useGlobalContext()
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

    const handleGameSelect = (gameType: string) => {
        setSelectedGame(gameType)

        if (voucherBalance >= 2 && selectedBalanceType === 'ticket' && isAuthenticated) {
            if (gameType === 'wordoll') {
                navigate('/wordoll-game')
            } else {
                navigate('/lock-pickr-game')
            }
        } else {
            navigate('/giveaway-game', {
                state: {
                    selectedGame: gameType,
                },
            })
        }
    }

    const handleSpin = () => {
        navigate('/spin')
        // if (selectedBalanceType === 'ticket') {
        //     if (voucherBalance === 0) {
        //         setOpenInfoModal(true);
        //     } else {
        //         setOpenInfoModal(false);
        //         navigate('/spin')
        //     }
        // } else  {
        //     navigate('/spin')
        // }
    }

    const GrandWin = () => {
        return(
            <>
                <div className={`flex-col flex items-center justify-center gap-y-5
                    ${isMobile && 'mt-10'}
                `}>
                    <p className={"font-semibold text-[20px] font-[DM Sans]"}>GRAND WIN</p>
                    <div className={"flex items-center"}>
                        <p className={"font-semibold pr-2 text-[20px] font-[DM Sans]"}>Win</p>
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                            alt="Heart"
                            className="w-6 h-6 pt-[2px] object-contain"
                        />
                        <p className={"font-semibold pl-2 text-[20px] font-[DM Sans]"}>1,000 Daily</p>
                    </div>
                </div>
            </>
        )
    }

    const CustomWordollCard = () => {
        if (isMobile) {
            return (
                <div
                    className="rounded-xl overflow-hidden flex flex-col h-[270px] relative cursor-pointer font-['DM Sans']"
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
            <div className="h-[318px] rounded-2xl overflow-hidden flex flex-col relative font-['DM Sans']">
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
                        className="bg-blue-500 hover:bg-blue-600 rounded-full py-1 px-14 text-white font-medium text-xl border border-white/60 font-['DM_Sans']"
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
                    className="rounded-xl overflow-hidden flex flex-col h-[270px] relative cursor-pointer font-['DM Sans']"
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
            <div className="h-[318px] rounded-2xl overflow-hidden flex flex-col relative font-['DM Sans']">
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
                        className="bg-blue-500 hover:bg-blue-600 rounded-full py-1 px-14 text-white font-medium text-xl border border-white/60 font-['DM_Sans']"
                        onClick={() => handleGameSelect('lockpickr')}
                    >
                        PLAY
                    </button>
                </div>
            </div>
        )
    }

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
                <StatusBar  isMobile={isMobile} hideOnlineCount={true} />
            </div>

            {/* Main Content */}
            <div className="flex flex-col w-full bg-[#1F2937] text-white">
                <div className="flex flex-col pt-0">
                    {/* Title */}
                    <h2 className={`${isMobile ? 'pb-3' : 'pb-2'} text-base font-dmSans font-['DM_Sans'] sm:text-lg md:text-xl font-medium text-center my-10 sm:my-3 md:mb-3 px-4`}>
                        Play any game to enter the Fortune Spin
                    </h2>

                    <div className={"flex justify-center"}>
                        {/* Left Side - Grand Win After Entries Select */}
                        { selectedBalanceType === 'ticket' && !isMobile && isAuthenticated &&
                            <GrandWin/>
                        }


                        {/* Game Cards */}
                        <div className={`px-4 sm:h-[450px] 
                            ${isMobile ? 'w-full' : 'mr-20 ml-20'}`
                        }
                        >
                            <div
                                className={`flex justify-center ${isMobile ? 'gap-3' : 'gap-4'} w-full max-w-2xl mx-auto`}
                            >
                                {/* WordollCard */}
                                <div
                                    className={`${isMobile ? 'w-[60%]' : 'w-[240px]'} ${isMobile ? 'h-[265px]' : 'h-[320px]'}`}
                                >
                                    <CustomWordollCard />
                                </div>

                                {/* LockPickerCard */}
                                <div
                                    className={`${isMobile ? 'w-[60%]' : 'w-[240px]'} ${isMobile ? 'h-[265px]' : 'h-[320px]'}`}
                                >
                                    <CustomLockPickrCard />
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Grand Win After Entries Select */}
                        { selectedBalanceType === 'ticket' && !isMobile &&  isAuthenticated &&
                            <>
                                <GrandWin/>
                            </>
                        }
                    </div>

                    {/* Mobile - Grand Win After Entries Select */}
                    { selectedBalanceType === 'ticket' && isMobile &&  isAuthenticated &&
                        <>
                            <GrandWin/>
                        </>
                    }

                    {/* Spin Button */}
                    <div className="w-full px-4 mt-10 sm:mt-5 md:mt-8 lg:mt-10 xl:mt-10 mb-20">
                        <button
                            className={`${voucherBalance > 0 ? 'bg-[#FFB302]' : 'bg-[#2D7FF0]'} hover:bg-opacity-90 text-white py-4 px-16 rounded-full mx-auto block`}
                            onClick={handleSpin}
                            disabled={selectedBalanceType === 'coin' && spinBalance <= 0}
                        >
                            { selectedBalanceType === 'ticket' && isAuthenticated ?
                                <>
                                    <div className={"h-[25px] flex items-center"}>
                                        <p className={"flex items-center"}>FLIP NOW
                                            {voucherBalance !== 0 &&
                                            <>
                                                (
                                                <img
                                                    src={IMAGES.voucher}
                                                    alt={"voucher"}
                                                    className={"w-6 h-6 mr-2 ml-2"}/>
                                                <p>x {voucherBalance}  )</p>
                                            </>
                                        }
                                        </p>
                                    </div>
                                </>
                                :
                                `SPIN NOW (${spinBalance} x Spin)`
                            }
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
