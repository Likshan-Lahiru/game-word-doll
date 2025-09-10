import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context/GlobalContext'
import { BalanceSelector } from '../components/BalanceSelector'
import { BottomNavigation } from '../components/BottomNavigation'
import { ConvertGem } from './ConvertGem.tsx'
import { fetchPackageOffers, createStripeCheckout } from '../services/api'
import PackageInclusions from "../components/StorePage/PackageInclusions.tsx";
import {IMAGES} from "../constance/imagesLink.ts";
import CookyShop from "./CookyShop.tsx";
import ConvertToEntries from "./ConvertToEntries.tsx";
interface PackageOffer {
  id: string
  title: string
  goldCoins: number
  entries: number
  priceUsd: number
  imageLink: string
  bestValue: boolean
}

const pkgInclusions = [
  {
    id: 1,
    name: "Starter",
    instruction1: "3 days access to the cooky shop.",
    instruction2: "VIP access to Cooky club. (coming soon)",
    instruction3: "200,000 gold coins.",
  },
  {
    id: 2,
    name: "Silver",
    instruction1: "7 days access to the cooky shop.",
    instruction2: "VIP access to Cooky club. (coming soon).",
    instruction3: "200,000 gold coins.",
    instruction4: "5 free entries.",
  },
  {
    id: 3,
    name: "Gold",
    instruction1: "2 weeks access to the cooky shop.",
    instruction2: "VIP access to Cooky club. (coming soon).",
    instruction3: "2,500,000 gold coins.",
    instruction4: "15 free entries.",
  },
  {
    id: 4,
    name: "Diamond",
    instruction1: "1 month access to the cooky shop.",
    instruction2: "VIP access to Cooky club. (coming soon).",
    instruction3: "15,000,000 gold coins.",
    instruction4: "80 free entries.",
  }
]

const logos = [
  {
    id: 1,
    image: IMAGES.originalLogo,
    title: "#1 Original Cooky",
  },
  {
    id: 2,
    image: IMAGES.logo2,
    title: "#2 Jelly Bean",
  },
  {
    id: 3,
    image: IMAGES.logo3,
    title: "#3 On the Walls",
  },
  {
    id: 4,
    image: IMAGES.logo4,
    title: "#4 Arcade",
  },
  {
    id: 5,
    image: IMAGES.logo5,
    title: "#5 Dark Side",
  },
  {
    id: 6,
    image: IMAGES.logo6,
    title: "#6 2077",
  },
  {
    id: 7,
    image: IMAGES.logo7,
    title: "#7 Life is Plastic",
  },
  {
    id: 8,
    image: IMAGES.logo8,
    title: "#8 8-bit",
  },
  {
    id: 9,
    image: IMAGES.logo9,
    title: "#9 Red Rage",
  }
]

export function StorePage() {
  const navigate = useNavigate()
  const { addCoins } = useGlobalContext()
  const [activeTab, setActiveTab] = useState('coins')
  const [activeTabDesktop, setActiveTabDesktop] = useState('coins')
  const [isMobile, setIsMobile] = useState(false)
  const { ticketBalance, setTicketBalance } = useGlobalContext()
  const [packages, setPackages] = useState<PackageOffer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [processingPayment, setProcessingPayment] = useState(false)
  const [collapsePkgInclusions, setCollapsePkgInclusions] = useState(false);
  // Fetch package offers from API
  useEffect(() => {
    setActiveTabDesktop("membership")

    const getPackageOffers = async () => {
      try {
        setIsLoading(true)
        const data = await fetchPackageOffers()
        if (Array.isArray(data)) {
          setPackages(data)
        } else {
          setPackages([])
          setError('Failed to load package offers')
        }
      } catch (err) {
        console.error('Error fetching package offers:', err)
        setError('Failed to load package offers')
      } finally {
        setIsLoading(false)
      }
    }
    getPackageOffers()
  }, [])
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  // Fallback to default packages if API fails or is loading
  const defaultPackages = [
    {
      id: '1',
      title: 'pack 1',
      goldCoins: 200000,
      entries: 0,
      priceUsd: 4.99,
      imageLink:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/sEuNjxvFCMfX4d66QCon1T/prizez-coins-1_.png',
      bestValue: false,
    },
    {
      id: '2',
      title: 'pack 2',
      goldCoins: 200000,
      entries: 5,
      priceUsd: 4.99,
      imageLink:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/sEuNjxvFCMfX4d66QCon1T/prizez-coins-1_.png',
      bestValue: true,
    },
    {
      id: '3',
      title: 'pack 3',
      goldCoins: 2500000,
      entries: 15,
      priceUsd: 14.99,
      imageLink:
          'https://uploadthingy.s3.us-west-1.amazonaws.com/n5UGDYmiJRz3NqoePW9zf3/prizez-coins-3.png',
      bestValue: false,
    },
    {
      id: '4',
      title: 'pack 4',
      goldCoins: 30000000,
      entries: 80,
      priceUsd: 79.99,
      imageLink: 'https://i.ibb.co/TMcsVBBr/4-store.png',
      bestValue: false,
    },
  ]
  // Use API packages if available, otherwise use defaults
  const displayPackages = packages.length > 0 ? packages : defaultPackages

  const handleBuy = async (packageItem: PackageOffer) => {
    try {
      setProcessingPayment(true)
      const userId = localStorage.getItem('userId')
      if (!userId) {
        alert('You need to be logged in to make a purchase')
        navigate('/login')
        return
      }
      // Call the Stripe checkout API
      const response = await createStripeCheckout(userId, packageItem.id)
      if (response && response.checkoutUrl) {
        // Redirect to the Stripe checkout page
        window.location.href = response.checkoutUrl
        // Note: After successful payment, Stripe will redirect back to the app's home page
        // This redirect is configured on the server side
      } else {
        throw new Error('Invalid checkout response')
      }
    } catch (error) {
      console.error('Payment error:', error)
      alert('There was an error processing your payment. Please try again.')
    } finally {
      setProcessingPayment(false)
    }
  }
  // For demo purposes only - this would be removed in production
  const handleDemoBuy = (packageItem: PackageOffer) => {
    // This is just for demo/development when not connected to Stripe
    setTicketBalance(ticketBalance + packageItem.entries)
    addCoins(packageItem.goldCoins)
    alert(
        `Purchased ${packageItem.goldCoins.toLocaleString()} Gold Coins and ${packageItem.entries} entries`,
    )
    navigate('/')
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
                  className="w-9 h-9"
              />
            </button>
          </div>
          {activeTab === 'coins' ? (
              <>
                {isLoading ? (
                    <div className="text-center py-4">Loading packages...</div>
                ) : error ? (
                    <div className="text-red-500 text-center py-4">
                      {error}
                    </div> /* Package cards - vertical stack with min/max width */
                ) : (
                    <div className="px-2 space-y-1 mb-4 w-full max-w-md mx-auto">
                      {displayPackages.map((pkg, index) => (
                          <div className="relative" key={pkg.id}>
                            {pkg.bestValue && (
                                <div
                                    className="w-full h-16 rounded-2xl absolute top-0"
                                    style={{
                                      background:
                                          'linear-gradient(90deg, #A7F432, #50C878)',
                                    }}
                                >
                                  <p className="text-center font-semibold pt-[2px]">
                                    Best Value
                                  </p>
                                </div>
                            )}
                            <div
                                className={`${pkg.bestValue ? 'top-7 mb-8 gradient-overlay pt-0 border-b-2 border-l-2 border-r-2 border-[#8CDF4F]' : ''} relative bg-white rounded-2xl p-4 flex items-center min-w-[280px] h-32 max-w-full w-full`}
                            >
                              {/* Coin image */}
                              <div className="w-20 h-20 flex items-center justify-center">
                                <img
                                    src={pkg.imageLink}
                                    alt="Coins"
                                    className="w-16 h-16 object-contain"
                                />
                              </div>
                              {/* Package details */}
                              <div className="flex-1 text-black mx-2">
                                <p className="text-xs font-semibold font-['DM_Sans']">
                                  GC {pkg.goldCoins.toLocaleString()}
                                </p>
                                {pkg.entries > 0 && (
                                    <div className="flex flex-col">
                            <span className="text-center mr-10 text-xs font-semibold font-['DM_Sans']">
                              +
                            </span>
                                      <div className="flex items-center">
                                        <img
                                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/mmaJ4fycdupGhSyQnVgCcX/Entries.png"
                                            alt="Ticket"
                                            className="w-7 h-7 mr-1 bg-[#0CC242] rounded-full p-[2px]"
                                        />
                                        <span className="font-['DM_Sans'] text-xs font-semibold">
                                × {pkg.entries} free
                              </span>
                                      </div>
                                    </div>
                                )}
                              </div>
                              {/* Price and buy button */}
                              <div className="flex flex-col items-end">
                                <p className="font-bold text-black mb-2 font-['DM_Sans'] pr-10">
                                  ${pkg.priceUsd}
                                </p>
                                <button
                                    onClick={() => handleBuy(pkg)}
                                    disabled={processingPayment}
                                    className={`${processingPayment ? 'bg-gray-400' : 'bg-[#56CA5A] hover:bg-[#4BB850]'} text-white py-1.5 px-12 rounded-full font-['DM_Sans'] font-bold`}
                                >
                                  {processingPayment ? 'BUY.' : 'BUY'}
                                </button>
                              </div>
                            </div>
                          </div>
                      ))}
                    </div>
                )}
                {/*Footer text */}
                <div className="text-center px-4 mb-20">
                  <p className="text-white text-xs text-s font-['DM_Sans']">
                    free to play. NO PURCHASE NECESSARY.
                  </p>
                  <p className="text-white text-[8px] mt-1 font-['DM_Sans']">
                    Your credit card will be securely billed one time without any
                    recurring charges or obligations.
                  </p>
                </div>
              </>
          ) : (
              <>
                <ConvertGem />
              </>
          )}
          {/* Bottom navigation */}
          <BottomNavigation />
        </div>
    )
  }
  // Desktop view
  return (
      <div className="flex flex-col w-[98.8vw] bg-[#1F2937] text-white mb-10 mt-5">
        {/* Top balance bar */}
        <div className="p-4">
          {(activeTabDesktop === 'membership' || activeTabDesktop === 'cookyShop') && (
              <BalanceSelector
                  onSelect={(type) => console.log(`Selected: ${type}`)}
              />
          )}
        </div>
        {/* Main content */}
        <div className="flex flex-1 pt-5 pl-16 pr-5 pb-8">

          {/* Left sidebar */}
          <div
              className={`${activeTabDesktop === 'convertGem' || activeTabDesktop === 'convertToEntries' ? 'mt-14' : 'w-72'} ${activeTabDesktop === 'convertGem' && 'w-[467px]'} ${activeTabDesktop === 'convertToEntries' && 'w-[292px]'} bg-[#374151] rounded-xl p-6 mr-4`}
          >
            <h1 className="text-2xl font-bold mb-3">Store</h1>

            {/* MemberShip Tab */}
            <button
                className={`${activeTabDesktop === 'membership' ? 'bg-blue-500 hover:bg-blue-600' : ' bg-[#1F2937] hover:bg-[#0A0E1A]'} w-full text-white py-4 px-5 rounded-xl mb-2 flex items-center`}
                onClick={() => {
                  setActiveTabDesktop('membership')
                }}
            >
            <span className="flex-1 text-left ml-2 font-medium">
              Memberships
            </span>
            </button>

            {/* Cooky Shop Tab */}
            <button
                className={`${activeTabDesktop === 'cookyShop' ? 'bg-blue-500 hover:bg-blue-600' : ' bg-[#1F2937] hover:bg-[#0A0E1A] '} w-full text-white py-4 px-5 rounded-xl mb-2 flex items-center`}
                onClick={() => {
                  setActiveTabDesktop('cookyShop')
                }}
            >
              <span className="flex-1 text-left ml-2 font-medium">Cooky Shop</span>
            </button>

            {/* Convert Gems */}
            <button
                className={`${activeTabDesktop === 'convertGem' ? 'bg-blue-500 hover:bg-blue-600' : ' bg-[#1F2937] hover:bg-[#0A0E1A] '} w-full text-white py-4 px-5 rounded-xl mb-2 flex items-center`}
                onClick={() => {
                  setActiveTabDesktop('convertGem')
                }}
            >
              <span className="flex-1 text-left ml-2 font-medium">Convert Gems</span>
            </button>

            {/* Convert to Entries */}
            <button
                className={`${activeTabDesktop === 'convertToEntries' ? 'bg-blue-500 hover:bg-blue-600' : ' bg-[#1F2937] hover:bg-[#0A0E1A] '} w-full text-white py-4 px-5 rounded-xl mb-2 flex items-center`}
                onClick={() => {
                  setActiveTabDesktop('convertToEntries')
                }}
            >
              <span className="flex-1 text-left ml-2 font-medium">Convert to Entries</span>
            </button>
          </div>
          {activeTabDesktop === 'membership' ? (
              // Membership Section
              <>
                {/* Right content area */}
                <div className="flex-1 bg-[#374151] rounded-xl p-6">
                  <h2 className="text font-medium mb-6 font-['DM Sans']">
                    Membership Packages
                  </h2>
                  {isLoading ? (
                      <div className="text-center py-4">Loading packages...</div>
                  ) : error ? (
                      <div className="text-red-500 text-center py-4">
                        {error}
                      </div> /* Package cards - updated to be responsive with min/max width */
                  ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-4 mb-8">
                        {displayPackages.map((pkg) => (
                            <div
                                key={pkg.id}
                                className="relative min-w-[122px] max-w-[300px] w-full mx-auto"
                            >
                              {pkg.bestValue && (
                                  <div
                                      className="absolute -top-12 h-16 left-0 right-0 py-2 text-center font-bold text-white text-xl rounded-t-2xl"
                                      style={{
                                        background:
                                            'linear-gradient(90deg, #A7F432, #50C878)',
                                      }}
                                  >
                                    Best Value
                                  </div>
                              )}
                              <div
                                  className={`relative rounded-xl overflow-hidden flex flex-col h-[440px] bg-white ${pkg.bestValue ? 'gradient-overlay pt-0 border-b-2 border-l-2 border-r-2 border-[#8CDF4F]' : ''}`}
                              >
                                {/* Card Title */}
                                <div className={"flex justify-center text-xl pt-5 font-['DM Sans'] font-semibold"}>
                                  <h2 className={`
                                    ${{
                                      Gold: "text-[#FFB302]",
                                      Silver: "text-[#67768F]",
                                      Diamond: "text-[#AB13F7]"
                                    }[pkg.title] || "text-black"}
                                  `}>
                                    {pkg.title}
                                  </h2>
                                </div>
                                {/* Coin image */}
                                <div className="flex justify-center items-center pt-8 pb-6">
                                  <img
                                      src={pkg.imageLink}
                                      alt="Coins"
                                      className="w-24 h-24 object-contain"
                                  />
                                </div>
                                {/* Package content - with consistent alignment */}
                                <div className="flex-1 flex flex-col text-center px-4">
                                  {/* GC amount */}
                                  <p className="font-semibold text-xl text-black mb-2 font-['DM Sans']">
                                    GC {pkg.goldCoins.toLocaleString()}
                                  </p>
                                  {/* Bonus items */}
                                  <div className="h-14 flex flex-col items-center justify-center">
                                    {
                                      pkg.entries > 0 ? (
                                          <>
                                            <p className="text-black text-xl">+</p>
                                            <div className="flex items-center justify-center mt-1">
                                              <img
                                                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/mmaJ4fycdupGhSyQnVgCcX/Entries.png"
                                                  alt="Ticket"
                                                  className="w-8 h-8 mr-1 bg-[#0CC242] rounded-full p-[2px]"
                                              />
                                              <span className="text-black text-xl font-semibold font-['DM Sans']">
                                      × {pkg.entries} free
                                    </span>
                                            </div>
                                          </>
                                      ) : (
                                          <div className="h-10"></div>
                                      ) // Empty space for consistent alignment
                                    }
                                  </div>
                                  {/* Buy button - always at the same position */}
                                  <div className="mt-auto mb-8 px-4">
                                    {/* Price */}
                                    <p className="font-semibold text-xl text-black my-2 font-['DM Sans']">
                                      ${pkg.priceUsd}
                                    </p>
                                    <p className={"text-black mb-4 text-xs font-bold"}>(Single payment only)</p>
                                    <button
                                        onClick={() => handleBuy(pkg)}
                                        disabled={processingPayment}
                                        className={`w-full ${processingPayment ? 'bg-gray-400' : 'bg-[#56CA5A] hover:bg-[#4BB850]'} text-white py-2 rounded-full font-bold`}
                                    >
                                      {processingPayment ? 'SELECT' : 'SELECT'}
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                        ))}
                      </div>
                  )}
                  {/* Footer text */}
                  <div className="text-center mt-2 pt-2">
                    <p className="text-white">
                      Price in USD.
                    </p>
                    <p className="text-white text-sm mt-2">
                      Your credit card will be securely billed one time without any recurring charges or obligations.
                    </p>

                    {/* Package Inclusions Button */}
                    <div className={"h-12 p-2 w-full bg-[#1F2937] rounded-xl mt-5 flex justify-center items-center"}
                      onClick={() => setCollapsePkgInclusions(!collapsePkgInclusions)}
                    >
                      <p className={"text-white"}>Click Here To See Full Inclusions</p>
                    </div>

                    {/* Package Inclusions */}
                    <div className={"mt-2"}>
                      {collapsePkgInclusions && (
                          <>
                            {pkgInclusions.map((inclusions) => (
                                <PackageInclusions key={inclusions.id} inclusions={inclusions} />
                            ))}
                          </>
                      )}
                    </div>
                  </div>
                </div>
              </>
          ) : activeTabDesktop === "cookyShop" ? (
            <>
              <div className="p-4 bg-[#374151] rounded-2xl">
                {/* responsive: 1 col on xs, 2 on sm, 3 on md+ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {logos.map((logo) => (
                    <CookyShop logo={logo}/>
                  ))}
                </div>
              </div>
            </>
          ) : activeTabDesktop === "convertToEntries" ? (
            <>
              <ConvertToEntries />
            </>
          ) : (
              // ConvertGem Section
              <div className={`${activeTabDesktop === 'convertGem' ? 'mt-14' : ''}`}>
                <ConvertGem />
              </div>
          )}
          {/* Diamonds And Tickets */}
          {(activeTabDesktop === 'convertGem' || activeTabDesktop === "convertToEntries" ) && (
              <div className="flex-col justify-end ml-4">
                {/* Diamonds */}
                <div className="w-32 h-10 bg-[#111827] rounded-full flex items-center px-4 mb-2">
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
          )}
        </div>
        {/* Bottom navigation */}
        <BottomNavigation />
      </div>
  )
}
