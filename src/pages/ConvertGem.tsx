import React, { useEffect, useState, useRef } from 'react'
import { CheckCircleIcon } from 'lucide-react'
import { useGlobalContext } from '../context/GlobalContext'
import { apiRequest } from '../services/api'
export function ConvertGem() {
  const { gemBalance } = useGlobalContext()
  const [redeemAmount, setRedeemAmount] = useState(100)
  const [showTransferModal, setShowTransferModal] = useState(false)
  const [showQuestionGemModal, setShowQuestionGemModal] = useState(false)
  const [showCompletedModal, setShowCompletedModal] = useState(false)
  const [showCompletedModalAusUsers, setShowCompletedModalAusUsers] =
      useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isDisable, setIsDisable] = useState(false)
  const [inputValue, setInputValue] = useState('')
  const [currentQuestion, setCurrentQuestion] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  // Available questions and answers
  const questions = [
    {
      question: '(10 × 2) ÷ 5 + (20 – 10) = ?',
      answer: '14',
    },
    {
      question: '(12 ÷ 4) × 5 + (15 – 5) = ?',
      answer: '25',
    },
    {
      question: '(16 ÷ 2) × 2 + (20 – 10) = ?',
      answer: '26',
    },
    {
      question: '(6 × 5) ÷ 3 + (18 – 6) = ?',
      answer: '22',
    },
    {
      question: '(10 × 2) ÷ 2 + (20 – 10) = ?',
      answer: '20',
    },
  ]
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  // Handle input change with validation
  const handleRedeemAmountChange = (value) => {
    const newValue = Number(value)
    if (newValue >= 100) {
      setRedeemAmount(newValue)
    } else {
      setRedeemAmount(100) // Minimum 100 gems required
    }
  }
  const handleRedeemNow = () => {
    // Check if user has enough gems
    if (gemBalance < redeemAmount) {
      alert("You don't have enough gems for this conversion.")
      return
    }
    setShowTransferModal(true)
  }
  const handleConfirmTransaction = () => {
    setShowTransferModal(false)
    // Select a random question
    const randomIndex = Math.floor(Math.random() * questions.length)
    setCurrentQuestion(questions[randomIndex].question)
    setCorrectAnswer(questions[randomIndex].answer)
    setInputValue('') // Reset the input value
    setShowQuestionGemModal(true)
  }
  const handleQuestionGemModal = async () => {
    // Check if the answer is correct
    if (inputValue === correctAnswer) {
      setShowQuestionGemModal(false)
      setIsLoading(true)
      try {
        // Get userId from localStorage
        const userId = localStorage.getItem('userId')
        if (!userId) {
          alert('User ID not found. Please log in again.')
          setIsLoading(false)
          return
        }
        // Call the API to generate a gift card
        const response = await apiRequest('/giftcard/generate', 'POST', {
          userId: userId,
          amount: redeemAmount,
        })
        if (response && response.success) {
          // Check if user is from Australia
          if (response.userAustralia) {
            setShowCompletedModalAusUsers(true)
          } else {
            setShowCompletedModal(true)
          }
        } else {
          alert('Failed to generate gift card. Please try again.')
        }
      } catch (error) {
        console.error('Error generating gift card:', error)
        alert('An error occurred. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    } else {
      alert('Incorrect answer. Please try again.')
      setInputValue('')
    }
  }
  const handleDone = () => {
    setShowCompletedModal(false)
    setShowCompletedModalAusUsers(false)
  }
  const handleAddBankAccount = () => {
    alert('Bank account setup would open here')
  }
  // Calculate available and total gems
  const availableGems = gemBalance || 0
  const totalGems = gemBalance * 1.1 // Just for display purposes, assuming total is 10% more than available
  // Mobile view
  if (isMobile) {
    return (
        <>
          {/* Right content area - Updated to match the image exactly */}
          <div className="flex flex-col justify-start rounded-xl p-5 pr-10 pl-10">
            <p className="text-[18px] font-medium mb-6 font-['Inter']">
              Convert Gems to Giftcard
            </p>
            <div className="space-y-4 mb-10 font-['Inter']">
              <div className="flex items-center gap-x-2">
                <p className="text-white text-[16px]">Available Gems</p>
                <p>:</p>
                <p className="font-medium text-[16px]">
                  {availableGems.toFixed(2)}
                </p>
              </div>
              <div className="flex items-center gap-x-2">
                <p className="text-white mr-8 text-[16px]">Total Gems</p>
                <p className="">:</p>
                <p className="font-medium text-[16px]">{totalGems.toFixed(2)}</p>
              </div>
            </div>
            <ul className="list-disc pl-5 space-y-4 mb-10">
              <li className="text-white font-thin text-[12px]">
                Total gems show your winnings to date, while available gems is the
                amount you can convert now. Gems won today will be added to your
                available gems after 7 days.
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
                    min={100}
                    onChange={(e) => handleRedeemAmountChange(e.target.value)}
                    className="bg-transparent w-16 outline-none text-black text-[16px]"
                />
                <span className="ml-1 font-['Inter'] text-black text-[16px]">
                (${redeemAmount})
              </span>
              </div>
              <div>
                <p className="text-white text-[16px]">gems</p>
              </div>
            </div>
            <div className="flex justify-center mb-8 mt-5 font-['Inter']">
              <button
                  onClick={handleRedeemNow}
                  className="bg-[#2D7FF0] text-[12px] w-36 text-white py-1 rounded-3xl font-medium"
                  disabled={redeemAmount > availableGems}
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
                    Do you want to convert {redeemAmount} gems to a gift card?
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
                  <div className={'mb-4'}>
                    <p className="mb-4 text-sm">
                      You are required to correctly answer a skill-based question to
                      be eligible to receive a gift card.
                    </p>
                    <p className={'text-sm'}>
                      Please solve the following puzzle within 3 minute without
                      assistance from any device or person.
                    </p>
                  </div>
                  <div className={'flex mb-5 gap-x-3 items-center'}>
                    <p className={'font-bold text-[12px]'}>{currentQuestion}</p>
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
                        className={`${inputValue === '' ? 'bg-[#67768F]' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 px-8 rounded-full font-medium`}
                        disabled={inputValue === '' || isLoading}
                    >
                      {isLoading ? 'Processing...' : 'Submit'}
                    </button>
                  </div>
                </div>
              </div>
          )}

          {/* Transaction Completed Modal For Australian Users */}
          {showCompletedModalAusUsers && (
              <div className="fixed inset-0 bg-[#1F2937E5]/60 flex items-center justify-center z-50 p-4">
                <div className="bg-[#374151] rounded-xl p-8 w-full max-w-lg">
                  <div className="flex mb-4 items-center gap-x-2">
                    <h2 className="text-[18px] font-semibold text-center font-inter">
                      Email Sent
                    </h2>
                    <img
                        src={'/complete-write.png'}
                        alt={'write icon'}
                        className={'w-4 h-4'}
                    />
                  </div>
                  <div>
                    <p className="mb-6 text-sm font-inter text-white text-opacity-75 font-semibold">
                      Our gift card does not support for Australia.
                    </p>
                    <span
                        className={
                          'mt-5 text-sm font-inter text-white text-opacity-75 font-semibold'
                        }
                    >
                  Please check your email for further instructions.
                </span>
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

          {/* Transaction Completed Modal Global user */}
          {showCompletedModal && (
              <div className="fixed inset-0 bg-[#1F2937E5]/60 flex items-center justify-center z-50 p-4">
                <div className="bg-[#374151] rounded-xl p-8 w-full max-w-lg">
                  <div className="flex mb-4 items-center gap-x-2">
                    <h2 className="text-[18px] font-semibold text-center font-inter">
                      Email Sent
                    </h2>
                    <img
                        src={'/complete-write.png'}
                        alt={'write icon'}
                        className={'w-4 h-4'}
                    />
                  </div>
                  <div>
                    <p className=" mb-2 font-inter text-white text-opacity-75 font-semibold text-sm">
                      Your gems have been converted to a gift card. The code has
                      been sent to your email.
                    </p>
                    <span
                        className={
                          'mt-5 font-inter text-white text-opacity-75 font-semibold text-sm'
                        }
                    >
                  Please check your email for further instructions.
                </span>
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
          <h2 className="text-2xl font-medium mb-6 font-['Inter']">
            Convert Gems to Giftcard
          </h2>
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
              Total gems show your winnings to date, while available gems is the
              amount you can convert now. Gems won today will be added to your
              available gems after 7 days.
            </li>
            <li className="text-white font-thin">
              A minimum 100 Gems required to process a conversion.
            </li>
          </ul>
          <div className="font-['Inter'] flex max-[958px]:flex-col max-[958px]:space-y-2 max-[958px]:items-start items-center mb-0.5 space-x-4">
            <p className="text-white text-lg font-['Inter']">Convert</p>
            <div className="bg-white rounded-md px-4 py-2 flex items-center">
              <input
                  type="number"
                  value={redeemAmount}
                  min={100}
                  onChange={(e) => handleRedeemAmountChange(e.target.value)}
                  className="bg-transparent w-16 outline-none text-black text-md"
              />
              <span className="ml-1 font-['Inter'] text-black text-md">
              (${redeemAmount})
            </span>
            </div>
            <p className="text-white font-['Inter']">gems</p>
          </div>
          <div className="flex-1 flex justify-end mb-16 font-['Inter']">
            <button
                onClick={handleRedeemNow}
                className={`md:mt-5 ${redeemAmount > availableGems ? 'bg-gray-500 cursor-not-allowed' : 'bg-[#2D7FF0] hover:bg-blue-600'} border-green-500 w-52 text-white py-2 px-10 rounded-full font-medium`}
                disabled={redeemAmount > availableGems}
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
                  Do you want to convert {redeemAmount} gems to a gift card?
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
                <div className={'mb-4'}>
                  <p className="mb-4">
                    You are required to correctly answer a skill-based question to
                    be eligible to receive a gift card.
                  </p>
                  <p>
                    Please solve the following puzzle within 3 minute without
                    assistance from any device or person.
                  </p>
                </div>
                <div className={'flex mb-5 gap-x-3 items-center'}>
                  <p className={'font-bold'}>{currentQuestion}</p>
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
                      className={`${inputValue === '' ? 'bg-[#67768F]' : 'bg-blue-500 hover:bg-blue-600'} text-white py-2 px-10 rounded-full font-medium`}
                      disabled={inputValue === '' || isLoading}
                  >
                    {isLoading ? 'Processing...' : 'Submit'}
                  </button>
                </div>
              </div>
            </div>
        )}

        {/* Transaction Completed Modal For Australian Users */}
        {showCompletedModalAusUsers && (
            <div className="fixed inset-0 bg-[#1F2937E5]/60 flex items-center justify-center z-50 p-4">
              <div className="bg-[#374151] rounded-xl p-16 w-full max-w-lg">
                <div className="flex mb-4 items-center gap-x-2">
                  <h2 className="text-2xl font-semibold text-center font-inter">
                    Email Sent
                  </h2>
                  <img
                      src={'/complete-write.png'}
                      alt={'write icon'}
                      className={'w-5 h-5'}
                  />
                </div>
                <div>
                  <p className=" mb-6 font-inter text-white text-opacity-75 font-semibold">
                    Our gift card does not support for Australia.
                  </p>
                  <span
                      className={
                        'mt-5 font-inter text-white text-opacity-75 font-semibold'
                      }
                  >
                Please check your email for further instructions.
              </span>
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

        {/* Transaction Completed Modal Global user */}
        {showCompletedModal && (
            <div className="fixed inset-0 bg-[#1F2937E5]/60 flex items-center justify-center z-50 p-4">
              <div className="bg-[#374151] rounded-xl p-16 w-full max-w-lg">
                <div className="flex mb-4 items-center gap-x-2">
                  <h2 className="text-2xl font-semibold text-center font-inter">
                    Email Sent
                  </h2>
                  <img
                      src={'/complete-write.png'}
                      alt={'write icon'}
                      className={'w-5 h-5'}
                  />
                </div>
                <div>
                  <p className=" mb-6 font-inter text-white text-opacity-75 font-semibold">
                    Your gems have been converted to a gift card. The code has been
                    sent to your email.
                  </p>
                  <span
                      className={
                        'mt-5 font-inter text-white text-opacity-75 font-semibold'
                      }
                  >
                Please check your email for further instructions.
              </span>
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
