import { useNavigate } from 'react-router-dom'
import { useGlobalContext } from '../context/GlobalContext'
type CongratsModalProps = {
  isOpen: boolean
  onClose: () => void
  coinAmount: number
  spinAmount: number
}
export function CongratsModal({
                                isOpen,
                                onClose,
                                coinAmount,
                                spinAmount,
                              }: CongratsModalProps) {
  const navigate = useNavigate()
  const { addSpins, addCoins } = useGlobalContext()
  if (!isOpen) return null
  const handleCollect = () => {
    // Add the coins and spins to the global context
    addCoins(coinAmount)
    addSpins(spinAmount)
    // Close the modal
    onClose()
    // Navigate to the giveaway entry page
    navigate('/giveaway-entry')
  }
  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/90">
        <div className="bg-gray-800 rounded-lg p-8 shadow-xl w-72 text-center">
          <h2 className="text-white text-2xl font-bold mb-6">Congratulations!</h2>
          <p className="text-white mb-4">You Won</p>
          <div className="flex items-center justify-center mb-4">
            <img
                src="https://uploadthingy.s3.us-west-1.amazonaws.com/fmLBFTLqfqxtLWG949C3wH/point.png"
                alt="Coins"
                className="w-6 h-6 mr-2"
            />
            <span className="text-white text-xl font-bold">
            {coinAmount.toLocaleString()}
          </span>
          </div>
          <p className="text-white mb-2">+</p>
          <p className="text-white text-xl font-bold mb-8">{spinAmount} x Spin</p>
          <button
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-12 rounded-full font-bold"
              onClick={handleCollect}
          >
            Collect
          </button>
        </div>
      </div>
  )
}
