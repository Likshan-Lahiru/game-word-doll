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
export function PrizeCard({ prize, isMobile, onEnter }: PrizeCardProps) {
    if (isMobile) {
        return (
            <div className="bg-white rounded-xl p-3 text-black flex items-center">
                <img
                    src={prize.image}
                    alt={`${prize.coinAmount} Coins`}
                    className="w-16 h-16"
                />
                <div className="ml-3 flex-1 text-center">
                    <p className="font-bold text-base">
                        GC {prize.coinAmount.toLocaleString()}
                    </p>
                    <p className="text-xs">+</p>
                    <p className="text-sm">{prize.spinAmount} x Spin</p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center mb-2">
                        <img
                            src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                            alt="Coins"
                            className="w-4 h-4 mr-1"
                        />
                        <span className="font-medium text-sm">
              {prize.cost.toLocaleString()}
            </span>
                    </div>
                    <button
                        className="bg-green-500 hover:bg-green-600 text-white py-1.5 px-5 rounded-full font-medium text-sm"
                        onClick={onEnter}
                    >
                        Let's Go!
                    </button>
                </div>
            </div>
        )
    }
    return (
        <div className="bg-white rounded-xl p-4 text-black flex flex-col items-center w-[190px] h-[400px]">

            <img
                src={prize.image}
                alt={`${prize.coinAmount} Coins`}
                className="w-16 h-16 mb-3"
            />
            <p className="font-bold text-lg mb-1">
                GC {prize.coinAmount.toLocaleString()}
            </p>
            <p className="text-center mb-1">+</p>
            <p className="mb-4">{prize.spinAmount} x Spin</p>
            <div className="flex items-center mb-3">
                <img
                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                    alt="Coins"
                    className="w-5 h-5 mr-2"
                />
                <span className="font-medium">{prize.cost.toLocaleString()}</span>
            </div>
            <button
                className="bg-green-500 hover:bg-green-600 text-white py-2 w-full rounded-full font-medium mt-auto"
                onClick={onEnter}
            >
                ENTER
            </button>
        </div>
    )
}
