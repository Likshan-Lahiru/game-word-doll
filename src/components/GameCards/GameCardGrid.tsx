import React, { useEffect, useState } from 'react'
import { WordollCard } from './WordollCard.tsx'
import { LockPickrCard } from './LockPickrCard.tsx'
import { GiveawayCard } from './GiveawayCard.tsx'
import { PlayBookCard } from './PlayBookCard.tsx'
import { LoginButton } from '../LoginButton'
import { useGlobalContext } from '../../context/GlobalContext'
import { fetchOnlineUserCount } from '../../services/api'
export function GameCardGrid() {
    // Check if mobile
    const isMobile = window.innerWidth <= 768
    const { isAuthenticated } = useGlobalContext()
    const [onlineCount, setOnlineCount] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    // Fetch online count
    useEffect(() => {
        const getOnlineCount = async () => {
            try {
                setIsLoading(true)
                const response = await fetchOnlineUserCount()
                if (response && typeof response.onlineCount === 'number') {
                    setOnlineCount(response.onlineCount)
                } else {
                    // Fallback to a default value if API response format is unexpected
                    console.warn(
                        'Unexpected API response format for online count:',
                        response,
                    )
                    setOnlineCount(Math.floor(Math.random() * 5000) + 1000) // Fallback random number
                }
            } catch (error) {
                console.error('Failed to fetch online count:', error)
                // Fallback to a default value in case of error
                setOnlineCount(Math.floor(Math.random() * 5000) + 1000)
            } finally {
                setIsLoading(false)
            }
        }
        getOnlineCount()
    }, [])
    if (isMobile) {
        return (
            <div className="flex-1 px-4 pb-0 game-card-grid">
                {/* Online status for mobile view - positioned above the cards */}
                {!isAuthenticated && (
                    <div className="flex items-center space-x-3 mb-4">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm font-bold">
              {isLoading
                  ? 'Loading...'
                  : `${onlineCount.toLocaleString()} Online`}
            </span>
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
            className={`flex-1 flex justify-center items-center ${isAuthenticated ? 'pb-16' : 'pt-0'} game-card-grid`}
        >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl min-w-[40vw] w-full">
                <WordollCard />
                <LockPickrCard />
                <GiveawayCard />
            </div>
        </div>
    )
}
