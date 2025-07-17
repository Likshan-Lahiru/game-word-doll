
import { useNavigate } from 'react-router-dom'
type LockPickrCardProps = {
    isMobile?: boolean
}
export function LockPickrCard({ isMobile = false }: LockPickrCardProps) {
    const navigate = useNavigate()
    if (isMobile) {
        return (
            <div
                className="rounded-xl overflow-hidden flex flex-col h-[270px] relative cursor-pointer"
                onClick={() => navigate('/lock-pickr-game')}
            >
                {/* Full image background */}
                <div className="absolute inset-0">
                    <img
                        src="https://uploadthingy.s3.us-west-1.amazonaws.com/i9wzJrxokDDqgwas4Cft5m/lockpickr.png"
                        alt="Lock Pickr"
                        className="w-full h-full object-cover"
                    />
                </div>
                {/* Title at the bottom */}
                <div className="mt-auto py-3 px-4 text-center  relative z-10">
                    <h3 className="text-2xl font-bold text-white">Lock Pickr</h3>
                </div>
            </div>
        )
    }
    return (
        <div className="h-[450px] rounded-2xl overflow-hidden flex flex-col relative">
            {/* Full image background */}
            <div className="absolute inset-0">
                <img
                    src="https://uploadthingy.s3.us-west-1.amazonaws.com/i9wzJrxokDDqgwas4Cft5m/lockpickr.png"
                    alt="Lock Pickr"
                    className="w-full h-full object-cover"
                />
            </div>
            {/* Dark overlay for better text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60"></div>
            {/* Title */}
            <h3 className="text-3xl font-bold text-center text-white relative z-10 mt-6">
                Lock Pickr
            </h3>
            {/* Spacer to push button to bottom */}
            <div className="flex-1"></div>
            {/* Play button */}
            <div className="p-4 flex justify-center mb-6 relative z-10">
                <button
                    className="bg-blue-500 hover:bg-blue-600 rounded-full py-3 px-16 text-white font-bold text-xl border border-blue-400"
                    onClick={() => navigate('/lock-pickr-game')}
                >
                    PLAY
                </button>
            </div>
        </div>
    )
}
