import React, { useEffect } from 'react'
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
        if (inviterId) sessionStorage.setItem('inviterId', inviterId)
        if (inviterName) sessionStorage.setItem('inviterName', inviterName)
    }, [searchParams])

    useEffect(() => {
        setPageType('')
    }, [])

    // --------- MOBILE VIEW (desktop unchanged) ----------
    if (isMobile) {
        return (
            <div className="fixed inset-0 flex flex-col bg-[#1F2937] text-white">
                {/* Top bar pinned */}
                <div className="sticky top-0 z-20 bg-[#1F2937]">
                    <StatusBar
                        isMobile
                        hideOnlineCount={true}
                        switchableBalanceSelector={true}
                    />
                </div>

                {/* Scrollable content area */}
                <div className="flex-1 overflow-y-auto overscroll-contain px-3 pt-2
                      pb-[calc(env(safe-area-inset-bottom)+72px)]">
                    <GameCardGrid />
                    {!isAuthenticated && (
                        <div className="mt-3">
                            <GameDescription />
                        </div>
                    )}
                </div>

                {/* Bottom nav pinned */}
                <div className="shrink-0 sticky bottom-0 z-30 bg-[#1F2937] pb-[env(safe-area-inset-bottom)]">
                    <BottomNavigation />
                </div>
            </div>
        )
    }


    // --------- DESKTOP VIEW (unchanged from your code) ----------
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white ">
            <StatusBar
                isMobile={isMobile}
                hideOnlineCount={true}
                switchableBalanceSelector={true}
            />

            {!isMobile && !isAuthenticated && <WinningStatus />}

            <div className={`flex-1 flex items-center ${isAuthenticated ? 'pt-1' : 'pt-0'}`}>
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
