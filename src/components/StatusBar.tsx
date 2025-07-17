import React from 'react'
import { BalanceSelector } from './BalanceSelector'
export function StatusBar({ isMobile }: { isMobile?: boolean }) {
    return (
        <div className="p-2 sm:p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
            {/* Mobile view remains unchanged */}
            {isMobile ? (
                <>
                    {/* Balance Selector - Full width on mobile */}
                    <div className="w-full mb-2">
                        <BalanceSelector
                            onSelect={(type) => console.log(`Selected: ${type}`)}
                        />
                    </div>
                    {/* Heart and Diamond - Row on mobile */}
                    <div className="flex justify-center space-x-3 mb-2">
                        <div className="w-36 h-10 bg-[#111827] rounded-full flex items-center px-4">
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                                alt="Heart"
                                className="w-7 h-7"
                            />
                            <span className="ml-1">0</span>
                        </div>
                        <div className="w-36 h-10 bg-[#111827] rounded-full flex items-center px-4">
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/uwPYNNRiavmZZ285SkzD5Z/diaomnd.png"
                                alt="Diamond"
                                className="w-8 h-8"
                            />
                            <span className="ml-1">0</span>
                        </div>
                    </div>
                </> /* Desktop view - all elements on one line */
            ) : (
                <>
                    {/* Online count - now inline instead of absolute */}
                    <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">1,568 Online</span>
                    </div>
                    {/* Balance Selector */}
                    <div className="flex-1 max-w-md mx-auto px-4">
                        <BalanceSelector
                            onSelect={(type) => console.log(`Selected: ${type}`)}
                        />
                    </div>
                    {/* Heart and Diamond - Keep in a column on desktop */}
                    <div className="flex flex-col space-y-1">
                        <div className="w-48 h-12 bg-[#111827] rounded-full flex items-center px-6">
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/agrcZVSRX593jbti3xzVTM/heart.png"
                                alt="Heart"
                                className="w-9 h-9"
                            />
                            <span className="ml-1">0</span>
                        </div>
                        <div className="w-48 h-12 bg-[#111827] rounded-full flex items-center px-6">
                            <img
                                src="https://uploadthingy.s3.us-west-1.amazonaws.com/uwPYNNRiavmZZ285SkzD5Z/diaomnd.png"
                                alt="Diamond"
                                className="w-10 h-10"
                            />
                            <span className="ml-1">0</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
