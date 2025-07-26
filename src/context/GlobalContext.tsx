import React, { useState, createContext, useContext } from 'react'
type GlobalContextType = {
    coinBalance: number
    ticketBalance: number
    spinBalance: number
    isAuthenticated: boolean
    betAmount: number
    winAmount: number
    setCoinBalance: (balance: number) => void
    setTicketBalance: (balance: number) => void
    setSpinBalance: (balance: number) => void
    addCoins: (amount: number) => void
    addSpins: (amount: number) => void
    setIsAuthenticated: (value: boolean) => void
    setBetAmount: (amount: number) => void
    setWinAmount: (amount: number) => void
    login: () => void
    logout: () => void
}
const GlobalContext = createContext<GlobalContextType | undefined>(undefined)
export function GlobalProvider({ children }: { children: React.ReactNode }) {
    const [coinBalance, setCoinBalance] = useState(50000)
    const [ticketBalance, setTicketBalance] = useState(15)
    const [spinBalance, setSpinBalance] = useState(0)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [betAmount, setBetAmount] = useState(1000)
    const [winAmount, setWinAmount] = useState(10000)
    const addCoins = (amount: number) => {
        setCoinBalance((prev) => prev + amount)
    }
    const addSpins = (amount: number) => {
        setSpinBalance((prev) => prev + amount)
    }
    const login = () => {
        setIsAuthenticated(true)
    }
    const logout = () => {
        setIsAuthenticated(false)
    }
    return (
        <GlobalContext.Provider
            value={{
                coinBalance,
                ticketBalance,
                spinBalance,
                isAuthenticated,
                betAmount,
                winAmount,
                setCoinBalance,
                setTicketBalance,
                setSpinBalance,
                setIsAuthenticated,
                setBetAmount,
                setWinAmount,
                addCoins,
                addSpins,
                login,
                logout,
            }}
        >
            {children}
        </GlobalContext.Provider>
    )
}
export function useGlobalContext() {
    const context = useContext(GlobalContext)
    if (context === undefined) {
        throw new Error('useGlobalContext must be used within a GlobalProvider')
    }
    return context
}
