import React from 'react'
type ProfileTabsProps = {
    activeTab: string
    onTabChange: (tab: string) => void
    isMobile?: boolean
}
export function ProfileTabs({
                                activeTab,
                                onTabChange,
                                isMobile = false,
                            }: ProfileTabsProps) {
    return (
        <div
            className={`${isMobile ? 'bg-[#0A0E1A] px-4 py-2 rounded-full mt-5 ml-2 mr-2' : 'bg-[#374151] flex justify-between p-4 rounded-t-xl px-20 pt-8'}`}
        >
            <div
                className={`${isMobile ? 'flex w-full justify-between' : 'bg-[#1F2937] flex w-full justify-between gap-2 p-1 rounded-full'}`}
            >
                <button
                    className={`${isMobile ? `${activeTab === 'account' ? 'bg-blue-500 text-white' : 'text-gray-300'} py-1 px-4 rounded-full text-base font-medium transition-colors` : `flex-1 py-2 px-4 rounded-full text-base font-medium transition-colors ${activeTab === 'account' ? 'bg-blue-500 text-white' : 'text-gray-300'}`}`}
                    onClick={() => onTabChange('account')}
                >
                    Account
                </button>
                <button
                    className={`${isMobile ? `${activeTab === 'rewards' ? 'bg-blue-500 text-white' : 'text-gray-300'} py-1 px-4 rounded-full text-base font-medium transition-colors` : `flex-1 py-2 px-4 rounded-full text-base font-medium transition-colors ${activeTab === 'rewards' ? 'bg-blue-500 text-white' : 'text-gray-300'}`}`}
                    onClick={() => onTabChange('rewards')}
                >
                    Rewards
                </button>
                <button
                    className={`${isMobile ? `${activeTab === 'privacy' ? 'bg-blue-500 text-white' : 'text-gray-300'} py-1 px-4 rounded-full text-base font-medium transition-colors` : `flex-1 py-2 px-4 rounded-full text-base font-medium transition-colors ${activeTab === 'privacy' ? 'bg-blue-500 text-white' : 'text-gray-300'}`}`}
                    onClick={() => onTabChange('privacy')}
                >
                    Privacy
                </button>
                <button
                    className={`${isMobile ? `${activeTab === 'help' ? 'bg-blue-500 text-white' : 'text-gray-300'} py-1 px-4 rounded-full text-base font-medium transition-colors` : `flex-1 py-2 px-4 rounded-full text-base font-medium transition-colors ${activeTab === 'help' ? 'bg-blue-500 text-white' : 'text-gray-300'}`}`}
                    onClick={() => onTabChange('help')}
                >
                    Help
                </button>
            </div>
        </div>
    )
}
