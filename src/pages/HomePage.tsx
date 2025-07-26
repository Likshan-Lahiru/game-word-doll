import React from 'react'
// src/pages/HomePage.tsx

import { StatusBar } from '../components/StatusBar'
import { WinningStatus } from '../components/WinningStatus'
import { GameCardGrid } from '../components/GameCards/GameCardGrid'
import { BottomNavigation } from '../components/BottomNavigation'
import { PlayBookButton } from '../components/PlayBookButton'
import { LoginButton } from '../components/LoginButton'
export function HomePage({ isMobile }: { isMobile: boolean }) {
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white  overflow-hidden">
            {' '}
            {/* Apply styles only here */}
            <StatusBar isMobile={isMobile} />
            {!isMobile && <WinningStatus />}
            <GameCardGrid />
            {!isMobile && <LoginButton />}
            <BottomNavigation />
            {!isMobile && <PlayBookButton />}
        </div>
    )
}
