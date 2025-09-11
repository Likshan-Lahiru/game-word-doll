/*
import React from 'react'
import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircleIcon } from 'lucide-react'
import { BottomNavigation } from '../components/BottomNavigation'
import { BalanceSelector } from '../components/BalanceSelector'
export function ConvertGem() {
  const navigate = useNavigate()
  const [redeemAmount, setRedeemAmount] = useState(75)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showCompletedModal, setShowCompletedModal] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState('redeem')
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  // Mock data
  const availableGems = 77.4
  const totalGems = 107.25
  const handleRedeemNow = () => {
    setShowTransferModal(true)
  }
  const handleConfirmTransaction = () => {
    setShowTransferModal(false)
    setShowCompletedModal(true)
  }
  const handleDone = () => {
    setShowCompletedModal(false)
  }
  const handleAddBankAccount = () => {
    alert('Bank account setup would open here')
  }
  // Mobile view
  if (isMobile) {
    return (
        <div className="flex flex-col w-full min-h-screen bg-[#1F2937] text-white">
          {/!* Store title *!/}
          <h1 className="text-2xl font-bold text-center my-4">Store</h1>
          {/!* Tabs *!/}
          <div className="flex px-6 mb-8">
            <button
                className={`flex-1 py-4 px-4 rounded-2xl flex items-center justify-center space-x-2 ${activeTab === 'coins' ? 'bg-blue-500' : 'bg-[#131520]'}`}
                onClick={() => {
                  setActiveTab('coins')
                  navigate('/store')
                }}
            >
              <span className="font-bold text-sm">Get Gold Coins</span>
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/tseH8zwDf6PgMMJLoCm3uz/gold-store.png"
                  alt="Coins"
                  className="w-7 h-7"
              />
            </button>
            <div className="w-4"></div>
            <button
                className={`flex-1 py-4 px-4 rounded-2xl flex items-center justify-center space-x-2 ${activeTab === 'redeem' ? 'bg-blue-500' : 'bg-[#131520]'}`}
                onClick={() => setActiveTab('redeem')}
            >
              <span className="font-bold text-sm">Redeem</span>
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/5ARgETPVNopfYddtEfN6Yn/redeem.png"
                  alt="Redeem"
                  className="w-7 h-7"
              />
            </button>
          </div>
          {/!* Withdraw section *!/}
          <div className="px-6 mb-8">
            <h2 className="text-xl font-bold mb-5">Withdraw</h2>
            <div className="mb-4">
              {/!* Updated to match the image more closely - colon closer to the number *!/}
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Available Gems</span>
                <span className="text-gray-300">
                :{' '}
                  <span className="font-medium">{availableGems.toFixed(2)}</span>
              </span>
              </div>
              <div className="flex justify-between mb-5">
                <span className="text-gray-300">Total Gems</span>
                <span className="text-gray-300">
                : <span className="font-medium">{totalGems.toFixed(2)}</span>
              </span>
              </div>
            </div>
            {/!* Bullet points *!/}
            <ul className="space-y-3 mb-8">
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span className="text-gray-400 text-xs">
                Total gems show your earnings to date, while available gems is
                the amount you can withdraw now. Gems earned today will be added
                to your available gems after 7 days.
              </span>
              </li>
              <li className="flex items-start">
                <span className="text-gray-400 mr-2">•</span>
                <span className="text-gray-400 text-xs">
                A minimum 100 Gems required to process a redeem.
              </span>
              </li>
            </ul>
            {/!* Redeem input *!/}
            <div className="mb-4">
              <div className="flex items-center mb-3">
                <p className="mr-2 text-sm">Redeem</p>
                <div className="w-24 bg-white rounded-md px-4 py-2 flex justify-between mx-2">
                  <input
                      type="number"
                      value={redeemAmount}
                      onChange={(e) => setRedeemAmount(Number(e.target.value))}
                      className="bg-transparent w-16 outline-none text-black text-sm"
                  />
                </div>
                <p className="text-gray-600 text-sm">({`$${redeemAmount}`})</p>
                <p className="text-gray-400 text-xs ml-2">
                  gems to cash
                  <br />
                  ($1 per gem)
                </p>
              </div>
              <div className="flex justify-center mt-5">
                <button
                    onClick={handleRedeemNow}
                    className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-10 rounded-full font-medium text-sm w-auto"
                >
                  Transfer Now
                </button>
              </div>
            </div>
          </div>
          {/!* Setup Payment Method *!/}
          <div className="px-6 mb-8">
            <h2 className="text-xl font-bold mb-4">Setup Payment Method</h2>
            <p className="text-gray-400 mb-6 text-center text-xs font-bold">
              Setup your payment method by entering your bank account details to
              receive funds.
            </p>
            <div className="flex justify-center">
              <button
                  onClick={handleAddBankAccount}
                  className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-8 rounded-full font-medium text-sm"
              >
                Add Bank Account
              </button>
            </div>
          </div>
          {/!* Note *!/}
          <div className="px-6 mb-20">
            <p className="text-white text-xs text-center">
              Note : 0.25% + $0.25 per payout
            </p>
          </div>
          {/!* Transfer Funds Modal *!/}
          {showTransferModal && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
                  <h2 className="text-xl font-bold mb-4">Transfer funds?</h2>
                  <p className="mb-6">
                    Do you want to transfer ${redeemAmount} to your bank account?
                  </p>
                  <div className="flex space-x-4">
                    <button
                        onClick={() => setShowTransferModal(false)}
                        className="flex-1 bg-white text-gray-800 py-2 px-4 rounded-full font-medium"
                    >
                      Cancel
                    </button>
                    <button
                        onClick={handleConfirmTransaction}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full font-medium"
                    >
                      Confirm Transaction
                    </button>
                  </div>
                </div>
              </div>
          )}
          {/!* Transaction Completed Modal *!/}
          {showCompletedModal && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
                  <div className="flex justify-center mb-2">
                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                  </div>
                  <h2 className="text-xl font-bold text-center mb-4">
                    Transaction Completed
                  </h2>
                  <p className="text-center mb-6">
                    You transferred ${redeemAmount} to your bank account. You will
                    receive it in 3-5 business days.
                  </p>
                  <div className="flex justify-center">
                    <button
                        onClick={handleDone}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-8 rounded-full font-medium"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
          )}
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
        <div className="flex flex-1 px-20 pb-8 font-['Inter']">
          {/!* Left sidebar *!/}
          <div className="w-72 bg-[#374151] rounded-xl p-6 mr-8">
            <h1 className="text-2xl font-bold mb-8">Store</h1>
            <button
                className="w-full bg-[#1F2937] hover:bg-gray-700 text-white py-4 px-5 rounded-xl mb-4 flex items-center"
                onClick={() => navigate('/store')}
            >
            <span className="flex-1 text-left ml-2 font-medium font-['Inter']">
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
                className="w-full bg-blue-500 hover:bg-blue-600 text-white py-4 px-5 rounded-xl flex items-center"
                onClick={() => {}}
            >
              <span className="flex-1 text-left ml-2 font-medium font-['Inter']">Redeem</span>
              <div className="w-12 h-12 flex items-center justify-center">
                <img
                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/5ARgETPVNopfYddtEfN6Yn/redeem.png"
                    alt="Redeem"
                    className="w-10 h-10"
                />
              </div>
            </button>
          </div>
          {/!* Right content area - Updated to match the image exactly *!/}
          <div className="flex-1 bg-[#374151] rounded-xl p-5 font-['Inter']">
            <h2 className="text-2xl font-medium mb-6 font-['Inter']">Withdraw</h2>
            {/!*<div className="space-y-4 mb-10">
              <div className="flex">
                <p className="text-white">Available Gems</p>
                <p className="flex-1 mx-1">:</p>
                <p className="font-medium flex-1 mx-1">{availableGems.toFixed(2)}</p>
              </div>
              <div className="flex">
                <p className="text-white">Total Gems</p>
                <p className="flex-1 mx-1">:</p>
                <p className="font-medium">{totalGems.toFixed(2)}</p>
              </div>
            </div>*!/}
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-x-2">
                <p className="text-white">Available Gems</p>
                <p>:</p>
                <p className="font-medium">{availableGems.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-x-2">
                <p className="text-white mr-8">Total Gems</p>
                <p className="">:</p>
                <p className="font-medium">{totalGems.toFixed(2)}</p>
              </div>
            </div>

            <ul className="list-disc pl-5 space-y-4 mb-10 font-['Inter']">
              <li className="text-white font-['Inter']">
                Total gems show your earnings to date, while available gems is the
                amount you can withdraw now. Gems earned today will be added to
                your available gems after 7 days.
              </li>
              <li className="text-white font-['Inter']">
                A minimum 100 Gems required to process a redeem.
              </li>
            </ul>
            <div className="flex items-center mb-0.5">
              <p className="text-white text-lg mr-4 font-['Inter']">Redeem</p>
              <div className="bg-white rounded-md px-4 py-2 flex items-center">
                <input
                    type="number"
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(Number(e.target.value))}
                    className="bg-transparent w-16 outline-none text-black text-lg"
                />
                <span className="text-gray-500 ml-1 font-['Inter']">({`$${redeemAmount}`})</span>
              </div>
              <p className="text-white ml-4">gems to cash ($1 per gem)</p>

            </div>
            <div className="flex-1 flex justify-end">
              <button
                  onClick={handleRedeemNow}
                  className="bg-[#2D7FF0] hover:bg-blue-600 w-52 text-white py-2 px-10 rounded-full font-medium"
              >
                Redeem Now
              </button>
            </div>
            <h2 className="text-2xl font-medium mt-12 mb-6">
              Setup Payment Method
            </h2>
            <div className="flex items-center mb-12">
              <p className="text-gray-300">
                Setup your payment method by entering your bank account details to
                receive funds.
              </p>

            </div>
            <div className="flex-1 flex justify-end">
              <button
                  onClick={handleAddBankAccount}
                  className="bg-[#2D7FF0] hover:bg-blue-600 text-white py-2 px-8 rounded-full font-medium"
              >
                Add Bank Account
              </button>
            </div>
            <ul className="list-disc pl-5 mt-16">
              <li className="text-white">Note : 0.25% + $0.25 per payout</li>
            </ul>
          </div>
        </div>
        {/!* Transfer Funds Modal *!/}
        {showTransferModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">Transfer funds?</h2>
                <p className="mb-6">
                  Do you want to transfer ${redeemAmount} to your bank account?
                </p>
                <div className="flex space-x-4">
                  <button
                      onClick={() => setShowTransferModal(false)}
                      className="flex-1 bg-white text-gray-800 py-2 px-4 rounded-full font-medium"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleConfirmTransaction}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-full font-medium"
                  >
                    Confirm Transaction
                  </button>
                </div>
              </div>
            </div>
        )}
        {/!* Transaction Completed Modal *!/}
        {showCompletedModal && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
              <div className="bg-gray-800 rounded-xl p-6 w-full max-w-md">
                <div className="flex justify-center mb-2">
                  <CheckCircleIcon className="w-6 h-6 text-green-500" />
                </div>
                <h2 className="text-xl font-bold text-center mb-4">
                  Transaction Completed
                </h2>
                <p className="text-center mb-6">
                  You transferred ${redeemAmount} to your bank account. You will
                  receive it in 3-5 business days.
                </p>
                <div className="flex justify-center">
                  <button
                      onClick={handleDone}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-8 rounded-full font-medium"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
        )}
        <BottomNavigation />
      </div>
  )
}
*/
import React, {useRef} from 'react'
import  { useEffect, useState } from 'react'
import { CheckCircleIcon } from 'lucide-react'

export function ConvertGem() {
  const [redeemAmount, setRedeemAmount] = useState(75)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showQuestionGemModal, setShowQuestionGemModal] = useState(false)
  const [showCompletedModal, setShowCompletedModal] = useState(false)
  const [showCompletedModalAusUsers, setShowCompletedModalAusUsers] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isDisable, setIsDisable] = useState(false)
  const [inputValue, setInputValue] = useState("");

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Mock data
  const availableGems = 77.4
  const totalGems = 107.25

  const handleRedeemNow = () => {
    setShowTransferModal(true)
  }

  const handleConfirmTransaction = () => {
    setShowTransferModal(false)
    // setShowCompletedModal(true)
    setShowQuestionGemModal(true);
  }

  const handleQuestionGemModal = () => {
    setShowQuestionGemModal(false);
    setShowCompletedModal(true);
  }

  const handleDone = () => {
    setShowCompletedModal(false)
  }

  const handleAddBankAccount = () => {
    alert('Bank account setup would open here')
  }

  // Mobile view
  if (isMobile) {
    return (
        <>
          {/* Right content area - Updated to match the image exactly */}
          <div className="flex flex-col justify-start rounded-xl p-5 pr-10 pl-10">
            <p className="text-[18px] font-medium mb-6 font-['Inter']">Convert Gems to Giftcard</p>

            <div className="space-y-4 mb-10 font-['Inter']">
              <div className="flex items-center gap-x-2">
                <p className="text-white text-[16px]">Available Gems</p>
                <p>:</p>
                <p className="font-medium text-[16px]">{availableGems.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-x-2">
                <p className="text-white mr-8 text-[16px]">Total Gems</p>
                <p className="">:</p>
                <p className="font-medium text-[16px]">{totalGems.toFixed(2)}</p>
              </div>
            </div>

            <ul className="list-disc pl-5 space-y-4 mb-10">
              <li className="text-white font-thin text-[12px]">
                Total gems show your winnings to date, while available gems is the amount you can convert now. Gems won today will be added to your available gems after 7 days.
              </li>
              <li className="text-white font-thin text-[12px]">
                A minimum 100 Gems required to process a conversion.
              </li>
            </ul>

            <div className="flex justify-center items-center mb-0.5 space-x-4 font-['Inter']">
              <div>
                <p className="text-white text-[16px] font-['Inter']">Convert</p>
              </div>

              <div className="bg-white rounded-md px-4 py-2 flex items-center">
                <input
                    type="number"
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(Number(e.target.value))}
                    className="bg-transparent w-16 outline-none text-black text-[16px]"
                />
                <span className="ml-1 font-['Inter'] text-black text-[16px]">(${redeemAmount})</span>
              </div>

              <div>
                <p className="text-white text-[16px]">gems</p>
              </div>
            </div>

            <div className="flex justify-center mb-8 mt-5 font-['Inter']">
              <button
                  onClick={handleRedeemNow}
                  className="bg-[#2D7FF0] text-[12px] w-36 text-white py-1 rounded-3xl font-medium"
              >
                Convert Now
              </button>
            </div>
          </div>

          {/* Convert Gem Modal */}
          {showTransferModal && (
              <div className="fixed inset-0 bg-[#1F2937E5]/60 flex items-center justify-center z-50 p-6">
                <div className="bg-[#374151] rounded-xl p-8 pt-8 pb-15 w-full max-w-lg">
                  <h2 className="text-[18px] font-semibold mb-4">Convert Gems?</h2>
                  <p className="mb-12 text-sm">
                    Do you want to convert 120 gems to a gift card?
                  </p>
                  <div className="flex justify-center space-x-2">
                    <button
                        onClick={() => setShowTransferModal(false)}
                        className="bg-white text-gray-800 px-8 rounded-full font-medium"
                    >
                      Cancel
                    </button>
                    <button
                        onClick={handleConfirmTransaction}
                        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-full font-medium"
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
          )}

          {/* Convert Gem Question Modal */}
          {showQuestionGemModal && (
              <div className="fixed inset-0 bg-[#1F2937E5]/60 flex items-center justify-center z-50 p-4">
                <div className="bg-[#374151] rounded-xl p-8 pt-8 pb-15 w-full max-w-lg">
                  <h2 className="text-[18px] font-semibold mb-4">Convert Gems?</h2>
                  <div className={"mb-4"}>
                    <p className="mb-4 text-sm">
                      You are required to correctly answer a skill-based question to be eligible to receive a gift card.
                    </p>
                    <p className={"text-sm"}>
                      Please solve the following puzzle within 3 minute without assistance from any device or person.
                    </p>
                  </div>
                  <div className={"flex mb-5 gap-x-3 items-center"}>
                    <p className={"font-bold text-[12px]"}>(10 x 2) ÷ 5 + (20 - 10) = ? </p>
                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="w-28 h-9 rounded-xl text-black p-2"
                    />
                  </div>
                  <div className="flex justify-center space-x-4">
                    <button
                        onClick={() => setShowQuestionGemModal(false)}
                        className="bg-white text-gray-800 px-8 rounded-full font-medium"
                    >
                      Cancel
                    </button>
                    <button
                        onClick={handleQuestionGemModal}
                        className={`${inputValue === "" ? "bg-[#67768F]" : "bg-blue-500 hover:bg-blue-600"} text-white py-2 px-8 rounded-full font-medium`}
                        disabled={inputValue === ""}
                    >
                      Submit
                    </button>
                  </div>
                </div>
              </div>
          )}

          {/* Transaction Completed Modal */}
          {showCompletedModalAusUsers && (
              <div className="fixed inset-0 bg-[#1F2937E5]/60 flex items-center justify-center z-50 p-4">
                <div className="bg-[#374151] rounded-xl p-8 w-full max-w-lg">
                  <div className="flex mb-4 items-center gap-x-2">
                    <h2 className="text-[18px] font-semibold text-center font-inter">
                      Email Sent
                    </h2>
                    <img src={"/complete-write.png"} alt={"write icon"} className={"w-4 h-4"}/>
                  </div>
                  <div>
                    <p className="mb-6 text-sm font-inter text-white text-opacity-75 font-semibold">
                      Our gift card does not support for Australia.
                    </p>
                    <span className={"mt-5 text-sm font-inter text-white text-opacity-75 font-semibold"}>Please check your email for further instructions.</span>
                  </div>
                  <div className="flex justify-end mt-10">
                    <button
                        onClick={handleDone}
                        className="font-inter bg-blue-500 hover:bg-blue-600 text-white py-1 px-8 rounded-full font-medium"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
          )}

          {/* Transaction Completed Modal For Australian Users */}
          {showCompletedModal && (
              <div className="fixed inset-0 bg-[#1F2937E5]/60 flex items-center justify-center z-50 p-4">
                <div className="bg-[#374151] rounded-xl p-8 w-full max-w-lg">
                  <div className="flex mb-4 items-center gap-x-2">
                    <h2 className="text-[18px] font-semibold text-center font-inter">
                      Email Sent
                    </h2>
                    <img src={"/complete-write.png"} alt={"write icon"} className={"w-4 h-4"}/>
                  </div>
                  <div>
                    <p className=" mb-2 font-inter text-white text-opacity-75 font-semibold text-sm">
                      Your gems have been converted to a gift card. The code has been sent to your email.
                    </p>
                    <span className={"mt-5 font-inter text-white text-opacity-75 font-semibold text-sm"}>Please check your email for further instructions.</span>
                  </div>
                  <div className="flex justify-end mt-5">
                    <button
                        onClick={handleDone}
                        className="font-inter bg-blue-500 hover:bg-blue-600 text-white py-1 px-8 rounded-full font-medium"
                    >
                      Done
                    </button>
                  </div>
                </div>
              </div>
          )}
        </>
    )
  }

  // Desktop view
  return (
      <>
        {/* Right content area - Updated to match the image exactly */}
        <div className="flex-1 bg-[#374151] rounded-xl p-5 pr-24 pl-10">
          <h2 className="text-2xl font-medium mb-6 font-['Inter']">Convert Gems to Giftcard</h2>

          <div className="space-y-4 mb-10 font-['Inter']">
            <div className="flex items-center gap-x-2">
              <p className="text-white">Available Gems</p>
              <p>:</p>
              <p className="font-medium">{availableGems.toFixed(2)}</p>
            </div>
            <div className="flex items-center gap-x-2">
              <p className="text-white mr-8">Total Gems</p>
              <p className="">:</p>
              <p className="font-medium">{totalGems.toFixed(2)}</p>
            </div>
          </div>

          <ul className="list-disc pl-5 space-y-4 mb-10">
            <li className="text-white font-thin">
              Total gems show your winnings to date, while available gems is the amount you can convert now. Gems won today will be added to your available gems after 7 days.
            </li>
            <li className="text-white">
              A minimum 100 Gems required to process a conversion.
            </li>
          </ul>

          <div className="font-['Inter'] flex max-[958px]:flex-col max-[958px]:space-y-2 max-[958px]:items-start items-center mb-0.5 space-x-4">
            <p className="text-white text-lg font-['Inter']">Convert</p>

            <div className="bg-white rounded-md px-4 py-2 flex items-center">
              <input
                  type="number"
                  value={redeemAmount}
                  onChange={(e) => setRedeemAmount(Number(e.target.value))}
                  className="bg-transparent w-16 outline-none text-black text-md"
              />
              <span className="ml-1 font-['Inter'] text-black text-md">(${redeemAmount})</span>
            </div>

            <p className="text-white font-['Inter']">gems</p>
          </div>

          <div className="flex-1 flex justify-end mb-16 font-['Inter']">
            <button
                onClick={handleRedeemNow}
                className="md:mt-5 bg-[#2D7FF0] border-green-500 hover:bg-blue-600 w-52 text-white py-2 px-10 rounded-full font-medium"
            >
              Convert Now
            </button>
          </div>
        </div>

        {/* Convert Gem Modal */}
        {showTransferModal && (
            <div className="fixed inset-0 bg-[#1F2937E5]/60 flex items-center justify-center z-50 p-4">
              <div className="bg-[#374151] rounded-xl p-16 pt-[68px] pb-20 w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-4">Convert Gems?</h2>
                <p className="mb-12">
                  Do you want to convert 120 gems to a gift card?
                </p>
                <div className="flex justify-end space-x-4">
                  <button
                      onClick={() => setShowTransferModal(false)}
                      className="bg-white text-gray-800 px-12 rounded-full font-medium"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleConfirmTransaction}
                      className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-10 rounded-full font-medium"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Convert Gem Question Modal */}
        {showQuestionGemModal && (
            <div className="fixed inset-0 bg-[#1F2937E5]/60 flex items-center justify-center z-50 p-4">
              <div className="bg-[#374151] rounded-xl p-16 pt-[68px] pb-20 w-full max-w-lg">
                <h2 className="text-2xl font-semibold mb-4">Convert Gems?</h2>
                <div className={"mb-4"}>
                  <p className="mb-4">
                    You are required to correctly answer a skill-based question to be eligible to receive a gift card.
                  </p>
                  <p>
                    Please solve the following puzzle within 3 minute without assistance from any device or person.
                  </p>
                </div>
                <div className={"flex mb-5 gap-x-3 items-center"}>
                  <p className={"font-bold"}>(10 x 2) ÷ 5 + (20 - 10) = ? </p>
                  <input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      className="w-28 h-9 rounded text-black p-2"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                      onClick={() => setShowQuestionGemModal(false)}
                      className="bg-white text-gray-800 px-10 rounded-full font-medium"
                  >
                    Cancel
                  </button>
                  <button
                      onClick={handleQuestionGemModal}
                      className={`${inputValue === "" ? "bg-[#67768F]" : "bg-blue-500 hover:bg-blue-600"} text-white py-2 px-10 rounded-full font-medium`}
                      disabled={inputValue === ""}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Transaction Completed Modal */}
        {showCompletedModalAusUsers && (
            <div className="fixed inset-0 bg-[#1F2937E5]/60 flex items-center justify-center z-50 p-4">
              <div className="bg-[#374151] rounded-xl p-16 w-full max-w-lg">
                <div className="flex mb-4 items-center gap-x-2">
                  <h2 className="text-2xl font-semibold text-center font-inter">
                    Email Sent
                  </h2>
                  <img src={"/complete-write.png"} alt={"write icon"} className={"w-5 h-5"}/>
                </div>
                <div>
                  <p className=" mb-6 font-inter text-white text-opacity-75 font-semibold">
                    Our gift card does not support for Australia.
                  </p>
                  <span className={"mt-5 font-inter text-white text-opacity-75 font-semibold"}>Please check your email for further instructions.</span>
                </div>
                <div className="flex justify-end mt-10">
                  <button
                      onClick={handleDone}
                      className="font-inter bg-blue-500 hover:bg-blue-600 text-white py-2 px-8 rounded-full font-medium"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Transaction Completed Modal For Australian Users */}
        {showCompletedModal && (
            <div className="fixed inset-0 bg-[#1F2937E5]/60 flex items-center justify-center z-50 p-4">
              <div className="bg-[#374151] rounded-xl p-16 w-full max-w-lg">
                <div className="flex mb-4 items-center gap-x-2">
                  <h2 className="text-2xl font-semibold text-center font-inter">
                    Email Sent
                  </h2>
                  <img src={"/complete-write.png"} alt={"write icon"} className={"w-5 h-5"}/>
                </div>
                <div>
                  <p className=" mb-6 font-inter text-white text-opacity-75 font-semibold">
                    Your gems have been converted to a gift card. The code has been sent to your email.
                  </p>
                  <span className={"mt-5 font-inter text-white text-opacity-75 font-semibold"}>Please check your email for further instructions.</span>
                </div>
                <div className="flex justify-end mt-10">
                  <button
                      onClick={handleDone}
                      className="font-inter bg-blue-500 hover:bg-blue-600 text-white py-2 px-8 rounded-full font-medium"
                  >
                    Done
                  </button>
                </div>
              </div>
            </div>
        )}
      </>
  )
}
