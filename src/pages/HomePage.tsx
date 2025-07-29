import React from 'react'
// src/pages/HomePage.tsx
import { StatusBar } from '../components/StatusBar'
import { WinningStatus } from '../components/WinningStatus'
import { GameCardGrid } from '../components/GameCards/GameCardGrid'
import { BottomNavigation } from '../components/BottomNavigation'
import { PlayBookButton } from '../components/PlayBookButton'
import { LoginButton } from '../components/LoginButton'
import { OnlineCountDisplay } from '../components/OnlineCountDisplay'
import { useGlobalContext } from '../context/GlobalContext'
export function HomePage({ isMobile }: { isMobile: boolean }) {
    const { isAuthenticated } = useGlobalContext()
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white overflow-hidden">
            {/* Logo in top left corner - only shown when not authenticated */}
            {!isAuthenticated && (
                <div className="absolute top-9 left-4 z-10">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/uYsqLmRkx6f1zBGRqMZA6G/cookycreanlogo3.png"
                        alt="Cooky Cream Logo"
                        className="h-12 sm:h-16"
                    />
                </div>
            )}
            <StatusBar
                isMobile={isMobile}
                hideOnlineCount={true}
                switchableBalanceSelector={true}
            />
            {!isMobile && !isAuthenticated && <WinningStatus />}
            <div className={`flex-1 ${isAuthenticated ? 'pt-4' : ''}`}>
                <GameCardGrid />
            </div>
            {!isMobile && !isAuthenticated && <LoginButton />}
            {!isMobile && !isAuthenticated && <OnlineCountDisplay />}
            <BottomNavigation />
            {!isMobile && <PlayBookButton />}
        </div>
    )
}
