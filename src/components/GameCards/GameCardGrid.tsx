import React from 'react';
import { WordollCard } from './WordollCard';
import { LockPickrCard } from './LockPickrCard';
import { GiveawayCard } from './GiveawayCard';
import { PlayBookCard } from './PlayBookCard';
export function GameCardGrid() {
  // Check if mobile
  const isMobile = window.innerWidth <= 768;
  if (isMobile) {
    return <div className="flex-1 px-4 pb-20 game-card-grid">
        <div className="grid grid-cols-2 gap-3">
          <WordollCard isMobile={true} />
          <LockPickrCard isMobile={true} />
          <GiveawayCard isMobile={true} />
          <PlayBookCard isMobile={true} />
        </div>
      </div>;
  }
  // Return original desktop version
  return <div className="flex-1 flex justify-center items-center p-4 game-card-grid">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl w-full">
        <WordollCard />
        <LockPickrCard />
        <GiveawayCard />
      </div>
    </div>;
}