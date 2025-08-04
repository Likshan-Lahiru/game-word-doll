import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../../context/GlobalContext.tsx'
type WordollCardProps = {
    isMobile?: boolean
}
export function WordollCard({ isMobile = false }: WordollCardProps) {
    const navigate = useNavigate()
    const { isAuthenticated, selectedBalanceType } = useGlobalContext()
    const { limitPlay, setLimitPlay } = useGlobalContext()

    const handlePlayClick = () => {

        if (isAuthenticated) {
            if (selectedBalanceType === 'ticket') {
                // Navigate to gem game mode if ticket is selected
                navigate('/gem-game-mode', {
                    state: {
                        gameType: 'wordoll',
                    },
                })
            } else {
                // Navigate to bet selector for normal coin mode
                navigate('/bet-selector', {
                    state: {
                        gameType: 'wordoll',
                    },
                })
            }
        } else {
            navigate('/bet-selector', {
                state: {
                    gameType: 'wordoll',
                },
            })
        }
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
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/wEfJPtYkYsjSUwUG9ivnUR/wordoll.png"
                        alt="Wordoll"
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* x3 indicator in top right corner */}
                { !isAuthenticated &&
                    <div className="absolute top-2 right-4 text-white text-3xl z-10">
                        x 3
                    </div>
                }
                {/* Title at the bottom */}
                <div className="mt-auto pb-6 px-4 text-center relative z-10">
                    <h3 className="text-xl font-bold text-white">Wordoll</h3>
                </div>
            </div>
        )
    }
    return (
        <div className="h-[450px] rounded-2xl overflow-hidden flex flex-col relative">
            {/* Full image background */}
            <div className="absolute inset-0">
                <img
                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/wEfJPtYkYsjSUwUG9ivnUR/wordoll.png"
                    alt="Wordoll"
                    className="w-full h-full object-cover"
                />
            </div>
            {/* x3 indicator in top right corner */}
            { !isAuthenticated &&
                <div className="absolute top-2 right-6 text-white text-2xl font-semibold z-10">
                    x 3
                </div>
            }
            {/* Title */}
            <h3 className="text-3xl font-medium text-center text-white relative z-10 mt-6 pt-2 font-['DM_Sans']">
                Wordoll
            </h3>
            {/* Spacer to push button to bottom */}
            <div className="flex-1"></div>
            {/* Play button */}
            <div className="p-4 flex justify-center mb-6 relative z-10">
                <button
                    className="bg-blue-500 hover:bg-blue-600 rounded-full py-1 px-16 text-white font-medium text-xl border border-white/60 font-['DM_Sans']"
                    onClick={handlePlayClick}
                    disabled={!isAuthenticated && limitPlay === 0}
                >
                    PLAY
                </button>
            </div>
        </div>
    )
}
