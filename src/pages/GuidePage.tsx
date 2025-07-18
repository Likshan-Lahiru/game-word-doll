import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomNavigation } from '../components/BottomNavigation'
export function GuidePage() {
    const navigate = useNavigate()
    const [, setIsMobile] = useState(window.innerWidth <= 768)
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white">
            {/* Header */}
            <div className="relative py-3 flex items-center justify-center">
                <button
                    className="absolute left-3 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-800 flex items-center justify-center"
                    onClick={() => navigate('/')}
                >
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/5dZY2vpVSVwYT3dUEHNYN5/back-icons.png"
                        alt="Back"
                        className="w-4 h-4 sm:w-6 sm:h-6"
                    />
                </button>
                <h1 className="text-xl sm:text-2xl font-bold">Guide</h1>
            </div>
            {/* Main Content - Scrollable container */}
            <div className="flex-1 px-3 py-4 sm:p-6 space-y-5 sm:space-y-8 overflow-y-auto">
                {/* Gold Coins Section */}
                <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="rounded-full">
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/vD9N9vM2M65c4oq3nT2jFf/Gold_Coins.png"
                                alt="Gold Coins"
                                className="w-6 h-6 sm:w-8 sm:h-8"
                            />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                            Gold Coins
                        </h3>
                    </div>
                    <p className="text-sm sm:text-base text-gray-300">
                        Gold Coins are your main in-game currency. Use them to play any of
                        our games. You can get more Gold Coins by buying them in the store
                        or winning them from games.
                    </p>
                </div>
                {/* Entries Section */}
                <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="rounded-full">
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/pghjseEomEmEhcxZ1KTDRe/Entries.png"
                                alt="Entries"
                                className="w-6 h-6 sm:w-8 sm:h-8"
                            />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                            Entries
                        </h3>
                    </div>
                    <p className="text-sm sm:text-base text-white">
                        Entries are special passes that let you join paid rooms and compete
                        in skill-based games for a chance to win Gems.
                    </p>
                </div>
                {/* Gems Section */}
                <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="rounded-full">
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/cLaoa9Q2SuXLLGphZCDzFr/Gems.png"
                                alt="Gems"
                                className="w-6 h-6 sm:w-8 sm:h-8"
                            />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                            Gems
                        </h3>
                    </div>
                    <p className="text-sm sm:text-base text-white">
                        Gems are a premium reward. If you collect enough Gems, you can
                        redeem and transfer them as funds to your bank account.
                    </p>
                </div>
                {/* Vouchers Section */}
                <div className="space-y-1 sm:space-y-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="rounded-full">
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/3YTVbiE1DuPqiMrrdaLvve/Vouchers.png"
                                alt="Vouchers"
                                className="w-6 h-6 sm:w-8 sm:h-8"
                            />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                            Vouchers
                        </h3>
                    </div>
                    <p className="text-sm sm:text-base text-white">
                        Earn Vouchers by playing skill-based games. Vouchers let you spin
                        the Giveaway Spin for bonus prizes and gems.
                    </p>
                </div>
                {/* Lucky Score Section */}
                <div className="space-y-1 sm:space-y-2 pb-16 sm:pb-8">
                    <div className="flex items-center gap-2 sm:gap-3">
                        <div className="rounded-full">
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/nsm9dStD4yr2m3TCXP3A67/Lucky_Meter.png"
                                alt="Lucky Score"
                                className="w-6 h-6 sm:w-8 sm:h-8"
                            />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-white">
                            Lucky Score
                        </h3>
                    </div>
                    <p className="text-sm sm:text-base text-white">
                        Your Lucky Score is visible in your account section. The more you
                        share your personalized game link, the higher your Lucky Score goes,
                        boosting your chances to win in Giveaway spins. (Note: The Lucky
                        Score doesn't affect outcomes in skill-based games.)
                    </p>
                </div>
            </div>
            {/* Bottom Navigation */}
            <BottomNavigation />
        </div>
    )
}
