import React, { useState, createContext, useContext } from 'react'
type GlobalContextType = {
  coinBalance: number
  ticketBalance: number
  spinBalance: number
  setCoinBalance: (balance: number) => void
  setTicketBalance: (balance: number) => void
  setSpinBalance: (balance: number) => void
  addCoins: (amount: number) => void
  addSpins: (amount: number) => void
}
const GlobalContext = createContext<GlobalContextType | undefined>(undefined)
export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [coinBalance, setCoinBalance] = useState(50000)
  const [ticketBalance, setTicketBalance] = useState(15)
  const [spinBalance, setSpinBalance] = useState(0)
  const addCoins = (amount: number) => {
    setCoinBalance((prev) => prev + amount)
  }
  const addSpins = (amount: number) => {
    setSpinBalance((prev) => prev + amount)
  }
  return (
      <GlobalContext.Provider
          value={{
            coinBalance,
            ticketBalance,
            spinBalance,
            setCoinBalance,
            setTicketBalance,
            setSpinBalance,
            addCoins,
            addSpins,
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
