import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WordollGame } from './pages/WordollGame'
import { GiveawayGame } from './pages/GiveawayGame'
import { GiveawayEntry } from './pages/GiveawayEntry'
import { GiveawayWordollGame } from './pages/GiveawayWordollGame'
import { GiveawayLockPickrGame } from './pages/GiveawayLockPickrGame'
import { GiveawayGoldWordollGame } from './pages/GiveawayGoldWordollGame'
import { GiveawayGoldLockPickrGame } from './pages/GiveawayGoldLockPickrGame'
import { LockPickrGame } from './pages/LockPickrGame'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { UserProfilePage } from './pages/UserProfilePage'
import { StorePage } from './pages/StorePage'
import { ConvertGem } from './pages/ConvertGem.tsx'
import { GuidePage } from './pages/GuidePage'
import { GlobalProvider } from './context/GlobalContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { FlipPage } from './pages/FlipPage'
import { HomePage } from './pages/HomePage'
import { BetSelectorPage } from './pages/BetSelectorPage'
import { GemGameModePage } from './pages/GemGameModePage'
import { GemWordollGame } from './pages/GemWordollGame'
import { GemLockPickrGame } from './pages/GemLockPickrGame'
import { GoldGiveawayGame } from './pages/GoldGiveawayGame'
import { GoldFlipPage } from './pages/GoldFlipPage'
import { SplashScreen } from './components/SplashScreen'

export function App() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768)
        }
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])
    return (
        <GlobalProvider>
            <BrowserRouter>
                <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white ">
                    <Routes>
                        <Route path="/" element={<HomePage isMobile={isMobile} />} />
                        <Route path="/wordoll" element={<WordollGame />} />
                        <Route path="/spin-wordoll-game" element={<WordollGame />} />
                        <Route path="/giveaway-game" element={<GiveawayGame />} />
                        <Route path="/giveaway-entry" element={<GiveawayEntry />} />
                        <Route
                            path="/giveaway-wordoll-game"
                            element={<GiveawayWordollGame />}
                        />
                        <Route
                            path="/giveaway-lockpickr-game"
                            element={<GiveawayLockPickrGame />}
                        />
                        <Route
                            path="/giveaway-gold-wordoll-game"
                            element={<GiveawayGoldWordollGame />}
                        />
                        <Route
                            path="/giveaway-gold-lockpickr-game"
                            element={<GiveawayGoldLockPickrGame />}
                        />
                        <Route path="/lockpickr" element={<LockPickrGame />} />
                        <Route path="/bet-selector" element={<BetSelectorPage />} />
                        <Route path="/gem-game-mode" element={<GemGameModePage />} />
                        <Route path="/gem-wordoll-game" element={<GemWordollGame />} />
                        <Route path="/gem-lockpickr-game" element={<GemLockPickrGame />} />
                        <Route path="/gold-giveaway-game" element={<GoldGiveawayGame />} />
                        <Route path="/gold-spin" element={<GoldFlipPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/splash-screen" element={<SplashScreen />} />

                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <UserProfilePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/store"
                            element={
                                <ProtectedRoute>
                                    <StorePage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/redeem"
                            element={
                                <ProtectedRoute>
                                    <ConvertGem />
                                </ProtectedRoute>
                            }
                        />
                        <Route path="/guide" element={<GuidePage />} />
                        <Route path="/cookyflip" element={<FlipPage />} />
                    </Routes>
                </div>
            </BrowserRouter>
        </GlobalProvider>
    )
}
