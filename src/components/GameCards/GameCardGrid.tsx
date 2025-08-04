import React from 'react'
import { WordollCard } from './WordollCard.tsx'
import { LockPickrCard } from './LockPickrCard.tsx'
import { GiveawayCard } from './GiveawayCard.tsx'
import { PlayBookCard } from './PlayBookCard.tsx'
import { LoginButton } from '../LoginButton.tsx'
import { useGlobalContext } from '../../context/GlobalContext.tsx'
export function GameCardGrid() {
    // Check if mobile
    const isMobile = window.innerWidth <= 768
    const { isAuthenticated } = useGlobalContext()
    if (isMobile) {
        return (
            <div className="flex-1 px-4 pb-10 game-card-grid">
                {/* Online status for mobile view - positioned above the cards */}
                {!isAuthenticated && (
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm font-bold">1,568 Online</span>
                    </div>
                )}
                <div className="grid grid-cols-2 gap-3 mb-3">
                    {/* Ensure Wordoll is first (top-left) */}
                    <WordollCard isMobile={true} />
                    <LockPickrCard isMobile={true} />
                    <GiveawayCard isMobile={true} />
                    <PlayBookCard isMobile={true} />
                </div>
                {!isAuthenticated && <LoginButton />}
            </div>
        )
    }
    return (
        <div
<<<<<<< HEAD

            className={flex-1 flex justify-center items-center ${isAuthenticated ? 'pb-40' : 'pt-0'} game-card-grid}

=======
            className={`flex-1 flex justify-center items-center ${isAuthenticated ? 'pb-40' : 'pt-0'} game-card-grid`}
>>>>>>> 399a174 (issues fixed)
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full">
                <WordollCard />
                <LockPickrCard />
                <GiveawayCard />
            </div>
        </div>
    )
}
