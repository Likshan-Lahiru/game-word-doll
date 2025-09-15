import React, { useEffect, useState } from 'react'
import { useGlobalContext } from '../context/GlobalContext'
import { apiRequest } from '../services/api'
const ConvertToEntries = ({ isMobile }) => {
    const { gemBalance, ticketBalance, setGemBalance, setTicketBalance } =
        useGlobalContext()
    const [entriesAmount, setEntriesAmount] = useState(50)
    const [showConvertNowModal, setShowConvertNowModal] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [apiError, setApiError] = useState(null)
    const [successMessage, setSuccessMessage] = useState(null)
    // Update entriesAmount when gemBalance changes
    useEffect(() => {
        // Set a default value that's less than or equal to gemBalance
        if (Math.floor(gemBalance) > 5) {
            // Leave 5 gems in account as per the note
            setEntriesAmount(Math.min(50, Math.floor(gemBalance) - 5))
        } else {
            setEntriesAmount(0)
        }
    }, [gemBalance])
    const handleConvertNow = () => {
        // Validate that we have enough gems (minimum 5 must remain)
        if (Math.floor(gemBalance) - entriesAmount < 5) {
            alert('A minimum balance of 5 gems must remain in your account.')
            return
        }
        if (entriesAmount <= 0) {
            alert('Please enter a valid amount to convert.')
            return
        }
        setShowConvertNowModal(true)
    }
    const handleConfirmConversion = async () => {
        setIsLoading(true)
        setApiError(null)
        setSuccessMessage(null)
        try {
            const userId = localStorage.getItem('userId') || '0'
            const response = await apiRequest(
                `/users/${userId}/convert-gems-to-entries`,
                'POST',
                {
                    gemsToConvert: entriesAmount,
                },
            )
            if (response && response.message) {
                // Update global context with new values
                setGemBalance(response.remainingGems)
                setTicketBalance(response.totalEntries)
                setSuccessMessage(response.message)
                setTimeout(() => {
                    setShowConvertNowModal(false)
                    setSuccessMessage(null)
                }, 2000)
            } else {
                throw new Error('Invalid response from server')
            }
        } catch (error) {
            console.error('Error converting gems to entries:', error)
            setApiError(
                error.message || 'Failed to convert gems to entries. Please try again.',
            )
        } finally {
            setIsLoading(false)
        }
    }
    if (isMobile) {
        return (
            <>
                {/* Right content area - Updated to match the image exactly */}
                <div className="relative mt-5 flex-1 rounded-xl p-5 pr-10 pl-10">
                    <h2 className="text-[18px] font-medium mb-6 font-['Inter']">
                        Convert Gems
                    </h2>
                    <div className="space-y-4 mb-10 font-['Inter']">
                        <div className="flex items-center gap-x-2">
                            <p className="text-[13px] text-white mr-[68px]">Entries</p>
                            <p>:</p>
                            <p className="font-medium text-[13px]">
                                {ticketBalance.toLocaleString()}
                            </p>
                        </div>
                        <div className="flex items-center gap-x-2">
                            <p className="text-white text-[13px]">Convertible Gems</p>
                            <p className="">:</p>
                            <p className="font-medium text-[13px]">
                                {Math.floor(gemBalance).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex justify-center items-center mb-0.5 space-x-4 font-['Inter']">
                        <p className="text-white text-[13px] font-['Inter']">Convert</p>
                        <div className="bg-white rounded-xl px-3 py-2 flex items-center">
                            <input
                                type="number"
                                value={entriesAmount}
                                onChange={(e) =>
                                    setEntriesAmount(Math.floor(Number(e.target.value)))
                                }
                                className="bg-transparent w-10 text-[13px] outline-none text-black text-md"
                            />
                            <span className="ml-1 font-['Inter'] text-[13px] text-black text-md">
                ({entriesAmount.toLocaleString()})
              </span>
                        </div>
                        <div className={'flex flex-col'}>
                            <p className="text-white text-[13px]">gems to entries</p>
                            <p className="text-white text-[13px]">(1 Gem = 1 Entry)</p>
                        </div>
                    </div>
                    <div className="flex-1 flex justify-end font-['Inter']">
                        <button
                            onClick={handleConvertNow}
                            className={`bg-[#2D7FF0] text-sm border-green-500 text-white py-1 px-5 mt-5 rounded-full font-medium ${Math.floor(gemBalance) - entriesAmount < 5 || entriesAmount <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                            disabled={
                                Math.floor(gemBalance) - entriesAmount < 5 || entriesAmount <= 0
                            }
                        >
                            Convert Now
                        </button>
                    </div>
                    <div className={'absolute bottom-0 right-0 left-0 mb-16 mr-10 ml-10'}>
                        <ul className="list-disc pl-5 space-y-2 mt-0 text-[12px] mb-5">
                            <li className="text-white font-thin">
                                Note : Once you convert gems into entries, they cannot be
                                converted back.
                            </li>
                            <li className="text-white font-thin">
                                Note : A minimum balance of 5 gems must remain in your account
                                when converting.
                            </li>
                        </ul>
                    </div>
                </div>
                {showConvertNowModal && (
                    <div className="fixed inset-0 bg-[#1F2937E5]/60 flex items-center justify-center z-50 p-6">
                        <div className="bg-[#374151] rounded-xl p-8 pt-8 pb-15 w-full max-w-lg">
                            <h2 className="text-[18px] font-semibold mb-4">Convert Gems?</h2>
                            {successMessage ? (
                                <p className="mb-12 text-sm text-green-400">{successMessage}</p>
                            ) : (
                                <>
                                    <p className="mb-12 text-sm">
                                        Do you want to convert {entriesAmount.toLocaleString()} gems
                                        to entries?
                                    </p>
                                    {apiError && (
                                        <p className="mb-4 text-sm text-red-400">{apiError}</p>
                                    )}
                                    <div className="flex justify-center space-x-2">
                                        <button
                                            onClick={() => setShowConvertNowModal(false)}
                                            className="bg-white text-gray-800 px-5 font-semibold rounded-full text-[14px]"
                                            disabled={isLoading}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleConfirmConversion}
                                            className="bg-blue-500 text-white text-[14px] font-semibold px-1 py-1 w-40 rounded-full disabled:opacity-50"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Processing...' : 'Confirm Conversion'}
                                        </button>
                                    </div>
                                </>
                            )}
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
            <div className="mt-14 flex-1 bg-[#374151] rounded-xl p-5 pr-24 pl-10">
                <h2 className="text-2xl font-medium mb-6 font-['Inter']">
                    Convert Gems
                </h2>
                <div className="space-y-4 mb-10 font-['Inter'] ">
                    <div className="flex items-center gap-x-2">
                        <p className="text-white mr-[83px]">Entries</p>
                        <p>:</p>
                        <p className="font-medium">{ticketBalance.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-x-2">
                        <p className="text-white">Convertible Gems</p>
                        <p className="">:</p>
                        <p className="font-medium">
                            {Math.floor(gemBalance).toLocaleString()}
                        </p>
                    </div>
                </div>
                <div className="font-['Inter'] flex max-[958px]:flex-col max-[958px]:space-y-2 max-[958px]:items-start items-center mb-0.5 space-x-4">
                    <p className="text-white text-lg font-['Inter']">Convert</p>
                    <div className="bg-white rounded-md px-4 py-2 flex items-center">
                        <input
                            type="number"
                            value={entriesAmount}
                            onChange={(e) =>
                                setEntriesAmount(Math.floor(Number(e.target.value)))
                            }
                            className="bg-transparent w-16 outline-none text-black text-md"
                        />
                        <span className="ml-1 font-['Inter'] text-black text-md">
              ({entriesAmount.toLocaleString()})
            </span>
                    </div>
                    <p className="text-white">gems to entries (1 Gem = 1 Entry)</p>
                </div>
                <div className="font-['Inter'] flex-1 flex justify-end mb-16">
                    <button
                        onClick={handleConvertNow}
                        className={`md:mt-5 bg-[#2D7FF0] border-green-500 hover:bg-blue-600 w-52 text-white py-2 px-10 rounded-full font-medium ${Math.floor(gemBalance) - entriesAmount < 5 || entriesAmount <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        disabled={
                            Math.floor(gemBalance) - entriesAmount < 5 || entriesAmount <= 0
                        }
                    >
                        Convert Now
                    </button>
                </div>
                <ul className="list-disc pl-5 space-y-4 mt-36 mb-5">
                    <li className="text-white font-thin">
                        Note : Once you convert gems into entries, they cannot be converted
                        back.
                    </li>
                    <li className="text-white font-thin">
                        Note : A minimum balance of 5 gems must remain in your account when
                        converting.
                    </li>
                </ul>
            </div>
            {showConvertNowModal && (
                <div className="fixed inset-0 bg-[#1F2937E5]/60 flex items-center justify-center z-50 p-6">
                    <div className="bg-[#374151] rounded-xl pl-16 pt-8 pb-16 w-full max-w-lg">
                        <h2 className="text-[18px] font-semibold mb-4">Convert Gems?</h2>
                        {successMessage ? (
                            <p className="mb-12 text-sm text-green-400">{successMessage}</p>
                        ) : (
                            <>
                                <p className="mb-12 text-sm">
                                    Do you want to convert {entriesAmount.toLocaleString()} gems
                                    to entries?
                                </p>
                                {apiError && (
                                    <p className="mb-4 text-sm text-red-400">{apiError}</p>
                                )}
                                <div className="flex justify-center space-x-2 pr-16">
                                    <button
                                        onClick={() => setShowConvertNowModal(false)}
                                        className="bg-white text-gray-800 py-2 px-8 font-medium rounded-full"
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleConfirmConversion}
                                        className="bg-blue-500 text-white font-medium px-8 py-2 rounded-full disabled:opacity-50"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? 'Processing...' : 'Confirm Conversion'}
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}
export default ConvertToEntries
