/*
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
*/
import React, { useEffect, useState } from 'react'
type CountdownModalProps = {
  isOpen: boolean
  onCountdownComplete: () => void
}
export function CountdownModal({
                                 isOpen,
                                 onCountdownComplete,
                               }: CountdownModalProps) {
  const [count, setCount] = useState(3)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  useEffect(() => {
    // Handle window resize for responsive design
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
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
      <div className="fixed inset-0 pb-56 z-50 flex items-center justify-center bg-[#1F2937E5]/80 font-['DM_Sans']">
        {isMobile ? (
            // Mobile view
            <div className="bg-[#374151] rounded-2xl p-16 shadow-xl w-80  text-center font-['DM_Sans']">
              <p className="text-white font-bold pt-4 text-2xl mb-4 font-['DM_Sans']">Starts in...</p>
              <div className="text-white text-7xl font-bold font-['DM_Sans']">{count}</div>
            </div>
        ) : (
            // Desktop view - larger text and card size
            <div className="bg-[#374151] rounded-2xl pt-16 p-16 shadow-xl h-3/6 w-5/12 text-center font-['DM_Sans']">
              <p className="text-white text-3xl mb-6 font-['DM_Sans']">Starts in...</p>
              <div className="text-white text-8xl font-bold font-['DM_Sans']">{count}</div>
            </div>
        )}
      </div>
  )
}
