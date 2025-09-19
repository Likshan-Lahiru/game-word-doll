import React, { useEffect } from 'react'
// src/pages/HomePage.tsx
import { StatusBar } from '../components/StatusBar'
import { WinningStatus } from '../components/WinningStatus'
import { BottomNavigation } from '../components/BottomNavigation'
import { PlayBookButton } from '../components/PlayBookButton'
import { LoginButton } from '../components/LoginButton'
import { OnlineCountDisplay } from '../components/OnlineCountDisplay'
import { useGlobalContext } from '../context/GlobalContext'
import { GameCardGrid } from '../components/GameCards/GameCardGrid'
import { GameDescription } from '../components/GameDescription'
import { useSearchParams } from 'react-router-dom'
export function HomePage({ isMobile }: { isMobile: boolean }) {
    const { isAuthenticated, setPageType } = useGlobalContext()
    const [searchParams] = useSearchParams()
    useEffect(() => {
        const inviterId = searchParams.get('inviterId')
        const inviterName = searchParams.get('inviterName')
        if (inviterId) {
            sessionStorage.setItem('inviterId', inviterId)
        }
        if (inviterName) {
            sessionStorage.setItem('inviterName', inviterName)
        }
    }, [searchParams])
    useEffect(() => {
        setPageType('')
    }, [])
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white ">
            <StatusBar
                isMobile={isMobile}
                hideOnlineCount={true}
                switchableBalanceSelector={true}
            />
            {!isMobile && !isAuthenticated && <WinningStatus />}
            <div
                className={`flex-1 flex items-center ${isAuthenticated ? 'pt-1' : 'pt-0'}`}
            >
                <GameCardGrid />
            </div>

            {!isMobile && !isAuthenticated && <LoginButton />}
            {!isMobile && !isAuthenticated && <OnlineCountDisplay />}
            {!isAuthenticated && <GameDescription />}
            <BottomNavigation />
            {!isMobile && <PlayBookButton />}
        </div>
    )
}
