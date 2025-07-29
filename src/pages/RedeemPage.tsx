import  { useEffect, useState } from 'react'
import { CheckCircleIcon } from 'lucide-react'

export function RedeemPage() {
  const [redeemAmount, setRedeemAmount] = useState(75)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showCompletedModal, setShowCompletedModal] = useState(false)
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
        <>
          {/* Withdraw section */}
          <div className="px-6 mb-8">
            <h2 className="text-xl font-bold mb-5">Withdraw</h2>
            <div className="mb-4">

              {/* Updated to match the image more closely - colon closer to the number */}
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

            {/* Bullet points */}
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

            {/* Redeem input */}
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

          {/* Setup Payment Method */}
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

          {/* Note */}
          <div className="px-6 mb-20">
            <p className="text-white text-xs text-center">
              Note : 0.25% + $0.25 per payout
            </p>
          </div>

          {/* Transfer Funds Modal */}
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

          {/* Transaction Completed Modal */}
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
        </>
    )
  }

  // Desktop view
  return (
      <>
          {/* Right content area - Updated to match the image exactly */}
          <div className="flex-1 bg-[#374151] rounded-xl p-5 font-['Inter']">
            <h2 className="text-2xl font-medium mb-6 font-['Inter']">Redeem</h2>

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

            <div className="flex max-[958px]:flex-col max-[958px]:space-y-2 max-[958px]:items-start items-center mb-0.5 space-x-4">
              <p className="text-white text-lg font-['Inter']">Redeem</p>

              <div className="bg-white rounded-md px-4 py-2 flex items-center">
                <input
                    type="number"
                    value={redeemAmount}
                    onChange={(e) => setRedeemAmount(Number(e.target.value))}
                    className="bg-transparent w-16 outline-none text-black text-lg"
                />
                <span className="text-gray-500 ml-1 font-['Inter']">({redeemAmount})</span>
              </div>

              <p className="text-white">gems to cash ($1 per gem)</p>
            </div>

            <div className="flex-1 flex justify-end">
              <button
                  onClick={handleRedeemNow}
                  className="md:mt-5 bg-[#2D7FF0] border-green-500 hover:bg-blue-600 w-52 text-white py-2 px-10 rounded-full font-medium"
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

        {/* Transfer Funds Modal */}
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

        {/* Transaction Completed Modal */}
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
      </>
  )
}
