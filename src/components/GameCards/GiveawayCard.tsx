import React from 'react'
import { useNavigate } from 'react-router-dom'
type GiveawayCardProps = {
    isMobile?: boolean
}
export function GiveawayCard({ isMobile = false }: GiveawayCardProps) {
    const navigate = useNavigate()
    const handlePlayClick = () => {
        navigate('/giveaway-entry')
    }
    if (isMobile) {
        return (
            <div
                className="rounded-xl overflow-hidden flex flex-col h-[250px] relative cursor-pointer"
                onClick={handlePlayClick}
            >
                {/* Full image background */}
                <div className="absolute inset-0">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/rSNQiZnPA1sR7UjzQqDTDG/giveaway.png"
                        alt="Fortune Spin"
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Title at the bottom */}
                <div className="mt-auto pb-6 px-4 text-center  relative z-10">
                    <h3 className="text-xl	 font-bold text-white">Fortune Spin</h3>
                </div>
            </div>
        )
    }
    return (
        <div className="h-[450px] rounded-2xl overflow-hidden flex flex-col relative">
            {/* Full image background */}
            <div className="absolute inset-0">
                <img
                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/rSNQiZnPA1sR7UjzQqDTDG/giveaway.png"
                    alt="Fortune Spin"
                    className="w-full h-full object-cover"
                />
            </div>
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
            {/* Title */}
            <h3 className="text-3xl font-medium text-center text-white relative z-10 mt-6 pt-2 font-['DM_Sans']">
                Fortune Spin
            </h3>
            {/* Spacer */}
            <div className="flex-1"></div>
            {/* Play button */}
            <div className="p-4 flex justify-center mb-6 relative z-10">
                <button
                    className="bg-blue-500 hover:bg-blue-600 rounded-full py-2 px-16 text-white font-medium text-xl border border-white/60 font-['DM_Sans']"
                    onClick={handlePlayClick}
                >
                    PLAY
                </button>

            </div>
        </div>
    )
}
