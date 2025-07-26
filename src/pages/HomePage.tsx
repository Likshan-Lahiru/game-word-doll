import React from 'react'
// src/pages/HomePage.tsx
import { StatusBar } from '../components/StatusBar'
import { WinningStatus } from '../components/WinningStatus'
import { GameCardGrid } from '../components/GameCards/GameCardGrid'
import { BottomNavigation } from '../components/BottomNavigation'
import { PlayBookButton } from '../components/PlayBookButton'
import { LoginButton } from '../components/LoginButton'
import { useGlobalContext } from '../context/GlobalContext'
export function HomePage({ isMobile }: { isMobile: boolean }) {
    const { isAuthenticated } = useGlobalContext()
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white overflow-hidden">
            <StatusBar isMobile={isMobile} hideOnlineCount={isAuthenticated} />
            {!isMobile && <WinningStatus />}
            <div className={`flex-1 ${isAuthenticated ? 'pt-4' : ''}`}>
                <GameCardGrid />
            </div>
            {!isMobile && !isAuthenticated && <LoginButton />}
            <BottomNavigation />
            {!isMobile && <PlayBookButton />}
        </div>
    )
}
