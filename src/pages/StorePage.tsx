/*
/!*
import React from 'react'
import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context/GlobalContext'
import { BalanceSelector } from '../components/BalanceSelector'
import { BottomNavigation } from '../components/BottomNavigation'
export function StorePage() {
  const navigate = useNavigate()
  const {addCoins } = useGlobalContext()
  const [activeTab, setActiveTab] = useState('coins')
  const [isMobile, setIsMobile] = useState(false)
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  const packages = [
    {
      id: 1,
      coins: 200000,
      bonus: 0,
      price: 4.99,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/sEuNjxvFCMfX4d66QCon1T/prizez-coins-1_.png', // Stack of coins
    },
    {
      id: 2,
      coins: 200000,
      bonus: 5,
      price: 4.99,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/sEuNjxvFCMfX4d66QCon1T/prizez-coins-1_.png', // Stack of coins
    },
    {
      id: 3,
      coins: 2500000,
      bonus: 15,
      price: 14.99,
      bestValue: true,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/n5UGDYmiJRz3NqoePW9zf3/prizez-coins-3.png', // Bag of coins
    },
    {
      id: 4,
      coins: 30000000,
      bonus: 80,
      price: 79.99,
      image:
          'https://i.ibb.co/TMcsVBBr/4-store.png', // Treasure chest
    },
  ]

  const handleBuy = (packageItem: any) => {
    // In a real app, this would process payment
    // For now, just add the coins to the balance
    addCoins(packageItem.coins)
    alert(`Purchased ${packageItem.coins.toLocaleString()} Gold Coins!`)
  }
  // Mobile view
  if (isMobile) {
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white">
          {/!* Store title *!/}
          <h1 className="text-2xl font-bold text-center my-4">Store</h1>
          {/!* Tabs *!/}
          <div className="flex px-4 mb-6">
            <button
                className={`flex-1 py-4 px-4 rounded-2xl flex items-center justify-center space-x-2 ${activeTab === 'coins' ? 'bg-blue-500' : 'bg-[#1F2937]'}`}
                onClick={() => setActiveTab('coins')}
            >
              <span className="font-bold">Get Gold Coins</span>
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/tseH8zwDf6PgMMJLoCm3uz/gold-store.png"
                  alt="Coins"
                  className="w-8 h-8"
              />
            </button>
            <div className="w-4"></div>
            <button
                className={`flex-1 py-4 px-4 rounded-2xl flex items-center justify-center space-x-2 ${activeTab === 'redeem' ? 'bg-blue-500' : 'bg-[#1F2937]'}`}
                onClick={() => {
                  setActiveTab('redeem')
                  navigate('/redeem')
                }}
            >
              <span className="font-bold">Redeem</span>
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/5ARgETPVNopfYddtEfN6Yn/redeem.png"
                  alt="Redeem"
                  className="w-8 h-8"
              />
            </button>
          </div>
          {/!* Package cards - vertical stack *!/}
          <div className="px-4 space-y-4 mb-4">
            {packages.map((pkg) => (
                <div
                    key={pkg.id}
                    className="relative bg-white rounded-2xl p-4 flex items-center"
                >
                  {/!* Coin image *!/}
                  <div className="w-20 h-20 flex items-center justify-center">
                    <img
                        src={pkg.image}
                        alt="Coins"
                        className="w-16 h-16 object-contain"
                    />
                  </div>
                  {/!* Package details *!/}
                  <div className="flex-1 text-black mx-2">
                    <p className=" text-xs font-medium">
                      GC {pkg.coins.toLocaleString()}
                    </p>
                    {pkg.bonus > 0 && (
                        <div className="flex flex-col">
                          <span className="text-center text-xs font-medium">+</span>
                          <div className="flex items-center">
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/mmaJ4fycdupGhSyQnVgCcX/Entries.png"
                                alt="Ticket"
                                className="w-5 h-5 mr-1"
                            />
                            <span className=" text-xs font-medium">
                        × {pkg.bonus} free
                      </span>
                          </div>
                        </div>
                    )}
                  </div>
                  {/!* Price and buy button *!/}
                  <div className="flex flex-col items-end">
                    <p className="font-bold text-black mb-2">${pkg.price}</p>
                    <button
                        onClick={() => handleBuy(pkg)}
                        className="bg-[#56CA5A] hover:bg-[#4BB850] text-white py-1.5 px-12 rounded-full font-bold"
                    >
                      BUY
                    </button>
                  </div>
                </div>
            ))}
          </div>
          {/!* Footer text *!/}
          <div className="text-center px-4 mb-20">
            <p className="text-gray-400 text-sm">
              free to play. NO PURCHASE NECESSARY.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Your credit card will be securely billed one time without any
              recurring charges or obligations.
            </p>
          </div>
          {/!* Bottom navigation *!/}
          <BottomNavigation />
        </div>
    )
  }
  // Desktop view
  return (
      <div className="flex flex-col w-full  bg-[#1F2937] text-white">
        {/!* Top balance bar *!/}
        <div className="p-4">
          <BalanceSelector
              onSelect={(type) => console.log(`Selected: ${type}`)}
          />
        </div>
        {/!* Main content *!/}
        <div className="flex flex-1 px-20 pb-8">
          {/!* Left sidebar *!/}
          <div className="w-72 bg-[#374151] rounded-xl p-6 mr-8">
            <h1 className="text-2xl font-bold mb-8">Store</h1>
            <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-5 rounded-xl mb-4 flex items-center"
                onClick={() => {}}
            >
            <span className="flex-1 text-left ml-2 font-medium">
              Get Gold Coins
            </span>
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/tseH8zwDf6PgMMJLoCm3uz/gold-store.png"
                    alt="Coins"
                    className="w-10 h-10"
                />
              </div>
            </button>
            <button
                className="w-full bg-[#1F2937] hover:bg-gray-700 text-white py-4 px-5 rounded-xl flex items-center"
                onClick={() => navigate('/redeem')}
            >
              <span className="flex-1 text-left ml-2 font-medium">Redeem</span>
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/5ARgETPVNopfYddtEfN6Yn/redeem.png"
                    alt="Redeem"
                    className="w-10 h-10"
                />
              </div>
            </button>
          </div>
          {/!* Right content area *!/}
          <div className="flex-1 bg-[#374151] rounded-xl p-6">
            <h2 className="text-xl mb-6">GC Package</h2>
            {/!* Package cards - updated to match the image design *!/}
            <div className="flex justify-center flex-wrap gap-4 mb-8">
              {packages.map((pkg) => (
                  <div key={pkg.id} className="relative w-[250px]">
                    {pkg.bestValue && (
                        <div
                            className="absolute -top-9 left-0 right-0 py-2 text-center font-bold text-white text-xl rounded-t-xl z-10"
                            style={{
                              background: 'linear-gradient(90deg, #A7F432, #50C878)',
                            }}
                        >
                          Best Value
                        </div>
                    )}
                    <div
                        className={`rounded-xl overflow-hidden flex flex-col ${pkg.bestValue ? 'pt-0 border-2 border-[#8CDF4F]' : ''}`}
                        style={{
                          height: '450px',
                          background: 'white',
                        }}
                    >
                      {/!* Coin image *!/}
                      <div className="flex justify-center items-center pt-10 pb-6">
                        <img
                            src={pkg.image}
                            alt="Coins"
                            className="w-24 h-24 object-contain"
                        />
                      </div>
                      {/!* Package content - aligned consistently *!/}
                      <div className="flex-1 flex flex-col text-center px-4">
                        {/!* GC amount *!/}
                        <p className="font-bold text-xl text-black mb-2">
                          GC {pkg.coins.toLocaleString()}
                        </p>
                        {/!* Bonus items *!/}
                        <div className="h-14 flex flex-col items-center justify-center">
                          {pkg.bonus > 0 && (
                              <>
                                <p className="text-black">+</p>
                                <div className="flex items-center justify-center mt-1">
                                  <img
                                      src="https://uploadthingy.s3.us-west-1.amazonaws.com/mmaJ4fycdupGhSyQnVgCcX/Entries.png"
                                      alt="Ticket"
                                      className="w-5 h-5 mr-1"
                                  />
                                  <span className="text-black font-bold">
                              × {pkg.bonus} free
                            </span>
                                </div>
                              </>
                          )}
                        </div>
                        {/!* Price *!/}
                        <p className="font-bold text-xl text-black my-4">
                          ${pkg.price}
                        </p>
                        {/!* Buy button - always at the same position *!/}
                        <div className="mt-auto mb-8">
                          <button
                              onClick={() => handleBuy(pkg)}
                              className="w-full bg-[#56CA5A] hover:bg-[#4BB850] text-white py-3 rounded-full font-bold"
                          >
                            BUY
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
            {/!* Footer text *!/}
            <div className="text-center mt-8 pt-16">
              <p className="text-gray-400">
                Free to play. NO PURCHASE NECESSARY.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Your credit card will be securely billed one time without any
                recurring charges or obligations.
              </p>
            </div>
          </div>
        </div>
        {/!* Bottom navigation *!/}
        <BottomNavigation />
      </div>
  )
}
*!/
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context/GlobalContext'
import { BalanceSelector } from '../components/BalanceSelector'
import { BottomNavigation } from '../components/BottomNavigation'
export function StorePage() {
  const navigate = useNavigate()
  const { addCoins } = useGlobalContext()
  const [activeTab, setActiveTab] = useState('coins')
  const [isMobile, setIsMobile] = useState(false)
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  const packages = [
    {
      id: 1,
      coins: 200000,
      bonus: 0,
      price: 4.99,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/sEuNjxvFCMfX4d66QCon1T/prizez-coins-1_.png', // Stack of coins
    },
    {
      id: 2,
      coins: 200000,
      bonus: 5,
      price: 4.99,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/sEuNjxvFCMfX4d66QCon1T/prizez-coins-1_.png', // Stack of coins
    },
    {
      id: 3,
      coins: 2500000,
      bonus: 15,
      price: 14.99,
      bestValue: true,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/n5UGDYmiJRz3NqoePW9zf3/prizez-coins-3.png', // Bag of coins
    },
    {
      id: 4,
      coins: 30000000,
      bonus: 80,
      price: 79.99,
      image: 'https://i.ibb.co/TMcsVBBr/4-store.png', // Treasure chest
    },
  ]
  const handleBuy = (packageItem: any) => {
    // In a real app, this would process payment
    // For now, just add the coins to the balance
    addCoins(packageItem.coins)
    alert(`Purchased ${packageItem.coins.toLocaleString()} Gold Coins!`)
  }
  // Mobile view
  if (isMobile) {
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white">
          {/!* Store title *!/}
          <h1 className="text-2xl font-bold text-center my-4">Store</h1>
          {/!* Tabs *!/}
          <div className="flex px-4 mb-6">
            <button
                className={`flex-1 py-4 px-4 rounded-2xl flex items-center justify-center space-x-2 ${activeTab === 'coins' ? 'bg-blue-500' : 'bg-[#1F2937]'}`}
                onClick={() => setActiveTab('coins')}
            >
              <span className="font-bold">Get Gold Coins</span>
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/tseH8zwDf6PgMMJLoCm3uz/gold-store.png"
                  alt="Coins"
                  className="w-8 h-8"
              />
            </button>
            <div className="w-4"></div>
            <button
                className={`flex-1 py-4 px-4 rounded-2xl flex items-center justify-center space-x-2 ${activeTab === 'redeem' ? 'bg-blue-500' : 'bg-[#1F2937]'}`}
                onClick={() => {
                  setActiveTab('redeem')
                  navigate('/redeem')
                }}
            >
              <span className="font-bold">Redeem</span>
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/5ARgETPVNopfYddtEfN6Yn/redeem.png"
                  alt="Redeem"
                  className="w-8 h-8"
              />
            </button>
          </div>
          {/!* Package cards - vertical stack with min/max width *!/}
          <div className="px-2 space-y-1 mb-4 w-full max-w-md mx-auto">
            {packages.map((pkg) => (
                <div
                    key={pkg.id}
                    className="relative bg-white rounded-2xl p-4 flex items-center min-w-[280px] h-32 max-w-full w-full"
                >
                  {/!* Coin image *!/}
                  <div className="w-20 h-20 flex items-center justify-center">
                    <img
                        src={pkg.image}
                        alt="Coins"
                        className="w-16 h-16 object-contain"
                    />
                  </div>
                  {/!* Package details *!/}
                  <div className="flex-1 text-black mx-2">
                    <p className=" text-xs  font-semibold font-['DM_Sans']">
                      GC {pkg.coins.toLocaleString()}
                    </p>
                    {pkg.bonus > 0 && (
                        <div className="flex flex-col">
                          <span className="text-center text-xs font-semibold font-['DM_Sans']">+</span>
                          <div className="flex items-center">
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/mmaJ4fycdupGhSyQnVgCcX/Entries.png"
                                alt="Ticket"
                                className="w-7 h-7 mr-1"
                            />
                            <span className="font-['DM_Sans'] text-xs font-semibold">
                        × {pkg.bonus} free
                      </span>
                          </div>
                        </div>
                    )}
                  </div>
                  {/!* Price and buy button *!/}
                  <div className="flex flex-col items-end">
                    <p className="font-bold text-black mb-2 font-['DM_Sans'] pr-10">${pkg.price}</p>
                    <button
                        onClick={() => handleBuy(pkg)}
                        className="bg-[#56CA5A] hover:bg-[#4BB850] text-white py-1.5 px-12 rounded-full font-['DM_Sans'] font-bold"
                    >
                      BUY
                    </button>
                  </div>
                </div>
            ))}
          </div>
          {/!* Footer text *!/}
          <div className="text-center px-4 mb-20">
            <p className="text-white text-s font-['DM_Sans']">
              free to play. NO PURCHASE NECESSARY.
            </p>
            <p className="text-white text-xs mt-1 font-['DM_Sans']">
              Your credit card will be securely billed one time without any
              recurring charges or obligations.
            </p>
          </div>
          {/!* Bottom navigation *!/}
          <BottomNavigation />
        </div>
    )
  }
  // Desktop view
  return (
      <div className="flex flex-col w-full  bg-[#1F2937] text-white">
        {/!* Top balance bar *!/}
        <div className="p-4">
          <BalanceSelector
              onSelect={(type) => console.log(`Selected: ${type}`)}
          />
        </div>
        {/!* Main content *!/}
        <div className="flex flex-1 px-20 pb-8">
          {/!* Left sidebar *!/}
          <div className="w-72 bg-[#374151] rounded-xl p-6 mr-8">
            <h1 className="text-2xl font-bold mb-8">Store</h1>
            <button
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-5 rounded-xl mb-4 flex items-center"
                onClick={() => {}}
            >
            <span className="flex-1 text-left ml-2 font-medium">
              Get Gold Coins
            </span>
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/tseH8zwDf6PgMMJLoCm3uz/gold-store.png"
                    alt="Coins"
                    className="w-10 h-10"
                />
              </div>
            </button>
            <button
                className="w-full bg-[#1F2937] hover:bg-gray-700 text-white py-4 px-5 rounded-xl flex items-center"
                onClick={() => navigate('/redeem')}
            >
              <span className="flex-1 text-left ml-2 font-medium">Redeem</span>
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/5ARgETPVNopfYddtEfN6Yn/redeem.png"
                    alt="Redeem"
                    className="w-10 h-10"
                />
              </div>
            </button>
          </div>
          {/!* Right content area *!/}
          <div className="flex-1 bg-[#374151] rounded-xl p-6">
            <h2 className="text font-medium mb-6">GC Package</h2>
            {/!* Package cards - updated to be responsive with min/max width *!/}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {packages.map((pkg) => (
                  <div
                      key={pkg.id}
                      className="relative min-w-[220px] max-w-[250px] w-full mx-auto"
                  >
                    {pkg.bestValue && (
                        <div
                            className="absolute -top-10 h-12 left-0 right-0 py-2 text-center font-bold text-white text-xl rounded-t-2xl z-10"
                            style={{
                              background: 'linear-gradient(90deg, #A7F432, #50C878)',
                            }}
                        >
                          Best Value
                        </div>
                    )}
                    <div
                        className={`rounded-xl overflow-hidden flex flex-col h-[440px] ${pkg.bestValue ? 'pt-0 border-2 border-[#8CDF4F]' : ''}`}
                        style={{
                          background: 'white',
                        }}
                    >
                      {/!* Coin image *!/}
                      <div className="flex justify-center items-center pt-10 pb-6">
                        <img
                            src={pkg.image}
                            alt="Coins"
                            className="w-24 h-24 object-contain"
                        />
                      </div>
                      {/!* Package content - with consistent alignment *!/}
                      <div className="flex-1 flex flex-col text-center px-4">
                        {/!* GC amount *!/}
                        <p className="font-bold text-xl text-black mb-2">
                          GC {pkg.coins.toLocaleString()}
                        </p>
                        {/!* Bonus items *!/}
                        <div className="h-14 flex flex-col items-center justify-center">
                          {
                            pkg.bonus > 0 ? (
                                <>
                                  <p className="text-black">+</p>
                                  <div className="flex items-center justify-center mt-1">
                                    <img
                                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/mmaJ4fycdupGhSyQnVgCcX/Entries.png"
                                        alt="Ticket"
                                        className="w-6 h-6 mr-1"
                                    />
                                    <span className="text-black font-bold">
                                × {pkg.bonus} free
                              </span>
                                  </div>
                                </>
                            ) : (
                                <div className="h-10"></div>
                            ) // Empty space for consistent alignment
                          }
                        </div>
                        {/!* Price *!/}
                        <p className="font-bold text-xl text-black my-4">
                          ${pkg.price}
                        </p>
                        {/!* Buy button - always at the same position *!/}
                        <div className="mt-auto mb-8 px-4">
                          <button
                              onClick={() => handleBuy(pkg)}
                              className="w-full bg-[#56CA5A] hover:bg-[#4BB850] text-white py-3 rounded-full font-bold"
                          >
                            BUY
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
              ))}
            </div>
            {/!* Footer text *!/}
            <div className="text-center mt-8 pt-16">
              <p className="text-white">
                Free to play. NO PURCHASE NECESSARY.
              </p>
              <p className="text-white text-sm mt-2">
                Your credit card will be securely billed one time without any
                recurring charges or obligations.
              </p>
            </div>
          </div>
        </div>
        {/!* Bottom navigation *!/}
        <BottomNavigation />
      </div>
  )
}
*/
import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../context/GlobalContext'
import { BalanceSelector } from '../components/BalanceSelector'
import { BottomNavigation } from '../components/BottomNavigation'
import {RedeemPage} from "./RedeemPage.tsx";

export function StorePage() {
  const { addCoins } = useGlobalContext()
  const [activeTab, setActiveTab] = useState('coins')
  const [activeTabDesktop, setActiveTabDesktop] = useState('coins')
  const [isMobile, setIsMobile] = useState(false)


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const packages = [
    {
      id: 1,
      coins: 200000,
      bonus: 0,
      price: 4.99,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/sEuNjxvFCMfX4d66QCon1T/prizez-coins-1_.png', // Stack of coins
    },
    {
      id: 2,
      coins: 200000,
      bonus: 5,
      price: 4.99,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/sEuNjxvFCMfX4d66QCon1T/prizez-coins-1_.png', // Stack of coins
    },
    {
      id: 3,
      coins: 2500000,
      bonus: 15,
      price: 14.99,
      bestValue: true,
      image:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/n5UGDYmiJRz3NqoePW9zf3/prizez-coins-3.png', // Bag of coins
    },
    {
      id: 4,
      coins: 30000000,
      bonus: 80,
      price: 79.99,
      image: 'https://i.ibb.co/TMcsVBBr/4-store.png', // Treasure chest
    },
  ]

  const handleBuy = (packageItem: any) => {
    // In a real app, this would process payment
    // For now, just add the coins to the balance
    addCoins(packageItem.coins)
    alert(`Purchased ${packageItem.coins.toLocaleString()} Gold Coins!`)
  }

  // Mobile view
  if (isMobile) {
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white">
          {/* Store title */}
          <h1 className="text-2xl font-bold text-center my-4">Store</h1>

          {/* Tabs */}
          <div className="flex px-4 mb-6">
            <button
                className={`flex-1 py-4 px-4 rounded-2xl flex items-center justify-center space-x-2 ${activeTab === 'coins' ? 'bg-blue-500' : 'bg-[#1F2937]'}`}
                onClick={() => setActiveTab('coins')}
            >
              <span className="font-bold text-sm">Get Gold Coins</span>
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/tseH8zwDf6PgMMJLoCm3uz/gold-store.png"
                  alt="Coins"
                  className="w-8 h-8"
              />
            </button>
            <div className="w-4"></div>
            <button
                className={`flex-1 py-4 px-4 rounded-2xl flex items-center justify-center space-x-2 ${activeTab === 'redeem' ? 'bg-blue-500' : 'bg-[#1F2937]'}`}
                onClick={() => {
                  setActiveTab('redeem')
                }}
            >
              <span className="font-bold">Redeem</span>
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/5ARgETPVNopfYddtEfN6Yn/redeem.png"
                  alt="Redeem"
                  className="w-8 h-8"
              />
            </button>
          </div>

          {activeTab === 'coins' ?
              <>
                {/* Package cards - vertical stack with min/max width */}
                <div className=" px-2 space-y-1 mb-4 w-full max-w-md mx-auto">
                  {packages.map((pkg, index) => (
                      <div className={"relative"}>
                        { index === 2 && (
                            <div className={"w-full h-16 rounded-2xl absolute top-0"}
                                 style={{
                                   background: 'linear-gradient(90deg, #A7F432, #50C878)',
                                 }}
                            >
                              <p className={"text-center font-semibold pt-[2px]"}>Best Value</p>
                            </div>
                        )}
                        <div
                            key={pkg.id}
                            className={`${pkg.bestValue ? 'top-7 mb-8 gradient-overlay pt-0 border-b-2 border-l-2 border-r-2 border-[#8CDF4F]' : ''} relative bg-white rounded-2xl p-4 flex items-center min-w-[280px] h-32 max-w-full w-full`}
                        >
                          {/* Coin image */}
                          <div className="w-20 h-20 flex items-center justify-center">
                            <img
                                src={pkg.image}
                                alt="Coins"
                                className="w-16 h-16 object-contain"
                            />
                          </div>

                          {/* Package details */}
                          <div className="flex-1 text-black mx-2">
                            <p className=" text-xs  font-semibold font-['DM_Sans']">
                              GC {pkg.coins.toLocaleString()}
                            </p>
                            {pkg.bonus > 0 && (
                                <div className="flex flex-col">
                                  <span className="text-center mr-10 text-xs font-semibold font-['DM_Sans']">+</span>
                                  <div className="flex items-center">
                                    <img
                                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/mmaJ4fycdupGhSyQnVgCcX/Entries.png"
                                        alt="Ticket"
                                        className="w-7 h-7 mr-1"
                                    />
                                    <span className="font-['DM_Sans'] text-xs font-semibold">
                          × {pkg.bonus} free
                        </span>
                                  </div>
                                </div>
                            )}
                          </div>

                          {/* Price and buy button */}
                          <div className="flex flex-col items-end">
                            <p className="font-bold text-black mb-2 font-['DM_Sans'] pr-10">${pkg.price}</p>
                            <button
                                onClick={() => handleBuy(pkg)}
                                className="bg-[#56CA5A] hover:bg-[#4BB850] text-white py-1.5 px-12 rounded-full font-['DM_Sans'] font-bold"
                            >
                              BUY
                            </button>
                          </div>
                        </div>
                      </div>
                  ))}
                </div>

                {/*Footer text */}
                <div className="text-center px-4 mb-20">
                  <p className="text-white text-s font-['DM_Sans']">
                    free to play. NO PURCHASE NECESSARY.
                  </p>
                  <p className="text-white text-xs mt-1 font-['DM_Sans']">
                    Your credit card will be securely billed one time without any
                    recurring charges or obligations.
                  </p>
                </div>
              </>
              :
              <>
                <RedeemPage/>
              </>
          }

          {/* Bottom navigation */}
          <BottomNavigation />
        </div>
    )
  }

  // Desktop view
  return (
      <div className={`flex flex-col w-[98.8vw] bg-[#1F2937] text-white mb-10 `}>

        {/* Top balance bar */}
        <div className="p-4">
          {activeTabDesktop === 'coins' && (
              <BalanceSelector
                  onSelect={(type) => console.log(`Selected: ${type}`)}
              />
          )}
        </div>

        {/* Main content */}
        <div className="flex flex-1 pl-16 pr-5 pb-8">

          {/* Left sidebar */}
          <div className={`${activeTabDesktop === 'redeem' ? 'mt-16 w-[468px]' : 'w-72'} bg-[#374151] rounded-xl p-6 mr-4`}>
            <h1 className="text-2xl font-bold mb-8">Store</h1>
            <button
                className={`${activeTabDesktop === 'coins' ? 'bg-blue-500 hover:bg-blue-600' : ' bg-[#1F2937] hover:bg-[#0A0E1A]'} w-full text-white py-4 px-5 rounded-xl mb-4 flex items-center`}
                onClick={() => {
                  setActiveTabDesktop('coins')
                }}
            >
            <span className="flex-1 text-left ml-2 font-medium">
              Get Gold Coins
            </span>
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/tseH8zwDf6PgMMJLoCm3uz/gold-store.png"
                    alt="Coins"
                    className="w-10 h-10"
                />
              </div>
            </button>

            <button
                className={`${activeTabDesktop === 'redeem' ? 'bg-blue-500 hover:bg-blue-600' : ' bg-[#1F2937] hover:bg-[#0A0E1A] '} w-full text-white py-4 px-5 rounded-xl flex items-center`}
                onClick={() => {
                  setActiveTabDesktop('redeem')
                }}
            >
              <span className="flex-1 text-left ml-2 font-medium">Redeem</span>
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/5ARgETPVNopfYddtEfN6Yn/redeem.png"
                    alt="Redeem"
                    className="w-10 h-10"
                />
              </div>
            </button>
          </div>

          {activeTabDesktop === 'coins' ?

              // Coins Section
              <>
                {/* Right content area */}
                <div className={`flex-1 bg-[#374151] rounded-xl p-6 `}>
                  <h2 className="text font-medium mb-6">GC Package</h2>

                  {/* Package cards - updated to be responsive with min/max width */}
                  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-4 mb-8`}>
                    {packages.map((pkg) => (
                        <div
                            key={pkg.id}
                            className="relative min-w-[122px] max-w-[300px] w-full mx-auto "
                        >
                          {pkg.bestValue && (
                              <div
                                  className="absolute -top-12 h-16 left-0 right-0 py-2 text-center font-bold text-white text-xl rounded-t-2xl"
                                  style={{
                                    background: 'linear-gradient(90deg, #A7F432, #50C878)',
                                  }}
                              >
                                Best Value
                              </div>
                          )}

                          <div
                              className={`relative rounded-xl overflow-hidden flex flex-col h-[440px] bg-white ${
                                  pkg.bestValue
                                      ? 'gradient-overlay pt-0 border-b-2 border-l-2 border-r-2 border-[#8CDF4F]'
                                      : ''
                              }`}
                          >
                            {/* Coin image */}
                            <div className="flex justify-center items-center pt-10 pb-6">
                              <img
                                  src={pkg.image}
                                  alt="Coins"
                                  className="w-24 h-24 object-contain"
                              />
                            </div>

                            {/* Package content - with consistent alignment */}
                            <div className="flex-1 flex flex-col text-center px-4">
                              {/* GC amount */}
                              <p className="font-bold text-xl text-black mb-2">
                                GC {pkg.coins.toLocaleString()}
                              </p>

                              {/* Bonus items */}
                              <div className="h-14 flex flex-col items-center justify-center">
                                {
                                  pkg.bonus > 0 ? (
                                      <>
                                        <p className="text-black">+</p>
                                        <div className="flex items-center justify-center mt-1">
                                          <img
                                              src="https://uploadthingy.s3.us-west-1.amazonaws.com/mmaJ4fycdupGhSyQnVgCcX/Entries.png"
                                              alt="Ticket"
                                              className="w-6 h-6 mr-1"
                                          />
                                          <span className="text-black font-bold">
                                            × {pkg.bonus} free
                                          </span>
                                        </div>
                                      </>
                                  ) : (
                                      <div className="h-10"></div>
                                  ) // Empty space for consistent alignment
                                }
                              </div>

                              {/* Price */}
                              <p className="font-bold text-xl text-black my-4">
                                ${pkg.price}
                              </p>

                              {/* Buy button - always at the same position */}
                              <div className="mt-auto mb-8 px-4">
                                <button
                                    onClick={() => handleBuy(pkg)}
                                    className="w-full bg-[#56CA5A] hover:bg-[#4BB850] text-white py-3 rounded-full font-bold"
                                >
                                  BUY
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>

                  {/* Footer text */}
                  <div className="text-center mt-8 pt-16">
                    <p className="text-white">
                      Free to play. NO PURCHASE NECESSARY.
                    </p>
                    <p className="text-white text-sm mt-2">
                      Your credit card will be securely billed one time without any
                      recurring charges or obligations.
                    </p>
                  </div>
                </div>
              </>
              :

              // Redeem Section
              <div className={`${activeTabDesktop === 'redeem' ? 'mt-16' : ''}`}>
                <RedeemPage/>
              </div>
          }

          {/* Diamonds And Tickets */}
          {activeTabDesktop === 'redeem' &&
              <div className={"flex-col justify-end ml-4"}>

                {/* Diamonds */}
                <div className="w-32 h-10 bg-[#111827] rounded-full flex items-center px-4 mb-2">
                  {/*outline outline-1 outline-[#374151]*/}
                  <div className="w-8 h-4 flex items-center justify-center">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                        alt="diamonds"
                        className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="ml-1">107.25</span>
                </div>

                {/* Tickets */}
                <div className="w-32 h-10 bg-[#111827] rounded-full flex items-center px-4">
                  {/*outline outline-1 outline-[#374151]*/}
                  <div className="w-8 h-18 flex items-center justify-center">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/uwPYNNRiavmZZ285SkzD5Z/diaomnd.png"
                        alt="Diamond"
                        className="w-full h-full object-contain"
                    />
                  </div>
                  <span className="ml-1">0</span>
                </div>
              </div>
          }
        </div>

        {/* Bottom navigation */}
        <BottomNavigation />
      </div>
  )
}
