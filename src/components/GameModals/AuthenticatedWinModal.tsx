import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../../context/GlobalContext'
import { IMAGES } from '../../constance/imagesLink'
type AuthenticatedWinModalProps = {
    isOpen: boolean
    onClose: () => void
    reward: number
}
export function AuthenticatedWinModal({
                                          isOpen,
                                          onClose,
                                          reward,
                                      }: AuthenticatedWinModalProps) {
    const navigate = useNavigate()
    const {
        addCoins,
        temporaryVoucherBalance,
        temporaryTicketBalance,
        temporaryCoinBalance,
        setVoucherBalance,
        setTicketBalance,
        voucherBalance,
        ticketBalance,
        selectedBalanceType,
    } = useGlobalContext()
    if (!isOpen) return null
    const handleCollect = () => {
        if (selectedBalanceType === 'coin') {
            // Add coins when user collects the reward
            addCoins(reward)
        } else {
            // Handle ticket balance case
            addCoins(temporaryCoinBalance)
            setVoucherBalance(voucherBalance + temporaryVoucherBalance)
            setTicketBalance(ticketBalance - temporaryTicketBalance)
        }
        onClose()
        navigate('/')
    }
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937]">
            <div className="bg-[#374151] rounded-2xl p-6 text-center text-white w-[320px] flex flex-col items-center">
                <h2
                    className={`${selectedBalanceType !== 'ticket' ? 'mb-24' : 'mb-10'} text-3xl text-[#FFFFFF] font-semibold mt-10 font-[Inter]`}
                >
                    Congratulations !
                </h2>
                <p className="text-[18px] font-medium mb-10 text-[#FFFFFF]">You Win</p>
                <div
                    className={`${selectedBalanceType !== 'ticket' && 'mb-36'} flex items-center justify-center text-5xl font-bold`}
                >
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                        alt="Coins"
                        className="w-6 h-6 mr-4"
                    />
                    {selectedBalanceType === 'ticket' ? (
                        <span className="text-2xl font-medium font-[Inter] text-[#FFFFFF]">
              {temporaryCoinBalance.toLocaleString()}
            </span>
                    ) : (
                        <span className="text-2xl font-medium font-[Inter] text-[#FFFFFF]">
              {reward.toLocaleString()}
            </span>
                    )}
                </div>

                {selectedBalanceType === 'ticket' && (
                    <div className={'font-inter mb-20'}>
                        <h2 className={'mt-5'}>+</h2>
                        <div className={'flex items-center'}>
                            <img src={IMAGES.voucher} alt="Coins" className="w-12 h-16" />
                            <span className="text-2xl font-medium text-[#FFFFFF]">
                x {temporaryVoucherBalance.toLocaleString()} free
              </span>
                        </div>
                    </div>
                )}

                <button
                    className=" w-48 bg-[#4E80F1] hover:bg-blue-600 text-[#FFFFFF] font-semibold py-3 px-8 rounded-xl text-xl font-[Inter] "
                    onClick={handleCollect}
                >
                    Collect
                </button>
            </div>
        </div>
    )
}
