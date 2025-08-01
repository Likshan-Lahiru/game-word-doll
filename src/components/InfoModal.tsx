import React, { useEffect, useState } from 'react'
import {XIcon} from "lucide-react";
type InfoProps = {
  isOpen: boolean
  onClose: () => void
}
export function InfoModal({isOpen, onClose}: InfoProps) {

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Handle window resize for responsive design
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    handleResize();

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  if (!isOpen) return null

  return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1F2937E5]/80">
            <div className={`${isMobile ? 'max-w-sm' : 'max-w-lg'} bg-[#374151] pb-20 pt-5 rounded-2xl`}>

              {/* Close Button */}
              <div className={"flex justify-end pr-5"}>
                <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-white pb-10"
                >
                  <XIcon size={24} />
                </button>
              </div>

              {/* Description */}
              <div className={`${isMobile ? 'pr-16 pl-16 ' : 'pr-20 pl-20 '}`}>
                <p className={`${isMobile ? 'text-md ml-[10px] mr-[10px] leading-4' : 'leading-6 text-[17px] pr-10'} text-center font-inter px-2 mt-4`}>
                  You don’t have enough{' '}
                  <img
                      src="https://uploadthingy.s3.us-west-1.amazonaws.com/n1GyLezxBrdL3JBWAwST8s/Vouchers.png"
                      alt="Voucher"
                      className={`${isMobile ? 'w-4 h-4' : 'w-5 h-5'} inline mx-1 p-0 m-0`}
                  />{' '}
                  vouchers to spin. Play more games to win vouchers.
                </p>
              </div>
            </div>
      </div>
  )
}
