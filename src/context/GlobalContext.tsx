import React, { useState, createContext, useContext } from 'react'
type GlobalContextType = {
    coinBalance: number
    ticketBalance: number
    spinBalance: number
    gemBalance: number
    isAuthenticated: boolean
    betAmount: number
    winAmount: number
    selectedBalanceType: 'coin' | 'ticket'
    setCoinBalance: (balance: number) => void
    setTicketBalance: (balance: number) => void
    setSpinBalance: (balance: number) => void
    setGemBalance: (balance: number) => void
    addCoins: (amount: number) => void
    addSpins: (amount: number) => void
    addGems: (amount: number) => void
    setIsAuthenticated: (value: boolean) => void
    setBetAmount: (amount: number) => void
    setWinAmount: (amount: number) => void
    setSelectedBalanceType: (type: 'coin' | 'ticket') => void
    login: () => void
    logout: () => void
}
const GlobalContext = createContext<GlobalContextType | undefined>(undefined)
export function GlobalProvider({ children }: { children: React.ReactNode }) {
    const [coinBalance, setCoinBalance] = useState(50000)
    const [ticketBalance, setTicketBalance] = useState(15)
    const [spinBalance, setSpinBalance] = useState(0)
    const [gemBalance, setGemBalance] = useState(15.2)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [betAmount, setBetAmount] = useState(1000)
    const [winAmount, setWinAmount] = useState(10000)
    const [selectedBalanceType, setSelectedBalanceType] = useState<
        'coin' | 'ticket'
    >('coin')
    const addCoins = (amount: number) => {
        setCoinBalance((prev) => prev + amount)
    }
    const addSpins = (amount: number) => {
        setSpinBalance((prev) => prev + amount)
    }
    const addGems = (amount: number) => {
        setGemBalance((prev) => prev + amount)
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
                gemBalance,
                isAuthenticated,
                betAmount,
                winAmount,
                selectedBalanceType,
                setCoinBalance,
                setTicketBalance,
                setSpinBalance,
                setGemBalance,
                setIsAuthenticated,
                setBetAmount,
                setWinAmount,
                setSelectedBalanceType,
                addCoins,
                addSpins,
                addGems,
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
