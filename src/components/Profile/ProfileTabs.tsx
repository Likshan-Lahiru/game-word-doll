import React from 'react';
type ProfileTabsProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
};
export function ProfileTabs({
  activeTab,
  onTabChange
}: ProfileTabsProps) {
  return <div className="bg-[#374151] flex justify-between p-4 rounded-t-xl">
      <div className="bg-[#1F2937] flex w-full justify-between gap-2 p-1 rounded-full">
        <button className={`flex-1 py-3 px-4 rounded-full text-base font-medium transition-colors ${activeTab === 'account' ? 'bg-blue-500 text-white' : 'text-gray-300'}`} onClick={() => onTabChange('account')}>
          Account
        </button>
        <button className={`flex-1 py-3 px-4 rounded-full text-base font-medium transition-colors ${activeTab === 'rewards' ? 'bg-blue-500 text-white' : 'text-gray-300'}`} onClick={() => onTabChange('rewards')}>
          Rewards
        </button>
        <button className={`flex-1 py-3 px-4 rounded-full text-base font-medium transition-colors ${activeTab === 'privacy' ? 'bg-blue-500 text-white' : 'text-gray-300'}`} onClick={() => onTabChange('privacy')}>
          Privacy
        </button>
        <button className={`flex-1 py-3 px-4 rounded-full text-base font-medium transition-colors ${activeTab === 'help' ? 'bg-blue-500 text-white' : 'text-gray-300'}`} onClick={() => onTabChange('help')}>
          Help
        </button>
      </div>
    </div>;
}