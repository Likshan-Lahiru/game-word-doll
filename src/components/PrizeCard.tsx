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
    return (
        <div className="bg-white rounded-xl p-4 text-black flex flex-col items-center w-[230px] h-[470px] font-['DM_Sans']">

            <img
                src={prize.image}
                alt={`${prize.coinAmount} Coins`}
                className="w-28 h-28 mb-3"
            />
            <p className="font-medium text-xl mt-10 mb-1">
                GC {prize.coinAmount.toLocaleString()}
            </p>
            <p className="text-center mb-1 text-xl font-medium font-['DM_Sans']">+</p>
            <p className="mb-4 font-['DM_Sans'] font-medium text-xl">{prize.spinAmount} x Spin</p>
            <div className="flex items-center mb-3 mt-10">
                <img
                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                    alt="Coins"
                    className="w-8 h-8 mr-2"
                />
                <span className="text-[#170F49] font-['DM_Sans'] font-medium text-xl">{prize.cost.toLocaleString()}</span>
            </div>
            <button
                className="bg-[#56CA5A] text-xl font-semibold font-['DM_Sans'] hover:bg-green-600 text-white py-2 w-44 h-12 rounded-full  mt-2"
                onClick={onEnter}
            >
                Let's Go!
            </button>
        </div>
    )
}
