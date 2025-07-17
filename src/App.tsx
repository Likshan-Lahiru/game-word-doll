import  { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { StatusBar } from './components/StatusBar'
import { WinningStatus } from './components/WinningStatus'
import { GameCardGrid } from './components/GameCards/GameCardGrid'
import { BottomNavigation } from './components/BottomNavigation'
import { PlayBookButton } from './components/PlayBookButton'
import { LoginButton } from './components/LoginButton'
import { WordollGame } from './pages/WordollGame'
import { WordollWin } from './pages/WordollWin'
import { WordollLose } from './pages/WordollLose'
import { GiveawayGame } from './pages/GiveawayGame'
import { GiveawayEntry } from './pages/GiveawayEntry'
import { LockPickrGame } from './pages/LockPickrGame'
import { LockPickrWin } from './pages/LockPickrWin'
import { LockPickrLose } from './pages/LockPickrLose'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { UserProfilePage } from './pages/UserProfilePage'
import { StorePage } from './pages/StorePage'
import { RedeemPage } from './pages/RedeemPage'
import { GuidePage } from './pages/GuidePage'
import { GlobalProvider } from './context/GlobalContext'
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
      <GlobalProvider children={undefined}>
        <BrowserRouter>
          <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white">
            <Routes>
              <Route
                  path="/"
                  element={
                    <>
                      <StatusBar isMobile={isMobile} />
                      {!isMobile && <WinningStatus />}
                      <GameCardGrid />
                      {!isMobile && <LoginButton />}
                      <BottomNavigation />
                      {!isMobile && <PlayBookButton />}
                    </>
                  }
              />
              <Route path="/wordoll-game" element={<WordollGame />} />
              <Route path="/wordoll-win" element={<WordollWin />} />
              <Route path="/wordoll-lose" element={<WordollLose />} />
              <Route path="/giveaway-game" element={<GiveawayGame />} />
              <Route path="/giveaway-entry" element={<GiveawayEntry />} />
              <Route path="/lock-pickr-game" element={<LockPickrGame />} />
              <Route path="/lock-pickr-win" element={<LockPickrWin />} />
              <Route path="/lock-pickr-lose" element={<LockPickrLose />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/profile" element={<UserProfilePage />} />
              <Route path="/store" element={<StorePage />} />
              <Route path="/redeem" element={<RedeemPage />} />
              <Route path="/guide" element={<GuidePage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </GlobalProvider>
  )
}
