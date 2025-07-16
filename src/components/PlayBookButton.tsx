import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlayBookModal } from './PlayBookModal';
export function PlayBookButton() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  return <>
      <div className="fixed right-4 bottom-24 z-10">
        <button className="flex flex-col items-center justify-center bg-[#374151] rounded-2xl p-4 w-24 h-24" onClick={() => setIsModalOpen(true)}>
          <img src="/play_book_icons.png" alt="Play Book" className="w-12 h-12 mb-1" />
          <span className="text-white text-sm font-medium">Guide</span>
        </button>
      </div>
      <PlayBookModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>;
}