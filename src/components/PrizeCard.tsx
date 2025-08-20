import {useGlobalContext} from "../context/GlobalContext.tsx";

export type PrizeData = {
    id: number
    coinAmount: number
    spinAmount: number
    cost: number
    image: string
}

type PrizeCardProps = {
    prize: PrizeData
    isMobile: boolean
    onEnter: () => void
}

import React from 'react'

export function PrizeCard({ prize, isMobile, onEnter }: PrizeCardProps) {

    const {selectedBalanceType} = useGlobalContext();

    if (isMobile) {
        return (
            <div className="bg-white h-32 rounded-xl p-3 text-black flex items-center font-['DM_Sans']">
                <img
                    src={prize.image}
                    alt={`${prize.coinAmount} Coins`}
                    className="w-24 h-24 pl-2   "
                />
                <div className="ml-3 flex-1 text-center">
                    <p className="font-medium text-base font-['DM_Sans']">
                        GC {prize.coinAmount.toLocaleString()}
                    </p>
                    <p className="text-sm font-medium font-['DM_Sans']">+</p>
                    <p className="text-sm font-medium font-['DM_Sans']">{prize.spinAmount} x Spin</p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center mb-2 text-lg pr-8">
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                            alt="Coins"
                            className="w-6 h-6 mr-1"
                        />
                        <span className="font-medium text-lg font-['DM_Sans']">
              {prize.cost.toLocaleString()}
            </span>
                    </div>
                    <button
                        className="bg-[#56CA5A] w-32 hover:bg-green-600 text-white py-1.5 px-5 rounded-full font-medium text-sm"
                        onClick={onEnter}
                    >
                        Let's Go!
                    </button>
                </div>
            </div>
        )
    }

    // Desktop
    return (
        <div className="bg-white rounded-xl p-4 text-black flex flex-col justify-between items-center w-[17vw] max-w-[350px] min-w-[250px] h-[60vh] max-h-[50vh] min-h-[390px]">

            <div>
                <img
                    src={prize.image}
                    alt={`${prize.coinAmount} Coins`}
                    className="w-28 h-28 mb-1"
                />
            </div>

            <div className={"flex flex-col justify-center"}>
                <p className="text-xl text-center mt-3 mb-1 font-semibold font-['DM_Sans']">
                    GC {prize.coinAmount.toLocaleString()}
                </p>
                <p className="text-center mb-1 text-xl font-medium font-['DM_Sans']">+</p>
                <p className="mb-4 font-['DM_Sans'] text-center text-xl font-semibold">
                    {selectedBalanceType === 'coin' ?
                        `${prize.spinAmount} x Spin`
                        :
                        <div className={"flex"}>
                            <img
                                src={"https://uploadthingy.s3.us-west-1.amazonaws.com/n1GyLezxBrdL3JBWAwST8s/Vouchers.png"}
                                alt={"voucher"}
                                className={"w-7 h-6 mr-2"}
                            />
                            {`x ${prize.spinAmount} free`}
                        </div>
                    }
                </p>
            </div>

            <div>
                <div className="flex justify-center items-center mb-3 mt-5">
                    <img
                        src={`${selectedBalanceType === 'coin' ? 'https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png' : 'https://uploadthingy.s3.us-west-1.amazonaws.com/65WCbcmf6dyyeqvjSAJHyp/fire.png'}`}
                        alt="Coins"
                        className={`${selectedBalanceType === 'ticket' && 'bg-[#0CC242]'} w-8 h-8 mr-2 rounded-full p-[2px]`}
                    />
                    <span className="text-[#170F49] font-semibold font-['DM_Sans'] text-xl">{prize.cost.toLocaleString()}</span>
                </div>
                <button
                    className="bg-[#56CA5A] flex items-center justify-center text-xl font-semibold font-['DM_Sans'] hover:bg-green-600 text-white py-2 w-[12vw] min-w-[220px] max-w-[300px] h-10 rounded-full  mt-2"
                    onClick={onEnter}
                >
                    Let's Go!
                </button>
            </div>
        </div>
    )
}
