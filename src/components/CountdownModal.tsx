import  { useEffect, useState } from 'react'
type CountdownModalProps = {
  isOpen: boolean
  onCountdownComplete: () => void
}
export function CountdownModal({
                                 isOpen,
                                 onCountdownComplete,
                               }: CountdownModalProps) {
  const [count, setCount] = useState(3)
  useEffect(() => {
    if (!isOpen) return
    // Reset count when modal opens
    setCount(3)
    // Start countdown
    const interval = setInterval(() => {
      setCount((prevCount) => {
        if (prevCount <= 1) {
          clearInterval(interval)
          // Wait a moment to show "1" before closing
          setTimeout(() => {
            onCountdownComplete()
          }, 800)
          return 0
        }
        return prevCount - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [isOpen, onCountdownComplete])
  if (!isOpen) return null
  return (
      <div className="fixed  inset-0 z-50 flex items-center justify-center bg-[#1F2937E5]/80">
        <div className="bg-[#374151]  rounded-lg p-8 shadow-xl text-center">
          <p className="text-white mb-4">Starts in...</p>
          <div className="text-white text-7xl font-bold">{count}</div>
        </div>
      </div>
  )
}
