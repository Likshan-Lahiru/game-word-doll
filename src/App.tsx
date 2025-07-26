import React, { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WordollGame } from './pages/WordollGame'
import { GiveawayGame } from './pages/GiveawayGame'
import { GiveawayEntry } from './pages/GiveawayEntry'
import { LockPickrGame } from './pages/LockPickrGame'
import { LoginPage } from './pages/LoginPage'
import { SignupPage } from './pages/SignupPage'
import { UserProfilePage } from './pages/UserProfilePage'
import { StorePage } from './pages/StorePage'
import { RedeemPage } from './pages/RedeemPage'
import { GuidePage } from './pages/GuidePage'
import { GlobalProvider } from './context/GlobalContext'
import { ProtectedRoute } from './components/ProtectedRoute'
import { SpinPage } from './pages/SpinPage'
import { HomePage } from './pages/HomePage'
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
          <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white ">
            <Routes>
              <Route path="/" element={<HomePage isMobile={isMobile} />} />
              <Route path="/wordoll-game" element={<WordollGame />} />
              <Route path="/spin-wordoll-game" element={<WordollGame />} />
              <Route path="/giveaway-game" element={<GiveawayGame />} />
              <Route path="/giveaway-entry" element={<GiveawayEntry />} />
              <Route path="/lock-pickr-game" element={<LockPickrGame />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
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
                      <RedeemPage />
                    </ProtectedRoute>
                  }
              />
              <Route path="/guide" element={<GuidePage />} />
              <Route path="/spin" element={<SpinPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </GlobalProvider>
  )
}
