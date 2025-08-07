import React from 'react'
import  { useState } from 'react'
import { PlayBookModal } from '../PlayBookModal.tsx'
import { useNavigate } from 'react-router-dom'
type PlayBookCardProps = {
  isMobile?: boolean
}
export function PlayBookCard({ isMobile = false }: PlayBookCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const navigate = useNavigate()
  const handleClick = () => {
    if (isMobile) {
      navigate('/guide')
    } else {
      setIsModalOpen(true)
    }
  }
  if (isMobile) {
    return (
        <>
          <div
              className="rounded-xl overflow-hidden bg-[#374151] flex flex-col h-[250px] relative cursor-pointer"
              onClick={handleClick}
          >
            <div className="flex-1 flex flex-col items-center justify-center mt-8">
              {/* Updated to use the new image */}
              <img
                  src="https://uploadthingy.s3.us-west-1.amazonaws.com/oHTY8NKSDmvznGJ9ayLTLN/play_book_icons.png"
                  alt="Play Book"
                  className="w-32 h-32 mb-4"
              />
            </div>
            <div className=" mb-6 px-4 text-center">
              <h3 className="text-xl font-bold text-white">Guide</h3>
            </div>
          </div>
          {!isMobile && (
              <PlayBookModal
                  isOpen={isModalOpen}
                  onClose={() => setIsModalOpen(false)}
              />
          )}
        </>
    )
  }
  // This component doesn't exist in the desktop version as a card
  // It's rendered as a floating button in the desktop version
  return null
}
