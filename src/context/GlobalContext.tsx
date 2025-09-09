import React, { useEffect, useState, createContext, useContext } from 'react'
import { getAuthToken, removeAuthToken } from '../services/auth.service'
import { fetchUserBalance, fetchGoldCoinFlipCount } from '../services/api'
type GlobalContextType = {
    coinBalance: number
    ticketBalance: number
    voucherBalance: number
    temporaryVoucherBalance: number
    temporaryTicketBalance: number
    temporaryCoinBalance: number
    spinBalance: number
    goldCoinFlipCount: number
    gemBalance: number
    isAuthenticated: boolean
    betAmount: number
    winAmount: number
    selectedBalanceType: 'coin' | 'ticket'
    setCoinBalance: (balance: number) => void
    setTicketBalance: (balance: number) => void
    setVoucherBalance: (balance: number) => void
    setTemporaryVoucherBalance: (balance: number) => void
    setTemporaryTicketBalance: (balance: number) => void
    setTemporaryCoinBalance: (balance: number) => void
    setSpinBalance: (balance: number) => void
    setGoldCoinFlipCount: (count: number) => void
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
    limitPlay: number
    setLimitPlay: React.Dispatch<React.SetStateAction<number>>
    updateUserBalance: () => Promise<void>
    updateGoldCoinFlipCount: () => Promise<void>
    setPageType: (type: string) => void
}
const GlobalContext = createContext<GlobalContextType | undefined>(undefined)
export function GlobalProvider({ children }: { children: React.ReactNode }) {
    const [coinBalance, setCoinBalance] = useState(50000)
    const [ticketBalance, setTicketBalance] = useState(0)
    const [voucherBalance, setVoucherBalance] = useState(0)
    const [temporaryVoucherBalance, setTemporaryVoucherBalance] = useState(0)
    const [temporaryTicketBalance, setTemporaryTicketBalance] = useState(0)
    const [temporaryCoinBalance, setTemporaryCoinBalance] = useState(0)
    const [spinBalance, setSpinBalance] = useState(0)
    const [goldCoinFlipCount, setGoldCoinFlipCount] = useState(0)
    const [gemBalance, setGemBalance] = useState(0)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [betAmount, setBetAmount] = useState(1000)
    const [winAmount, setWinAmount] = useState(10000)
    const [limitPlay, setLimitPlay] = useState<number>(3)
    const [selectedBalanceType, setSelectedBalanceType] = useState<
        'coin' | 'ticket'
    >('coin')
    const [pageType, setPageType] = useState('')
    // Function to update gold coin flip count from API
    const updateGoldCoinFlipCount = async () => {
        if (isAuthenticated) {
            try {
                const userId = localStorage.getItem('userId')
                if (userId) {
                    const { goldCoinFlipCount: count } =
                        await fetchGoldCoinFlipCount(userId)
                    if (count !== undefined) {
                        setGoldCoinFlipCount(count || 0)
                    }
                }
            } catch (error) {
                console.error('Failed to update gold coin flip count:', error)
            }
        }
    }
    // Function to update user balance from API
    const updateUserBalance = async () => {
        if (isAuthenticated) {
            try {
                const userId = localStorage.getItem('userId')
                if (userId) {
                    const balanceData = await fetchUserBalance(userId)
                    if (balanceData) {
                        setCoinBalance(balanceData.goldCoins || 0)
                        setTicketBalance(balanceData.entries || 0)
                        setVoucherBalance(balanceData.vouchers || 0)
                        setGemBalance(balanceData.gems || 0)
                    }
                }
            } catch (error) {
                console.error('Failed to update user balance:', error)
            }
        }
    }
    // Check for existing token on app initialization
    useEffect(() => {
        const token = getAuthToken()
        if (token) {
            setIsAuthenticated(true)
            // Fetch user balance when authenticated
            updateUserBalance()
        }
    }, [])
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
        // Fetch user balance when user logs in
        updateUserBalance()
    }
    const logout = () => {
        removeAuthToken()
        setIsAuthenticated(false)
    }
    return (
        <GlobalContext.Provider
            value={{
                limitPlay,
                coinBalance,
                ticketBalance,
                voucherBalance,
                temporaryVoucherBalance,
                temporaryTicketBalance,
                temporaryCoinBalance,
                spinBalance,
                goldCoinFlipCount,
                gemBalance,
                isAuthenticated,
                betAmount,
                winAmount,
                selectedBalanceType,
                setLimitPlay,
                setCoinBalance,
                setTicketBalance,
                setVoucherBalance,
                setTemporaryVoucherBalance,
                setTemporaryTicketBalance,
                setTemporaryCoinBalance,
                setSpinBalance,
                setGoldCoinFlipCount,
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
                updateUserBalance,
                updateGoldCoinFlipCount,
                setPageType,
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
